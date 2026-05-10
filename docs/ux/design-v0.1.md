# ayingott.me · UX Design v0.1

- Status: v0.1 (S2 deliverable)
- Owner: @UX
- Drafted: 2026-05-07
- Stage: DD-005 S2 (design language reconstruction + UI spec)
- Inputs: `docs/product/needs-v0.1.md` v0.1 + AY-D-01~19 + `@ayingott/theme@0.0.1` + `skills/ayingott-design-system/SKILL.md` (LoTwT/design-system)

## How to read this document

This document is the site-level UX contract for ayingott.me V1. It does **not** redefine design tokens — `@ayingott/theme` already ships them and the design-system skill already documents how to consume them. This document covers what the design system does not: page composition, information architecture, decoration usage, accessibility acceptance, and prompt packs to drive AI mockup generation.

Reading order:

- TL implementing pages → §3 IA, §4 page wireframes, §5 decoration rules, §6 a11y checklist
- @lo-user driving Claude Design / v0 / Figma AI mockups → §7 prompt pack
- @QA running acceptance → §6 a11y checklist + §8 contrast verification
- @Product tracking scope → §1 deliverable summary, §9 V1.x candidates

The document is intentionally page-focused. Token names, hex values, and dark-mode behavior all live in `@ayingott/theme`; cross-reference that package whenever a token decision is needed.

---

## 1. Deliverable summary

V1 ships five page templates and the routing / IA shell that holds them.

| Page        | Path           | Purpose                                                                  | Required for V1 |
| ----------- | -------------- | ------------------------------------------------------------------------ | --------------- |
| Home        | `/`            | Landing, signature block, contact strip, optional now and resume entries | Yes             |
| About       | `/about`       | Long-form bio (B+A mixed: tagline + interests + working notes)           | Yes             |
| Blog list   | `/blog`        | Reverse chronological post index, container only — V1 may ship empty     | Yes             |
| Blog detail | `/blog/[slug]` | Single post template, prose + meta + share                               | Yes             |
| Not found   | catch-all      | Soft 404 with one-line copy + return-home link                           | Yes             |

Out of scope for V1 per `needs-v0.1.md` §3.3:

- Resume PDF embed, recruiter framing, link-in-bio aggregation
- Comments, guestbook, newsletter forms
- Live status, listening activity, editor activity
- Webring, friend links
- Multi-language toggle (Chinese first; EN deferred)
- Command palette and other power-user surfaces

Layouts and components below assume the `home` Nuxt layout from S1 stays as the default and gains a sibling `prose` layout for blog detail.

---

## 2. Design language anchors

`@ayingott/theme` V0 is the contract. This document references tokens by name only.

**Source of truth**:

- Tokens, semantic vars, font handling, dark mode, focus rules → `@ayingott/theme` (`packages/theme/src/`).
- Token usage rules, voice and tone, V0 boundary → `skills/ayingott-design-system/SKILL.md` and `references/tokens.md`.
- Live reference: https://design.ayingott.me

**For ayingott.me V1, defer to V0**:

- Page background → `var(--surface-canvas)`. Warm cream in light, purple-tinged near-black in dark.
- Body text → `var(--text-primary)` on canvas, `var(--text-secondary)` for metadata, `var(--text-muted)` for de-emphasized labels.
- Accent → `var(--accent-primary)` for active surfaces (links, button background, decorative geometry); `var(--text-accent)` for inline link text.
- Borders → `var(--border-subtle)` default; `--border-default` for cards and dividers; `--border-strong` for emphasis.
- Focus → `focus-ring` utility on buttons, `focus-ring-inset` on inputs.
- Cards → `var(--surface-elevated)` background, `--border-subtle` outline, `--radius-card`, `--shadow-card`.

**Drift not allowed**:

- Do not introduce new tokens inside ayingott.me. If a need surfaces, file a `@ayingott/theme` RFC.
- Do not hardcode hex values inside Vue templates or scoped CSS. The S1 `--ayingott-*` shim variables in `app/assets/main.css` are scheduled for removal during S2 implementation; replacing them with V0 semantic vars is part of S2 acceptance.
- Do not import a body webfont. System-ui plus the V0 CJK fallback chain is the contract.
- Do not import an icon library. Icons in V1 are inline SVGs hand-drawn at the consumption site, using `currentColor` so they inherit page text color.

### 2.1 Rendered text language conventions (V1, locked 2026-05-09)

V1 uses **Chinese chrome with English personal copy**. The site `<html>` element declares `lang="zh-CN"`. Personal copy (display name, tagline, About subtitle, About bio) stays English as a deliberate brand choice — the author's handle and self-description are presented as a continuous identity surface, not as bilingual UI strings. Everything else the visitor reads as system-level affordance (nav, button labels, empty states, error pages, accessibility labels, page titles) is Chinese.

| Surface                                     | Locked text (V1)                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `<html lang>`                               | `zh-CN`                                                                               |
| Display name                                | `Lo`                                                                                  |
| Hero greeting                               | `Hi, I'm Lo.`                                                                         |
| Home tagline                                | `A developer`                                                                         |
| About subtitle                              | `Lo · Developer`                                                                      |
| About bio (single paragraph, final)         | `A person.`                                                                           |
| Nav · Home link                             | `首页`                                                                                |
| Nav · About link                            | `关于`                                                                                |
| Nav · Blog list link                        | `文章` (note: the third nav slot uses `文章`, not `博客`; the URL path stays `/blog`) |
| Blog list page title (display 4xl)          | `文章`                                                                                |
| Blog detail back crumb                      | `← 文章`                                                                              |
| Blog list empty state heading (display 2xl) | `还没有文章。`                                                                        |
| Blog list empty state explanation           | `第一篇文章准备好后会出现在这里。订阅暂未开放，V1 阶段偶尔来看就行。`                 |
| 404 heading                                 | `未找到。`                                                                            |
| 404 subtitle                                | `这个页面不在。首页还在。`                                                            |
| 404 button                                  | `回到首页`                                                                            |
| Theme toggle aria-label, switching to dark  | `切换到暗色模式`                                                                      |
| Theme toggle aria-label, switching to light | `切换到亮色模式`                                                                      |
| Resume contact icon aria-label              | `简历 PDF`                                                                            |
| GitHub / X / RSS contact icon aria-label    | `GitHub` / `X` / `RSS` (brand names, not translated)                                  |
| Email contact icon aria-label               | `邮箱`                                                                                |
| Footer                                      | `© 2026 Lo · MIT 许可证`                                                              |
| `<title>` Home                              | `ayingott.me`                                                                         |
| `<title>` About                             | `关于 · ayingott.me`                                                                  |
| `<title>` Blog list                         | `文章 · ayingott.me`                                                                  |
| `<title>` Blog detail                       | `<post title> · ayingott.me`                                                          |
| `<title>` 404                               | `未找到 · ayingott.me`                                                                |

The URL path stays `/blog` and `/blog/[slug]` for technical reasons — see §3.4 routing rules. Display label and URL surface are intentionally decoupled: the visitor reads `文章` in the nav and the address bar shows `/blog/`.

Blog post bodies (S3 scope, rendered through `@nuxt/content`) default to Chinese; per-post `lang` frontmatter allows individual posts to ship in English when the topic warrants it. V1 chrome decisions do not constrain post content language.

This table is the canonical source for any rendered Chinese chrome string. Wireframes and prompts elsewhere in this document still use English structural names (e.g. "Blog list" as a section name in §4.3) for clarity inside the UX doc; the **rendered** value is whatever this table specifies.

---

## 3. Information architecture

### 3.1 URL structure

