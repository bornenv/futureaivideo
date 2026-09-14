import { ArrowUpRight } from "lucide-react";

const COLS = [
  {
    title: "Navegação",
    links: [
      { label: "Sobre", href: "#sobre" },
      { label: "Portfólio", href: "#portfolio" },
      { label: "Serviços", href: "#servicos" },
      { label: "Método", href: "#metodologia" },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "Vídeos corporativos", href: "#servicos" },
      { label: "Marketing e campanhas", href: "#servicos" },
      { label: "Educação e treinamento", href: "#servicos" },
      { label: "Avatares e personagens", href: "#servicos" },
    ],
  },
  {
    title: "Tecnologia",
    links: [
      { label: "Tecnologia e pesquisa", href: "#tecnologia" },
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
            <img
              src="/brand/logo.webp"
              alt="Future AI Video Labs"
              width={529}
              height={200}
              loading="lazy"
              className="h-16 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              Produção audiovisual potencializada por inteligência artificial generativa,
              criatividade humana e tecnologia aplicada.
            </p>
            <a
              href="mailto:daniel.reis@futureai.consulting"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
            >
              daniel.reis@futureai.consulting
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
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
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Future AI Video Labs. Todos os direitos reservados.
          </p>
          <a href="#etica" className="text-xs text-white/60 transition-colors hover:text-white">
            Uso responsável de IA
          </a>
        </div>
      </div>
    </footer>
  );
}
