# ayingott.me Agent Guide

## Project

`ayingott.me` is Ayingott's personal site. V1 is a long-lived personal space for bio, writing, selected work, and contact paths. It is not a hiring page, link-in-bio aggregator, or commercial brand site.

Read these before changing product scope:

- `docs/product/needs-v0.1.md`
- `docs/product/decisions/index.md`

## Current Phase

S2 implements the locked `design-v0.1` page system on top of `@ayingott/theme@0.0.1`.

In scope: home, about, blog list empty state, blog detail route template, 404, `.dark` mode, contact-strip resume affordance, and removal of the S1 `--ayingott-*` compatibility shim. Out of scope: `@nuxt/content` ingestion, RSS generation, real resume PDF publishing, comments, search, analytics, and expanded biography copy.

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS v4 through `@tailwindcss/vite`
- `@ayingott/theme@0.0.1` from npm
- `@nuxtjs/color-mode` with `.dark` class output
- Static generation for Cloudflare deployment

Use Node 22.12.0 or newer; `.node-version` pins the project runtime baseline for local work and Cloudflare builds.

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

Do not reintroduce the S1 `--ayingott-*` compatibility variables. New UI should consume the V0 semantic variables directly.

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
