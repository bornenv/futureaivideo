import { useEffect, useRef, type RefObject } from "react";
import { lerp, type PointerState } from "./interaction";

/**
 * LiquidMesh: the base layer of the background, ported from the Future AI
 * Insights site. A fragment shader with nested fbm domain warping, drawn on a
 * single full-screen triangle in raw WebGL. Its palette walks violet → indigo →
 * cyan with scroll progress, and a light halo trails the pointer with an elastic
 * lag (never 1:1). Without WebGL the canvas hides and the CSS fallback behind it
 * carries the look.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform vec2  u_mouse;     // 0..1, smoothed by lerp in the frame loop
uniform float u_time;
uniform float u_scroll;    // scroll progress 0..1 -> violet > indigo > cyan
uniform float u_intensity;
uniform float u_energy;    // 0..1, rises while the pointer is down

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.3, -0.7);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.055;

  // domain warping: what makes it read as living liquid
  vec2 q = vec2(fbm(p * 1.55 + t), fbm(p * 1.55 + vec2(3.2, 1.7) - t));
  vec2 r = vec2(
    fbm(p * 1.85 + 2.6 * q + vec2(1.7, 9.2) + t * 1.35),
    fbm(p * 1.85 + 2.6 * q + vec2(8.3, 2.8) - t * 1.05)
  );
  float f = fbm(p * 1.35 + 2.2 * r);

  // palette that walks with the scroll
  vec3 violet = vec3(0.486, 0.227, 0.929); // #7C3AED
  vec3 indigo = vec3(0.427, 0.365, 0.988); // #6D5DFC
  vec3 cyan   = vec3(0.000, 0.878, 1.000); // #00E0FF
  vec3 base   = vec3(0.043, 0.039, 0.047); // #0B0A0C

  vec3 cA = mix(violet, indigo, smoothstep(0.0, 0.55, u_scroll));
  vec3 cB = mix(indigo, cyan, smoothstep(0.30, 1.0, u_scroll));

  vec3 col = mix(cA, cB, clamp(f * 1.4, 0.0, 1.0));
  col = mix(base, col, clamp(f * f * 2.4, 0.0, 1.0));

  // elastic pointer halo (the smoothing happens in JS)
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  float d = distance(p, m);
  float halo = exp(-d * d * (3.0 - u_energy * 0.9));
  col += (cB * 0.5 + cA * 0.4) * halo * (0.5 + 0.3 * u_energy);

  // veins of light in the valleys of the warp
  col += cyan * pow(clamp(length(r) - 0.58, 0.0, 1.0), 2.0) * 0.42;

  col *= u_intensity;
  col *= smoothstep(1.45, 0.2, length(uv - 0.5)); // vignette

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type Props = {
  pointer: RefObject<PointerState>;
  /** Page scroll progress 0..1, updated outside React. */
  scroll: RefObject<number>;
  reduced: boolean;
  /** Render-resolution scale; the canvas is blurred anyway, so half resolution is plenty. */
  quality?: number;
};

export function LiquidMesh({ pointer, scroll, reduced, quality = 0.5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.style.display = "none";
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");
    const uEnergy = gl.getUniformLocation(prog, "u_energy");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * quality));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * quality));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Smoothed pointer: the elastic lag is what sets this apart from a 1:1 follow.
    let mx = 0.5;
    let my = 0.5;
    let energy = 0;
    let time = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Reduced motion freezes time and keeps only the scroll-driven colour.
      time += reduced ? 0 : dt;

      const p = pointer.current;
      mx = lerp(mx, p.nx, reduced ? 1 : 0.045);
      my = lerp(my, 1 - p.ny, reduced ? 1 : 0.045); // WebGL y is flipped
      energy = lerp(energy, p.down ? 1 : p.active ? 0.35 : 0, 0.06);

      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, scroll.current);
      gl.uniform1f(uIntensity, reduced ? 0.85 : 1.15);
      gl.uniform1f(uEnergy, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(frame);
    };

    // Stop drawing while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [pointer, scroll, reduced, quality]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full scale-[1.08]"
      style={{ filter: "blur(26px) saturate(130%)" }}
    />
  );
}
