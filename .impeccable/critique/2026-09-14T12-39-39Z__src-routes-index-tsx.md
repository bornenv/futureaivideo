---
target: "critique all: o site todo, depois do animate"
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\arthu\\Documents\\Projetos\\Future AI Vision\\src\\routes\\index.tsx"
target_fingerprint: "sha256:37ad715766e55ec5927e5791bb02b9dab636b8de49fb2b9578e7e0b34c5f631a"
target_path: "C:\\Users\\arthu\\Documents\\Projetos\\Future AI Vision\\src\\routes\\index.tsx"
timestamp: 2026-09-14T12-39-39Z
slug: src-routes-index-tsx
---
Method: dual-agent (A: design-review sub-agent · B: detector + browser sub-agent)

Alvo: o site todo, working tree após o passe /impeccable animate, desktop 1440×900 e mobile 390×844; A capturou quadros do hero ao longo do tempo e testou com reduced motion.

## Design Health Score

| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do status | 3 | Nav, trilho do Método, spinner e sucesso ok; após "Falar sobre este formato" o foco cai no body e o destaque da frente acaba antes de o scroll chegar. |
| 2 | Correspondência com o mundo real | 3 | "multimodal", "voz neural", "visão computacional", "P&D" sem explicação. |
| 3 | Controle e liberdade | 3 | Modal por Esc/fundo/X; pausa do vídeo sobrevive ao scroll; menu mobile sem focus trap nem fundo escurecido. |
| 4 | Consistência e padrões | 3 | Âmbar com um só significado; seta ↗ em saltos internos; rodapé com 4 das 6 frentes. |
| 5 | Prevenção de erros | 3 | Pré-preenchimento sobrescreve frente já escolhida. |
| 6 | Reconhecimento em vez de memória | 3 | Pré-preenchimento leva a peça até o formulário. |
| 7 | Flexibilidade e eficiência | n/a | Página única de persuasão. |
| 8 | Estética e minimalismo | 3 | Serviços com quatro camadas de texto; mobile 13.565px. |
| 9 | Recuperação de erros | 3 | Erros específicos, entrada preservada, mailto na falha. |
| 10 | Ajuda e documentação | n/a | Página de marketing. |
| Total | | 24/32 (75%) | Bom |

## Veredito de especificidade

Hero e Método autorais: âmbar só no gate (chip, marcador lateral, borda do card, traço no título) e wipe reservado às frases do gate. O miolo (Sobre em 3 colunas, grade 3×2, 6 serviços, listas de Tecnologia e Ética) ainda é padrão de categoria; o portfólio não mostra versões, formatos nem traço de revisão. Ideia central autoral, página em volta montada.

Detector: CLI 0 achados; na página 3 antipadrões (antes 10, e 67 na primeira). layout-transition 2 = menu mobile contado duas vezes e oculto a 1440px (real só abaixo de lg); tight-leading 1 = frase do gate em tamanho de display (limítrofe). Nenhuma animação sinalizada. Overlay só em scratchpad/critique3-B/desktop-overlay-full.png (headless).

## Impressão geral

Estável em Bom; sistema de movimento bem construído (só CSS, repouso = estado final, H1 não anima, reduced motion ok), mas o momento autoral é pouco visível: faixa na borda do viewport no desktop, abaixo da dobra no mobile, contraste entre estados 2,19:1. Maior oportunidade: o subtítulo do hero descreve o mecanismo, não o problema de volume do comprador.

## O que funciona

1. Âmbar com um significado só: o gate lê como o produto.
2. Movimento honesto: CSS do estado inicial ao de repouso, H1 sem animação, reveals só abaixo da dobra, vídeo espera o load, pausa fora da tela, respeita economia de dados, guarda a pausa.
3. Formulário bem feito: erros específicos, foco no primeiro inválido, mailto na falha, texto do visitante preservado.

## Problemas prioritários

