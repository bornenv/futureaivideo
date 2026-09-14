import { useEffect, useRef } from "react";
import { useBackgroundInteraction, useMediaQuery } from "./interaction";
import { LiquidMesh } from "./LiquidMesh";
import { ParticleField } from "./ParticleField";

/**
 * The page background, the same one as the Future AI Insights site (sitefuture),
 * fixed behind every section. Layers, bottom to top:
 *   1. liquid WebGL mesh, whose colour follows scroll and whose halo trails the pointer
 *   2. technical grid, drifting up slowly with scroll
 *   3. canvas particle field that reacts to the pointer
 *   4. readability vignette and film grain
 * The mesh and grid are strongest in the hero, nearly vanish through the middle of
 * the page (where content needs quiet) and come back lightly near the contact form.
 */

const INK = "#0b0a0c";
// Static stand-in for the mesh when WebGL is unavailable.
const MESH_FALLBACK =
  "radial-gradient(60% 60% at 30% 20%, rgba(124,58,237,.35), transparent 70%), radial-gradient(50% 50% at 80% 60%, rgba(0,224,255,.22), transparent 70%)";
const GRID_MASK = "radial-gradient(120% 80% at 50% 30%, #000 30%, transparent 85%)";
// Darkens the middle of the page so text keeps AA contrast over the mesh.
const READABILITY_VIGNETTE =
  "radial-gradient(125% 95% at 50% 5%, transparent 0%, rgba(11,10,12,.34) 45%, rgba(11,10,12,.74) 100%)";

export function InteractiveBackground() {
  const { pointer, scroll, density } = useBackgroundInteraction();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const meshRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll-driven fade of the mesh and grid, applied only when the page scrolls.
  useEffect(() => {
    let raf = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const fade = p < 0.5 ? 1 - p * 1.5 : 0.25 + (p - 0.5) * 0.7;

      const mesh = meshRef.current;
      if (mesh) mesh.style.opacity = Math.max(0.18, Math.min(1, fade)).toFixed(3);

      const grid = gridRef.current;
      if (grid) {
        grid.style.opacity = (0.25 + Math.max(0, 1 - p * 2.2) * 0.75).toFixed(3);
        grid.style.transform = reduced ? "" : `translate3d(0, ${(p * -120).toFixed(2)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: INK }}
    >
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: MESH_FALLBACK }} />

      <div ref={meshRef} className="absolute inset-0">
        <LiquidMesh
          pointer={pointer}
          scroll={scroll}
          reduced={reduced}
          quality={mobile ? 0.35 : 0.5}
        />
      </div>

      <div
        ref={gridRef}
        className="tech-grid absolute inset-x-0 -inset-y-24 will-change-transform"
        style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
      />

      <ParticleField pointer={pointer} density={density} reduced={reduced} mobile={mobile} />

      <div className="absolute inset-0" style={{ backgroundImage: READABILITY_VIGNETTE }} />
      <div className="grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
    </div>
  );
}
