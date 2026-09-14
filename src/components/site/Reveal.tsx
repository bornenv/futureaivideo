import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-in reveal as progressive enhancement. Content renders visible on the
 * server and before hydration; only elements that start below the fold are
 * hidden on mount, while off screen, and revealed as they scroll in. Nothing a
 * visitor can already see ever disappears, and without JS the page is complete.
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setHidden(false);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, hidden };
}

/**
 * - `rise`: blocks and list items (the default).
 * - `fade`: large blocks, where movement would feel heavy.
 * - `wipe`: reserved for the curation gate's own statements.
 */
export type RevealVariant = "rise" | "fade" | "wipe";

export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "rise",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
}) {
  const { ref, hidden } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-hidden={hidden ? "true" : "false"}
      data-variant={variant}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