| Path           | Page        | Notes                                                                                                                       |
| -------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/`            | Home        | `app/pages/index.vue`                                                                                                       |
| `/about`       | About       | `app/pages/about.vue`                                                                                                       |
| `/blog`        | Blog list   | `app/pages/blog/index.vue`                                                                                                  |
| `/blog/[slug]` | Blog detail | `app/pages/blog/[slug].vue` (S2 page template + prose styles); `@nuxt/content` v3 wiring lands in S3 per `needs-v0.1.md` §6 |
| `/feed.xml`    | RSS / Atom  | Optional, deferred until first post ships                                                                                   |
| catch-all      | 404         | `app/error.vue` (Nuxt error page convention)                                                                                |

`/now` and `/uses` are explicitly deferred to V1.x. The home page may carry a one-line "now" entry, and a resume PDF link rendered as a peer icon inside the home contact strip when AY-D-08 conditions are met (see §4.1).

### 3.2 Navigation

- **Primary nav**: lives in the `home` layout header. Three links: `首页 / 关于 / 文章` (rendered Chinese values per §2.1). The URL targets are `/`, `/about`, `/blog`. Plus a theme toggle.
- **Secondary nav**: none. No footer link farm. The footer carries copyright, license, and a one-line site identity.
- **Active state**: the current route's link uses `var(--text-accent)`; siblings use `var(--text-primary)` with hover lifting to `var(--accent-primary-hover)`.
- **Mobile**: nav links collapse to a horizontal strip below the title block, not a hamburger. Three labels fit horizontally on a 360px viewport.

### 3.3 SEO meta defaults

Every page sets:

- `<title>` → page-specific. Home: `ayingott.me`. About: `关于 · ayingott.me`. Blog list: `文章 · ayingott.me`. Blog post: `<post title> · ayingott.me`. 404: `未找到 · ayingott.me`. (See §2.1 for the canonical rendered-text table.)
- `<meta name="description">` → page-specific. 70–160 character range, third-person, no marketing language. See §7 voice rules.
- `<meta property="og:title">` → mirrors `<title>` minus the trailing site name.
- `<meta property="og:image">` → `https://ayingott.me/lo.svg` (V1 default; bespoke per-post images deferred).
- `<meta property="og:url">` → canonical absolute URL.
- `<link rel="canonical">` → canonical absolute URL.
- Author meta → `lo-user` only. No real-name PII per AY-D-07.

Blog posts additionally publish (Open Graph article properties; use `property=`, not `name=`):

- `<meta property="article:published_time">` from frontmatter `date`.
- `<meta property="article:tag">` per frontmatter `tags` (V1.x scope; V1 may omit).

### 3.4 Routing rules

- All anchor links use `<NuxtLink>`. External links use `<NuxtLink to="https://…" target="_blank" rel="noopener noreferrer">`.
- Canonical paths are lowercase with trailing slash dropped. `/blog/post-slug`, not `/Blog/Post-Slug/`.
- 404 catches everything not enumerated above. There is no 410 / gone handling for V1.

### 3.5 Header behavior (uniform static signature mark, all pages)

The site header is sticky and **carries the same static cursive Lo signature mark across all pages** (home / about / blog list / blog detail / 404). This is the v14 update of the original Q3 hybrid (lo-user msg `74f99bc1`, 2026-05-10): home was previously markless, but lo-user requested the home header carry the mark too — to provide a consistent chrome-level brand anchor on every page.

**Sticky chrome (all pages)**:

- `position: sticky; top: 0; z-index: var(--z-header);`.
- `min-height: 64px`. `border-bottom: 1px solid var(--border-subtle)`.
- `background: var(--surface-canvas)` so content scrolls beneath without bleeding through.
- Padding: `var(--layout-page-gutter)`.

**Left-side mark (uniform, all pages)**:

- All pages render a **static cursive Lo signature mark** as a brand anchor and home-link target.
- Component: `<LoSignatureMark :animated="false" />` (static variant, see §4.7 contract).
- Size: `--lo-signature-width: 54px; --lo-signature-height: 36px; --lo-signature-stroke-width: 0.32;`.
- Wrapper: `<NuxtLink to="/" aria-label="Lo">` with `min-width / min-height: var(--touch-target-min)` (44px) so the visible 54×36 mark sits in a ≥ 44×44 hit area.
- Hover: color shifts to `var(--text-accent)`.

**Right cluster (all pages)**: nav links + theme toggle. Nav links are `var(--font-mono)` at **`var(--text-sm)` (14px)**, `padding-block: var(--spacing-2)`, `padding-inline: var(--spacing-3)`, `border-radius: var(--radius-control)`, `transition: var(--transition-interactive)`. Each nav link has a ≥ 44×44 hit area via the V0 `touch-target` utility. The active link uses `var(--text-accent)`; siblings use `var(--text-primary)`.

**Home double-mark visual relationship**: home renders both a **small static mark in the header (54×36)** and a **large animated signature in the hero (~76×51)** — these are intentionally not the same visual weight. The chrome mark is a quiet brand anchor; the hero signature is the page's primary identity moment. The cursive Lo path data is shared, so the two marks read as consistent siblings rather than duplicate elements (small printed stamp + large hand signature).

**Why a static (not animated) mark on chrome**: the animated 12s cycle in the chrome region would pull attention from page content on every page. Static filled cursive Lo preserves brand recognition without competing for attention. Hero animation is reserved for the home identity moment only.

**Reduced-motion**: the static variant is already animation-free, so `prefers-reduced-motion: reduce` is a no-op for the header mark.

### 3.6 Favicon (theme-reactive)

The favicon mirrors the active color scheme:

- Light mode → `/lo.svg?v=light`.
- Dark mode → `/lo-white.svg?v=dark`.

The `?v=light` / `?v=dark` query string is a deliberate cache-bust marker — browsers cache favicons aggressively and would otherwise hold a stale icon across theme switches.

Implementation lives in `app/composables/useSiteFavicon.ts`. The composable:

1. Reads `useAppliedColorMode().isDark` (S1 composable).
2. Computes `faviconHref` as a derived ref switching between the two URL+query pairs.
3. Registers the link via `useHead` with a stable `id="site-favicon"` so SSR and CSR render the same element.
4. On the client, watches the href ref and patches the existing `<link id="site-favicon">` in place (replacing the node with a fresh element when the href differs from current). Falls back to `document.querySelector('link[rel="icon"][type="image/svg+xml"]')` if the id is missing.
5. Calls `onMounted(syncFaviconLink)` to cover the initial paint.

Drift not allowed: do not add a third favicon variant for system theme; theme is user-controlled in V1 (manual toggle), and the favicon mirrors whatever the page reports.

### 3.7 Theme toggle transition (circular reveal)

When the visitor clicks the right-side theme toggle (light↔dark), the new theme paints in via a **circular reveal anchored at the toggle's click position**. This is the only chrome-level transition animation in V1; static toggles felt abrupt for what is otherwise a calm site.

**Source of truth**: lo-user msg `74f99bc1` requested a fullscreen theme transition; UX default candidate (a) accepted in lo-user msg `63d7b9ef` 2026-05-10.

**Visual model**:

- Origin: the click event's `clientX` / `clientY` — i.e. exactly where the user pressed the toggle button.
- Shape: `clip-path: circle(<radius> at <x> <y>)`, animating radius from `0` to the viewport diagonal distance from origin (so the circle sweeps through every pixel).
- Direction: only the **incoming** theme animates in (`::view-transition-new(root)`). The outgoing theme stays as the static under-layer; the circle reveals the new theme on top of it.
- Duration: **600ms**. Slow enough to perceive the reveal as a deliberate transition; fast enough not to block subsequent interaction.
- Easing: `ease-out` — fast at the origin, decelerating as it expands. Reads as "light expanding outward and naturally settling."

