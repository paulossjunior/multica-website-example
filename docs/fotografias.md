# Feature — página `/fotografias`

Página de captação de demandas de fotografia. Entregue no PR #8 — HEAD da branch em `a2ce64f`, merge commit em `main` em `ac3084e`. Resolve o issue LEDS-9.

## 1. Visão geral

- **Rota**: `/fotografias/` (trailing slash por `next.config.ts: trailingSlash: true`).
- **Arquivo**: [`app/fotografias/page.tsx`](../app/fotografias/page.tsx).
- **Tipo**: Client Component (`"use client"`) — depende de `useState`, `useEffect`, `window.location`.
- **Objetivo**: coletar os dados da demanda do visitante e abrir o cliente de e-mail dele com um `mailto:` pré-preenchido para o fotógrafo.
- **Compatibilidade com `output: "export"`**: sem Server Actions, sem rotas de API, sem backend — todo o fluxo é client-side, por isso a entrega é via `mailto:` e não `fetch`.

## 2. Fluxo

```
Usuário preenche form
      │
      ▼
clica "Enviar demanda"
      │
      ▼
validate() ──► erros? ──► exibe mensagens inline (não submete)
      │ (válido)
      ▼
setStatus("submitting")
      │
      ▼
monta subject + body (encodeURIComponent)
      │
      ▼
window.location.href = "mailto:<PHOTOGRAPHER_EMAIL>?subject=...&body=..."
setStatus("success")   ◄── (mesmo tick da atribuição; ver §8.1)
      │
      ▼
SO abre cliente de e-mail padrão
      │
      ▼
tela "Demanda recebida" (render do estado success)
      │
      ▼
Usuário revisa e envia o e-mail manualmente
```

A entrega efetiva depende do usuário clicar **Enviar** no cliente de e-mail aberto. A página não grava, não envia direto, não notifica o fotógrafo sozinha.

## 3. Campos do formulário

| Campo | `name` | Tipo | Obrigatório | Observações |
|---|---|---|---|---|
| Nome completo | `nome` | `input[type=text]` | ✅ | `autoComplete="name"` |
| E-mail | `email` | `input[type=email]` | ✅ | `autoComplete="email"`; validado por regex |
| Tipo de ensaio | `tipoEnsaio` | `select` | ✅ | 10 opções (ver abaixo) |
| Data desejada | `dataDesejada` | `input[type=date]` | ❌ | `min` = hoje (populado em `useEffect`) |
| Local / Cidade | `local` | `input[type=text]` | ❌ | Texto livre |
| Descrição do projeto | `descricao` | `textarea` (5 linhas) | ❌ | Texto livre |

**Opções de "Tipo de ensaio"** (constante `TIPOS_ENSAIO` em `app/fotografias/page.tsx`):

1. Retrato
2. Casamento
3. Ensaio Gestante
4. Newborn
5. Família
6. Corporativo / Empresarial
7. Produto
8. Evento
9. Paisagem / Arquitetura
10. Outro

## 4. Validação

Função `validate()` roda **antes** de `setStatus("submitting")`. Retorna `FormErrors = Partial<Record<"nome" | "email" | "tipoEnsaio", string>>`:

| Regra | Erro exibido |
|---|---|
| `nome.trim()` vazio | `"Nome obrigatório."` |
| `email.trim()` vazio | `"E-mail obrigatório."` |
| `email` não casa `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `"E-mail inválido."` |
| `tipoEnsaio` vazio | `"Selecione um tipo de ensaio."` |

Se qualquer erro: `setErrors(errs)` e **retorna** antes de montar o `mailto:`.

### Acessibilidade

Cada campo validado aplica:

- `aria-invalid={!!errors.<campo>}` no input/select.
- `aria-describedby="<fieldId>-error"` apontando para o `<p>` do erro.
- O helper `Field` recebe `fieldId` e renderiza `<p id="${fieldId}-error" role="alert">{error}</p>` — garantindo que o ID referenciado existe no DOM (fix do review).
- `<label htmlFor={fieldId}>` associa label ao input, permitindo clicar no label para focar.
- Mensagens de erro têm `role="alert"` para anúncio por leitores de tela.

Ao editar um campo com erro, `handleChange` limpa o erro daquele campo (`setErrors((prev) => ({ ...prev, [name]: undefined }))`).

## 5. Como configurar o destinatário

O e-mail que recebe as demandas vem de uma **única constante**:

```ts
// lib/site.ts
// TODO: replace with real contact email before deploy
export const PHOTOGRAPHER_EMAIL = "hello@example.com"
```

**Antes de qualquer deploy**: trocar `"hello@example.com"` pelo endereço real do fotógrafo. O valor padrão é um placeholder RFC 2606 — e-mails caem num blackhole.

Essa constante também é usada no fallback de erro (link clicável quando `window.location.href` falha).

> O arquivo `components/sections/Contact.tsx` ainda tem `hello@example.com` **hard-coded** (não usa `PHOTOGRAPHER_EMAIL`). Vale centralizar em follow-up.

## 6. Navegação

Link **"Fotografias"** adicionado ao `Nav` ([`components/sections/Nav.tsx`](../components/sections/Nav.tsx)):

```tsx
<li>
  <Link href="/fotografias" className="hover:text-foreground transition-colors">
    Fotografias
  </Link>