1. [P1] A página argumenta o mecanismo, não o problema do comprador. O subtítulo do hero é a frase mais genérica do site. Correção: "Mais vídeo, em mais formatos, canais e idiomas, sem ampliar sua equipe. Cada peça passa pela curadoria antes de chegar até você." Comando: /impeccable clarify.
2. [P1] Ética e consentimento afirmam mais do que o PRODUCT.md sustenta. "Adotamos práticas…" sem políticas; "Não… compartilhamos com terceiros" sem aviso de privacidade (Resend processa os dados); "Dúvidas do seu jurídico?" cai no formulário genérico. Correção: Ética "Estes são os pontos que tratamos com o seu jurídico antes de começar"; consentimento "Usamos estes dados só para responder a este contato"; link do jurídico pré-preenche "Ainda não sei" com assunto de política de IA e dados. Comando: /impeccable clarify.
3. [P2] Momento autoral pouco visto. Faixa em y≈788/900 no desktop, abaixo da dobra em laptops ≤800px e no mobile; /45→/70 fraco; vídeo começa junto e rouba a atenção. Correção: faixa abaixo do subtítulo, acima dos CTAs; fio âmbar que percorre a faixa e para no gate; vídeo só depois da sequência (~2,2 s). Comando: /impeccable animate.
4. [P2] Passagem portfólio → contato quebra. Destaque de 1,4 s começa no clique durante o scroll; reveals disparam no caminho e o contato chega em fade; foco no body; frente já escolhida sobrescrita. Correção: focar o campo na chegada; destaque quando o campo estiver visível; reveals concluídos na navegação por âncora; preencher a frente só se vazia. Comando: /impeccable harden.
5. [P2] Miolo de template e desconectado da prova. Seis serviços iguais com subtítulo repetindo a descrição; tags parecem chips e não fazem nada; serviços não levam à peça (o mapeamento existe); Tecnologia antes do Método contra "direção antes da ferramenta". Correção: ligar frente à peça, tirar tags ou descrição, absorver Tecnologia na etapa 03. Comando: /impeccable distill, depois /impeccable layout.

## Avaliação do movimento

Merece: sequência de aprovação (conceito certo, falta posição e contraste), trilho do Método, wipe do gate, entrada do modal, regras do vídeo. Não merece: ~40 reveals em quase todo bloco (padrão de reveal repetido; atrasa âncoras) e o loop de preview dos cards no foco por teclado. Lacunas no reduced motion: stagger e max-height do menu mobile, scrollIntoView suave da lateral do Método, previews no hover. Custo: seis vídeos de card buscam metadados no load, sem poster.

## Personas

Jordan: termos sem explicação; card "Apresentador digital" abre com professor em sala de aula; "Ver peças entregues" vs. "Portfólio".
Riley: frente sobrescrita; foco perdido após o CTA do modal; refresh apaga o formulário; consentimento sem política; "Experimento audiovisual · P&D" não parece entrega.
Casey: sequência fora da tela; 13.565px sem CTA fixo; seis cards buscam metadados; links do rodapé com ~20px; menu mobile sem fundo escurecido.
Marina (marketing, PRODUCT.md): problema de volume nunca nomeado; "um conceito, muitas versões" afirmado e não mostrado.
Paulo (jurídico, PRODUCT.md): quatro rótulos e "adotamos práticas" sem base; sem aviso de privacidade; sem caminho próprio.

## Observações menores

--muted-foreground 4,32:1 (só na 404); números das etapas duplicados no desktop; títulos do rodapé no estilo eyebrow aposentado; raio de pílula do textarea corta o controle de redimensionar; "controle de qualidade quadro a quadro" é verificável, confirmar se é literal.

## Perguntas para considerar

- Por que o portfólio só mostra finais aprovados, se a curadoria é o produto?
- A sequência de aprovação deveria ser o hero, e não uma faixa sob ele?
- A Tecnologia merece seção própria antes do Método?
- O que o comprador recebe na primeira semana?