**Implementation**:

The transition uses the **CSS View Transitions API** (`document.startViewTransition`). The toggle handler reads click coordinates, computes the end radius (`Math.hypot` of the larger horizontal and vertical distances to viewport edges), and animates `clip-path` on the `::view-transition-new(root)` pseudo-element.

Reference shape:

```ts
function toggleTheme(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setColorMode()
    return
  }

  const transition = document.startViewTransition(async () => {
    setColorMode()
    await nextTick()
  })
  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 600,
        easing: "ease-out",
        pseudoElement: "::view-transition-new(root)",
      },
    )
  })
}
```

`setColorMode()` is whatever existing color-mode mutation the S1 toggle runs (Nuxt color-mode `.dark` class swap on `<html>`). The View Transitions API takes a DOM mutation callback and handles the snapshot + cross-fade scaffolding; we override only the `new(root)` keyframe so the default cross-fade is replaced with the circle reveal.

**Two implementation bridges required for the spec's stated visual**:

1. **`await nextTick()` inside the View Transition callback** — Nuxt color-mode mutates `.dark` on `<html>` reactively, which Vue applies on a microtask. A synchronous callback returns before the class change actually paints, so the View Transitions API would snapshot the _old_ theme as `new(root)`. The async callback + `await nextTick()` blocks until Vue has flushed the reactivity, ensuring the new theme is the snapshot source for the reveal.
2. **Suppress the default UA cross-fade on both pseudo-elements** — by default browsers fade-out `::view-transition-old(root)` and fade-in `::view-transition-new(root)` simultaneously, which competes with the circle reveal on `new(root)` and breaks the "outgoing theme stays as static under-layer" model. Add a global CSS rule (`app/assets/main.css` alongside the other global resets, since the View Transitions pseudo-elements are global, not toggle-scoped):

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

Both bridges are required — without them the spec's "outgoing under-layer + circular incoming reveal" mental model is silently broken at runtime.

**Browser support and fallback**:

- **Supported**: Chromium (Chrome 111+ / Edge 111+) + WebKit (Safari 18+).
- **Unsupported**: Firefox (no `startViewTransition` as of this spec); older Safari/Chrome. In those browsers `document.startViewTransition` is `undefined` and the early return runs `setColorMode()` synchronously — the theme swaps instantly with no animation. No JS error, no console warning.
- **Reduced motion**: same code path as unsupported — `prefers-reduced-motion: reduce` matches → `setColorMode()` synchronously, instant swap.

**Accessibility**:

- The toggle's `aria-pressed` state is updated by `setColorMode()` and is observed by screen readers immediately, regardless of animation timing — visual transition runs in parallel, not in series.
- The transition is purely decorative: no information is conveyed only through the animation.
- Reduced-motion users get instant swap (already covered above).
- Focus behavior is unaffected — the toggle button keeps keyboard focus through the transition.

**SSR / hydration**:

- View Transitions API is client-only. `document.startViewTransition` access is gated by feature detection inside the click handler (which only fires after hydration), so SSR is safe.
- The first paint (before any toggle click) shows whatever theme `useColorMode` resolves to and never animates — matches existing S1 behavior; no flash.

**Drift not allowed**:

- Do not change the duration to a fixed `300ms` "snap" or `1200ms` "drama" — 600ms ease-out is the brand-tuned default. If a future iteration wants a different feel, it goes through Product/UX rather than ad-hoc tuning.
- Do not animate the **outgoing** theme's `::view-transition-old(root)` — that produces a competing fade and breaks the "single light wave from origin" mental model.
- Do not clamp the end radius below the diagonal — the circle must reach all four corners.
- Do not gate the transition behind a feature flag or user preference toggle in V1 — `prefers-reduced-motion` is the single opt-out.

---

## 4. Page wireframes

Wireframes describe block composition and token usage. They are not pixel mockups — pixel-level visuals are produced via §7 prompt pack and reviewed in critique loop.

Each block lists its semantic vars, spacing, and accessibility role. Anything not listed inherits page defaults.

### 4.1 Home (`/`)

**Purpose**: identity card. The visitor lands and within one screen knows who this is and where to go next.

**Block layout (top to bottom, v14 update — home now also carries chrome mark)**:

```
┌─────────────────────────────────────────────────────┐
│  Header (sticky, static Lo mark left + nav right)   │
│  ┌────────┐                  ┌──────────────────┐   │
│  │ Lo mark│                  │ Nav · Theme tog. │   │
│  └────────┘                  └──────────────────┘   │
│                                                     │
│  Hero signature block (centered)                    │
│  ┌─────────────────────────────────────────────┐    │
│  │  Hi, I'm  ⟨cursive Lo SVG, animated⟩  .  👋  │    │
│  │  (single H1, flex row, items center)        │    │
│  │  tagline (body, lg, --text-secondary)       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Optional: now entry (one line, --text-muted)       │
│                                                     │
│  Contact strip (inline icons, conditional members)  │
│  GitHub · X · Email · Resume (if PDF) · RSS (if     │
│                       blog posts)                   │
│                                                     │
│  Footer (copyright · license · identity)            │
└─────────────────────────────────────────────────────┘
```

The interests chip strip from earlier drafts was dropped in design loop v2; the hero already carries identity, and chips read as portfolio-marketing under AY-D-01.

**Token references**:

- Page background → `var(--surface-canvas)`.
- Header height: 64px (sticky, see §3.5). Padding: `var(--layout-page-gutter)`.
- **Home header has no left-side mark** (Q3 hybrid, see §3.5). Right cluster is `nav + theme toggle`.
- H1 hero is a `display: flex; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 0` row with four flex children: text span (`Hi, I'm`) → `<LoSignatureMark>` (animated cursive SVG) → period span (`.`) → emoji span (`👋`).
- H1 typography: `var(--font-display)` weight 700 at `var(--text-5xl)`, `letter-spacing: var(--tracking-tight)`, **`line-height: 1.5`** (line-height accommodates the larger SVG visual height; do not use `--text-5xl--line-height` here).
- LoSignatureMark hero sizing (CSS vars consumed by component, see §4.7 for full contract):
  - Desktop: `--lo-signature-width: 4.8rem; --lo-signature-height: 3.2rem; --lo-signature-stroke-width: 0.35;`
  - Mobile (`@media (max-width: 720px)`): same width/height/stroke-width values.
  - Wrapper `.home-page__signature` uses `display: inline-flex; flex: 0 0 auto; margin-inline: 0.5rem` (mobile `0.375rem`).
- Period span `.home-page__signature-period`: `display: inline-block; flex: 0 0 auto; margin-inline-end: 0.25rem;`. Period is **plain text**, never animated, computed `animation-name: none, opacity: 1`. The period belongs to sentence punctuation, not to the signature stroke.
- Emoji span `.home-page__emoji`: `display: inline-block; flex: 0 0 auto; margin-inline-start: 0`. Wave animation: `home-emoji-wave 2.8s ease-in-out infinite` rotating ±14° / -8° / 12° / -4° / 6° within 30% of the cycle, then resting. Reduced-motion: animation none.
- Tagline uses `var(--font-sans)` at `var(--text-xl)`, color `var(--text-secondary)`, max-width `28rem`, centered (`margin: var(--spacing-6) auto 0`).
- Contact strip icons sit at 24×24, inline SVG, `currentColor`, monoline 1.5px stroke. The strip uses `var(--spacing-4)` between items. Each icon uses the V0 `touch-target` utility so the 24×24 visual is wrapped in a 44×44 hit area without changing layout. Each icon ships an `aria-label` matching the channel name (e.g. `aria-label="简历 PDF"` on the resume icon).
- Footer text: `var(--text-muted)` at `var(--text-xs)`. Footer carries `border-top: 1px solid var(--border-subtle)`.
- `.home-page` container uses `display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: var(--spacing-8); padding-block: clamp(var(--spacing-16), 18svh, 11rem) var(--spacing-12); text-align: center;`.

