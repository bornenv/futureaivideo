import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// In page order.
const NAV = [
  { label: "Portfólio", href: "#portfolio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Método", href: "#metodologia" },
  { label: "IA responsável", href: "#etica" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Watch every section, not only the linked ones: reading a section that has no
  // nav link (hero, Sobre, Contato) must clear the highlight.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (!els.length) return;
    const linked = new Set(NAV.map((n) => n.href));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const href = `#${visible.target.id}`;
        setActive(linked.has(href) ? href : "");
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-500 ${
          scrolled ? "border-b border-white/[0.08] bg-background/95" : "border-b border-transparent"
        }`}
      >
        <div className="container-x grid h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <a href="#top" className="flex min-w-0 items-center">
            <img
              src="/brand/logo.webp"
              alt="Future AI Video Labs"
              width={529}
              height={200}
              className="h-12 w-auto md:h-14"
            />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "location" : undefined}
                className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  active === item.href
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden justify-end lg:flex">
            <a
              href="#contato"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/35 hover:bg-white/10"
            >
              Falar com nosso time
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 shrink-0 items-center justify-center justify-self-end rounded-full border border-white/15 bg-white/[0.04] lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-white transition-all duration-300 motion-reduce:transition-none ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-4 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-white transition-all duration-300 motion-reduce:transition-none ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-b border-white/[0.08] bg-background transition-[max-height,opacity] duration-500 motion-reduce:transition-none lg:hidden ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-x flex flex-col py-4">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              className={`border-b border-white/[0.06] py-4 font-display text-2xl font-medium tracking-tight transition-all duration-500 motion-reduce:translate-y-0 motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              } ${active === item.href ? "text-white" : "text-white/65"}`}
            >
              {item.label}
            </a>
          ))}
          <a href="#contato" onClick={() => setOpen(false)} className="btn-primary my-6">
            Falar com nosso time
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
