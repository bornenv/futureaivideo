---
target: "critique all: o site todo (HEAD 8e33ad2)"
total_score: 17
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\arthu\\Documents\\Projetos\\Future AI Vision\\src\\routes\\index.tsx"
target_fingerprint: "sha256:d1e1f87c8cbb42751d3db0c20395e497548f34a90bf57173242eb679c9a2f6db"
target_path: "C:\\Users\\arthu\\Documents\\Projetos\\Future AI Vision\\src\\routes\\index.tsx"
timestamp: 2026-09-11T15-13-35Z
slug: src-routes-index-tsx
---
Method: dual-agent (A: design-review sub-agent · B: detector + browser sub-agent)

Alvo: o site todo na versão commitada (HEAD 8e33ad2), renderizada de cópia isolada em desktop 1440×900 e mobile 390×844. Linhas citadas conforme o HEAD; no working tree, sections.tsx está deslocado +1 a partir da linha 19 (import adicionado por outra sessão). A seção de contato (FinalCta, mailto) estava sendo substituída por um formulário no momento da crítica.

## Design Health Score

| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do status | 2 | Nav e stepper do Método mostram onde você está; CTA mailto sem retorno; conteúdo invisível até o JS hidratar. |
| 2 | Correspondência com o mundo real | 2 | Categorias em inglês ("Generative AI", "Synthetic Media", "Computer Vision") numa página pt-BR; html lang="en". |
| 3 | Controle e liberdade | 3 | Modal fecha por X e fundo, mas não por Esc e não devolve o foco. |
| 4 | Consistência e padrões | 2 | "Falar com nosso time" rola até #contato no hero e abre mailto no CTA final; "Conversar" e "Contato" levam ao mesmo lugar. |
| 5 | Prevenção de erros | 2 | mailto sem alternativa; 6 de 7 filtros retornam 1 card; ícone Play promete vídeo inexistente. |
| 6 | Reconhecimento em vez de memória | 3 | Nav visível; stepper só no desktop; e-mail só no rodapé. |
| 7 | Flexibilidade e eficiência | n/a | Página única de persuasão, sem tarefas repetidas. |
| 8 | Estética e minimalismo | 2 | 10 seções (Pilares repete Sobre; Pesquisa repete Tecnologia); gradiente em todo título anula a hierarquia; 10.600px desktop / 18.062px mobile. |
| 9 | Recuperação de erros | 1 | mailto sem cliente de e-mail falha em silêncio; 404 e página de erro em inglês. |
| 10 | Ajuda e documentação | n/a | Marketing, sem sistema de ajuda. |
| Total | | 17/32 (53%) | Aceitável |

## Veredito de especificidade

Avaliação do design: majoritariamente intercambiável. Kit padrão de startup de IA: aurora violeta-ciano com grade mascarada, grad-text em uma palavra dos 10 títulos, grades de card-glass, eyebrow acima de cada título, ícones Sparkles/Bot/BrainCircuit, stats com CountUp, grade "Generative AI / Multimodal AI" em inglês, seção "Por que X?" de quatro pilares. Autorais: o texto do Sobre ("Direção antes da ferramenta") e o stepper do Método. O ponto de reprovação humano (a única coisa não copiável) não tem forma visual. Estúdio de vídeo sem nenhuma imagem em movimento.

Varredura determinística: CLI com 0 achados (exit 0) em src/routes, src/components/site e src/components/ui, também com --no-config; canário provou que o scanner funciona. A CLI não enxerga porque o estilo vive nos @utility de styles.css. Detector injetado na página: 67 antipadrões (111 linhas de achado; os números não batem). Falsos positivos descartados: 36 "texto ciano neon" são ícones SVG aria-hidden; 10 "fundo gradiente ciano" duplicam grad-text; 5 clipped-overflow são o número-marca-d'água cortado de propósito; 1 layout-transition num menu oculto a 1440px. Reais: kicker-above-heading 14, gradient-text 10, numbered-section-labels 7, undersized-ui-text 7 ("AI Video Studio" 9,6px; selos do portfólio 10,4px), image-hover-transform 6, gradiente violeta/ciano de fundo 6, dark-glow 3, low-contrast 2 (btn-primary 4,4:1), oversized-h1 1, halo/spotlight radial 2. Concordância: A apontou gradiente, eyebrows, numeração e aurora antes de ver o detector. Detector pegou o que a A não pegou: texto pequeno, contraste do btn-primary, zoom no hover. Detector não pegou: texto white/25–45 (2,1–4,47:1), posicionamento, veracidade, SSR invisível.

Overlays visuais: injeção ok (preflight de mutação ok) em Chrome headless; nenhum overlay visível ao usuário; existe só em scratchpad/critique-B/desktop-overlay-full.png. Mobile sem injeção.

## Impressão geral

Construção limpa e tecnicamente sólida vestindo o uniforme padrão de IA e escondendo a própria tese. Maior oportunidade: tornar o gate de curadoria o centro visual e narrativo; hoje é a frase mais apagada da página.

## O que funciona

1. Stepper do Método (sections.tsx:313-418): índice sticky sincronizado com o scroll; única interação autoral; única numeração com sentido.
2. Texto do Sobre (sections.tsx:101-169): posicionamento na voz da casa; rótulos dos stats descrevem a oferta com honestidade.
3. Base técnica: sem overflow, hierarquia de títulos lógica, alt em todas as imagens, reduced-motion respeitado, botão de menu de 44px.

## Problemas prioritários