**Behavior**:

- The H1 hero animates per §4.7 (12-second 5-phase cycle). The signature is decorative; the H1's accessible name is set via `aria-label="Hi, I'm Lo."` and the SVG / period / emoji children are all `aria-hidden="true"`.
- Hover on contact icon: `transform: scale(1.1)`, color shifts to `var(--text-accent)`. Transition uses `var(--transition-interactive)`.
- Nav theme toggle uses the existing component from S1, retokenized to V0 semantic vars.

**Decoration**:

- **None.** The geometric-primitive decoration (dot / line) at the top-right of the signature block was deprecated during design loop v2 (see §5). The hero signature SVG itself is the visual anchor; layering an additional primitive on top of an animated cursive mark reads as visual noise.

**Conditional rendering**:

- Resume icon renders only when `siteConfig.public.resumePdfUrl` is truthy (AY-D-08). When rendered, it sits as a peer in the contact strip alongside GitHub / X / Email — not as a separate primary button. This treatment is a deliberate brand choice tied to AY-D-01 (ayingott.me is a personal garden, **not** a recruiter-facing portfolio); a primary CTA-style resume button reads as "click to apply" and would clash with that framing. Routing target: a `target="_blank" rel="noopener noreferrer"` link to the configured PDF URL.
- RSS contact icon renders only when at least one blog post is published.
- Now entry renders only when `siteConfig.public.nowText` is truthy.

### 4.2 About (`/about`)

**Purpose**: long-form bio. Where the visitor goes if they want to know more than the home page tells them.

**Block layout**:

