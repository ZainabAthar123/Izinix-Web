"use client";

/**
 * Interactive Three.js background (react-three-fiber).
 * A low-poly particle grid, displaced by simplex noise, that warps toward
 * the cursor and gains turbulence with scroll velocity. Peaks and the
 * cursor's wake tint electric orange; the rest stays deep navy.
 *
 * Performance / accessibility:
 *  - import this component with next/dynamic({ ssr: false }) — it is
 *    code-split away from the initial bundle
 *  - rendering pauses when the canvas leaves the viewport or the tab hides
 *  - replaced by a static gradient on mobile and under reduced motion
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/motion";
import { scrollState } from "@/lib/scroll";

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */

// Ashima/IQ 3D simplex noise (public domain).
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;      // grid-space cursor position
uniform float uVelocity;  // smoothed scroll velocity
uniform float uPixelRatio;
${NOISE_GLSL}
varying float vGlow;

void main() {
  vec3 pos = position;

  // Base terrain: slow-rolling noise; scroll velocity adds turbulence.
  float speed = 0.22 + min(abs(uVelocity) * 0.012, 0.5);
  float amp = 0.85 + min(abs(uVelocity) * 0.02, 1.1);
  float elevation = snoise(vec3(pos.xy * 0.32, uTime * speed)) * amp;

  // Cursor warp: a soft radial swell that follows the mouse.
  float dist = distance(pos.xy, uMouse);
  float influence = exp(-dist * dist * 0.32) * 1.35;
  elevation += influence;

  pos.z += elevation;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (1.4 + elevation * 0.9 + influence * 2.0)
    * uPixelRatio * (28.0 / -mvPosition.z);

  // Peaks + cursor wake glow orange.
  vGlow = smoothstep(0.55, 1.9, elevation + influence * 1.4);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColorBase;
uniform vec3 uColorAccent;
uniform float uOpacity;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.12, d);
  vec3 color = mix(uColorBase, uColorAccent, vGlow);
  gl_FragColor = vec4(color, alpha * uOpacity * (0.35 + vGlow * 0.65));
}
`;

/* ------------------------------------------------------------------ */
/*  Particle field                                                     */
/* ------------------------------------------------------------------ */

type ParticleFieldProps = {
  density: number;
  particleOpacity: number;
};

const GRID_W = 20; // world units
const GRID_H = 12;

function ParticleField({ density, particleOpacity }: ParticleFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const smoothedMouse = useRef(new THREE.Vector2(0, 0));
  const smoothedVelocity = useRef(0);

  const positions = useMemo(() => {
    const cols = Math.round(110 * density);
    const rows = Math.round(66 * density);
    const array = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        array[i] = (c / (cols - 1) - 0.5) * GRID_W; // x
        array[i + 1] = (r / (rows - 1) - 0.5) * GRID_H; // y
        array[i + 2] = 0; // z (displaced in the shader)
        i += 3;
      }
    }
    return array;
  }, [density]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined"
          ? Math.min(window.devicePixelRatio, 1.75)
          : 1,
      },
      uColorBase: { value: new THREE.Color("#2a4066") },
      uColorAccent: { value: new THREE.Color("#ff5a1f") },
      uOpacity: { value: particleOpacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value += delta;

    // Pointer (-1..1) mapped into grid space, lerped for a viscous feel.
    const targetX = state.pointer.x * (GRID_W * 0.5);
    const targetY = state.pointer.y * (GRID_H * 0.5);
    smoothedMouse.current.x += (targetX - smoothedMouse.current.x) * 0.06;
    smoothedMouse.current.y += (targetY - smoothedMouse.current.y) * 0.06;
    material.uniforms.uMouse.value.copy(smoothedMouse.current);

    smoothedVelocity.current +=
      (scrollState.velocity - smoothedVelocity.current) * 0.08;
    material.uniforms.uVelocity.value = smoothedVelocity.current;
  });

  return (
    <points rotation={[-0.9, 0, 0]} position={[0, -1.2, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Public wrapper                                                     */
/* ------------------------------------------------------------------ */

type HeroBackgroundProps = {
  /** Overall blend opacity of the canvas layer (brief: 15–20% under hero). */
  opacity?: number;
  /** 1 = full grid; lower for secondary pages. */
  density?: number;
  className?: string;
};

export default function HeroBackground({
  opacity = 0.55,
  density = 1,
  className = "",
}: HeroBackgroundProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Pause the render loop when off-screen or the tab is hidden.
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(holder);

    const onVisibility = () => setInView(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const showCanvas = mounted && !reduced && !isMobile;

  return (
    <div
      ref={holderRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {showCanvas ? (
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.6, 6.5], fov: 55 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ParticleField density={density} particleOpacity={0.9} />
        </Canvas>
      ) : (
        /* Static fallback: same mood, zero cost. */
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 70%, var(--color-navy-glow) 0%, transparent 65%), radial-gradient(40% 30% at 70% 60%, rgba(255,90,31,0.12) 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
