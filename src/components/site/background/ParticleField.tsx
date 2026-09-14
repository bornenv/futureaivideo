import { useEffect, useRef, type RefObject } from "react";
import { lerp, type PointerState } from "./interaction";

/**
 * ParticleField: a sparse grid of points over the liquid mesh, ported from the
 * Future AI Insights site. Points drift slightly, get pushed away from and lit
 * by the pointer, and grow denser near sections marked `data-dense`.
 */

type Props = {
  pointer: RefObject<PointerState>;
  /** 0..1: the closer to a `data-dense` section, the denser the field. */
  density: RefObject<number>;
  reduced: boolean;
  mobile: boolean;
};

export function ParticleField({ pointer, density, reduced, mobile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const spacing = mobile ? 46 : 34;
    const radius = mobile ? 130 : 190;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let seed = new Float32Array(0);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / spacing) + 1;
      rows = Math.ceil(h / spacing) + 1;
      seed = new Float32Array(cols * rows);
      for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    let dense = 0;
    let px = w / 2;
    let py = h / 2;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += reduced ? dt * 0.15 : dt;

      const p = pointer.current;
      // Same lerp as the mesh: the field chases the pointer instead of tracking it.
      px = lerp(px, p.x, reduced ? 1 : 0.08);
      py = lerp(py, p.y, reduced ? 1 : 0.08);
      dense = lerp(dense, density.current, 0.05);

      ctx.clearRect(0, 0, w, h);

      const r2 = radius * radius;
      // Away from dense sections the field almost disappears.
      const baseAlpha = 0.045 + dense * 0.24;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const s = seed[y * cols + x] ?? 1;
          if (s > 0.32 + dense * 0.5) continue;

          const ox = Math.sin(t * 0.5 + s * 8 + y * 0.3) * 2.5;
          const oy = Math.cos(t * 0.4 + s * 6 + x * 0.3) * 2.5;
          let dx = x * spacing + ox;
          let dy = y * spacing + oy;

          const vx = dx - px;
          const vy = dy - py;
          const dist2 = vx * vx + vy * vy;

          let a = baseAlpha * (0.4 + s);
          let size = 1.6;

          if (dist2 < r2 && !reduced) {
            const f = 1 - dist2 / r2;
            const push = f * f * 26;
            const inv = 1 / Math.max(Math.sqrt(dist2), 0.001);
            dx += vx * inv * push;
            dy += vy * inv * push;
            a += f * f * 0.6;
            size += f * f * 1.8;
          }

          if (a <= 0.02) continue;
          // Cyan for excited points, cool white for the rest.
          ctx.fillStyle =
            a > 0.34 ? `rgba(120, 226, 255, ${Math.min(a, 0.85)})` : `rgba(190, 200, 255, ${a})`;
          ctx.fillRect(dx, dy, size, size);
        }
      }

      raf = requestAnimationFrame(frame);
    };

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
    };
  }, [pointer, density, reduced, mobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-60"
    />
  );
}
