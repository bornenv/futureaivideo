import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { CONTACT_EMAIL, ContactForm } from "./ContactForm";

// Curation is the studio's quality gate: a piece that fails it never reaches delivery.
// The hero and the method both single this step out, and ember is reserved for it.
const GATE_STEP = "Curadoria";

/* ---------------------------------- HERO --------------------------------- */

const METHOD_FLOW = ["Estratégia", "Conceito", "Produção", GATE_STEP, "Entrega"];

// The approval sequence (see styles.css): each step lights up in turn, and the
// flow holds at the gate while it is approved before reaching Entrega. Seconds.
const FLOW_START = 0.35;
const FLOW_STEP = 0.28;
const GATE_HOLD = 0.55;
const GATE_INDEX = METHOD_FLOW.indexOf(GATE_STEP);
const flowDelay = (i: number) =>
  `${FLOW_START + i * FLOW_STEP + (i > GATE_INDEX ? GATE_HOLD : 0)}s`;

const HERO_REEL = {
  video: "/videos/portfolio/corporate.mp4",
  poster: "/videos/portfolio/corporate-poster.jpg",
  title: "Filme institucional generativo",
};

// The reel autoplays only where it is cheap and welcome: wide screens, no reduced
// motion, no data saver, and only after the page has loaded. Everywhere else the
// poster frame stands in, so the first viewport never waits on the video file.
function HeroReel() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // A pause the visitor chose survives scrolling away and back.
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const canAutoplay = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    ).matches;
    if (!canAutoplay || connection?.saveData) return;

    // A decorative loop must not run where nobody sees it: play only while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) video.pause();
        else if (!userPaused.current) video.play().catch(() => {});
      },
      { threshold: 0.25 },
    );
    const start = () => io.observe(video);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      io.disconnect();
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <figure className="rise-in" style={{ animationDelay: "320ms" }}>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
        <video
          ref={ref}
          src={HERO_REEL.video}
          poster={HERO_REEL.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-background/75 text-white transition-colors hover:bg-background"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="text-white/70">{HERO_REEL.title} · projeto de cliente</span>
        <a
          href="#portfolio"
          className="text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Ver peças entregues
        </a>
      </figcaption>
    </figure>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative">
      <div className="container-x pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <h1 className="max-w-[20ch] text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[3.6rem] lg:text-[3.4rem] xl:text-[4rem]">
              <span className="text-white/60">Vídeo com IA generativa.</span> Nenhuma peça sai sem{" "}
              <span className="gate-underline">aprovação humana.</span>
            </h1>

            <p
              className="rise-in mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              A Future AI Video Labs combina criatividade humana, inteligência artificial generativa
              e tecnologia audiovisual para transformar ideias em vídeos, campanhas e experiências.
            </p>

            <div
              className="rise-in mt-10 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "220ms" }}
            >
              <a href="#contato" className="btn-primary group">
                Falar com nosso time
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#metodologia" className="btn-ghost">
                Ver o método
              </a>
            </div>
          </div>

          <HeroReel />
        </div>

        <ol
          aria-label="Método em cinco etapas"
          className="mt-16 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 text-sm md:mt-20"
        >
          {METHOD_FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              {step === GATE_STEP ? (
                <span
                  className="gate-approve rounded-full border border-ember/60 bg-ember/10 px-3.5 py-1.5 font-medium text-white"
                  style={{ animationDelay: flowDelay(i) }}
                >
                  {step}
                  <span className="text-white/70"> · aprovação humana</span>
                </span>
              ) : (
                <span className="flow-step text-white/70" style={{ animationDelay: flowDelay(i) }}>
                  {step}
                </span>
              )}
              {i < METHOD_FLOW.length - 1 && (
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-white/40" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------- SOBRE --------------------------------- */

const MOVES = [
  {
    title: "Direção antes da ferramenta",
    desc: "Começamos pela narrativa, pelo público e pelo objetivo do vídeo — a tecnologia entra depois, a serviço da ideia.",
  },
  {
    title: "Produção com IA generativa",
    desc: "Roteiro, imagem, movimento, voz e montagem construídos com modelos multimodais dentro de um fluxo controlado.",
  },
  {
    title: "Escala com consistência",
    desc: "Cada peça vira múltiplas versões por formato, canal, público e idioma, mantendo a identidade da marca.",
  },
];

export function About() {
  return (
    <section id="sobre" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <h2 className="text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
              Criatividade e execução
              <br className="hidden md:block" /> em produção audiovisual
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-base leading-relaxed text-white/70">
              O que orienta cada projeto, da ideia ao vídeo entregue.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {MOVES.map((m, i) => (
            <Reveal key={m.title} delay={i * 90}>
              <div className="border-t border-white/15 pt-8">
                <h3 className="text-xl font-semibold md:text-2xl">{m.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} variant="wipe">
          <p className="mt-20 max-w-[24ch] font-display text-[1.9rem] font-semibold leading-[1.12] tracking-[-0.03em] md:mt-28 md:text-[2.8rem]">
            Se a peça não atende ao critério criativo, ela não avança para a entrega.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- SERVIÇOS -------------------------------- */

const SERVICES = [
  {
    title: "Vídeos corporativos",
    lead: "Narrativas institucionais com acabamento de estúdio.",
    desc: "Apresentações, vídeos institucionais, mensagens executivas e comunicação interna.",
    tags: ["Institucional", "Executivo", "Interno"],
  },
  {
    title: "Marketing e campanhas",
    lead: "Uma ideia, desdobrada por público e canal.",
    desc: "Campanhas digitais, anúncios, vídeos sociais e variações por público e canal.",
    tags: ["Anúncios", "Social", "Performance"],
  },
  {
    title: "Educação e treinamento",
    lead: "Conhecimento em formato audiovisual.",
    desc: "Tutoriais, treinamentos, conteúdos educacionais e narração multilíngue.",
    tags: ["Tutoriais", "Onboarding", "Multilíngue"],
  },
  {
    title: "Conteúdo de marca",
    lead: "Presença contínua com identidade consistente.",
    desc: "Reels, séries, teasers, storytelling e conteúdos recorrentes para o ano inteiro.",
    tags: ["Reels", "Séries", "Storytelling"],
  },
  {
    title: "Avatares e personagens",
    lead: "Porta-vozes digitais e personagens virtuais.",
    desc: "Avatares realistas, apresentadores digitais, experiências interativas e simulações.",
    tags: ["Avatares", "Voz neural", "Interativo"],
  },
  {
    title: "Consultoria e P&D",
    lead: "Novos fluxos de produção com IA.",
    desc: "Estratégia, experimentação e desenho de fluxos de produção audiovisual assistidos por IA.",
    tags: ["Estratégia", "Fluxos de produção", "Experimentação"],
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <h2 className="text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            O que fazemos
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            Seis frentes que se sustentam. A direção define o alvo, a IA generativa entrega
            capacidade de produção, a curadoria mantém qualidade e a escala leva o conteúdo a todos
            os canais.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90} className="h-full">
              <article className="h-full border-t border-white/15 pt-7">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/85">{s.lead}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- METODOLOGIA ------------------------------ */

const STEPS = [
  {
    num: "01",
    title: "Estratégia",
    desc: "Entendimento do objetivo, público, canal e contexto de uso do conteúdo.",
    items: ["Briefing", "Público e canal", "Objetivo mensurável"],
  },
  {
    num: "02",
    title: "Conceito",
    desc: "Desenvolvimento da narrativa, referências visuais e direção criativa.",
    items: ["Roteiro", "Direção de arte", "Referências"],
  },
  {
    num: "03",
    title: "Produção",
    desc: "Geração com IA multimodal: imagem, movimento, voz, trilha e montagem.",
    items: ["IA generativa", "Voz neural", "Montagem"],
  },
  {
    num: "04",
    title: GATE_STEP,
    desc: "Refinamento humano, ajuste de marca e controle de qualidade quadro a quadro.",
    items: ["Revisão criativa", "Consistência de marca", "Aprovação"],
  },
  {
    num: "05",
    title: "Entrega",
    desc: "Finalização e adaptação para formatos, canais, públicos e idiomas.",
    items: ["Formatos", "Versões", "Idiomas"],
  },
];

function stepMarkerClass(isGate: boolean, isActive: boolean, isPast: boolean) {
  if (isGate)
    return isActive ? "border-ember bg-ember/20 text-white" : "border-ember/70 text-white/80";
  if (isActive) return "border-white/70 bg-white/10 text-white";
  return isPast ? "border-white/25 text-white/70" : "border-white/15 text-white/60";
}

export function Method() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset["idx"]);
            setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="metodologia" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <h2 className="text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            Da ideia ao vídeo
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            O mesmo ciclo roda em qualquer frente. O que muda é o formato.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-32 pl-6">
              {/* The rail fills as the reader moves through the steps. */}
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-white/10" />
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px origin-top bg-white/60 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: `scaleY(${(active + 1) / STEPS.length})` }}
              />
              {STEPS.map((s, i) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() =>
                    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  className="flex w-full items-center gap-4 py-3 text-left"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors duration-500 ${stepMarkerClass(
                      s.title === GATE_STEP,
                      i === active,
                      i < active,
                    )}`}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`font-display text-lg font-medium transition-colors duration-500 ${
                      i === active ? "text-white" : "text-white/60"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* An ordered list, so assistive tech announces the step position; the
              visible numbers are then decorative. */}
          <ol className="space-y-5">
            {STEPS.map((s, i) => {
              const isGate = s.title === GATE_STEP;
              return (
                <li
                  key={s.num}
                  data-idx={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className={`rounded-lg border p-7 transition-colors duration-500 md:p-10 ${
                    isGate
                      ? "border-ember/85 bg-ember/[0.06]"
                      : i === active
                        ? "border-white/25 bg-white/[0.04]"
                        : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <h3 className="text-2xl font-semibold md:text-3xl">
                    <span
                      aria-hidden="true"
                      className="mr-3 font-display tabular-nums text-white/60"
                    >
                      {s.num}
                    </span>
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                    {s.desc}
                  </p>
                  <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                    {s.items.map((it) => (
                      <li key={it} className="border-t border-white/10 pt-3 text-sm text-white/70">
                        {it}
                      </li>
                    ))}
                  </ul>
                  {isGate && (
                    <Reveal variant="wipe" className="mt-8">
                      <dl className="grid gap-4 border-t border-ember/30 pt-6 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-white">Aprovada</dt>
                          <dd className="mt-1 text-white/70">Segue para a entrega.</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-white">Não aprovada</dt>
                          <dd className="mt-1 text-white/70">Não avança para a entrega.</dd>
                        </div>
                      </dl>
                    </Reveal>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ IA RESPONSÁVEL ---------------------------- */

// The eight commitments, paired so the list reads as four points. Labels only:
// the studio's written policies behind them have not been provided yet.
const ETHICS = [
  "Direitos autorais e autenticidade criativa",
  "Privacidade e LGPD",
  "Segurança e governança",
  "Transparência e uso ético de IA",
];

export function Ethics() {
  return (
    <section id="etica" className="relative py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="text-[2.1rem] font-semibold leading-[1.06] md:text-[3rem]">
            IA responsável. Criatividade consciente.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Projetos corporativos com IA passam pelo jurídico. Adotamos práticas de uso de
            inteligência artificial pensadas para esse contexto, e estes são os pontos que elas
            cobrem.
          </p>
          <a
            href="#contato"
            className="group mt-8 inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
          >
            Dúvidas do seu jurídico? Fale com a gente
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>
        <ul className="border-t border-white/10">
          {ETHICS.map((e, i) => (
            <li key={e} className="border-b border-white/10">
              <Reveal
                delay={i * 70}
                className="py-5 font-display text-lg font-medium text-white/90"
              >
                {e}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------- TECNOLOGIA ------------------------------ */

const CAPABILITIES = [
  {
    name: "Imagem e movimento",
    desc: "Geração, edição e tratamento de imagem e vídeo com modelos generativos e visão computacional.",
  },
  {
    name: "Voz e idioma",
    desc: "Voz neural com controle de interpretação e narração em vários idiomas.",
  },
  {
    name: "Avatares digitais",
    desc: "Apresentadores e personagens virtuais para comunicação recorrente.",
  },
  {
    name: "Fluxo multimodal",
    desc: "Texto, áudio, imagem e vídeo num só fluxo, com etapas automatizadas e reproduzíveis.",
  },
];

const RESEARCH = [
  "Storytelling generativo",
  "Narração neural",
  "Tradução automatizada",
  "Personalização de vídeos",
  "Agentes criativos",
  "Automação audiovisual",
];

export function Technology() {
  return (
    <section id="tecnologia" className="relative py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <h2 className="text-[2.1rem] font-semibold leading-[1.06] md:text-[3rem]">
            Tecnologia por trás da criatividade
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Inteligência artificial aplicada a cada etapa da produção, e linhas contínuas de
            pesquisa para antecipar as próximas capacidades.
          </p>
        </Reveal>
        <div>
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {CAPABILITIES.map((c, i) => (
              <Reveal
                key={c.name}
                delay={i * 70}
                className="grid gap-2 py-6 md:grid-cols-[1fr_1.4fr] md:gap-10"
              >
                <dt className="font-display text-lg font-medium">{c.name}</dt>
                <dd className="text-sm leading-relaxed text-white/70">{c.desc}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal delay={280}>
            <div id="pesquisa" className="mt-10">
              <h3 className="font-display text-base font-medium">Em pesquisa</h3>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                {RESEARCH.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ----------------------------------- */

const NEXT_STEPS = [
  "Respondemos no e-mail que você informar.",
  "A primeira conversa é sobre objetivo, público, canais e prazo.",
  "Enviar a mensagem não gera compromisso de contratação.",
];

export function FinalCta() {
  return (
    <section id="contato" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal variant="fade">
          <div className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-20">
            <div>
              <h2 className="max-w-xl text-[2.2rem] font-semibold leading-[1.05] md:text-[3.2rem]">
                Conte o objetivo. A direção vem antes da ferramenta.
              </h2>
              <h3 className="mt-10 text-base font-semibold">Depois do envio</h3>
              <ul className="mt-4 max-w-md border-t border-white/10">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step} className="border-b border-white/10">
                    <Reveal
                      delay={200 + i * 80}
                      className="py-3 text-sm leading-relaxed text-white/70"
                    >
                      {step}
                    </Reveal>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-white/60">Prefere escrever direto?</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group mt-2 inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
              >
                {CONTACT_EMAIL}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