1. [P1] A tese é a coisa mais silenciosa da página, e o hero vende outra. H1 "…precisam escalar" (sections.tsx:43-47), escala é efeito segundo o PRODUCT.md; frase do gate em white/35, 14px, 3,10:1 (sections.tsx:166); etapa Curadoria com o mesmo card (sections.tsx:300-304); Curadoria como último chip e quarto pilar. Correção: H1 em torno do gate; etapa 04 como gate visível (bifurcação aprovado / volta para Conceito); frase do gate como conclusão em display; cortar Pilares. Comando: /impeccable shape, depois /impeccable bolder.
2. [P1] Conteúdo ilustrativo vestido de prova, com instrução interna vazada. Stats 6/5/8 com CountUp (sections.tsx:22-26); "dias em vez de semanas" e "∞ versões" como métricas (sections.tsx:113-121); "Portfólio" com ícone Play que abre imagem parada; aviso "envie seus vídeos reais para substituí-las" (Showcase.tsx:169-171); ShieldCheck ao lado de LGPD sugere certificação. Correção: tirar o CountUp; fatos do método no lugar de "dias" e "∞"; "Formatos de peça" sem Play e com especificações; reescrever o aviso para o comprador; marcador neutro na Ética. Comando: /impeccable clarify.
3. [P1] A página sai do servidor invisível. SSR com 48 elementos .reveal com data-visible="false" e opacity 0, 0 visíveis, sem noscript; H1 do hero dentro de um deles (styles.css:329-339, Reveal.tsx:44-49). LCP escondido até hidratar e o IntersectionObserver disparar; sem JS, página em branco. Correção: reveal como melhoria progressiva (esconder só sob html.js marcado no head antes do paint); hero fora do reveal; fallback em noscript. Comando: /impeccable harden (cobre também lang="en", 404 em inglês, modal sem Esc, role=dialog e focus trap).
4. [P1] A ordem das seções enterra o critério jurídico. Tecnologia (8 cards em inglês), Pesquisa e Pilares entre o portfólio e a Ética (index.tsx:59-63); Ética é a 9ª de 10, fora da nav, 8 rótulos sem afirmações; links legais do rodapé caem em #etica. Correção: remover Pilares; fundir Tecnologia e Pesquisa numa faixa em português; Ética depois do Método, com um compromisso por item (titularidade dos assets, consentimento de voz e imagem, rotulagem de mídia sintética, briefing sob LGPD); Ética na nav. Comando: /impeccable distill, depois /impeccable layout.
5. [P2] Contraste e tamanho abaixo do mínimo. 16 usos de white/25–45 sobre #08060B (2,10–4,47:1); cards inativos do Método com opacity-60; texto em 9,6px e 10,4px; btn-primary a 4,4:1. Correção: mínimo /60 para corpo e /50 para metadados; nada funcional abaixo de 11px; cards inativos diferenciados pela borda. Comando: /impeccable audit, depois /impeccable polish.

## Personas

Jordan (primeira visita): jargão ("Multimodal AI", "Synthetic Media", "P&D", "Pipelines", "Ads"); CTA do hero só rola; nada sobre como é um projeto; Play promete vídeo e abre foto.
Riley (testador de limites): mailto morto com webmail; nenhum endereço para copiar perto do CTA; filtros viram grades de 1 card; política de privacidade cai em pílulas; lang="en" oferece tradução; sem JS a página fica em branco.
Casey (celular): 18.062px (~21 telas), contato no fim sem CTA persistente; stats ocupam 1,5 tela; filtros em 3 linhas; cards do Método parecem desabilitados; blur(40px) em loop mais backdrop-filter.
Marina, head de comunicação corporativa (PRODUCT.md): não vê onde a aprovação dela entra; não sabe o que acontece depois de escrever; "Portfólio" sem clientes; avatares sem política de consentimento; "performance em escala" é jargão de growth.
Ricardo, jurídico/compliance (PRODUCT.md): Ética fora da nav; 8 rótulos com escudo; os dois links legais no mesmo lugar; nada sobre titularidade, consentimento, fornecedores ou rotulagem.

## Seção de contato (será superada pelo formulário em andamento)

"Ver soluções" manda o leitor de volta para cima no momento da decisão; mailto sem rótulo nem alternativa (o diff em andamento já mostra o endereço e adiciona formulário); nada que tranquilize (prazo, pessoa nomeada, o que enviar, confidencialidade/LGPD); texto põe a tecnologia na frente; "Falar sobre este formato" não leva o formato escolhido adiante (o formulário deveria vir preenchido); o card repete a aurora e os botões do hero.

## Observações menores

summary_large_image sem og:image; og:url e canonical relativos; eyebrow "AI VIDEO STUDIO" redundante; violeta, ciano e âmbar sem papel semântico; "AVATARES" sobre sala vazia (imagens de banco); cards de serviço com três níveis de texto; "Role para percorrer as cinco etapas"; "Contato" e "Conversar" com o mesmo alvo.

## Perguntas para considerar

- Se a curadoria é o produto, por que o visitante não vê uma peça reprovada, e o que o gate barrou?
- Uma head de comunicação confia num estúdio de vídeo sem nenhuma imagem em movimento no site?
- O gate é só do estúdio, ou a aprovação do cliente mora dentro da etapa 04?
- Se Tecnologia, Pesquisa e Pilares sumissem, o que o comprador perderia?
- Por que o título de um estúdio cuja tese é dizer "não" fala em escalar?
