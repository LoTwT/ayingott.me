# ayingott.me

Personal site for Ayingott. V1 is a long-lived personal space for bio, writing, selected work, and contact paths. It is not a hiring page, link-in-bio aggregator, or commercial brand site.

Product requirements and decisions live in:

- `docs/product/needs-v0.1.md`
- `docs/product/decisions/index.md`

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS v4
- `@ayingott/theme@0.0.2` from npm
- `@nuxt/content` v3 for Markdown articles
- `@nuxtjs/color-mode` with a `.dark` class
- Static generation for Cloudflare deployment

Use Node 22.16.0 or newer. The repository pins this in `.node-version` so Cloudflare Pages can use Nuxt Content's native SQLite connector during static generation.

The design-system package is pinned to the active npm technical release:

```json
{
  "@ayingott/theme": "0.0.2"
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

Add posts in `content/blog/`. The writing template lives in `docs/content/blog-post-template.md`; keep drafts as `*.draft.md` with `draft: true`, and use `NUXT_INCLUDE_DRAFTS=1 pnpm dev` for local draft preview. Published posts appear in `/blog`, `/feed.xml`, and `/sitemap.xml`.

## Styling

The app CSS entry is `app/assets/main.css`.

```css
@import "tailwindcss";
@import "@ayingott/theme/fonts.css";
@import "@ayingott/theme";
```

`@ayingott/theme` provides Tailwind v4 tokens, semantic CSS variables, focus/touch utilities, base styles, and opt-in Space Grotesk / Space Mono webfonts.

S2 implements the locked `design-v0.1` page system: home, about, blog list, blog detail route, 404, `.dark` mode, and the contact-strip resume affordance. Phase A wires blog content ingestion with `@nuxt/content`, quiet article prose, RSS, and sitemap output. Real resume PDF configuration remains follow-up work.

## Deployment

The current target is static output on Cloudflare:

```bash
pnpm generate
```

The generated site is written to `.output/public`.
