import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Showcase } from "@/components/site/Showcase";
import { Hero, About, Services, Method, Ethics, FinalCta } from "@/components/site/sections";

const TITLE = "Future AI Video Labs | IA para Produção Audiovisual";
const DESCRIPTION =
  "Produção audiovisual com IA generativa e curadoria humana. Vídeos corporativos, campanhas, treinamento e conteúdo de marca, com aprovação antes de cada entrega.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Future AI Video Labs",
          description: DESCRIPTION,
          email: "daniel.reis@futureai.consulting",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Showcase />
        <Services />
        <Method />
        <Ethics />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