</li>
```

### Âncoras da home

Links "Work", "Pricing" e "Contact" apontam para seções da home (`/#work`, `/#pricing`, `/#contact`) — **não** para âncoras relativas (`#work`). Diferença importante quando o usuário está em `/fotografias/`: `<Link href="/#work">` navega para a home e rola até a seção; `<a href="#work">` tentaria `/fotografias/#work`, que não existe.

| Link | `href` | Destino |
|---|---|---|
| Logo (nome) | `/` | Home |
| Work | `/#work` | Seção `<Gallery>` na home |
| Pricing | `/#pricing` | Seção `<Pricing>` na home |
| Contact | `/#contact` | Seção `<Contact>` na home |
| Fotografias | `/fotografias` | Esta página |

## 7. Compatibilidade com `output: "export"`

`next.config.ts` define `output: "export"` — todo o site é exportado para HTML estático em `./out` e servido pelo GitHub Pages.

Consequências para `/fotografias`:

- ❌ **Sem Server Actions** — `handleSubmit` não pode ser `async` server-side.
- ❌ **Sem rotas de API** (`app/api/.../route.ts`).
- ❌ **Sem SSR por request** — HTML é gerado uma vez no build.
- ✅ **Form 100% client-side** com estado em `useState`.
- ✅ **Entrega via `mailto:`** — único canal possível sem backend.

Alternativas viáveis caso queiram sair do `mailto:` futuramente (todas sem alterar `output: "export"`): Formspree, Web3Forms, Netlify Forms (requer Netlify), EmailJS.

### Hydration safety

`minDate` do campo `dataDesejada` é inicializado como `""` e populado em `useEffect` após o mount:

```tsx
const [minDate, setMinDate] = useState("")
useEffect(() => {
  setMinDate(new Date().toISOString().split("T")[0])
}, [])
```

Isso evita mismatch entre o HTML gerado no build (data congelada no dia do build) e o valor no client no dia da visita.

## 8. Nits conhecidos (não bloqueiam)

Acordados como follow-up durante o review final (verdict **approve**):

### 8.1 Estado `"submitting"` nunca é pintado

Em `handleSubmit`:

```tsx
setStatus("submitting")
// ... monta subject + body ...
window.location.href = `mailto:...`   // navegação síncrona
setStatus("success")                  // mesmo tick
```

React agrupa atualizações de estado no mesmo tick. O label `"Abrindo e-mail…"` do botão só apareceria se houvesse yield entre `submitting` e `success`. Resultado: usuário vê transição direta `idle → success`.

Mitigação possível (não aplicada): envolver a navegação em `requestAnimationFrame` ou `setTimeout(0)` para forçar re-render do estado intermediário.

### 8.2 `catch` em volta de `window.location.href` quase inatingível

```tsx
try {
  window.location.href = `mailto:${PHOTOGRAPHER_EMAIL}?...`
  setStatus("success")
} catch {
  setStatus("error")
}
```

Atribuição a `window.location.href` **não lança** quando o navegador não trata `mailto:` — ele apenas não navega. O `catch` fica como fallback simbólico. Na prática, o ramo `status === "error"` (que exibe link direto para `PHOTOGRAPHER_EMAIL`) só dispara em erros síncronos do próprio `encodeURIComponent` ou acesso a `window.location`, cenários raríssimos.

Mitigação futura: detectar ausência de handler `mailto:` por outro meio (ex.: timer que verifica se o foco ainda está na página após X ms) — não vale o esforço no estado atual.

## 9. Como testar localmente

```bash
pnpm install
pnpm dev
# http://localhost:3000/fotografias/
```

Fluxos a validar:

1. **Submeter vazio** → mensagens de erro em Nome, E-mail, Tipo de ensaio.
2. **E-mail malformado** (`foo`) → `"E-mail inválido."`.
3. **Preencher corretamente** → cliente de e-mail abre com `subject`/`body` preenchidos; tela "Demanda recebida" aparece.
4. **Navegação**: a partir de `/fotografias/`, clicar em Work/Pricing/Contact deve voltar à home e rolar até a seção.
5. **Data mínima**: campo `dataDesejada` não aceita datas anteriores ao dia atual (após mount).

Para build estático: `pnpm build` → inspecionar `./out/fotografias/index.html`.

## 10. Referências

- Issue: LEDS-9 — "Criar página de envio de demandas de fotografia"
- PR: [#8](https://github.com/paulossjunior/multica-website-example/pull/8) — HEAD `a2ce64f`, squash-merged em `main` como `ac3084e`
- Arquivos tocados:
  - [`app/fotografias/page.tsx`](../app/fotografias/page.tsx)
  - [`components/sections/Nav.tsx`](../components/sections/Nav.tsx)
  - [`lib/site.ts`](../lib/site.ts)
