# multica-website-example

Personal portfolio site built with Next.js 16, Tailwind CSS v4, and deployed to GitHub Pages as a static export.

## Getting started

```bash
pnpm install
pnpm dev       # http://localhost:3000/multica-website-example
```

## Build & deploy

```bash
pnpm build     # outputs to out/ (static export)
pnpm lint      # eslint
pnpm format    # prettier --write
```

The site deploys automatically on push to `main` via `.github/workflows/deploy.yml` (GitHub Pages).
`basePath` is set to `/multica-website-example` in `next.config.ts` to match the Pages subdirectory.

## Stack

- **Next.js 16** — App Router, static export (`output: "export"`)
- **React 19** — Server Components by default
- **Tailwind CSS v4** — utility-first styling
- **next-themes** — dark/light mode via `ThemeProvider`
- **@hugeicons/react** — icon set

## Customising content

All page content lives in `app/page.tsx`. Edit the section components (`Nav`, `Hero`, `Work`, `Pricing`, `Contact`, `Footer`) directly.
Fonts and global styles are in `app/globals.css` and `app/layout.tsx`.