```
┌─────────────────────────────────────────────┐
│  Header (same as home)                      │
│                                             │
│  Page title block                           │
│  ┌──────────────────────────────────────┐   │
│  │ "关于"  (display, 4xl)               │   │
│  │ subtitle (mono, sm, --text-muted)    │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Bio prose                                  │
│  ┌──────────────────────────────────────┐   │
│  │ paragraph 1: tagline + identity      │   │
│  │ paragraph 2: interests (B+A mix)     │   │
│  │ paragraph 3: working notes           │   │
│  │ paragraph 4: closing / contact CTA   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

**Constraints**:

- Prose container max-width: `var(--layout-prose-width)` (= `--container-reading` = `42rem`).
- Body text uses `var(--font-sans)` at `var(--text-base)` with paired line-height (1.5rem).
- Section headings inside prose use `var(--font-display)` weight 500 at `var(--text-2xl)`.
- Inline links use `var(--text-accent)`, no underline by default, underlined on hover with `text-decoration-thickness: 0.08em` and `text-underline-offset: 0.18em`. Matches V0 `base.css` rule.
- Prose blocks separated by `var(--spacing-6)`.

**Voice**:

- Sentence-level voice follows the design-system skill voice rules (sentence case, no emoji, third-person where natural, plain and contractual). The bio itself may use first-person where required, since it's autobiographical — that is the one explicit exception to the third-person rule across the site.

**Decoration**:

- **None.** The outlined-circle primitive at the top-right of the page title block was deprecated during design loop v2 (see §5). The about page is intentionally minimal: page title + subtitle + bio prose, centered. The header carries the inner-page Lo signature mark (Q3 hybrid, see §3.5) which serves the brand-identity role on inner pages.

### 4.3 Blog list (`/blog`)

**Purpose**: reverse chronological index of posts. V1 may ship empty; the empty state is part of the spec.

**Block layout (with posts)**:

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│                                             │
│  Page title block                           │
│  ┌──────────────────────────────────────┐   │
│  │ "文章"  (display, 4xl)               │   │
│  │ subtitle (mono, sm)                  │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Post list (one per row)                    │
│  ┌──────────────────────────────────────┐   │
│  │ Post title (display, xl)             │   │
│  │ meta (mono, xs, --text-muted):       │   │
│  │   yyyy-mm-dd · reading time          │   │
│  │ excerpt (sans, base, --text-secondary│   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │ ... next post                        │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

**Block layout (empty)**:

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│                                             │
│  Page title block                           │
│                                             │
│  Empty state                                │
│  ┌──────────────────────────────────────┐   │
│  │ "还没有文章。"                       │   │
│  │ "第一篇文章准备好后会出现在这里。订   │   │
│  │  阅暂未开放，V1 阶段偶尔来看就行。"   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

**Token references**:

- Each post row is a card using `var(--surface-elevated)`, `--border-subtle`, `--radius-card`, `--shadow-card`. Hover lift: `translateY(-1px)` + `--shadow-md`.
- Post rows are separated by `var(--spacing-6)`.
- Empty state copy uses `var(--text-secondary)` at `var(--text-base)`. Container max-width `var(--container-reading)`.
- Whole page click target on the card row, not just the title.

**Decoration**:

- **None.** The inter-row dot primitive (with-posts state) and the empty-state rotated-square primitive were deprecated during design loop v2 (see §5). The post list reads as cards on canvas; visual rhythm comes from card spacing and shadow, not from injected ornaments. The empty-state container retains its dashed border + soft shadow; the missing primitive is not replaced by anything.

### 4.4 Blog detail (`/blog/[slug]`)

**Purpose**: single post. The page template + prose styles defined in this section are S2 deliverables. The Markdown / MDC rendering pipeline (`@nuxt/content` v3) is wired in S3 per `docs/product/needs-v0.1.md` §6, and the V1 blog list may ship empty until that wiring is complete. UX intent is: S2 builds the visual shell against a stub fixture; S3 swaps the stub for `@nuxt/content` without changing the visual contract.

**Block layout**:

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│                                             │
│  Post header                                │
│  ┌──────────────────────────────────────┐   │
│  │ Post title (display, 5xl)            │   │
│  │ meta (mono, sm, --text-muted):       │   │
│  │   yyyy-mm-dd · reading time · tags   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Prose body                                 │
│  ┌──────────────────────────────────────┐   │
│  │ Markdown / MDC rendered content      │   │
│  │  - h2: display, 3xl                  │   │
│  │  - h3: display, 2xl                  │   │
│  │  - body: sans, base                  │   │
│  │  - code block: mono, sm,             │   │
│  │    --surface-subtle bg               │   │
│  │  - inline code: mono, sm,            │   │
│  │    --surface-subtle bg, padding 2px  │   │
│  │  - blockquote: --border-strong       │   │
│  │    left bar, italic, --text-secondary│   │
│  │  - figure: full prose width, caption │   │
│  │    mono xs --text-muted              │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Post footer                                │
│  ┌──────────────────────────────────────┐   │
│  │ License line (CC-BY 4.0, AY-D-13)    │   │
│  │ Permalink                            │   │
│  │ Edit on GitHub link (V1.x)           │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

**Token references**:

- Prose container max-width: `var(--layout-prose-width)`.
- Code block uses `var(--surface-subtle)` background, `var(--radius-md)` corners, `var(--spacing-4)` block padding, `var(--font-mono)` at `var(--text-sm)`. Syntax highlighting uses the V0 `--color-syntax-*` tokens (keyword / string / function / number / comment / operator).
- Blockquote: `border-left: 3px solid var(--border-strong)`, `padding-left: var(--spacing-4)`, color `var(--text-secondary)`, font-style italic.
- Figures and pull quotes use `var(--surface-panel)` background (slight differentiation from page canvas). Caption uses `var(--font-mono)` at `var(--text-xs)` color `var(--text-muted)`.

**Reading rhythm**:

- Paragraphs separated by `var(--spacing-4)`.
- Headings have `var(--spacing-8)` top margin, `var(--spacing-4)` bottom margin.
- Lists indent at `var(--spacing-6)`. Nested lists indent at `var(--spacing-4)` per level.

**Decoration**: none. The post is the content; no ornament inside the prose.

### 4.5 Not found (catch-all)

**Purpose**: soft 404. The visitor took a wrong turn; the page acknowledges that and offers one path back.

**Block layout**:

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│                                             │
│  Centered block                             │
│  ┌──────────────────────────────────────┐   │
│  │ "404"  (display, 7xl, accent)        │   │
│  │ "未找到。" (display, 2xl)            │   │
│  │ subtitle (sans, base, --text-muted)  │   │
│  │ ┌────────────────────────┐           │   │
│  │ │ 回到首页 (button)      │           │   │
│  │ └────────────────────────┘           │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

**Token references**:

- "404" digit uses `var(--font-display)` weight 700 at `var(--text-7xl)`, color `var(--accent-primary)`, `letter-spacing: var(--tracking-tighter)`.
- Subtitle copy: a single sentence, sentence case, no apology language. V1 rendered text: `这个页面不在。首页还在。` (the canonical text lives in §2.1; this English example shows the brand's no-apology register: "The page is not there. The home page is.").
- Button: primary surface, `var(--accent-primary)` background, `var(--accent-contrast)` text (deep-lavender near-black, AA-verified at 5.50:1 light / 8.56:1 dark), `var(--radius-control)`, `var(--font-display)` weight 500, `--transition-interactive`. Min-height `--touch-target-min` (44px). White / `--text-inverse` is **not** an option on `--accent-primary` in V0 — that pair fails AA at 2.86:1.
- Vertical centering uses CSS grid; the centered block sits at roughly 30% from the top, leaving headroom for the header.

**Decoration**:

- **None.** The 40×2 line primitive directly under the "404" digit was deprecated during design loop v2 (see §5). The page is centered (block-level `align-items: center; text-align: center`) with `404` digit + heading + subtitle + button — the digit's `text-7xl` weight + accent color is sufficient visual focus.

### 4.6 Layout containers and centering

All five page templates use **centered** content blocks under the V1 design loop v2 outcome. Per-page CSS uses:

- `.home-page` / `.about-page` / `.blog-page` / `.error-page`: `display: flex|grid; align-items: center; justify-items: center; text-align: center;` (precise property mix varies by page).
- `.home-page__copy` / `.about-page__prose`: `margin-inline: auto`.
- `.blog-page__list`: `width: 100%; max-width: var(--container-reading)`.
- `.blog-empty`: `width: min(100%, var(--container-reading)); align-items: center;`.
- `.about-page` / `.blog-page` use `justify-items: center; text-align: center` on the grid container.

Containers do not need additional decoration to feel "designed"; centered type + the signature mark + sticky-header chrome carry the visual weight. Earlier drafts used left-aligned content with primitives in negative space; design loop v2 replaced that with center-aligned content.

### 4.7 Hero signature animation contract

The home hero animates a cursive **Lo** signature inside the H1. This is the brand's only motion-as-identity element in V1.

**Component**: `app/components/site/LoSignatureMark.vue`. Single component with two render variants controlled by an `animated?: boolean` prop (default `true`):

- `animated=true` (used in home hero) — runs the 12-second 5-phase loop below.
- `animated=false` (used in inner-page header per §3.5) — renders the same path data as a static filled cursive Lo (`fill-opacity: 1; stroke: none; animation: none`).

**SVG markup**:

- `<svg viewBox="0 0 15 10" fill="none" xmlns="..." aria-hidden="true" focusable="false">` with a single `<path>` carrying the cursive Lo glyph outline.
- `pathLength="1"` is required so `stroke-dasharray` / `stroke-dashoffset` keyframes can use normalized 0–1 values without measuring path length at runtime.
- `vector-effect="non-scaling-stroke"` so stroke weight stays consistent across container sizes.
- The `<path>` uses `fill: currentColor; stroke: currentColor` and inherits color from the parent. Width / height / stroke-width are CSS variables set by the consumer.

**CSS variables consumed by the component** (set by parent):

- `--lo-signature-width` (default `54px`)
- `--lo-signature-height` (default `36px`)
- `--lo-signature-stroke-width` (default `0.32`)

**12s 5-phase cycle (animated variant only)**:

| Phase  | Range (% of 12s)    | Duration | Behavior                                                                                                                   | Key state                                                          | Easing      |
| ------ | ------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------- |
| 1      | 0% → 16.7%          | 2s       | Stroke draws in (full-glyph outline)                                                                                       | `stroke-dashoffset: 1 → 0`, `fill-opacity: 0`, `stroke-opacity: 1` | ease-in-out |
| 2      | 16.7% → 25%         | 1s       | Fill fades in                                                                                                              | `fill-opacity: 0 → 1`, `stroke-opacity: 1`, `stroke-dashoffset: 0` | ease-out    |
| 3      | 25% → 75%           | **6s**   | Filled hold (readable Lo)                                                                                                  | `fill-opacity: 1`, `stroke-opacity: 1`, `stroke-dashoffset: 0`     | linear      |
| 4      | 75% → 83.3%         | 1s       | Fill fades out                                                                                                             | `fill-opacity: 1 → 0`, `stroke-opacity: 1`                         | ease-out    |
| 5      | 83.3% → 100%        | 2s       | Stroke erases (mirror of Phase 1, reverse)                                                                                 | `stroke-dashoffset: 0 → 1`, `fill-opacity: 0`, `stroke-opacity: 1` | ease-in-out |
| → loop | 100% → 0% (instant) | —        | Loop boundary; Phase 5 end == Phase 1 start (both at `stroke-dashoffset: 1`). Phase 1 immediately begins drawing in again. | momentary stroke=0 acceptable (not a sustained phase)              | linear      |

Total cycle: **12 seconds**. There is **no Phase 6 blank breathing** — Phase 5 → Phase 1 is direct (lo-user msg `9533eb58`: "立刻接新的描边动画"). At any non-loop-boundary instant the path satisfies `stroke-opacity > 0 OR fill-opacity > 0`; only the exact 12s/0s seam has a momentary `stroke-dashoffset = 1` state.

**Symmetry constraints** (both required):

- Phase 1 and Phase 5 are equal in duration (both 2s).
- Phase 1 and Phase 5 use the **same mechanism** (stroke-dashoffset endpoints `1↔0`, just inverted). Phase 5 must not fade via `stroke-opacity` — that produces an asymmetric "draw in / fade out" mismatch lo-user explicitly flagged.

**Consumer sizing**:

- Hero (home): `--lo-signature-width: 4.8rem; --lo-signature-height: 3.2rem; --lo-signature-stroke-width: 0.35;` desktop and mobile.
- Header (inner pages): `--lo-signature-width: 54px; --lo-signature-height: 36px; --lo-signature-stroke-width: 0.32;` (smaller stroke for legibility at small size).

**Reduced-motion fallback** (`prefers-reduced-motion: reduce`):

- `animation: none; fill-opacity: 1; stroke: none; stroke-opacity: 0; stroke-dasharray: none; stroke-dashoffset: 0; stroke-width: 0;`.
- The signature renders as a static filled cursive Lo with no stroke and no animation — equivalent to the static variant at all sizes.

**A11y on the H1 (consumer responsibility)**:

- The home `<h1>` declares `aria-label="Hi, I'm Lo."` so screen readers receive a clean single-string accessible name.
- The four flex children (`Hi, I'm` text span / `<LoSignatureMark>` / period span / emoji span) are all `aria-hidden="true"` to avoid double-announcement.
- The SVG itself is also `aria-hidden="true"` and `focusable="false"` at the component level.

