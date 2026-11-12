import type { ContactService } from "@/lib/contact";

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  /** Contact-form option preselected when the visitor asks about this piece. */
  service: ContactService;
  desc: string;
  highlight: string;
  video: string;
  /** A frame of the film, so nothing downloads until the visitor asks for motion. */
  poster: string;
};

const piece = (
  id: string,
  rest: Omit<PortfolioItem, "id" | "video" | "poster">,
): PortfolioItem => ({
  id,
  ...rest,
  video: `/videos/portfolio/${id}.mp4`,
  poster: `/videos/portfolio/${id}-poster.jpg`,
});

// Client projects (confirmed by the studio), then the studio's own films.
// No client names, results or metrics exist.
export const PORTFOLIO: PortfolioItem[] = [
  piece("corporate", {
    title: "Filme institucional generativo",
    category: "Corporativo",
    service: "Vídeos corporativos",
    desc: "Narrativa executiva construída com cenas geradas e direção humana.",
    highlight: "Conceito único, múltiplos cortes",
  }),
  piece("shopping", {
    title: "Campanha de varejo",
    category: "Campanhas",
    service: "Marketing e campanhas",
    desc: "Uma ideia adaptada para vertical, quadrado e horizontal.",
    highlight: "Variações por canal",
  }),
  piece("consumer", {
    title: "Filme de produto",
    category: "Campanhas",
    service: "Marketing e campanhas",
    desc: "Peça voltada ao consumidor, com cenas geradas e acabamento cinematográfico.",
    highlight: "Produto em destaque",
  }),
  piece("felipe", {
    title: "Apresentador digital",
    category: "Avatares",
    service: "Avatares e personagens",
    desc: "Porta-voz virtual para comunicação recorrente da marca.",
    highlight: "Personagem consistente",
  }),
  piece("brand", {
    title: "Série de conteúdo de marca",
    category: "Conteúdo",
    service: "Conteúdo de marca",
    desc: "Episódios curtos com identidade visual contínua.",
    highlight: "Produção recorrente",
  }),
  piece("jazz", {
    title: "Experimento audiovisual",
    category: "P&D",
    service: "Consultoria e P&D",
    desc: "Exploração de linguagem visual com modelos multimodais.",
    highlight: "Laboratório criativo",
  }),
  // The studio's own films (not client work); listed after the client pieces so
  // Serviços keeps linking each frente to a client piece first.
  piece("manifesto", {
    title: "Manifesto do estúdio",
    category: "Estúdio",
    service: "Vídeos corporativos",
    desc: "De uma loja a uma indústria inteira: a mesma visão aplicada em qualquer escala.",
    highlight: "Filme próprio",
  }),
  piece("studio", {
    title: "Apresentação das frentes",
    category: "Estúdio",
    service: "Marketing e campanhas",
    desc: "As frentes do estúdio em um só filme, com a revisão humana antes de cada entrega.",
    highlight: "Filme próprio",
  }),
];

// Lets another section (Serviços) open a piece in the portfolio dialog without the
// two components sharing state.
const OPEN_EVENT = "portfolio:open";

export function openPortfolioPiece(id: string) {
  window.dispatchEvent(new CustomEvent<string>(OPEN_EVENT, { detail: id }));
}

/** Subscribes to open requests; returns the unsubscribe function. */
export function onOpenPortfolioPiece(handler: (id: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
