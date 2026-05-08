# ayingott.me · UX Design v0.1

- Status: v0.1 (S2 deliverable)
- Owner: @UX
- Drafted: 2026-05-07
- Stage: DD-005 S2 (design language reconstruction + UI spec)
- Inputs: `docs/product/needs-v0.1.md` v0.1 + AY-D-01~19 + `@ayingott/theme` V0 (LoTwT/design-system pinned to `f8c1d8e`) + `skills/ayingott-design-system/SKILL.md` (LoTwT/design-system)

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

`/now`, `/uses`, and resume PDF download are explicitly deferred to V1.x. The home page may carry a one-line "now" entry or a single-button resume entry when AY-D-08 conditions are met.

### 3.2 Navigation

- **Primary nav**: lives in the `home` layout header. Three links: `Home / About / Blog`. Plus a theme toggle.
- **Secondary nav**: none. No footer link farm. The footer carries copyright, license, and a one-line site identity.
- **Active state**: the current route's link uses `var(--text-accent)`; siblings use `var(--text-primary)` with hover lifting to `var(--accent-primary-hover)`.
- **Mobile**: nav links collapse to a horizontal strip below the title block, not a hamburger. Three labels fit horizontally on a 360px viewport.

### 3.3 SEO meta defaults

Every page sets:

- `<title>` → page-specific. Home: `ayingott.me`. About: `About · ayingott.me`. Blog list: `Blog · ayingott.me`. Blog post: `<post title> · ayingott.me`. 404: `Not found · ayingott.me`.
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

---

## 4. Page wireframes

Wireframes describe block composition and token usage. They are not pixel mockups — pixel-level visuals are produced via §7 prompt pack and reviewed in critique loop.

Each block lists its semantic vars, spacing, and accessibility role. Anything not listed inherits page defaults.

### 4.1 Home (`/`)

**Purpose**: identity card. The visitor lands and within one screen knows who this is and where to go next.

**Block layout (top to bottom)**:

```
┌─────────────────────────────────────────────────────┐
│  Header                                             │
│  ┌────────────────────────┐  ┌──────────────────┐   │
│  │ Site title (text mark) │  │ Nav · Theme tog. │   │
│  └────────────────────────┘  └──────────────────┘   │
│                                                     │
│  Signature block                                    │
│  ┌─────────────────────────────────────────────┐    │
│  │ "Hi, I'm 龙."  (display, 5xl)               │    │
│  │ tagline (body, lg, --text-secondary)        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Interests strip (3–4 chips, single row)            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│  │chip │ │chip │ │chip │ │chip │                    │
│  └─────┘ └─────┘ └─────┘ └─────┘                    │
│                                                     │
│  Optional: now entry (one line, --text-muted)       │
│                                                     │
│  Optional: resume entry (single button)             │
│                                                     │
│  Contact strip (4 inline icons + labels)            │
│  GitHub  ·  X  ·  Email  ·  RSS (when blog posts)   │
│                                                     │
│  Footer (copyright · license · identity)            │
└─────────────────────────────────────────────────────┘
```

**Token references**:

- Page background → `var(--surface-canvas)`.
- Header height: 64px. Padding: `var(--layout-page-gutter)`.
- Site title font: `var(--font-display)`, weight 500, size `var(--text-xl)`. Cursor default; not a link.
- Signature display copy uses `var(--font-display)` weight 700 at `var(--text-5xl)` with paired line-height. Letter-spacing `var(--tracking-tight)`.
- Tagline uses `var(--font-sans)` at `var(--text-lg)`, color `var(--text-secondary)`.
- Interests chips: `var(--surface-subtle)` background, `var(--text-primary)` text, 1px `var(--border-subtle)` border, `var(--radius-full)` corners, `var(--spacing-2)` block padding, `var(--spacing-3)` inline padding, `var(--font-mono)` at `var(--text-xs)` with `var(--tracking-wide)`.
- Contact strip icons sit at 24×24, inline SVG, `currentColor`. The strip uses `var(--spacing-4)` between items.
- Footer text: `var(--text-muted)` at `var(--text-xs)`.

**Behavior**:

- Hover on chip: `transform: translateY(-1px)`, `box-shadow: var(--shadow-md)`. No color change.
- Hover on contact icon: `transform: scale(1.1)`, color shifts to `var(--text-accent)`. Transition uses `var(--transition-interactive)`.
- Nav theme toggle uses the existing component from S1, retokenized to V0 semantic vars.

**Decoration**:

- Place 1 dot (8px) and 1 line (40×2) primitive at the top-right of the signature block. Color `var(--accent-primary)`. See §5.

**Conditional rendering**:

- Resume entry renders only when `siteConfig.public.resumePdfUrl` is truthy (AY-D-08).
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
│  │ "About"  (display, 4xl)              │   │
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

- Place 1 outlined-circle primitive (24×24, 1.5px stroke, `currentColor` → `var(--accent-primary)`) in the top-right margin of the page title block. No other decoration on this page; the bio prose stays clean.

### 4.3 Blog list (`/blog`)

**Purpose**: reverse chronological index of posts. V1 may ship empty; the empty state is part of the spec.

**Block layout (with posts)**:

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│                                             │
│  Page title block                           │
│  ┌──────────────────────────────────────┐   │
│  │ "Blog"  (display, 4xl)               │   │
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
│  │ "No posts yet."                      │   │
│  │ "First entry will land here when it  │   │
│  │  is ready. Subscribe is not yet live │   │
│  │  — checking back occasionally is the │   │
│  │  flow for V1."                       │   │
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

