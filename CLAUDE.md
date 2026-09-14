# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing site for **Future AI Video Labs** (AI-assisted audiovisual production studio). Content is in **Brazilian Portuguese**; code identifiers and comments are in English. Built with TanStack Start (SSR) + React 19 + Tailwind v4 + shadcn/ui.

Product facts — audience, positioning, and what the page may and may not claim — live in [PRODUCT.md](PRODUCT.md). Read it before changing copy: the portfolio videos are the only real proof on hand, and no client names, metrics, or certifications exist to cite.

## Commands

```sh
bun install          # bun.lock is the committed lockfile
bun run dev          # vite dev server
bun run build        # production build (nitro, cloudflare target by default)
bun run build:dev    # build in development mode
bun run preview      # serve the production build
bun run lint         # eslint (prettier runs as an eslint rule — lint fails on format drift)
bun run format       # prettier --write .
bun run test         # vitest run (src/**/*.test.ts)
```

Vitest uses its own `vitest.config.ts`, which deliberately skips the Lovable/Start plugin stack from `vite.config.ts`. The live Resend test in `src/lib/contact.server.test.ts` runs only when `RESEND_API_KEY` is set (e.g. in `.env.local`) and sends only to Resend's `delivered@resend.dev` test inbox.

## Architecture

### Request path (SSR)

`src/server.ts` → `@tanstack/react-start/server-entry` → `src/start.ts` middleware → router.

Three layers exist purely to stop a thrown error from becoming a blank page or an opaque h3 JSON 500:

