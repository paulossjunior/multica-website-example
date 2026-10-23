# Documentação — `multica-website-example`

Índice da documentação técnica do projeto.

## Documentos

| Arquivo | Escopo |
|---|---|
| [`architecture.md`](./architecture.md) | Visão geral do stack, diagramas UML (pacotes, componentes, classes, sequência, deployment), ADRs, boas práticas, dívidas técnicas e fluxo de desenvolvimento. |
| [`fotografias.md`](./fotografias.md) | Feature `/fotografias` — página de captação de demandas: fluxo, campos, validação, configuração do destinatário (`PHOTOGRAPHER_EMAIL`), navegação, compatibilidade com `output: "export"` e nits conhecidos. |

## Convenções

- Diagramas usam **Mermaid** — renderizam direto no GitHub.
- Caminhos de código são relativos à raiz do repo (ex.: `app/fotografias/page.tsx`).
- Dívidas técnicas e TODOs são rastreados em `architecture.md` §9.

## Como contribuir

Ao adicionar um documento, inclua uma linha na tabela acima com o escopo coberto.
