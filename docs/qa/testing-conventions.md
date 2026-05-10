# QA Testing Conventions

Production smoke testing methodology for ayingott.me. Owned by @QA and @QAClaude.

---

## HTTP smoke testing

### User-facing routes (HTML responses)

When validating pages that real users visit via a browser, always send an explicit `Accept: text/html` header. The site runs on Nitro (Cloudflare Pages Worker), which performs content negotiation: browsers receive SSR HTML, while programmatic clients without an explicit `Accept` header receive a JSON error object from the standard Nitro error handler.

```bash
# Correct: browser-equivalent smoke
curl -si -H "Accept: text/html" https://ayingott.me/<path>
# Expect: HTTP 2xx/3xx/4xx + content-type: text/html

# Incorrect for user-facing validation: omitting Accept header
curl -si https://ayingott.me/<path>
# Returns: application/json (Nitro default for */*) — not what users see
```

**Applies to**: all routes including 404 fallback paths. Example:

```bash
# Verify 404 page returns brand HTML, not JSON
curl -si -H "Accept: text/html" https://ayingott.me/nonexistent-path
# Expect: HTTP 404 + content-type: text/html;charset=utf-8
# Expect: response body contains brand header (site-header, aria-label="Lo", etc.)
```

**Origin**: DD-011 (2026-05-10) — production `/404` was initially reported as returning JSON. Root cause was curl's default `Accept: */*` triggering Nitro's API JSON branch. Browsers correctly receive SSR HTML. Closed as testing artifact; this convention prevents future false alarms.

---

### API / programmatic behavior

When validating Nitro's JSON error responses (e.g. for API consumers):

```bash
# Default curl sends Accept: */* — exercises the JSON error branch
curl -si https://ayingott.me/<path>
# Returns: application/json error object (standard Nitro behavior)
```

---

### a11y attribute checks in HTML smoke

When verifying accessibility attributes in SSR output, use Python or `grep` on the raw HTML body rather than browser-level tools:

```bash
curl -s -H "Accept: text/html" https://ayingott.me/ | python3 -c "
import sys, re
html = sys.stdin.read()
# Example: verify Lo mark link
m = re.search(r'<a[^>]*aria-label=\"Lo\"[^>]*>', html)
print('✅ Lo mark link found' if m else '❌ Lo mark link missing')
"
```

---

## CSS / asset smoke

Generated CSS is in content-hashed external files (`/_nuxt/entry.<hash>.css`), not inline in the HTML. Verify CSS rules by fetching the CSS bundle directly:

```bash
# Find CSS file
CSS=$(curl -s -H "Accept: text/html" https://ayingott.me/ | \
  grep -oE '/_nuxt/entry\.[^"]+\.css' | head -1)

# Check for a specific rule
curl -s "https://ayingott.me${CSS}" | grep "view-transition"
```

---

## Cloudflare Pages PR previews

Each PR branch gets a Cloudflare Pages preview URL. Retrieve it from PR comments:

```bash
gh api "repos/LoTwT/ayingott.me/issues/<PR_NUMBER>/comments" \
  --jq '.[].body' | grep "Preview URL"
```

Run smoke against the preview URL using the same conventions above before merging.
