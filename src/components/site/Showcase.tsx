import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import { prefillContact } from "./contact-prefill";
import { PORTFOLIO, onOpenPortfolioPiece, type PortfolioItem } from "./portfolio";
import { Reveal } from "./Reveal";

const FOCUSABLE = 'button, a[href], video[controls], [tabindex]:not([tabindex="-1"])';

const focusedElement = () =>
  document.activeElement instanceof HTMLElement ? document.activeElement : null;

export function Showcase() {
  const [open, setOpen] = useState<PortfolioItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Focus goes back to whatever opened the dialog, unless the visitor left
  // through the contact link: then it must stay with the form.
  const openerRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef(true);

  const openItem = (item: PortfolioItem) => {
    openerRef.current = focusedElement();
    setOpen(item);
  };

  // Serviços can open a piece from its own section.
  useEffect(
    () =>
      onOpenPortfolioPiece((id) => {
        const item = PORTFOLIO.find((i) => i.id === id);
        if (!item) return;
        openerRef.current = focusedElement();
        setOpen(item);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (restoreFocusRef.current) openerRef.current?.focus({ preventScroll: true });
      restoreFocusRef.current = true;
    };
  }, [open]);

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="container-x">
        <h2 className="text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
          Peças entregues
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
          Projetos produzidos para clientes, em diferentes frentes e formatos, e os filmes do
          próprio estúdio.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80} className="h-full">
              <ShowcaseCard item={item} onOpen={() => openItem(item)} />
            </Reveal>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-4 animate-in fade-in-0 duration-200"
          onClick={() => setOpen(null)}
        >
          {/* Reduced motion keeps only the fade. */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="showcase-dialog-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-card animate-in fade-in-0 duration-300 ease-out motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Fechar"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background/80 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
            {/* contain, not cover: vertical and square cuts must show whole. */}
            <video
              key={open.id}
              src={open.video}
              poster={open.poster}
              aria-label={open.title}
              controls
              autoPlay
              playsInline
              className="aspect-[16/9] max-h-[70vh] w-full bg-black object-contain"
            />
            <div className="p-7 md:p-9">
              <h3 id="showcase-dialog-title" className="text-2xl font-semibold">
                {open.title}
              </h3>
              <p className="mt-2 text-sm text-white/65">
                {open.category} · {open.highlight}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{open.desc}</p>
              <a
                href="#contato"
                onClick={() => {
                  restoreFocusRef.current = false;
                  prefillContact({
                    service: open.service,
                    message: `Vi a peça “${open.title}” no portfólio e quero conversar sobre algo nesse formato.`,
                  });
                  setOpen(null);
                }}
                className="btn-primary group mt-8"
              >
                Falar sobre este formato
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ShowcaseCard({ item, onOpen }: { item: PortfolioItem; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // The hover preview is decoration: skip it under reduced motion, and never run it
  // for keyboard focus, where it would only distract.
  const play = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // play() rejects if interrupted by a quick mouseleave — harmless here.
    videoRef.current?.play().catch(() => {});
  };
  const stop = () => {
    const video = videoRef.current;
    if (!video || video.paused) return;
    video.pause();
    // load() puts the poster back without downloading anything (preload is "none").
    video.load();
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={play}
      onMouseLeave={stop}
      aria-label={`Ver vídeo: ${item.title}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] text-left transition-colors duration-300 hover:border-white/25 focus-visible:border-white/40"
    >
      <span className="relative block aspect-[16/10] overflow-hidden">
        <video
          ref={videoRef}
          src={item.video}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100"
        />
        {/* Always visible: on touch screens there is no hover to reveal it. */}
        <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-background/75 text-white transition-colors duration-300 group-hover:bg-background">
          <Play className="h-4 w-4" />
        </span>
      </span>
      <span className="block p-6">
        <span className="block font-display text-lg font-semibold">{item.title}</span>
        <span className="mt-2 block text-sm leading-relaxed text-white/70">{item.desc}</span>
        <span className="mt-4 block text-sm text-white/60">
          {item.category} · <span className="text-white/85">{item.highlight}</span>
        </span>
      </span>
    </button>
  );
}
