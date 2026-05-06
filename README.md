# ayingott.me

Personal site for Ayingott. V1 is a long-lived personal space for bio, writing, selected work, and contact paths. It is not a hiring page, link-in-bio aggregator, or commercial brand site.

Product requirements and decisions live in:

- `docs/product/needs-v0.1.md`
- `docs/product/decisions/index.md`

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS v4
- `@ayingott/theme` from `LoTwT/design-system`
- `@nuxtjs/color-mode` with a `.dark` class
- Static generation for Cloudflare deployment

The design-system package is pinned to the V0 closure commit:

```json
{
  "@ayingott/theme": "github:LoTwT/design-system#f8c1d8e&path:packages/theme"
}
```

## Development

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Start the dev server:

```bash
pnpm dev
```

Run checks:

```bash
pnpm lint
pnpm generate
```

## Styling

The app CSS entry is `app/assets/main.css`.

```css
@import "tailwindcss";
@import "@ayingott/theme/fonts.css";
@import "@ayingott/theme";
```

`@ayingott/theme` provides Tailwind v4 tokens, semantic CSS variables, focus/touch utilities, base styles, and opt-in Space Grotesk / Space Mono webfonts.

S1 keeps the existing signature page visually stable while replacing UnoCSS with Tailwind v4. S2 will handle the visual redesign and page expansion.

## Deployment

The current target is static output on Cloudflare:

```bash
pnpm generate
```

The generated site is written to `.output/public`.
