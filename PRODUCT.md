# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primário — liderança de marketing e comunicação corporativa** em empresas médias e grandes. Chega pressionado por volume: precisa de mais vídeo, em mais formatos e canais, sem ampliar equipe nem orçamento de produção. O job é conseguir capacidade de produção audiovisual contínua com segurança para usar dentro de uma estrutura corporativa.

O site também fala com times adjacentes que o comprador de marketing costuma trazer para a decisão — comunicação interna, RH/treinamento, educação corporativa —, mas eles aparecem como linhas de serviço, não como públicos confirmados com job próprio.

## Product Purpose

Produção audiovisual executada com IA generativa multimodal e finalizada por direção humana: roteiro, imagem, movimento, voz, trilha e montagem dentro de um fluxo controlado, do briefing à entrega em múltiplos formatos e idiomas.

Sucesso do site, hoje, é uma conversa iniciada: o caminho principal de conversão é o formulário da seção `#contato`, que envia a mensagem por e-mail (Resend) para `daniel.reis@futureai.consulting`, e é o destino dos CTAs do header e do hero. O `mailto:` continua como alternativa direta na mesma seção e no rodapé.

## Positioning

**A curadoria é o gate, não um acabamento.** A IA entrega capacidade de produção; o critério criativo humano decide o que sai. A regra está afirmada na própria página: *"Se a peça não atende ao critério criativo, ela não avança para a entrega."* Um concorrente pode alegar acesso aos mesmos modelos; não pode copiar honestamente a existência de um ponto de reprovação humano antes da entrega.

Consequência para trabalhos futuros: velocidade e escala são efeitos, não a tese. Reposicionar a página em torno de "mais rápido" ou "mais barato" contradiz o mecanismo declarado.

## Operating Context