**Performance**:

- The animation runs entirely on `fill-opacity`, `stroke-opacity`, and `stroke-dashoffset` — all GPU-friendly properties. No layout reflow inside the cycle.
- One SVG `<path>` element. No filters, no masks, no gradients.

**Drift not allowed**:

- Do not add Phase 6 blank breathing back without lo-user re-spec.
- Do not change Phase 5 to opacity-fade; the mechanism must mirror Phase 1.
- Do not introduce a 10% residual stroke at the loop boundary (the v12 (c) variant). lo-user msg `9533eb58` confirmed full draw-out → full draw-in is the intended flow.
- Do not split the path into multiple sub-paths or change drawing order without UX sign-off; the path data is the brand's hand-traced cursive Lo and is part of the visual contract.

---

## 5. Decoration placement rules (DEPRECATED for V1)

> **Status (2026-05-09)**: V1 ships **without** geometric-primitive decoration. The dot / line / outlined-circle / rotated-square primitives previously placed at the top-right of page-title blocks (home signature / about / blog list / 404 line) were removed during the **design loop v2** initiated by lo-user feedback ("中间一个不明所以的小点和横线" / "关于和文章里有不明所以的图案"). After PR #10 (home decoration removal), iterations PR #11 (deferred §5 patch) and PR #12 (v13 cohesive ship) closed out the visual escape entirely.
>
> The brand's V1 visual identity is now carried by:
>
> - The **Lo signature mark** (animated cursive SVG in hero / static cursive SVG in inner-page header — see §4.7 + §3.5).
> - The **emoji wave** in hero (👋, see §4.1 token references).
> - **Centered, minimal page composition** with type-scale and color contrast as the only "ornament".
>
> The four-primitive motif from `@ayingott/theme` spec §5.3 remains a valid design-system primitive set for _other consumers_ of the design system, but ayingott.me V1 explicitly opts out. Re-introducing primitives requires a Product/UX RFC that demonstrates a real composition need not already covered by the signature + emoji + type-scale toolkit.

The historical placement rules (preserved for V1.x reference; do not implement in V1):

> - Top-right margin of page title blocks (home signature, about title, blog list title). One primitive, never two.
> - Visual rhythm between long lists (every Nth row, where N ≥ 3). Centered horizontally, dot or line only.
> - 404 page under the digit, line only.
> - Never inside body prose, never inside cards, never as pattern fill.
> - `currentColor` SVG inheriting from parent `color: var(--accent-primary)` on light or `var(--text-accent)` on dark; never hardcode lavender hex.
> - V1 ships static decoration only — `float-gentle` recipe deferred.

If a future V1.x iteration brings a primitive back, treat the rule set above as the floor (sparse seasoning, never pattern) and re-evaluate against the in-place signature mark to avoid double-anchoring identity.

---

## 6. Accessibility AA acceptance

Per AY-D-19, V1 ships at WCAG AA. QA validates all four items below before any S2 PR merges.

### 6.1 Color contrast

- Body text on canvas: `var(--text-primary)` on `var(--surface-canvas)` ≥ 4.5:1. Verified in V0 §8 contrast table (light: 17.8:1; dark: 16.6:1).
- Secondary text on canvas: `var(--text-secondary)` on `var(--surface-canvas)` ≥ 4.5:1.
- Muted text on canvas: `var(--text-muted)` on `var(--surface-canvas)` ≥ 4.5:1 for body sizes; ≥ 3:1 acceptable for large display sizes (≥ 18pt regular or ≥ 14pt bold).
- Accent text: `var(--text-accent)` (= `--color-lavender-700` light, `--color-lavender-300` dark) on `var(--surface-canvas)` ≥ 4.5:1.
- Accent button text: `var(--accent-contrast)` on `var(--accent-primary)` ≥ 4.5:1 (verified 5.50:1 light, 8.56:1 dark). The pair `var(--text-inverse)` on `var(--accent-primary)` is **not** AA-compliant (2.86:1 light) and is explicitly forbidden for V1 buttons.

QA evidence: capture light + dark screenshots, run a contrast checker against the rendered hex pairs, attach the report to the PR.

### 6.2 Focus visibility

- Every interactive element (link, button, theme toggle, card hover row) must show a focus indicator under keyboard navigation.
- Focus indicator uses the V0 `focus-ring` (offset +2px) for buttons / links / cards, or `focus-ring-inset` (inset, used for inputs — there are no inputs in V1, included for completeness).
- The indicator must remain visible against both `--surface-canvas` and `--surface-elevated`.
- No `outline: none` or `outline: 0` anywhere in V1 styles. The S1 `app/components/theme/toggle.vue` is on the S2 retokenization punch list — verify focus there too.

QA evidence: tab through the page sequentially, screenshot every focus state, attach.

### 6.3 Dark mode parity

- Every page must satisfy 6.1 and 6.2 in both light and dark.
- The `.dark` toggle on `<html>` flips semantic vars; pages should not need their own `.dark` selectors. If a page introduces a `.dark` block, treat it as a smell.
- Theme toggle must be reachable by keyboard and operable by Enter / Space. The toggle component should announce its state via `aria-pressed`.

QA evidence: dark-mode pass of 6.1 and 6.2.

### 6.4 Touch target size

- All interactive elements have a hit area of at least 44×44 CSS px on touch devices. Use the V0 `touch-target` utility for compact icons (contact strip, theme toggle, header signature mark) so the target inflates without changing visual size.
- Inline links inside prose are exempt (per WCAG 2.5.5 inline-text exception), but standalone link icons are not.

QA evidence: device emulation at 360px width, manual hit-test on all standalone interactive elements.

### 6.5 Decorative-image H1 pattern (hero)

The home hero H1 mixes plain text, a decorative SVG signature, and an emoji as inline siblings. The accessibility contract is:

- The `<h1>` element carries `aria-label="Hi, I'm Lo."` — this is the screen-reader announcement.
- All inner spans (`Hi, I'm` text span / `<LoSignatureMark>` / period `.` / emoji `👋`) are `aria-hidden="true"`.
- The SVG component itself is `aria-hidden="true"` and `focusable="false"`.

Why: screen readers should hear a clean, single-string sentence — `Hi, I'm Lo.` — not "Hi I'm" + "graphic" + "period" + "wave hand". The visual cursive Lo is a brand decoration, not a textual token; the period is sentence punctuation but not necessary for SR comprehension; the emoji wave is decorative motion the SR user does not need.

The H1 still represents `displayName = "Lo"` semantically. If `useSiteContent().identity.displayName` ever changes, both the visible signature SVG asset (path data + interpretation) and the `aria-label` need to update together.

### 6.6 Reduced-motion fallback

Per WCAG 2.3.3 and `prefers-reduced-motion: reduce`, every motion element on the site provides a static-equivalent fallback:

- **Lo signature** (hero animated variant): `animation: none; fill-opacity: 1; stroke: none`. Cursive Lo renders as a static filled glyph (visually identical to Phase 3 of the cycle).
- **Lo signature** (header static variant): no-op (already animation-free).
- **Hero emoji wave** (`home-emoji-wave`): `animation: none`. Emoji renders without rotation.
- **Period and tagline / contact icons**: never animated.

