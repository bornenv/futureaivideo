---
target: "critique all: o site todo, depois das correcoes"
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\arthu\\Documents\\Projetos\\Future AI Vision\\src\\routes\\index.tsx"
target_fingerprint: "sha256:f8ab0499c6574e4a90c5c4a5962bd36d45709e54490631cd1c8c8a96a4ec8aca"
target_path: "C:\\Users\\arthu\\Documents\\Projetos\\Future AI Vision\\src\\routes\\index.tsx"
timestamp: 2026-09-11T20-27-00Z
slug: src-routes-index-tsx
---
Method: dual-agent (A: design-review sub-agent · B: detector + browser sub-agent)

Alvo: o site todo, working tree após a rodada de correções (clarify, bolder, quieter, distill/layout, harden, polish), renderizado em desktop 1440×900 e mobile 390×844. Ambas as avaliações foram interrompidas por limite de uso da API e retomadas com o próprio contexto, mantendo o isolamento.

## Design Health Score

| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do status | 3 | Formulário com estados claros; stepper acompanha o scroll; destaque da nav trava em "Portfólio" durante Tecnologia e Contato. |
| 2 | Correspondência com o mundo real | 3 | Português natural; "multimodal", "visão computacional", "P&D" sem explicação; "Performance" é jargão de growth. |
| 3 | Controle e liberdade | 3 | Modal fecha por Esc, X e fundo e devolve o foco; menu mobile não fecha com Esc. |
| 4 | Consistência e padrões | 2 | "Três movimentos" vs. "cinco etapas"; âmbar marca a etapa ativa e o gate; "Avatares virtuais" vs. "Avatares e personagens". |
| 5 | Prevenção de erros | 3 | Validação ao sair do campo; mínimo de 20 caracteres só aparece como erro. |
| 6 | Reconhecimento em vez de memória | 3 | Play só no hover; "Falar sobre este formato" esquece a peça vista. |
| 7 | Flexibilidade e eficiência | n/a | Página única de persuasão. |
| 8 | Estética e minimalismo | 3 | Limpo e contido; tese direção → IA → curadoria → escala repetida três vezes. |
| 9 | Recuperação de erros | 4 | Mensagens específicas por campo, entrada preservada, fallback mailto no erro de servidor. |
| 10 | Ajuda e documentação | n/a | Página de marketing. |
| Total | | 24/32 (75%) | Bom (antes 17/32, 53%) |

## Veredito de especificidade

Avaliação do design: a tese agora tem forma e só este estúdio a faria — H1 dividido (primeira frase apagada, "Nenhuma peça sai sem aprovação humana." em branco), faixa das cinco etapas com um único chip âmbar em "Curadoria · aprovação humana", e o card da Curadoria com "Aprovada / Não aprovada". O resto ainda é de qualquer agência: botões em pílula, grades de três colunas com fios, layout "título à esquerda, lista à direita" repetido, card de contato com o formulário dentro de outro card. Um estúdio de vídeo que abre só com texto: os filmes de clientes ficam a ~4.700px do topo. O brilho de "startup de IA" sobrevive no logo.

Varredura determinística: CLI 0 achados (exit 0) em src/routes e src/components/site. Detector na página: 10 antipadrões (antes 67). ai-color-palette 6 (real: destaque ciano dos cards, Showcase.tsx:245; a A também apontou o ciano sem papel); nested-cards 1 (real: formulário dentro de card dentro de card, sections.tsx:466; a A também apontou); layout-transition 2 (falso positivo a 1440px — menu mobile oculto; um caso real só no mobile, segunda ocorrência parece contagem dupla); tight-leading 1 (limítrofe: a frase do gate é um <p> em tamanho de display). O detector não pega: bordas dos campos a 1,31:1, destaque da nav travado, corte de vídeo vertical no modal.

Overlays visuais: injeção ok em Chrome headless; nenhum overlay visível ao usuário; existe só em scratchpad/critique2-B/desktop-overlay-full.png.

## Impressão geral

De Aceitável para Bom, e o salto veio de onde devia: a tese de curadoria virou design. Maior oportunidade: a ordem das seções — a única prova real está enterrada depois de quatro seções de texto.

## O que funciona

1. O gate no primeiro viewport (sections.tsx:18-57): H1 dividido e o único chip âmbar encenam a tese.
2. O card da Curadoria diz o resultado: "Aprovada / Não aprovada" é algo que o comprador repete para compras.
3. Contenção honesta e formulário bem feito: nada inventado; placeholder pede objetivo, público e prazo; todo texto ≥4,5:1 (/55 = 6,26:1); botão primário 6,61:1.