- Landing page única em português do Brasil (`/`), navegada por âncoras, nesta ordem: `#top`, `#sobre`, `#portfolio`, `#servicos`, `#metodologia` (com `#tecnologia` e `#pesquisa` dentro da etapa Produção), `#etica` e `#contato`. O hero mostra em loop um filme de cliente (o institucional), o portfólio vem logo depois do Sobre, e cada frente de serviço com peça correspondente leva ao vídeo dela: a prova aparece cedo e é ligada à oferta.
- Sem CMS e sem banco de dados — o conteúdo é literal no código (`src/components/site/sections.tsx`). O único backend é a server function do formulário de contato, que apenas envia e-mail: nenhum lead fica armazenado no site.
- Contexto de compra corporativa: a decisão passa por jurídico e compliance, e não só por criação. Por isso a seção de IA responsável vem logo depois do método e está na navegação principal.
- Projeto conectado ao [Lovable](https://lovable.dev); commits no branch conectado sincronizam de volta para o editor.

## Capabilities and Constraints

**Seis frentes de serviço:** vídeos corporativos; marketing e campanhas; educação e treinamento; conteúdo de marca; avatares e personagens; consultoria e P&D.

**Método de cinco etapas**, aplicado igual em todas as frentes — o que muda é o formato: Estratégia → Conceito → Produção → Curadoria → Entrega. A Curadoria é o ponto de aprovação: a peça aprovada segue para a entrega; a não aprovada não avança.

**Oito categorias de tecnologia declaradas**, apresentadas dentro da etapa Produção do método (a direção vem antes da ferramenta), em quatro áreas em português (imagem e movimento; voz e idioma; avatares digitais; fluxo multimodal): IA generativa, vídeo com IA, voz neural, avatares digitais, IA multimodal, mídia sintética, automação e visão computacional. São categorias, não fornecedores: nenhum modelo, ferramenta ou parceiro é nomeado no site, e nomear um é uma decisão de produto ainda não tomada.

**Seis linhas de pesquisa contínua:** storytelling generativo, narração neural, tradução automatizada, personalização de vídeos, agentes criativos, automação audiovisual.

**IA responsável — oito rótulos:** uso ético de IA, direitos autorais, privacidade, segurança, transparência, governança, autenticidade criativa, LGPD. O site mostra só os rótulos, agrupados em quatro pares, sem ícone de certificação e sem prometer garantia jurídica; oferece ao jurídico do cliente um caminho até o contato. O compromisso concreto de cada item depende das políticas reais do estúdio, que ainda não foram fornecidas; não escrever texto de política sem elas.

**Terminologia da casa:** "frentes" (não "produtos"), "método" e "etapas" (não "processo"/"fases"), "curadoria" para a revisão humana, "peça" para o entregável.

**Restrições técnicas:** TanStack Start com SSR, build Nitro (alvo Cloudflare por padrão), React 19, Tailwind v4. Deploy via Lovable.

**Explicitamente indecidido:**
- se haverá CRM ou armazenamento de leads (o formulário de contato existe, mas só envia e-mail);
- preço, pacotes e modelo de contratação;
- multi-idioma do próprio site (a entrega multilíngue é do serviço, não da página);
- links de redes sociais;
- **aviso de privacidade**: o formulário coleta nome e e-mail com consentimento LGPD, mas não existe página de política de privacidade. O link "Política de privacidade" do rodapé foi removido porque apontava para a seção `#etica`, não para um documento. O rodapé mantém "Uso responsável de IA" → `#etica`.

## Brand Commitments

- Nome: **Future AI Video Labs**. O header e o rodapé usam o logo em `public/brand/logo.webp` (originais em `public/assets/`); com essa troca, o descritor "AI Video Studio" deixou de aparecer no header.
- Contato público: `daniel.reis@futureai.consulting` (também o `email` no JSON-LD de Organization).
- Idioma e voz: português do Brasil, primeira pessoa do plural, afirmativa e sóbria. Sem exclamação, sem jargão de growth, sem promessa numérica.
- Visual: a paleta OKLCH e as fontes Outfit/Manrope ficam; texto em gradiente, eyebrows, vidro e numeração decorativa foram removidos em 2026-09-11 e não devem voltar.
- Fundo, por decisão do usuário em 2026-09-14: o mesmo fundo interativo do site Future AI Insights (`sitefuture`) — malha líquida em WebGL, grade técnica, partículas e granulação —, em `src/components/site/background/`. Ele substitui a aurora antiga e é o único fundo da página: não criar brilhos por seção. O sistema vive em `src/styles.css`; não existe DESIGN.md.

## Evidence on Hand

**As provas reais são os 6 vídeos de clientes do portfólio. O que não está listado aqui não existe e não pode ser inventado.**

- `public/videos/portfolio/` — 6 vídeos de projetos de clientes, confirmado pelo usuário em 2026-09-11 (`src/components/site/Showcase.tsx`). Não há nomes de clientes, resultados nem métricas associados; títulos e categorias são descritivos.
- Removidos em 2026-09-11 por não terem medição por trás, e não devem voltar como resultado: os números do hero (6 / 5 / 8, que contavam seções do próprio site), "dias em vez de semanas" e "∞ versões a partir de um mesmo conceito".
- Ausentes, e a serem tratados como ausentes: clientes nomeados, depoimentos, estudos de caso com resultado, números de performance, prêmios, imprensa, parceiros, tamanho de equipe, tempo de mercado, preços, SLAs e certificações.
- Assets de marca: `public/brand/logo.webp`, `public/favicon.ico`, `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`; originais em `public/assets/`.

## Product Principles

1. **A curadoria é o produto.** Toda decisão de produto e de página deve deixar visível que existe um ponto de reprovação humano antes da entrega.
2. **Direção antes da ferramenta.** Narrativa, público e objetivo definem o trabalho; a tecnologia entra a serviço da ideia e nunca como protagonista da conversa.
3. **Um conceito, muitas versões.** A unidade de valor é o conceito validado; formatos, canais, públicos e idiomas são desdobramentos dele, com identidade preservada.
4. **Não afirmar o que não foi entregue.** Os vídeos de clientes mostram o trabalho; nomes, resultados e métricas só entram quando existirem e forem autorizados.
5. **Segurança jurídica faz parte da criação.** Em compra corporativa, direitos autorais, privacidade e LGPD são critério de decisão, não apêndice institucional.