QA evidence: enable Chrome DevTools "Emulate CSS media: prefers-reduced-motion: reduce" and verify the home hero shows a static filled cursive Lo + static 👋 with no transform or opacity transitions running.

---

## 7. Mockup prompt pack

These are six prompts lo-user can paste into Claude Design / v0.dev / Figma AI (or hand off to a designer) to produce visual mockups. Each prompt is self-contained and produces one page or one cross-cutting deliverable.

The prompt format:

1. Brief — what to produce.
2. Brand anchors — voice, palette, typography, motif.
3. Page-specific blocks — what goes where.
4. Constraints — what the output must avoid.

Run them in order. After each, paste the output into this thread; UX runs critique loop and converges to a TL-implementable mockup.

**Historical note (2026-05-09 update)**: the prompts below were the V1 mockup-generation set, run once on 2026-05-08, and the resulting mockup was approved as the S2 implementation baseline. **They have since been superseded by the design loop v2 outcome (PR #12, v13)** — running them again would not produce the V1 ship spec. Specifically:

- They render nav and chrome as English (`Home / About / Blog / Not found. / Back to home / etc.`) because that was the working assumption at prompt-generation time. The locked rendered values for V1 are Chinese per §2.1.
- They specify a **text** site title mark in the header. V1 uses an animated cursive **Lo signature SVG** in hero + a static cursive Lo SVG in inner-page headers (Q3 hybrid, see §3.5). The home header has **no** left-side mark.
- They specify "**No emoji**" as a brand constraint. V1 includes a single emoji `👋` in the home hero as a hand-wave punctuation glyph paired with the signature; this is the only emoji on the site and is `aria-hidden`. Voice rules elsewhere (about prose, blog post bodies, error messages, nav labels, button copy) still ban emoji per the design-system skill.
- They specify "**No animation**" generally (404 prompt) and place static **geometric primitive decorations** (dot / line / outlined-circle / rotated-square) at top-right of page-title blocks. V1 ships **no decoration primitives** (see §5 deprecation) and ships **one motion element** — the 12s hero signature cycle (see §4.7). 404 stays static.
- They specify left-aligned content with negative-space ornament. V1 uses **centered** content (see §4.6).

The locked rendered values, layouts, and animation contract for V1 are §2.1 + §3 + §4 + §6, **not** these prompts. The prompts are preserved verbatim for V1.x reference — when re-running for a future iteration that wants to revisit decoration / typography / layout from scratch, treat them as a brand-anchor reference and update the chrome / decoration / animation / layout sections to the design loop v2 outcome before submitting.

### 7.1 Prompt 1 · Home page

```
Design the home page for ayingott.me, a personal website for a Chinese
software developer. The site is a long-running personal garden (blog +
about + contact), not a recruiter-facing portfolio.

Brand:
- Calm, geometric, warm-cream-and-lavender. Backgrounds are warm cream
  (#fffaef), never grey, never pure white at the page level. The brand
  accent is a single lavender (#9c8fd9 at default).
- Typography: display = Space Grotesk (geometric sans, weights 300–700);
  body = system-ui with PingFang SC / Hiragino Sans GB / Microsoft YaHei
  fallback for Chinese; mono = Space Mono (400 / 700) for meta and code.
- No emoji. No marketing language. Headings are nouns in sentence case.
- The decorative motif is geometric primitives: 8×8 dot, 40×2 line,
  24×24 outlined circle, 16×16 rotated square. Place them sparsely in
  page chrome, never inside prose, never as patterns.

Page composition (top to bottom):
1. Header bar: site title text mark on the left, three-link nav (Home /
   About / Blog) and a theme toggle on the right.
2. Signature block: "Hi, I'm 龙." in display 5xl bold, with a one-line
   tagline below in body lg, color slightly muted.
3. Interest chips: a single horizontal row of 3–4 small lavender-tinted
   chips. Pill-shaped, mono labels, low contrast.
4. Optional now line: one short sentence about what the author is
   currently working on. Muted text.
5. Contact strip: a single horizontal row of inline 24×24 monoline
   icons in currentColor — GitHub, X, email, optional resume PDF
   (renders only when a PDF link is configured), and optional RSS
   (renders only when at least one blog post is published). The
   resume PDF is a peer icon in this strip, not a separate primary
   button, because ayingott.me is intentionally not a recruiter-
   facing portfolio. Each icon has a 44×44 touch-area target around
   it.
6. Footer: copyright, license line, site identity. Mono, xs, muted.

Constraints:
- No gradients, no images, no patterns, no textures.
- No icon fonts; icons are inline SVGs in monoline 1.5px stroke style.
- No exclamation points. No "Welcome!" copy.
- Place exactly one dot + line decoration combo in the top-right margin
  of the signature block. Lavender, sparse.
- Provide both light and dark variants. Dark canvas is purple-tinged
  near-black (#121019), not neutral grey.
```

### 7.2 Prompt 2 · About page

```
Design the about page for ayingott.me. Use the same brand anchors as
the home prompt.

Page composition:
1. Header bar (identical to home).
2. Page title block: "About" in display 4xl, with a one-line subtitle
   below in mono sm muted.
3. Bio prose, four paragraphs, each separated by generous vertical
   space:
   - Paragraph 1: identity tagline (one or two sentences).
   - Paragraph 2: interests, written as flowing prose, not a bulleted
     list. Mention 2–4 things the author cares about (programming
     languages, games, reading, side projects).
   - Paragraph 3: working notes — what the author is currently building
     or thinking about.
   - Paragraph 4: closing line that points to the contact strip.
4. Footer.

Constraints:
- Prose container max-width 42rem; do not let lines exceed 80 characters.
- Inline links use lavender-700 in light, lavender-300 in dark, with
  underline on hover only.
- One outlined-circle decoration primitive in the top-right of the page
  title block. No other decoration.
- The bio is autobiographical; first-person ("I" / "我") is allowed
  inside the prose. The rest of the site stays third-person.
```

### 7.3 Prompt 3 · Blog list and empty state

```
Design two states of the blog index page for ayingott.me.

State A — with posts:
- Page title block: "Blog" in display 4xl, mono subtitle.
- A vertical list of post cards. Each card is:
  - Surface-elevated background (pure white in light, surface-elevated
    near-black panel in dark).
  - 1px subtle border, 0.5rem radius, soft warm shadow.
  - Title in display xl, meta line below in mono xs muted (date · reading
    time), excerpt in body base secondary text.
  - Hover lifts the card by 1px and increases shadow one step.
- Insert one dot-decoration primitive between every third row, centered
  horizontally, lavender, with generous vertical breathing room.

State B — empty:
- The page title block is identical.
- Below it, a single block in a 42rem container with a one-sentence
  primary line ("No posts yet.") and a two-sentence secondary block
  explaining that subscriptions are not live yet and the reader should
  check back later.
- One rotated-square decoration primitive in the top-right of the empty
  block.

Constraints:
- Both states share the same header and footer.
- No taxonomy chips in V1. Tags will arrive in V1.x.
- No date formatting tricks like "3 days ago"; use ISO yyyy-mm-dd.
```

### 7.4 Prompt 4 · Blog detail (single post)

```
Design a single blog post page for ayingott.me. The post body is
rendered from Markdown via Nuxt Content v3.

Page composition:
1. Header bar.
2. Post header:
   - Title in display 5xl bold, tracking tight.
   - Meta line below in mono sm muted: yyyy-mm-dd · X min read.
3. Post body (max-width 42rem):
   - h2 in display 3xl with vertical air above; h3 in display 2xl.
   - Body text in body base with 1.5rem line-height paragraphs.
   - Inline code in mono sm with a subtle warm-cream background and
     small horizontal padding.
   - Code blocks in mono sm, surface-subtle background, 0.5rem radius,
     1rem block padding. Syntax highlighting uses the six V0 syntax
     tokens: keyword / string / function / number / comment / operator.
     No 14-color highlighting; the palette is intentionally narrow.
   - Blockquotes have a 3px lavender-strong left bar, italic body
     secondary text, no extra background.
   - Figures span the prose width; captions are mono xs muted.
4. Post footer:
   - License line: "CC BY 4.0" with a link to the license.
   - Permalink line.
   - (V1.x) "Edit on GitHub" link.
5. Site footer.

Constraints:
- No decoration anywhere on this page. The prose is the content.
- No author byline or avatar; the site has one author and a footer
  identity is enough.
- No social share buttons.
- Show both light and dark variants of one full post mockup.
```

### 7.5 Prompt 5 · Not-found page

```
Design the 404 page for ayingott.me.

Page composition:
- Standard header.
- Centered block, sitting roughly 30% from the top, on a single column:
  - "404" in display 7xl bold lavender, letter-spacing extra tight.
  - One line decoration primitive (40×2) directly below the digit, also
    lavender.
  - "Not found." in display 2xl primary text.
  - One subtitle sentence in body base muted: "The page is not there.
    The home page is."
  - One primary button: "Back to home". Lavender background, deep-
    lavender near-black text (V0 `--accent-contrast`). Do not use
    white or warm cream text on the lavender background — that pair
    fails WCAG AA in V0. Small radius, min-height 44px.
- Standard footer.

Constraints:
- No apology language. No "Oops" or "Sorry".
- No animation. No floating digits, no shake on hover.
- Both light and dark variants.
```

### 7.6 Prompt 6 · System review board (cross-cutting)

```
Produce a one-page review board that places all five page mockups
(home, about, blog list with posts, blog list empty, blog detail, 404)
side by side at thumbnail size, plus a small token legend.

Brand anchors are identical to the per-page prompts. The board's job is
to let the reviewer scan visual consistency:
- Page background is uniform warm cream across all pages.
- Lavender accent appears at the same intensity on every page.
- Decoration density is consistent — never crowded, never absent for
  more than one consecutive page.
- Type scale steps are visible: 7xl on 404, 5xl on home/blog detail
  hero, 4xl on about/blog list, body and mono in their normal spots.

Constraints:
- Do not redesign individual pages on this board; mirror the per-page
  mockups exactly.
- Show light variant only; dark mode is reviewed separately on each
  per-page output.
- One row per page, scaled to the same height.
```

---

## 8. Verification checklist (UX-side, pre-PR)

UX runs this checklist before requesting TL implementation review.

- [ ] Every token referenced in this document is a real V0 token. Verify by grepping `packages/theme/src/` in the design-system repo.
- [ ] No `--text-tertiary`, no `--bg-accent-soft`, no `--font-serif`, no `--color-syntax-punctuation`, no other tokens flagged as V1.x candidates in `@ayingott/theme` spec §A Future. If a need surfaces, file a `@ayingott/theme` RFC instead.
- [ ] **No geometric-primitive decoration on any V1 page** (§5 deprecated). The only motion element is the hero Lo signature animation per §4.7.
- [ ] Voice rules from `skills/ayingott-design-system/references/voice-examples.md` are reflected in copy examples (no emoji except the hero `👋` per §4.1 + §6.5, no exclamation, sentence case headings, third person).
- [ ] Five page wireframes accounted for (Home, About, Blog list with two states, Blog detail, 404).
- [ ] Header Q3 hybrid behavior is implemented (home empty / inner pages static Lo mark per §3.5).
- [ ] Hero signature animation matches §4.7 contract (12s 5-phase cycle, Phase 1 + 5 symmetric `dashoffset 1↔0` × 2s, Phase 3 hold ≥ 4s, no Phase 6 blank).
- [ ] H1 a11y pattern matches §6.5 (`aria-label="Hi, I'm Lo."`, all decorative children `aria-hidden`).
- [ ] Reduced-motion fallback per §6.6 (animated signature → static filled, emoji wave → no rotation).
- [ ] Favicon composable per §3.6 swaps `/lo.svg?v=light` ↔ `/lo-white.svg?v=dark` on theme change.
- [ ] Six prompts in §7 are tagged **superseded by design loop v2** at the section header; do not re-implement from prompts.
- [ ] §6 a11y checklist is testable by QA without needing UX in the loop.

---

## 9. Future / V1.x candidates (not in V1)

Tracked here so the deferred items have a single home and do not creep into V1 scope. Each candidate triggers a `@ayingott/theme` RFC or an ayingott.me RFC when a real consumer use case emerges.

- **Tags taxonomy on blog list**: `--color-mint-*`, `--color-sky-*`, etc. become useful as tag chip backgrounds. Triggers when blog has ≥ 5 posts and tagging actually helps reader navigation.
- **Now page**: dedicated `/now` page when home one-line entry stops being enough.
- **Resume PDF download**: when AY-D-08 conditions are satisfied (PDF on CDN, link configured).
- **RSS / Atom feed**: when at least one post exists and the feed has subscribers worth serving.
- **EN translation toggle**: AY-D-04 deferred. Triggers when meaningful EN-speaking traffic appears.
- **`--text-tertiary` semantic var**: when the third level of text emphasis becomes a real composition need (e.g. footer micro-copy that reads as too dim with `--text-muted` and too loud with `--text-secondary`).
- **`--font-serif`**: V0 spec §A Future. ayingott.me has no serif content in V1; revisit if blog acquires long-form essays that benefit from serif.
- **`prefers-color-scheme` automatic theme**: V0 deliberately leaves theme control to consumer. ayingott.me V1 uses manual toggle only; system-pref bridge is a V1.x addition if user feedback asks for it.
- **Decoration animation**: V0 documents `float-gentle` recipe but does not ship. ayingott.me V1 stays static. Animated decoration is a V1.x experiment.
- **Per-post Open Graph imagery**: V1 uses one site-default OG image. Per-post images are deferred until at least one post needs them.

When any of the above triggers, file an RFC under `docs/product/decisions/` (ayingott.me) or `docs/decisions/` (design-system), not a one-off PR comment.

---

## 10. Glossary

- **Block**: a logical chunk of a page (signature block, post header, post body). Not the same as a Vue component; one block may be multiple components.
- **Chrome**: header, footer, and any global affordance that wraps page content. Decoration belongs to chrome.
- **Prose**: long-form reading content (about copy, blog post body). No decoration inside prose.
- **Shim**: the temporary `--ayingott-*` variables introduced in S1 to preserve visual zero-regression. Scheduled for removal during S2 retokenization.

---

## Appendix A · Reference matrix

| Need                 | Source                                                       |
| -------------------- | ------------------------------------------------------------ |
| Token names and hex  | `@ayingott/theme@0.0.1` `packages/theme/src/`                |
| Token usage rules    | `skills/ayingott-design-system/SKILL.md`                     |
| Voice and tone       | `skills/ayingott-design-system/references/voice-examples.md` |
| Live token reference | https://design.ayingott.me                                   |
| Product requirements | `docs/product/needs-v0.1.md` v0.1                            |
| Product decisions    | `docs/product/decisions/index.md` (AY-D-01~19)               |
| Site agent guide     | `CLAUDE.md` / `AGENTS.md`                                    |
