(function () {
    'use strict';

    document.body.classList.remove('no-js');

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    var preloader = document.getElementById('preloader');

    /* ════════════════════════════════════════════════════════════════════
       THREE.JS — interactive aurora shader + drifting particles
       ════════════════════════════════════════════════════════════════════ */
    var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    var scrollNorm = { v: 0, t: 0 };

    function initWebGL() {
      if (typeof window.THREE === 'undefined') return null;
      var canvas = document.getElementById('webgl');
      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
      } catch (e) { return null; }

      var DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(DPR);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.autoClear = false;

      /* — Scene A: fullscreen aurora shader — */
      var sceneA = new THREE.Scene();
      var camA = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      var uniforms = {
        uTime:   { value: 0 },
        uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
        uRes:    { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uScroll: { value: 0 }
      };
      var mat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: [
          'varying vec2 vUv;',
          'void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }'
        ].join('\n'),
        fragmentShader: [
          'precision highp float;',
          'uniform float uTime; uniform vec2 uMouse; uniform vec2 uRes; uniform float uScroll;',
          'varying vec2 vUv;',
          'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
          'float noise(vec2 p){',
          '  vec2 i = floor(p); vec2 f = fract(p);',
          '  f = f * f * (3.0 - 2.0 * f);',
          '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),',
          '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);',
          '}',
          'float fbm(vec2 p){',
          '  float v = 0.0; float a = 0.5;',
          '  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }',
          '  return v;',
          '}',
          'void main(){',
          '  vec2 asp = vec2(uRes.x / uRes.y, 1.0);',
          '  vec2 p = (vUv - 0.5) * asp;',
          '  vec2 m = (uMouse - 0.5) * asp;',
          '  float t = uTime * 0.055;',
          '  float md = length(p - m);',
          '  vec2 warp = (p - m) * 0.22 * smoothstep(0.75, 0.0, md);',
          '  vec2 pp = p - warp;',
          '  vec2 q = vec2(fbm(pp * 1.35 + t), fbm(pp * 1.35 - t * 0.8));',
          '  vec2 r = vec2(fbm(pp * 1.8 + q * 1.6 + vec2(1.7, 9.2) + t * 1.4),',
          '                fbm(pp * 1.8 + q * 1.6 + vec2(8.3, 2.8) - t * 1.1));',
          '  float f = fbm(pp * 1.55 + r * 1.85);',
          '  vec3 base = vec3(0.014, 0.014, 0.032);',
          '  vec3 vio  = vec3(0.32, 0.24, 0.92);',
          '  vec3 teal = vec3(0.05, 0.58, 0.50);',
          '  vec3 col = base;',
          '  col = mix(col, vio * 0.60, smoothstep(0.32, 0.95, f) * 0.62);',
          '  col = mix(col, teal * 0.55, smoothstep(0.55, 1.0, q.y) * 0.38);',
          '  col += vec3(0.30, 0.24, 0.85) * smoothstep(0.9, 1.0, r.x) * 0.22;',
          '  col += vec3(0.42, 0.36, 1.0) * smoothstep(0.5, 0.0, md) * 0.13;',
          '  float vg = smoothstep(1.35, 0.35, length(p));',
          '  col *= vg;',
          '  col *= 1.0 - uScroll * 0.22;',
          '  col += (hash(vUv * uRes.xy) - 0.5) * 0.014;',
          '  gl_FragColor = vec4(col, 1.0);',
          '}'
        ].join('\n'),
        depthTest: false, depthWrite: false
      });
      sceneA.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

      /* — Scene B: drifting particles — */
      var sceneB = new THREE.Scene();
      var camB = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 60);
      camB.position.z = 8;

      var COUNT = 550;
      var positions = new Float32Array(COUNT * 3);
      var seeds = new Float32Array(COUNT);
      for (var i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        seeds[i] = Math.random() * Math.PI * 2;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var pmat = new THREE.PointsMaterial({
        color: 0x9f92ff, size: 0.035, sizeAttenuation: true,
        transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      var points = new THREE.Points(geo, pmat);
      sceneB.add(points);

      var clock = new THREE.Clock();
      var running = true;

      function render() {
        var t = clock.getElapsedTime();

        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        scrollNorm.v += (scrollNorm.t - scrollNorm.v) * 0.06;

        uniforms.uTime.value = t;
        uniforms.uMouse.value.set(mouse.x, 1.0 - mouse.y);
        uniforms.uScroll.value = scrollNorm.v;

        points.rotation.y = t * 0.02 + (mouse.x - 0.5) * 0.18;
        points.rotation.x = (mouse.y - 0.5) * 0.14;
        points.position.y = Math.sin(t * 0.12) * 0.35 + scrollNorm.v * 1.4;

        renderer.clear();
        renderer.render(sceneA, camA);
        renderer.clearDepth();
        renderer.render(sceneB, camB);
      }

      function loop() {
        if (!running) return;
        render();
        requestAnimationFrame(loop);
      }

      window.addEventListener('resize', function () {
        var w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h);
        uniforms.uRes.value.set(w, h);
        camB.aspect = w / h;
        camB.updateProjectionMatrix();
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { running = false; }
        else if (!reduced) { running = true; loop(); }
      });

      if (reduced) {
        render(); // single static frame
      } else {
        loop();
      }
      return renderer;
    }

    window.addEventListener('mousemove', function (e) {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    }, { passive: true });

    var webglOK = initWebGL();

    /* ════════════════════════════════════════════════════════════════════
       Text splitting helpers
       ════════════════════════════════════════════════════════════════════ */
    /* chars grouped into word-level inline-blocks so headings still wrap */
    function splitChars(el) {
      var text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);
      var words = text.split(' ');
      words.forEach(function (w, wi) {
        var wspan = document.createElement('span');
        wspan.className = 'word';
        wspan.setAttribute('aria-hidden', 'true');
        for (var i = 0; i < w.length; i++) {
          var s = document.createElement('span');
          s.className = 'char';
          s.textContent = w[i];
          wspan.appendChild(s);
        }
        el.appendChild(wspan);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
      return el.querySelectorAll('.char');
    }

    function splitWords(el) {
      var words = el.textContent.trim().split(/\s+/);
      el.setAttribute('aria-label', el.textContent.trim());
      el.textContent = '';
      var frag = document.createDocumentFragment();
      words.forEach(function (w) {
        var s = document.createElement('span');
        s.className = 'word';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = w;
        frag.appendChild(s);
      });
      el.appendChild(frag);
      return el.querySelectorAll('.word');
    }

    /* ════════════════════════════════════════════════════════════════════
       No-motion fallback path
       ════════════════════════════════════════════════════════════════════ */
    if (!hasGsap || reduced) {
      document.body.classList.add('no-motion');
      if (preloader) preloader.parentNode.removeChild(preloader);
      var glc = document.getElementById('webgl');
      if (glc && webglOK) glc.style.opacity = '1';
      // counters never animate in this mode — show final values
      document.querySelectorAll('[data-count]').forEach(function (el) {
        var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        el.textContent = parseFloat(el.getAttribute('data-count')).toFixed(dec);
      });
      initMenu(null);
      initContactForm();
      return;
    }

    /* ════════════════════════════════════════════════════════════════════
       GSAP + Lenis setup
       ════════════════════════════════════════════════════════════════════ */
    gsap.registerPlugin(ScrollTrigger);

    var lenis = null;
    if (typeof window.Lenis !== 'undefined') {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      if (preloader) lenis.stop(); // locked during preload (home page only)
    }

    // feed normalized scroll into the shader
    function onScrollY(y) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      scrollNorm.t = max > 0 ? Math.min(y / max, 1) : 0;
    }
    if (lenis) {
      lenis.on('scroll', function (e) { onScrollY(e.scroll); });
    } else {
      window.addEventListener('scroll', function () { onScrollY(window.scrollY); }, { passive: true });
    }

    /* ════════════════════════════════════════════════════════════════════
       Preloader → hero intro (preloader on home; subpages fade straight in)
       ════════════════════════════════════════════════════════════════════ */
    var heroLines = document.querySelectorAll('.hero-title .line');
    var introEls = document.querySelectorAll('[data-intro]');

    gsap.set(heroLines, { yPercent: 115 });
    gsap.set(introEls, { autoAlpha: 0, y: 26 });

    var introTl = gsap.timeline();

    if (preloader) {
      var brandChars = splitChars(document.getElementById('preloaderBrand'));
      var countEl = document.getElementById('preloaderCount');
      var barEl = document.getElementById('preloaderBar');
      var counter = { v: 0 };

      gsap.set(brandChars, { yPercent: 120 });

      introTl
        .to(brandChars, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 })
        .to(counter, {
          v: 100, duration: 1.7, ease: 'power2.inOut',
          onUpdate: function () {
            countEl.textContent = String(Math.round(counter.v)).padStart(2, '0');
          }
        }, 0.2)
        .to(barEl, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.2)
        .to(brandChars, { yPercent: -120, duration: 0.7, ease: 'expo.in', stagger: 0.035 }, '+=0.15')
        .to(countEl.parentNode, { autoAlpha: 0, duration: 0.4 }, '<')
        .to(preloader, {
          clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut',
          onStart: function () { barEl.style.opacity = '0'; }
        }, '-=0.25')
        .set(preloader, { display: 'none' })
        // hero reveal
        .to('#webgl', { opacity: 1, duration: 2.2, ease: 'power2.out' }, '-=1.0')
        .to(heroLines, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.11 }, '-=1.15')
        .to(introEls, {
          autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.08,
          onStart: function () { if (lenis) lenis.start(); }
        }, '-=0.85');
    } else {
      introTl
        .to('#webgl', { opacity: 1, duration: 2.0, ease: 'power2.out' }, 0)
        .to(heroLines, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.11 }, 0.15)
        .to(introEls, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.08 }, 0.45);
    }

    /* ════════════════════════════════════════════════════════════════════
       Nav — hide on scroll down, solidify after hero
       ════════════════════════════════════════════════════════════════════ */
    var nav = document.getElementById('nav');
    var lastY = 0;
    function navOnScroll(y) {
      if (y > 120 && y > lastY + 4 && !document.body.classList.contains('menu-open')) {
        nav.classList.add('nav-hidden');
      } else if (y < lastY - 4 || y <= 120) {
        nav.classList.remove('nav-hidden');
      }
      nav.classList.toggle('nav-solid', y > 60);
      lastY = y;
    }
    if (lenis) lenis.on('scroll', function (e) { navOnScroll(e.scroll); });
    else window.addEventListener('scroll', function () { navOnScroll(window.scrollY); }, { passive: true });

    /* ════════════════════════════════════════════════════════════════════
       Marquee — infinite loop + scroll-velocity skew
       ════════════════════════════════════════════════════════════════════ */
    if (document.querySelector('.marquee-inner')) {
      var marqueeTween = gsap.to('.marquee-track', { xPercent: -100, duration: 26, ease: 'none', repeat: -1 });
      var skewSetter = gsap.quickSetter('.marquee-inner', 'skewX', 'deg');
      var skewClamp = gsap.utils.clamp(-6, 6);
      var marqueeReset = gsap.delayedCall(0.4, function () {
        skewSetter(0);
        marqueeTween.timeScale(1);
      }).pause();
      ScrollTrigger.create({
        onUpdate: function (self) {
          var vel = self.getVelocity();
          skewSetter(skewClamp(vel / -400));
          marqueeTween.timeScale(gsap.utils.clamp(0.6, 3, 1 + Math.abs(vel) / 1200));
          marqueeReset.restart(true);
        }
      });
    }

    /* ════════════════════════════════════════════════════════════════════
       Split headings — char reveal
       ════════════════════════════════════════════════════════════════════ */
    document.querySelectorAll('.split-heading').forEach(function (h) {
      var chars = splitChars(h);
      gsap.from(chars, {
        yPercent: 115, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.018,
        scrollTrigger: { trigger: h, start: 'top 86%', once: true }
      });
    });

    /* ════════════════════════════════════════════════════════════════════
       Manifesto — word-by-word scrub reveal
       ════════════════════════════════════════════════════════════════════ */
    var manifestoEl = document.getElementById('manifestoText');
    if (manifestoEl) {
      var mWords = splitWords(manifestoEl);
      gsap.fromTo(mWords, { opacity: 0.13 }, {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: {
          trigger: '#manifestoText',
          start: 'top 78%',
          end: 'bottom 45%',
          scrub: true
        }
      });
    }

    /* ════════════════════════════════════════════════════════════════════
       Generic reveals
       ════════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 46, autoAlpha: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* ════════════════════════════════════════════════════════════════════
       Services — sticky deck: scale + shade previous cards
       ════════════════════════════════════════════════════════════════════ */
    var svcCards = gsap.utils.toArray('.service-card');
    svcCards.forEach(function (card, i) {
      if (i === svcCards.length - 1) return;
      var inner = card.querySelector('.service-inner');
      var shade = card.querySelector('.service-shade');
      var next = svcCards[i + 1];
      gsap.to(inner, {
        scale: 0.94, transformOrigin: 'center top', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true }
      });
      gsap.to(shade, {
        opacity: 0.55, ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true }
      });
    });

    /* ════════════════════════════════════════════════════════════════════
       Process — pinned horizontal scroll (desktop)
       ════════════════════════════════════════════════════════════════════ */
    var mm = gsap.matchMedia();
    if (document.getElementById('processTrack')) mm.add('(min-width: 900px)', function () {
      var track = document.getElementById('processTrack');
      var section = document.getElementById('process');
      var getAmount = function () { return Math.max(track.scrollWidth - window.innerWidth, 0); };

      var tween = gsap.to(track, {
        x: function () { return -getAmount(); },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () { return '+=' + getAmount(); },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      var bar = gsap.to('#processBar', {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () { return '+=' + getAmount(); },
          scrub: true,
          invalidateOnRefresh: true
        }
      });
      return function () {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        bar.scrollTrigger && bar.scrollTrigger.kill();
        tween.kill(); bar.kill();
        gsap.set(track, { x: 0 });
        gsap.set('#processBar', { scaleX: 0 });
      };
    });

    /* ════════════════════════════════════════════════════════════════════
       Work — cover parallax
       ════════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.work-item').forEach(function (item) {
      var art = item.querySelector('.work-cover-art');
      gsap.fromTo(art, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      // hover zoom via GSAP so it composes with the parallax transform
      item.addEventListener('mouseenter', function () {
        gsap.to(art, { scale: 1.06, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
      });
      item.addEventListener('mouseleave', function () {
        gsap.to(art, { scale: 1, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
      });
    });

    /* ════════════════════════════════════════════════════════════════════
       Counters
       ════════════════════════════════════════════════════════════════════ */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: target, duration: 2, ease: 'power3.out',
            onUpdate: function () { el.textContent = obj.v.toFixed(dec); }
          });
        }
      });
    });

    /* ════════════════════════════════════════════════════════════════════
       Scenarios — before/after device frames (use-cases page)
       ════════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.scenario').forEach(function (sc) {
      var device = sc.querySelector('.device');
      var head = sc.querySelector('.scenario-head');
      var beforeItems = sc.querySelectorAll('.pane-before > :not(ul), .pane-before li');
      var afterItems = sc.querySelectorAll('.pane-after > :not(ul):not(.pane-glow), .pane-after li');
      var glow = sc.querySelector('.pane-glow');

      var tl = gsap.timeline({
        scrollTrigger: { trigger: sc, start: 'top 76%', once: true }
      });
      if (head) tl.from(head, { y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out' });
      tl.from(device, { y: 64, autoAlpha: 0, duration: 1.05, ease: 'power3.out' }, head ? '-=0.55' : 0)
        .from(beforeItems, { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' }, '-=0.45')
        .from(afterItems, { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' }, '-=0.35');
      if (glow) tl.to(glow, { opacity: 1, duration: 1.4, ease: 'power2.out' }, '-=0.6');

      // subtle drift so the frames feel alive while scrolling past
      gsap.fromTo(device, { y: 26 }, {
        y: -26, ease: 'none',
        scrollTrigger: { trigger: sc, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ════════════════════════════════════════════════════════════════════
       Hero floating chips — mouse parallax
       ════════════════════════════════════════════════════════════════════ */
    var floatChips = document.querySelectorAll('.hero-chip-float');
    if (floatChips.length && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('mousemove', function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5);
        var cy = (e.clientY / window.innerHeight - 0.5);
        floatChips.forEach(function (chip) {
          var d = parseFloat(chip.getAttribute('data-depth') || '1');
          gsap.to(chip, { x: cx * 34 * d, y: cy * 26 * d, duration: 1.1, ease: 'power3.out', overwrite: 'auto' });
        });
      }, { passive: true });
      // gentle bob on rotation so it never fights the x/y mouse-parallax tween
      floatChips.forEach(function (chip, i) {
        gsap.to(chip, {
          rotation: i % 2 === 0 ? 1.6 : -1.6,
          duration: 2.6 + i * 0.5, yoyo: true, repeat: -1,
          ease: 'sine.inOut', delay: i * 0.4
        });
      });
    }

    /* ════════════════════════════════════════════════════════════════════
       Custom cursor + magnetic elements
       ════════════════════════════════════════════════════════════════════ */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var dot = document.querySelector('.cursor-dot');
      var ring = document.querySelector('.cursor-ring');
      var label = ring.querySelector('.cursor-label');
      var pos = { x: innerWidth / 2, y: innerHeight / 2 };
      var ringPos = { x: pos.x, y: pos.y };

      window.addEventListener('mousemove', function (e) {
        pos.x = e.clientX; pos.y = e.clientY;
        dot.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px) translate(-50%,-50%)';
      }, { passive: true });

      gsap.ticker.add(function () {
        ringPos.x += (pos.x - ringPos.x) * 0.16;
        ringPos.y += (pos.y - ringPos.y) * 0.16;
        ring.style.transform = 'translate(' + ringPos.x + 'px,' + ringPos.y + 'px) translate(-50%,-50%)';
      });

      document.querySelectorAll('a, button, [data-hover]').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
      });
      document.querySelectorAll('[data-cursor]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          label.textContent = el.getAttribute('data-cursor');
          ring.classList.add('is-label');
        });
        el.addEventListener('mouseleave', function () { ring.classList.remove('is-label'); });
      });

      document.querySelectorAll('[data-magnetic]').forEach(function (el) {
        var strength = 0.32;
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = e.clientX - r.left - r.width / 2;
          var y = e.clientY - r.top - r.height / 2;
          gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' });
        });
      });
    }

    /* ════════════════════════════════════════════════════════════════════
       Contact form — validates, then composes a prefilled email.
       Swap the mailto for a fetch() to your form endpoint when you have one.
       ════════════════════════════════════════════════════════════════════ */
    function initContactForm() {
      var form = document.getElementById('contactForm');
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var data = new FormData(form);
        var name = data.get('name') || '';
        var company = data.get('company');
        var subject = 'Project inquiry — ' + name + (company ? ' @ ' + company : '');
        var body =
          'Name: ' + name +
          '\nEmail: ' + (data.get('email') || '') +
          '\nCompany: ' + (company || '—') +
          '\nInterested in: ' + (data.get('service') || 'Not sure yet') +
          '\nBudget: ' + (data.get('budget') || 'Still exploring') +
          '\n\n' + (data.get('message') || '');
        var success = document.getElementById('formSuccess');
        if (success) success.classList.add('show');
        window.location.href = 'mailto:hello@izinix.studio?subject=' +
          encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      });
    }

    /* ════════════════════════════════════════════════════════════════════
       Menu + anchors
       ════════════════════════════════════════════════════════════════════ */
    function initMenu(lenisInst) {
      var burger = document.getElementById('burger');
      function closeMenu() {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
        if (lenisInst) lenisInst.start();
      }
      burger.addEventListener('click', function () {
        var open = document.body.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', String(open));
        if (lenisInst) { open ? lenisInst.stop() : lenisInst.start(); }
      });
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('href');
          if (id.length > 1 && document.querySelector(id)) {
            e.preventDefault();
            closeMenu();
            if (lenisInst) lenisInst.scrollTo(id, { offset: -70, duration: 1.5 });
            else document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
    initMenu(lenis);
    initContactForm();

    /* refresh triggers once fonts settle */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  })();

