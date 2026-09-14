import { useEffect, useRef, useState, type RefObject } from "react";

export type PointerState = {
  /** Target position, viewport pixels. */
  x: number;
  y: number;
  /** Normalised 0..1. */
  nx: number;
  ny: number;
  down: boolean;
  active: boolean;
};

export type BackgroundInteraction = {
  pointer: RefObject<PointerState>;
  /** Page scroll progress, 0..1. */
  scroll: RefObject<number>;
  /** 0..1: how close the viewport centre is to a section marked `data-dense`. */
  density: RefObject<number>;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Pointer, scroll progress and particle density for the background layers.
 * Everything lives in refs read inside requestAnimationFrame, so none of it
 * re-renders React. Ported from the Future AI Insights site (sitefuture).
 */
export function useBackgroundInteraction(): BackgroundInteraction {
  const pointer = useRef<PointerState>({
    x: 0,
    y: 0,
    nx: 0.5,
    ny: 0.5,
    down: false,
    active: false,
  });
  const scroll = useRef(0);
  const density = useRef(0);

  useEffect(() => {
    const p = pointer.current;
    p.x = window.innerWidth / 2;
    p.y = window.innerHeight / 2;

    const move = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      p.nx = e.clientX / window.innerWidth;
      p.ny = e.clientY / window.innerHeight;
      p.active = true;
    };
    const down = () => {
      p.down = true;
    };
    const up = () => {
      p.down = false;
    };
    const leave = () => {
      p.active = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scroll.current = Math.min(1, Math.max(0, window.scrollY / max));

      // Sections marked data-dense thicken the particle field as they cross the centre.
      const center = window.innerHeight / 2;
      let best = 0;
      document.querySelectorAll<HTMLElement>("[data-dense]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const mid = r.top + r.height / 2;
        best = Math.max(best, 1 - Math.min(Math.abs(mid - center) / window.innerHeight, 1));
      });
      density.current = best;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { pointer, scroll, density };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
