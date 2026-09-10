import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Clapperboard,
  GraduationCap,
  Layers,
  Megaphone,
  Mic,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Wand2,
  Workflow,
} from "lucide-react";
import { Reveal, CountUp } from "./Reveal";

/* ---------------------------------- HERO --------------------------------- */

const HERO_STATS: Array<{ value: number; suffix: string; label: string }> = [
  { value: 6, suffix: "", label: "frentes de produção audiovisual" },
  { value: 5, suffix: "", label: "etapas do método, da ideia à entrega" },
  { value: 8, suffix: "", label: "categorias de tecnologia aplicada" },
];

const HERO_CHIPS = [
  { icon: Sparkles, label: "IA generativa aplicada" },
  { icon: Layers, label: "Escala em formatos e idiomas" },
  { icon: ShieldCheck, label: "Curadoria humana" },
];

export function Hero() {
  return (
    <section id="top" className="aurora relative overflow-hidden">
      <div className="container-x relative pb-24 pt-40 md:pb-32 md:pt-52">
        <Reveal>
          <p className="eyebrow">AI VIDEO STUDIO</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 max-w-[16ch] text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[4.4rem] lg:text-[5.2rem]">
            <span className="grad-text">Vídeo, IA</span> e criação
            <br className="hidden sm:block" /> para marcas que precisam
            escalar.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            A Future AI Video Labs combina criatividade humana, inteligência artificial generativa e
            tecnologia audiovisual para transformar ideias em vídeos, campanhas e experiências.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#contato" className="btn-primary group">
              Falar com nosso time
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#servicos" className="btn-ghost">
              Ver soluções
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-20 hairline" />
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="sm:border-l sm:border-white/[0.08] sm:pl-6 sm:first:border-0 sm:first:pl-0">
                <p className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-12 flex flex-wrap gap-3">
            {HERO_CHIPS.map((c) => (
              <span key={c.label} className="pill">
                <c.icon className="h-3.5 w-3.5 text-cyan" />
                {c.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 glow-fade" />
    </section>
  );
}

/* --------------------------------- SOBRE --------------------------------- */

const MOVES: Array<[string, string, string, string, string]> = [
  [
    "01",
    "Direção antes da ferramenta",
    "Começamos pela narrativa, pelo público e pelo objetivo do vídeo — a tecnologia entra depois, a serviço da ideia.",
    "1 conceito",
    "por projeto, validado antes da produção",
  ],
  [
    "02",
    "Produção com IA generativa",
    "Roteiro, imagem, movimento, voz e montagem construídos com modelos multimodais dentro de um fluxo controlado.",
    "dias",
    "em vez de semanas de produção",
  ],
  [
    "03",
    "Escala com consistência",
    "Cada peça vira múltiplas versões por formato, canal, público e idioma, mantendo a identidade da marca.",
    "∞ versões",
    "a partir de um mesmo conceito",
  ],
];

export function About() {
  return (
    <section id="sobre" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">SOBRE</p>
            <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
              Criatividade e <span className="grad-text">execução</span>
              <br className="hidden md:block" /> em produção audiovisual
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-base leading-relaxed text-white/55">
              Três movimentos entre a ideia e o vídeo entregue. Cada um tem direção, entregável e
              critério de qualidade definidos antes de começar.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden md:grid-cols-3">
          {MOVES.map(([num, title, desc, metric, metricLabel], i) => (
            <Reveal key={num} delay={i * 90}>
              <div className="group relative h-full px-0 py-8 md:px-8 md:first:pl-0">
                <div className="hairline" />
                <span className="mt-8 block font-display text-xs font-semibold tracking-[0.3em] text-ember">
                  {num}
                </span>
                <h3 className="mt-6 text-xl font-semibold md:text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/55">{desc}</p>
                <div className="mt-8 hairline" />
                <p className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold">{metric}</span>
                  <span className="text-xs text-white/45">{metricLabel}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-sm text-white/35">
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
    num: "01",
    icon: Clapperboard,
    title: "Vídeos Corporativos",
    lead: "Narrativas institucionais com acabamento de estúdio.",
    desc: "Apresentações, vídeos institucionais, mensagens executivas e comunicação interna.",
    tags: ["Institucional", "Executivo", "Interno"],
  },
  {
    num: "02",
    icon: Megaphone,
    title: "Marketing e Campanhas",
    lead: "Conteúdo de performance em escala.",
    desc: "Campanhas digitais, anúncios, vídeos sociais e variações por público e canal.",
    tags: ["Ads", "Social", "Performance"],
  },
  {
    num: "03",
    icon: GraduationCap,
    title: "Educação e Treinamento",
    lead: "Conhecimento em formato audiovisual.",
    desc: "Tutoriais, treinamentos, conteúdos educacionais e narração multilíngue.",
    tags: ["Tutoriais", "Onboarding", "Multilíngue"],
  },
  {
    num: "04",
    icon: Wand2,
    title: "Conteúdo de Marca",
    lead: "Presença contínua com identidade consistente.",
    desc: "Reels, séries, teasers, storytelling e conteúdos recorrentes para o ano inteiro.",
    tags: ["Reels", "Séries", "Storytelling"],
  },
  {
    num: "05",
    icon: ScanFace,
    title: "Avatares e Personagens",
    lead: "Porta-vozes digitais e personagens virtuais.",
    desc: "Avatares realistas, apresentadores digitais, experiências interativas e simulações.",
    tags: ["Avatares", "Voz neural", "Interativo"],
  },
  {
    num: "06",
    icon: BrainCircuit,
    title: "Consultoria e P&D",
    lead: "Novos fluxos de produção com IA.",
    desc: "Estratégia, experimentação e desenho de pipelines audiovisuais assistidos por IA.",
    tags: ["Estratégia", "Pipelines", "P&D"],
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">SERVIÇOS</p>
          <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            O que <span className="grad-text">fazemos</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55">
            Seis frentes que se sustentam. A direção define o alvo, a IA generativa entrega
            capacidade de produção, a curadoria mantém qualidade e a escala leva o conteúdo a todos
            os canais.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 90} className="h-full">
              <article className="card-glass group h-full p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-ember transition-colors duration-500 group-hover:border-ember/40 group-hover:text-ember">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <span className="font-display text-xs font-semibold tracking-[0.28em] text-white/35">
                    {s.num}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.lead}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/45">{s.desc}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
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
    title: "Curadoria",
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

export function Method() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

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
          <p className="eyebrow">MÉTODO</p>
          <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            Da ideia ao <span className="grad-text">vídeo</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55">
            O mesmo ciclo roda em qualquer frente. O que muda é o formato. Role para percorrer as
            cinco etapas.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-32 border-l border-white/10 pl-6">
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
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[0.7rem] font-semibold transition-all duration-500 ${
                      i === active
                        ? "border-ember bg-ember/20 text-white"
                        : i < active
                          ? "border-white/20 bg-white/5 text-white/50"
                          : "border-white/10 text-white/35"
                    }`}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`font-display text-lg font-medium transition-colors duration-500 ${
                      i === active ? "text-white" : "text-white/35"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                data-idx={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`card-glass relative overflow-hidden p-7 transition-all duration-700 md:p-10 ${
                  i === active ? "border-white/20 opacity-100" : "opacity-60"
                }`}
              >
                <span className="pointer-events-none absolute -right-4 -top-8 font-display text-[7rem] font-bold leading-none text-white/[0.04] md:text-[10rem]">
                  {s.num}
                </span>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-ember">
                  Etapa {s.num}
                </p>
                <h3 className="mt-4 text-2xl font-semibold md:text-3xl">{s.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
                  {s.desc}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {s.items.map((it) => (
                    <div key={it} className="border-t border-white/10 pt-3 text-sm text-white/55">
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- TECNOLOGIA ------------------------------ */

const TECH = [
  { icon: Sparkles, name: "Generative AI", desc: "Modelos multimodais para imagem e vídeo." },
  { icon: Clapperboard, name: "AI Video", desc: "Geração e edição assistida de movimento." },
  { icon: Mic, name: "Neural Voice", desc: "Vozes sintéticas com controle de interpretação." },
  { icon: ScanFace, name: "Digital Avatars", desc: "Apresentadores e personagens virtuais." },
  { icon: Bot, name: "Multimodal AI", desc: "Texto, áudio, imagem e vídeo num só fluxo." },
  { icon: Layers, name: "Synthetic Media", desc: "Cenários, elementos e composições geradas." },
  { icon: Workflow, name: "Automation", desc: "Pipelines reproduzíveis de produção." },
  { icon: BrainCircuit, name: "Computer Vision", desc: "Análise e tratamento inteligente de imagem." },
];

export function Technology() {
  return (
    <section id="tecnologia" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">TECNOLOGIA</p>
          <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            Tecnologia por trás da <span className="grad-text">criatividade</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55">
            Um ecossistema de categorias de inteligência artificial aplicadas a cada etapa da cadeia
            de produção audiovisual.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TECH.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 70} className="h-full">
              <div className="card-glass group h-full p-6">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-cyan">
                  <t.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- PESQUISA -------------------------------- */

const RESEARCH = [
  ["Storytelling generativo", "Novas estruturas narrativas construídas com apoio de modelos."],
  ["Narração neural", "Vozes sintéticas com naturalidade e controle de interpretação."],
  ["Tradução automatizada", "Adaptação de conteúdos para múltiplos idiomas."],
  ["Personalização de vídeos", "Variações dinâmicas por público, canal e contexto."],
  ["Agentes criativos", "Assistentes que apoiam etapas do processo criativo."],
  ["Automação audiovisual", "Fluxos de produção mais rápidos e reproduzíveis."],
];

export function Research() {
  return (
    <section id="pesquisa" className="relative py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="eyebrow">PESQUISA & INOVAÇÃO</p>
          <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3rem]">
            Pesquisa, inovação e <span className="grad-text">futuro audiovisual</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            Mantemos linhas contínuas de investigação para antecipar as próximas capacidades da
            produção audiovisual com IA.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div>
            {RESEARCH.map(([t, d], i) => (
              <div
                key={t}
                className="group grid gap-2 border-t border-white/10 py-6 transition-colors duration-500 last:border-b hover:border-white/25 md:grid-cols-[1fr_1.2fr] md:gap-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xs text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-medium transition-transform duration-500 group-hover:translate-x-1">
                    {t}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-white/45">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- DIFERENCIAIS ----------------------------- */

const PILLARS = [
  ["Tecnologia", "IA generativa multimodal aplicada à produção audiovisual."],
  ["Velocidade", "Processos mais rápidos, com menos etapas manuais."],
  ["Escala", "Múltiplas versões para diferentes públicos e canais."],
  ["Curadoria", "Tecnologia combinada com direção e sensibilidade humana."],
];

export function Pillars() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">DIFERENCIAIS</p>
          <h2 className="mt-6 max-w-2xl text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            Por que <span className="grad-text">Future AI Video Labs</span>?
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 80} className="h-full">
              <div className="card-glass h-full p-7">
                <span className="font-display text-xs font-semibold tracking-[0.28em] text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-semibold">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ IA RESPONSÁVEL ---------------------------- */

const ETHICS = [
  "Uso ético de IA",
  "Direitos autorais",
  "Privacidade",
  "Segurança",
  "Transparência",
  "Governança",
  "Autenticidade criativa",
  "LGPD",
];

export function Ethics() {
  return (
    <section id="etica" className="relative py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow">IA RESPONSÁVEL</p>
          <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3rem]">
            IA responsável. <span className="grad-text">Criatividade consciente.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            Adotamos práticas claras de uso de inteligência artificial para garantir segurança
            jurídica, confiança e consistência em projetos corporativos.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ETHICS.map((e) => (
              <li
                key={e}
                className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 text-sm transition-all duration-400 hover:border-white/25 hover:bg-white/[0.07]"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-cyan" />
                <span className="text-white/75 transition-colors group-hover:text-white">{e}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ----------------------------------- */

export function FinalCta() {
  return (
    <section id="contato" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <div className="aurora relative overflow-hidden rounded-[2rem] border border-white/10 px-7 py-16 md:px-16 md:py-24">
            <p className="eyebrow">CONTATO</p>
            <h2 className="mt-6 max-w-3xl text-[2.2rem] font-semibold leading-[1.05] md:text-[3.6rem]">
              Vamos criar o próximo capítulo da{" "}
              <span className="grad-text">produção audiovisual</span>?
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/60">
              Conte-nos sobre seu projeto e descubra como a inteligência artificial pode transformar
              sua produção de conteúdo.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:daniel.reis@futureai.consulting" className="btn-primary group">
                Falar com nosso time
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="#servicos" className="btn-ghost">
                Ver soluções
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
