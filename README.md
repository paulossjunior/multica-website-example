# multica-website-example

A personal photography portfolio site built with Next.js 16 (App Router), Tailwind CSS v4, and shadcn. Deployed to GitHub Pages via a static export.

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # static export → ./out
pnpm lint
```

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.

Set the `NEXT_PUBLIC_BASE_PATH` repository variable in GitHub if your Pages URL uses a path prefix other than `/multica-website-example` (e.g. a custom domain at `/`):

```
NEXT_PUBLIC_BASE_PATH=
```

The default is `/multica-website-example`, which matches the GitHub repo name.

## Stack

- **Next.js 16** — App Router, static export (`output: "export"`)
- **React 19** — Server Components by default
- **Tailwind CSS v4** — utility-first styling
- **next-themes** — dark/light mode via `ThemeProvider`

## Tooling note

`pnpm-workspace.yaml` is retained to configure `allowBuilds` for native modules (`sharp`, `unrs-resolver`, `msw`). It is not a monorepo workspace config.

## Customising content

Edit `lib/content.ts` to update the gallery and pricing arrays without touching any JSX.

Edit `app/layout.tsx` and change `PHOTOGRAPHER_NAME` to update the name in the nav, footer, and `<title>`.

### Placeholder image guide

Gallery slots are driven by the `gallery` array in `lib/content.ts`. Each entry has a `seed` (used to generate a unique placeholder via `picsum.photos`) and an `alt` string.

To replace a placeholder with a real photo:

1. Add your image to `public/gallery/`.
2. In `lib/content.ts`, add a `src` field to the matching entry:

   ```ts
   { src: "/gallery/lisbon.jpg", alt: "Trams at dawn, Lisbon" }
   ```

3. Update the `<Image>` in the `Work` component to use `src` instead of the picsum URL.
4. Update `alt` with a specific, descriptive string — generic alt text hurts accessibility.

Intended subject for each slot:

| Slot | Subject |
|------|---------|
| p1 | hero / wide establishing shot |
| p2 | tight portrait, natural window light |
| p3 | environmental portrait (person in their space) |
| p4 | texture or abstract detail |
| p5 | candid or street moment |
| p6 | architectural form or geometric composition |
| p7 | golden-hour or dusk scene |
| p8 | interior with deliberate light |
| p9 | close portrait or still life |