- `src/server.ts` is the custom server entry (wired in via `vite.config.ts`'s `tanstackStart.server.entry`). It imports `src/lib/error-capture.ts` for its side effect, then detects h3's swallowed-error body (`{"unhandled":true,"message":"HTTPError"}`) and rewrites it into the HTML from `src/lib/error-page.ts`.
- `src/start.ts` defines `startInstance` with a request middleware that catches non-HTTP errors and returns the same error page. **Creating this file opts out of Start's automatic CSRF middleware**, so `createCsrfMiddleware` is re-added explicitly there — don't remove it.
- `src/routes/__root.tsx` holds the client-side `errorComponent` / `notFoundComponent`, reporting through `src/lib/lovable-error-reporting.ts`.

### Routing

File-based, TanStack Start conventions only — see [src/routes/README.md](src/routes/README.md) for the file→URL table. `src/routeTree.gen.ts` is generated; never edit it. Never introduce `src/pages/` or `app/layout.tsx` (Next.js/Remix conventions).

`src/router.tsx` creates a fresh `QueryClient` per request and passes it as router context; `__root.tsx` reads it via `Route.useRouteContext()` and mounts `QueryClientProvider`. `<Outlet />` in the root component is required.

### Vite config

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which **already bundles** tanstackStart, viteReact, tailwindcss, tsconfigPaths, nitro, devtools, the `@` alias and React/TanStack dedupe. Adding any of those plugins manually breaks the app with duplicates. Extra config goes through `defineConfig({ vite: { ... } })`.

### Styling

Tailwind v4, configured entirely in `src/styles.css` (no `tailwind.config.js`). The design system is:

- OKLCH CSS variables on `:root` for a **dark-only** palette, plus brand tokens `--violet`, `--cyan`, `--ember`, `--surface`, `--surface-strong`, exposed to Tailwind through `@theme inline`.
- Fonts: `font-display` (Outfit) for headings, `font-sans` (Manrope) for body, loaded from Google Fonts in `__root.tsx`.
- Custom `@utility` classes: `container-x`, `btn-primary`, `btn-ghost`, `hairline`, `reveal`. The page deliberately has **no** gradient text, eyebrow/kicker labels above headings, aurora or glow backgrounds, glass cards, or decorative section numbers — they were removed as the generic "AI startup" look (see `.impeccable/critique/`). Don't reintroduce them. Emphasis comes from size, weight, and the `ember` accent, which is reserved for the curation gate.
- Keep text at `white/60` or above on the dark background (`/55` is the floor for 12px metadata); lower alphas fail WCAG AA.
- `reveal` pairs with `<Reveal>` through `data-hidden`: content renders visible on the server and before hydration, and only elements that start below the fold are hidden on mount and revealed on scroll. Reduced motion skips it entirely. Use it only for list items and the gate's own statements: ordinary text blocks don't animate, and neither does the contact section, because visitors often arrive there by anchor jump and must land on settled content. Each variant has a role:
  - `rise`: blocks and list items (the default);
  - `fade`: large blocks;
  - `wipe`: reserved for the curation gate's own statements.
- The `wipe` variant clips the Reveal's **child**, never the Reveal itself. Chrome's IntersectionObserver honours the target's own `clip-path`, so a fully clipped target never counts as on screen and stays hidden forever.
- **Motion system.** The page has one authored moment, the approval sequence: `flow-step`, `gate-approve`, `gate-underline` and `rise-in` in `styles.css`, timed by `flowDelay()` in `sections.tsx`.
  - It runs once on load, in CSS only. Every keyframe animates *from* a start state, so the resting style is the final one and the page is complete without JS.
  - The `h1` itself never animates, so LCP is not delayed.
  - Everything else is feedback or continuity: the method rail, the dialog entrance and the prefill highlight.
  - Every animation needs a `prefers-reduced-motion` path.

### Components

- `src/components/ui/` — shadcn/ui (new-york style, slate base). Add components with the shadcn CLI; aliases are in `components.json`.
- `src/components/site/` — this site's own layer. `sections.tsx` exports the landing-page sections (`Hero`, `About`, `Services`, `Method`, `Ethics`, `FinalCta`) as named exports from one file. There is no Technology section: technology and the research lines live inside the Produção step of `Method`, where the `#tecnologia` and `#pesquisa` anchors now point. `GATE_STEP` names the Curadoria step that the hero flow and the method cards single out. Section order lives in `src/routes/index.tsx`, which also owns the page's meta tags and JSON-LD.
- `portfolio.ts` holds the client pieces (`PORTFOLIO`: video, poster frame, and the contact-form service each one maps to). It also exports `openPortfolioPiece(id)`, a window event that lets `Services` open a piece in the `Showcase` dialog. Every frente with a matching piece links to it.
- `Showcase.tsx` plays the client videos from `public/videos/portfolio/`. Its dialog handles Esc, traps Tab, and returns focus to the opening card — except when the visitor leaves through the contact link. That link ("Falar sobre este formato") preselects the piece's service and suggests a message in the contact form through `contact-prefill.ts`, a window event, so the two components share no state; a message the visitor already typed is never overwritten.
- `HeroReel` (in `sections.tsx`) autoplays one client film only on screens ≥1024px, with no reduced motion and no data saver, and only after `load` and after the approval sequence has finished (`FLOW_END_MS`), so the two never compete for attention. It pauses while off screen, and a pause the visitor chose survives scrolling. Everywhere else `preload="none"` keeps the file from downloading and the poster frame (`corporate-poster.jpg`) stands in. Keep its pause button: WCAG 2.2.2 requires one for motion longer than 5 s.

### Contact form (Resend)

`FinalCta` renders `ContactForm.tsx` (react-hook-form + zod) → `sendContactMessage` server function (`src/lib/contact.functions.ts`) → `handleContactSubmission` (`src/lib/contact.server.ts`) → Resend SDK. `src/lib/contact.ts` holds the zod schema shared by client and server, plus the service options; `src/lib/contact-email.ts` builds the HTML/text emails.

- Env vars (see `.env.example`; local values go in `.env.local` or `.env`, both git-ignored): `RESEND_API_KEY` (required, or the form answers "unavailable"), `CONTACT_FROM_EMAIL` (defaults to `DEFAULT_CONTACT_FROM`; must be on a domain verified in Resend), `CONTACT_TO_EMAIL` (comma-separated, defaults to `DEFAULT_CONTACT_TO`), `CONTACT_SEND_CONFIRMATION`. `serverEnv()` merges `process.env` with Cloudflare's `globalThis.__env__` bindings.
- Spam handling is silent: a filled `website` honeypot or `elapsedMs < MIN_FILL_MS` returns `{ ok: true }` without sending. `submissionId` is the Resend idempotency key, so retries of one message never duplicate.
- The visitor confirmation email must never echo submitted text: its recipient is visitor-supplied, so echoing would turn the form into an open relay.
- Only reach `contact.server.ts` through the server function; the Start compiler strips it from the client bundle.

## TypeScript

`strict` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature`. Array indexing yields `T | undefined` and optional props reject explicit `undefined` — write for that rather than casting around it.

Do not import `server-only` (an eslint rule blocks it); use a `*.server.ts` filename or `@tanstack/react-start/server-only`.

## Lovable sync

This project is connected to [Lovable](https://lovable.dev) (see [AGENTS.md](AGENTS.md)). Never rewrite published git history — no force push, rebase, amend, or squash of pushed commits — it destroys the user's Lovable project history. Keep the connected branch in a working state, since pushes sync back into the editor.

`bunfig.toml` sets `minimumReleaseAge = 86400` as a supply-chain guard. Confirm with the user before adding any package to `minimumReleaseAgeExcludes`.