- Place 1 dot primitive between post rows as a visual rhythm anchor (centered horizontally, `--spacing-4` block padding, `var(--accent-primary)` color). Skip if total post count is less than three; the empty state has its own decoration.
- Empty state: place 1 rotated-square primitive in the top-right of the empty state block.

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
│  │ "Not found." (display, 2xl)          │   │
│  │ subtitle (sans, base, --text-muted)  │   │
│  │ ┌────────────────────────┐           │   │
│  │ │ Back to home (button)  │           │   │
│  │ └────────────────────────┘           │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

**Token references**:

- "404" digit uses `var(--font-display)` weight 700 at `var(--text-7xl)`, color `var(--accent-primary)`, `letter-spacing: var(--tracking-tighter)`.
- Subtitle copy: a single sentence, sentence case, no apology language. Example: "The page is not there. The home page is."
- Button: primary surface, `var(--accent-primary)` background, `var(--accent-contrast)` text (deep-lavender near-black, AA-verified at 5.50:1 light / 8.56:1 dark), `var(--radius-control)`, `var(--font-display)` weight 500, `--transition-interactive`. Min-height `--touch-target-min` (44px). White / `--text-inverse` is **not** an option on `--accent-primary` in V0 — that pair fails AA at 2.86:1.
- Vertical centering uses CSS grid; the centered block sits at roughly 30% from the top, leaving headroom for the header.

**Decoration**:

- Place 1 line primitive (40×2) directly under the "404" digit, color `var(--accent-primary)`. No other decoration.

---

## 5. Decoration placement rules

The four geometric primitives from `@ayingott/theme` spec §5.3 (8×8 dot, 40×2 line, 24×24 outlined circle, 16×16 rotated square within 20×20 viewBox) are the brand's only "iconography substitute". V0 does not ship them as files; ayingott.me reproduces them inline as needed.

**Where to place**:

- Top-right margin of page title blocks (Home signature, About title, Blog list title). One primitive, never two.
- Visual rhythm between long lists (every Nth row, where N ≥ 3). Centered horizontally, dot or line only.
- 404 page under the digit, line only.

**Where not to place**:

- Inside body prose. Decoration belongs to layout chrome, not reading flow.
- Inside cards. Cards have their own visual weight from shadow and border; adding decoration overloads them.
- Full-bleed pattern fills. The motif is sparse seasoning, never pattern.

**Color and inheritance**:

- Use `currentColor` on the SVG. Set the parent's `color` property to `var(--accent-primary)` on light surfaces or `var(--text-accent)` on dark.
- Never hardcode `#9c8fd9` or any lavender hex inside the SVG markup.

**Density rule of thumb**:

- One primitive per page section. If you find yourself placing more than three across the visible viewport, the design has lost focus.

**Animation**:

- V1 ships static decoration only. No floating, fading, or rotating motion. The skill explicitly defers the "float-gentle" recipe to consumer responsibility, and ayingott.me opts out for V1.

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

- All interactive elements have a hit area of at least 44×44 CSS px on touch devices. Use the V0 `touch-target` utility for compact icons (contact strip, theme toggle, decoration triggers) so the target inflates without changing visual size.
- Inline links inside prose are exempt (per WCAG 2.5.5 inline-text exception), but standalone link icons are not.

QA evidence: device emulation at 360px width, manual hit-test on all standalone interactive elements.

---

## 7. Mockup prompt pack

These are six prompts lo-user can paste into Claude Design / v0.dev / Figma AI (or hand off to a designer) to produce visual mockups. Each prompt is self-contained and produces one page or one cross-cutting deliverable.

The prompt format:

1. Brief — what to produce.
2. Brand anchors — voice, palette, typography, motif.
3. Page-specific blocks — what goes where.
4. Constraints — what the output must avoid.

Run them in order. After each, paste the output into this thread; UX runs critique loop and converges to a TL-implementable mockup.

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
5. Optional resume button: single primary button, lavender background
   (V0 `--accent-primary`), deep-lavender near-black text (V0
   `--accent-contrast`). White text on lavender fails contrast in V0
   and must not be used. Only renders when a PDF link is configured.
6. Contact strip: four inline icons (GitHub, X, email, RSS), 24×24,
   monoline, currentColor.
7. Footer: copyright, license line, site identity. Mono, xs, muted.

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
- [ ] Decoration usage stays within §5 limits (one primitive per page section, never inside prose, never as pattern fill).
- [ ] Voice rules from `skills/ayingott-design-system/references/voice-examples.md` are reflected in copy examples (no emoji, no exclamation, sentence case headings, third person).
- [ ] Five page wireframes accounted for (Home, About, Blog list with two states, Blog detail, 404).
- [ ] Six prompts in §7 are self-contained — none requires reading another prompt to make sense.
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
| Token names and hex  | `@ayingott/theme` `packages/theme/src/` (pinned `f8c1d8e`)   |
| Token usage rules    | `skills/ayingott-design-system/SKILL.md`                     |
| Voice and tone       | `skills/ayingott-design-system/references/voice-examples.md` |
| Live token reference | https://design.ayingott.me                                   |
| Product requirements | `docs/product/needs-v0.1.md` v0.1                            |
| Product decisions    | `docs/product/decisions/index.md` (AY-D-01~19)               |
| Site agent guide     | `CLAUDE.md` / `AGENTS.md`                                    |
