# ayingott.me

Personal site for Ayingott. V1 is a long-lived personal space for bio, writing, selected work, and contact paths. It is not a hiring page, link-in-bio aggregator, or commercial brand site.

Product requirements and decisions live in:

- `docs/product/needs-v0.1.md`
- `docs/product/decisions/index.md`

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS v4
- `@ayingott/theme@0.0.1` from npm
- `@nuxtjs/color-mode` with a `.dark` class
- Static generation for Cloudflare deployment

Use Node 22.12.0 or newer. The repository pins this in `.node-version` to match the Nuxt 4 engine requirement and Cloudflare build target.

The design-system package is pinned to the first npm technical release:

```json
{
  "@ayingott/theme": "0.0.1"
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

S2 implements the locked `design-v0.1` page system: home, about, blog list, blog detail route, 404, `.dark` mode, and the contact-strip resume affordance. Blog content ingestion with `@nuxt/content`, RSS, and real resume PDF configuration remain follow-up work.

## Deployment

The current target is static output on Cloudflare:

```bash
pnpm generate
```

The generated site is written to `.output/public`.
