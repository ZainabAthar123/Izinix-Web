/* ============================================================
   IZINIX — interactive hero background
   A low-poly particle terrain rendered with a custom shader:
   simplex-noise waves in navy → orange, displaced by the cursor.
   Degrades gracefully: if WebGL/THREE is unavailable the CSS
   gradient glows behind the canvas simply show through.
   ============================================================ */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;
  var canvases = document.querySelectorAll('#hero-canvas, canvas[data-hero-canvas]');
  if (!canvases.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  canvases.forEach(function (canvas) { initHeroBg(canvas); });

  function initHeroBg(canvas) {

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      return; // no WebGL — CSS fallback stays
    }

    var DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(DPR);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 2.1, 5.2);
    camera.lookAt(0, 0.2, 0);

    /* ---- particle grid ---- */
    var COLS = 190, ROWS = 110;
    var WIDTH = 22, DEPTH = 12;
    var count = COLS * ROWS;
    var positions = new Float32Array(count * 3);
    var seeds = new Float32Array(count);

    var i = 0;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        positions[i * 3]     = (c / (COLS - 1) - 0.5) * WIDTH;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * DEPTH;
        seeds[i] = Math.random();
        i++;
      }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    var uniforms = {
      uTime:   { value: 0 },
      uMouse:  { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: DPR },
      uColorDeep:   { value: new THREE.Color('#0E1A2B') },
      uColorMid:    { value: new THREE.Color('#1A2C4A') },
      uColorAccent: { value: new THREE.Color('#FF5A1F') },
      uColorHot:    { value: new THREE.Color('#FF7A3D') }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: [
        'uniform float uTime;',
        'uniform vec2 uMouse;',
        'uniform float uPixelRatio;',
        'attribute float aSeed;',
        'varying float vElev;',
        'varying float vGlow;',
        'varying float vFade;',

        // simplex-ish value noise, cheap enough for a vertex shader
        'vec2 hash22(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1.0 + 2.0 * fract(sin(p) * 43758.5453123); }',
        'float noise(vec2 p){',
        '  vec2 i = floor(p); vec2 f = fract(p);',
        '  vec2 u = f * f * (3.0 - 2.0 * f);',
        '  return mix(mix(dot(hash22(i), f), dot(hash22(i + vec2(1.,0.)), f - vec2(1.,0.)), u.x),',
        '             mix(dot(hash22(i + vec2(0.,1.)), f - vec2(0.,1.)), dot(hash22(i + vec2(1.,1.)), f - vec2(1.,1.)), u.x), u.y);',
        '}',

        'void main(){',
        '  vec3 p = position;',
        '  float t = uTime * 0.22;',

        // layered rolling waves
        '  float e = noise(vec2(p.x * 0.35 + t, p.z * 0.5 - t * 0.6)) * 0.65;',
        '  e += noise(vec2(p.x * 0.9 - t * 0.4, p.z * 1.2 + t)) * 0.25;',
        '  e += noise(vec2(p.x * 2.4 + t * 0.8, p.z * 2.8)) * 0.08;',

        // cursor ripple — a soft crater of energy around the mouse
        '  float md = distance(p.xz, uMouse);',
        '  float influence = smoothstep(3.2, 0.0, md);',
        '  e += sin(md * 4.0 - uTime * 3.0) * 0.22 * influence;',
        '  vGlow = influence;',

        '  p.y = e;',
        '  vElev = e;',

        // fade points near the far and side edges
        '  float edgeX = smoothstep(11.0, 7.5, abs(p.x));',
        '  float edgeZ = smoothstep(6.0, 3.0, abs(p.z));',
        '  vFade = edgeX * edgeZ;',

        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_Position = projectionMatrix * mv;',
        '  float size = (1.1 + aSeed * 1.3 + vGlow * 2.2) * uPixelRatio;',
        '  gl_PointSize = size * (4.6 / -mv.z);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColorDeep;',
        'uniform vec3 uColorMid;',
        'uniform vec3 uColorAccent;',
        'uniform vec3 uColorHot;',
        'varying float vElev;',
        'varying float vGlow;',
        'varying float vFade;',

        'void main(){',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  float d = length(uv);',
        '  float disc = smoothstep(0.5, 0.12, d);',
        '  if (disc < 0.01) discard;',

        // navy floor, crests warm up; cursor zone runs hot orange
        '  float h = smoothstep(-0.55, 0.85, vElev);',
        '  vec3 col = mix(uColorDeep, uColorMid, h);',
        '  col = mix(col, uColorAccent, smoothstep(0.55, 0.95, h) * 0.85);',
        '  col = mix(col, uColorHot, clamp(vGlow, 0.0, 1.0));',

        '  float alpha = disc * vFade * (0.28 + h * 0.5 + vGlow * 0.45);',
        '  gl_FragColor = vec4(col, alpha);',
        '}'
      ].join('\n')
    });

    var points = new THREE.Points(geometry, material);
    points.position.y = -0.6;
    scene.add(points);

    /* ---- sizing ---- */
    function resize() {
      var w = canvas.clientWidth || canvas.parentElement.clientWidth;
      var h = canvas.clientHeight || canvas.parentElement.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    /* ---- pointer → world-space mouse on the particle plane ---- */
    var raycaster = new THREE.Raycaster();
    var ndc = new THREE.Vector2(-10, -10);
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.6);
    var hit = new THREE.Vector3();
    var targetMouse = new THREE.Vector2(0, 0);
    var targetCam = { x: 0, y: 0 };

    window.addEventListener('pointermove', function (e) {
      var rect = canvas.getBoundingClientRect();
      if (rect.bottom < 0) return;
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        targetMouse.set(hit.x, hit.z);
      }
      targetCam.x = ndc.x * 0.35;
      targetCam.y = ndc.y * 0.18;
    }, { passive: true });

    /* ---- render loop (paused off-screen / hidden tab) ---- */
    var clock = new THREE.Clock();
    var elapsed = 0;
    var inView = true;
    var rafId = null;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView && rafId === null) loop();
      }, { threshold: 0 }).observe(canvas);
    }

    function loop() {
      if (!inView || document.hidden) { rafId = null; return; }
      rafId = requestAnimationFrame(loop);

      var dt = Math.min(clock.getDelta(), 0.05);
      if (!reduceMotion) elapsed += dt;
      uniforms.uTime.value = elapsed;

      // inertia on cursor + camera drift
      uniforms.uMouse.value.lerp(targetMouse, 0.06);
      camera.position.x += (targetCam.x - camera.position.x) * 0.04;
      camera.position.y += (2.1 + targetCam.y - camera.position.y) * 0.04;
      camera.lookAt(0, 0.2, 0);

      renderer.render(scene, camera);
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && rafId === null) loop();
    });

    if (reduceMotion) {
      // static frame only
      uniforms.uTime.value = 4;
      renderer.render(scene, camera);
    } else {
      loop();
    }
  }
})();
