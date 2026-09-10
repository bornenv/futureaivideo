import { ArrowUpRight } from "lucide-react";

const COLS = [
  {
    title: "Navegação",
    links: [
      { label: "Sobre", href: "#sobre" },
      { label: "Serviços", href: "#servicos" },
      { label: "Método", href: "#metodologia" },
      { label: "Portfólio", href: "#portfolio" },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "Vídeos corporativos", href: "#servicos" },
      { label: "Marketing e campanhas", href: "#servicos" },
      { label: "Educação e treinamento", href: "#servicos" },
      { label: "Avatares virtuais", href: "#servicos" },
    ],
  },
  {
    title: "Tecnologia",
    links: [
      { label: "IA generativa", href: "#tecnologia" },
      { label: "Synthetic media", href: "#tecnologia" },
      { label: "Pesquisa e inovação", href: "#pesquisa" },
      { label: "IA responsável", href: "#etica" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.08]">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-violet/70 to-cyan/40">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="font-display text-[0.95rem] font-semibold">
                Future AI Video Labs
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/45">
              Produção audiovisual potencializada por inteligência artificial generativa,
              criatividade humana e tecnologia aplicada.
            </p>
            <a
              href="mailto:daniel.reis@futureai.consulting"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              daniel.reis@futureai.consulting
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/40">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Future AI Video Labs. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap gap-6">
            <a href="#etica" className="text-xs text-white/35 transition-colors hover:text-white">
              Política de privacidade
            </a>
            <a href="#etica" className="text-xs text-white/35 transition-colors hover:text-white">
              Uso responsável de IA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