## Problemas prioritários

1. [P1] A única prova real está enterrada, e um estúdio de vídeo abre sem vídeo. Filmes de clientes a ~4.700/8.380px no desktop e ~7.000/13.414px no mobile, depois de Sobre, Serviços, Método e Ética (index.tsx:52-59). Correção: portfólio logo após o hero ou loop mudo de uma peça real ao lado do H1; absorver o Sobre no hero e no Método; tirar Tecnologia de entre a prova e o pedido. Comando: /impeccable layout, depois /impeccable bolder no hero.
2. [P1] A Ética promete mais do que sustenta. "para garantir segurança jurídica" sobre oito rótulos vazios (sections.tsx:374-386); "conforme a LGPD" sem aviso de privacidade. Correção: trocar a promessa pelo que é verdade ("tratamos estes pontos em cada projeto e os detalhamos por escrito na primeira conversa"); agrupar os rótulos em 3–4; página de privacidade depende do usuário. Comando: /impeccable clarify.
3. [P2] Âmbar do gate diluído e dois modelos de processo. Barra lateral do Método pinta de âmbar a etapa ativa (sections.tsx:277-283); "três movimentos" vs. cinco etapas; número no H3 lido como "01Estratégia". Correção: etapa ativa em branco/violeta, âmbar só na Curadoria; borda do gate mais forte (hoje 2,44:1); movimentos como princípios, sem contagem. Comando: /impeccable distill.
4. [P2] Conversão genérica e sem contexto. Título "Vamos criar o próximo capítulo…"; "Falar sobre este formato" não leva a peça ao formulário; "Frente de interesse" obrigatório com 7 opções; nada diz o que acontece depois. Correção: título ligado à tese; pré-selecionar a frente vinda do portfólio; 2–3 linhas de "o que acontece depois" sem prazo; mencionar a confirmação por e-mail no sucesso se CONTACT_SEND_CONFIRMATION estiver ligado. Comando: /impeccable clarify e /impeccable harden.
5. [P2] Toque, vídeo e contraste de interface. Play só no hover (cards parecem fotos no celular); modal com object-cover 16:9 corta vertical e quadrado; bordas dos campos white/12 (1,31:1 < 3:1); ciano sem papel. Correção: play sempre visível, object-contain com tarja, bordas ≥ /35, ciano sai ou ganha papel. Comando: /impeccable adapt, depois /impeccable polish.

## Personas

Jordan (primeira visita): primeira tela sem imagem do trabalho; jargão sem explicação; destaques ciano parecem links e não levam a nada.
Riley (testador de limites): quatro links de "Soluções" no rodapé caem em #servicos; nav travada em "Portfólio" no Contato; contador 0/5000 com mínimo de 20 só no erro; "Experimento audiovisual · P&D · Laboratório criativo" sob "Projetos produzidos para clientes" não parece entrega.
Casey (celular): 13.414px, primeiro vídeo a ~8 rolagens; nada indica toque para assistir; Método empilha cinco cards (~2.180px); faixa do gate abaixo da dobra no hero mobile.
Head de comunicação (PRODUCT.md): "um conceito, muitas versões" é o job dela e nenhuma peça mostra versões lado a lado; serviços não levam às peças do portfólio.
Jurídico/compliance (PRODUCT.md): oito rótulos sem conteúdo; "garantir segurança jurídica" sem base; titularidade do material gerado não respondida; "conforme a LGPD" sem aviso de privacidade.

## Observações menores

"Controle de qualidade quadro a quadro" e "Objetivo mensurável" vão além do PRODUCT.md; itens de "Em pesquisa" leem como uma frase; checkbox de consentimento é o quadrado branco padrão; --muted-foreground 4,32:1 (só na 404); título do Sobre genérico; logo diz "FUTURE AI VIDEO", não "Future AI Video Labs".

## Perguntas para considerar

- Por que a primeira coisa que o visitante vê é texto sobre curadoria, e não algo que a curadoria aprovou?
- A Curadoria poderia mostrar um par reprovado × aprovado de um projeto real?
- O comprador precisa de seis frentes, ou de três jobs com avatares e consultoria como capacidades?
- O que a Ética diria se respondesse titularidade, dados de treino e licença de voz e imagem?
