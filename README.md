# Hark Digital — 2026 Website (V2)

**This is the v2 working copy** — the original build is preserved untouched in `../site`.
V2 adds: long-form SEO/GEO content + FAQs + structured data on every service page
(`src/data/serviceContent.ts`), a Services dropdown in the nav, and TV-static page
transitions (`src/components/site/RouteStatic.tsx`). Dev server: port 5173 (Vite default).

Dark, agency-style one-pager built with **Vite + React 19 + TypeScript + Tailwind CSS v4**,
plus a custom canvas particle engine that replaces the old Unicorn.Studio embed.

## Run it

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Pages

- `/` — the main site (hero, work, services, security, testimonials, contact)
- `/work` — dynamic portfolio: all 15 clients, filterable by industry sector
  (`src/pages/Portfolio.tsx`), animated grid.
- `/contact` — contact page with the form (`src/pages/ContactPage.tsx`). All
  "Say hello" and "Start a project" CTAs link here.
- `/services/<slug>` — one page per service, each with its own themed canvas
  animation. Slugs: `software-development · web-design · ecommerce · seo-geo ·
  page-speed · ai-consulting · aerial-media · hack-remediation · security ·
  ada-accessibility`.
  Copy lives in `src/data/servicePages.ts`; the animations in `src/components/scenes/`.
  Aerial lives under Services (no standalone nav item or homepage section).
- `/lab` — the **Logo Lab**: twelve particle interpretations of the logo mark, all
  cursor-interactive. Deep-link a variant with `/lab?v=vortex`
  (`assemble · ember · constellation · vortex · filings · erode · matrix ·
  fireworks · aurora · ripple · fireflies` — the last five adapted from the
  Backgrounds folder components).

## The particle logo (Unicorn.Studio replacement)

Everything lives in `src/lib/particles/` and `src/components/logo/`:

- `logo.ts` — embeds `Logo Piece.svg`, rasterizes it offscreen, and samples opaque
  pixels into particle positions. No external libraries.
- `useParticleCanvas.tsx` — shared canvas runner (DPR-aware, pauses offscreen,
  honors `prefers-reduced-motion`, touch + mouse).
- `Logo*.tsx` — the six variants.

**To change which variant the hero uses:** edit `src/sections/Hero.tsx` and swap
`<LogoGlow …/>` for any other variant (e.g. `<LogoVortex …/>`). The footer uses
`LogoConstellation` the same way.

## Content lives in data files

- `src/data/services.ts` — the ten services (home page list)
- `src/data/servicePages.ts` — full copy for each service page (headline, features, process, stats, CTA)
- `src/data/work.ts` — all 15 portfolio items (flip `featured` to promote/demote a card)
- `src/data/testimonials.ts` — client quotes (from the old site's reviews)

Portfolio screenshots are in `public/work/*.webp` (1280×800). To refresh one:

```bash
node scripts/shoot.mjs https://example.com public/work/example.png --w=1600 --h=1000
# then convert to webp at 1280x800
```

## Design tokens

Colors and fonts are Tailwind v4 `@theme` tokens in `src/index.css`.
Single accent — `--color-signal` (#00ff85 green) — on `--color-ink` (#0d0d0d) and
`--color-paper` (#fff). Fonts: **Syne** (display), **Instrument Sans** (body),
**DM Mono** (labels).

## Contact form (SendGrid)

The `/contact` form POSTs JSON to `/api/contact`, a serverless function in
[`api/contact.ts`](api/contact.ts) that sends the message with SendGrid.

Set these env vars in your host (never expose the API key to the browser):

```
SENDGRID_API_KEY=SG.xxxx          # your SendGrid key
CONTACT_TO_EMAIL=mike@hark.digital
CONTACT_FROM_EMAIL=noreply@hark.digital   # must be a verified SendGrid sender
```

See `.env.example`. On **Vercel** the function is auto-detected; run `vercel dev`
to test the endpoint locally (plain `npm run dev` has no `/api`, so the form shows
its error state and points people to the direct email — that's expected). On
**Netlify**, move the handler to `netlify/functions/contact.ts`. The form includes
a honeypot field and server-side validation for spam/garbage.

## Deploying

`npm run build`, then host `dist/` anywhere static. The app has client-side routes
(`/work`, `/contact`, `/services/*`, `/lab`), so serve `index.html` for unknown
paths — `vercel.json` already does this (Netlify: `_redirects` with `/* /index.html 200`).
For the contact form you need a host that runs the `api/` function (Vercel/Netlify).

## Notes

- `scripts/shoot.mjs` is a dev-only screenshot helper (needs Chrome installed).
- The `?autopilot` URL param on any page drives a synthetic cursor through the
  particle scenes — useful for automated screenshots.
