import { useMemo, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import { Reveal } from "./Reveal";
import show1 from "@/assets/show-1.jpg";
import show2 from "@/assets/show-2.jpg";
import show3 from "@/assets/show-3.jpg";
import show4 from "@/assets/show-4.jpg";
import show5 from "@/assets/show-5.jpg";
import show6 from "@/assets/show-6.jpg";

type Item = {
  id: string;
  title: string;
  category: string;
  desc: string;
  highlight: string;
  tags: string[];
  image: string;
};

const ITEMS: Item[] = [
  {
    id: "1",
    title: "Filme institucional generativo",
    category: "Corporativo",
    desc: "Narrativa executiva construída com cenas geradas e direção humana.",
    highlight: "Conceito único, múltiplos cortes",
    tags: ["Institucional", "IA generativa"],
    image: show1,
  },
  {
    id: "2",
    title: "Campanha em múltiplos formatos",
    category: "Campanhas",
    desc: "Uma ideia adaptada para vertical, quadrado e horizontal.",
    highlight: "Variações por canal",
    tags: ["Ads", "Social"],
    image: show2,
  },
  {
    id: "3",
    title: "Trilha de treinamento",
    category: "Educação",
    desc: "Série de módulos com narração neural e apoio visual gerado.",
    highlight: "Narração multilíngue",
    tags: ["Treinamento", "Voz neural"],
    image: show3,
  },
  {
    id: "4",
    title: "Apresentador digital",
    category: "Avatares",
    desc: "Porta-voz virtual para comunicação recorrente da marca.",
    highlight: "Personagem consistente",
    tags: ["Avatar", "Marca"],
    image: show4,
  },
  {
    id: "5",
    title: "Série de conteúdo de marca",
    category: "Conteúdo",
    desc: "Episódios curtos com identidade visual contínua.",
    highlight: "Produção recorrente",
    tags: ["Reels", "Storytelling"],
    image: show5,
  },
  {
    id: "6",
    title: "Experimento audiovisual",
    category: "P&D",
    desc: "Exploração de linguagem visual com modelos multimodais.",
    highlight: "Laboratório criativo",
    tags: ["P&D", "Multimodal"],
    image: show6,
  },
];

const FILTERS = ["Todos", "Corporativo", "Campanhas", "Educação", "Avatares", "Conteúdo", "P&D"];

export function Showcase() {
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState<Item | null>(null);

  const items = useMemo(
    () => (filter === "Todos" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">PORTFÓLIO</p>
          <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.06] md:text-[3.2rem]">
            Formatos e <span className="grad-text">explorações</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55">
            Exemplos visuais dos formatos que produzimos. Filtre pela frente mais próxima do seu
            desafio.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                  filter === f
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80} className="h-full">
              <button
                type="button"
                onClick={() => setOpen(item)}
                aria-label={`Ver detalhes de ${item.title}`}
                className="card-glass group h-full w-full overflow-hidden text-left"
              >
                <span className="relative block aspect-[16/10] overflow-hidden rounded-t-[1.2rem]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                    {item.category}
                  </span>
                  <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                    <Play className="h-4 w-4" />
                  </span>
                </span>
                <span className="block p-6">
                  <span className="block font-display text-lg font-semibold">{item.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/50">
                    {item.desc}
                  </span>
                  <span className="mt-4 block text-sm text-cyan">{item.highlight}</span>
                  <span className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-sm text-white/35">
            Imagens ilustrativas de formatos — envie seus vídeos reais para substituí-las.
          </p>
        </Reveal>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
          onClick={() => setOpen(null)}
          role="presentation"
        >
          <div
            className="card-glass relative w-full max-w-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background/70 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={open.image}
              alt={open.title}
              className="aspect-[16/9] w-full rounded-t-[1.2rem] object-cover"
            />
            <div className="p-7 md:p-9">
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-ember">
                {open.category}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{open.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{open.desc}</p>
              <a href="#contato" onClick={() => setOpen(null)} className="btn-primary mt-8 group">
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
