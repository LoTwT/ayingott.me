# ayingott.me Agent Guide

## Project

`ayingott.me` is Ayingott's personal site. V1 is a long-lived personal space for bio, writing, selected work, and contact paths. It is not a hiring page, link-in-bio aggregator, or commercial brand site.

Read these before changing product scope:

- `docs/product/needs-v0.1.md`
- `docs/product/decisions/index.md`

## Current Phase

S1 is a technical stack migration. It must preserve the existing one-page signature UI while moving the app to Tailwind CSS v4 and `@ayingott/theme`.

Do not implement the S2 redesign, blog IA, new page shells, `@nuxt/content`, resume conditional rendering, RSS, or new site features in S1.

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS v4 through `@tailwindcss/vite`
- `@ayingott/theme` pinned to design-system V0 commit `f8c1d8e`
- `@nuxtjs/color-mode` with `.dark` class output
- Static generation for Cloudflare deployment

## Styling Rules

The CSS entry is `app/assets/main.css`:

```css
@import "tailwindcss";
@import "@ayingott/theme/fonts.css";
@import "@ayingott/theme";
```

Prefer `@ayingott/theme` semantic variables for new UI:

- `--surface-canvas`
- `--text-primary`
- `--text-secondary`
- `--text-muted`
- `--accent-primary`
- `--border-subtle`
- `--focus-ring-color`

S1 keeps the old signature-page colors as local compatibility variables so the visual baseline does not change. Remove or revise those only in S2.

## Dark Mode

`@ayingott/theme` expects `.dark` on `<html>`. Keep `@nuxtjs/color-mode` configured with an empty `classSuffix`.

## Documentation

Keep README, this file, and `docs/product/decisions/index.md` in sync when changing stack decisions or project phase boundaries.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm generate
```
