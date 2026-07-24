# PROJECT SABLE / SYSTEM 001

This repository contains several static sites. The Project Sable teaser is an
additive, self-contained experience at `/cyberpunk/`; it does not replace the
existing `deleskie.com` pages.

Project Sable is a private-development teaser for an ultra-luxury technical
garment system. The public experience intentionally separates a globally
oriented non-ballistic shell from any future jurisdiction-controlled
configuration. It includes no ecommerce or protective-product checkout.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer

## Local development

```sh
npm install
npm run build:cyberpunk
npm run dev:cyberpunk
```

Open `http://127.0.0.1:8124/cyberpunk/`. In development, when Supabase is not
configured, sanitized access requests are written to
`.data/access-requests.jsonl`. The `.data` directory is ignored by Git.

## Project commands

```sh
npm run format
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` preserves the repository’s existing Miami generation and
validation tasks, then generates the Project Sable route and a
Cloudflare-compatible `dist/` package for private Sites previews. The browser
suite starts its own local server.

## Environment variables

Copy `.env.example` to `.env.local` for reference. The custom local server does
not automatically load dotenv files, so export variables in the shell or use
your deployment platform’s environment settings.

| Variable                           | Purpose                                                                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_INDEXABLE`            | Defaults to `false`. Set to `true` to generate indexable metadata, allow the route in root robots policy, and create the Project Sable sitemap. |
| `NEXT_PUBLIC_SITE_URL`             | Canonical base URL for the route, without a trailing slash.                                                                                     |
| `NEXT_PUBLIC_CONTACT_EMAIL`        | Public contact address shown in the footer and privacy notice.                                                                                  |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`   | `none` by default; `plausible` enables optional cookieless analytics when a domain is also configured.                                          |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN`     | Domain sent to the optional analytics script.                                                                                                   |
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | Optional self-hosted or approved Plausible-compatible script URL.                                                                               |
| `SUPABASE_URL`                     | Server-only Supabase project URL.                                                                                                               |
| `SUPABASE_SERVICE_ROLE_KEY`        | Server-only service-role credential. Never prefix this variable with `NEXT_PUBLIC_`.                                                            |
| `PORT`                             | Optional local development port; defaults to `8124`.                                                                                            |

The default build creates no cookies and loads no analytics. Enabling analytics
does not add a cookie banner because only a privacy-first, cookieless provider
is supported.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in its SQL editor.
3. Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` only in the
   server-side deployment environment.
4. Deploy the server function at `/api/access`.

The access table has row-level security enabled and grants no browser roles.
The service-role key stays on the server. Email is unique, and duplicate
submissions receive the same public success response as new submissions.

When no production provider is configured, the API returns HTTP 503 and the
form reports that the private channel is temporarily unavailable. It never
pretends a request was recorded. The included rate limiter is intentionally
same-process and development-only. Enforce production limits at the CDN, edge,
reverse-proxy, or platform firewall layer.

## Editing brand and copy

All public brand names, metadata, navigation labels, headlines, body copy,
status labels, legal language, form labels, form options, and public form
messages live in `src/content/site.ts`. Change the working name, product
designation, contact address fallback, or any copy there, then run
`npm run build:cyberpunk`.

The founder note is controlled by `siteContent.founderNote.enabled` in the same
file. Set it to `false` to remove the section without changing the renderer.

Environment values can override the canonical URL and contact address at build
time. Generated files under `cyberpunk/` should not be edited directly.

## Artwork

The abstract garment is original inline SVG assembled by
`src/cyberpunk/components/garment-visual.ts` and styled in
`src/cyberpunk/site.css`. Replace that component to change the form while
preserving its accessible title and description, restrained callouts, mobile
simplification, and non-instructional abstraction.

The four-line temporary sigil is defined in
`src/cyberpunk/components/mark.ts`; standalone mark, favicon, and manifest icon
sources live in `src/cyberpunk/assets/`. The page grain is a low-opacity SVG
texture generated in the repository. No stock media or remote fonts are used.

## Indexing and metadata

`NEXT_PUBLIC_INDEXABLE` is false by default. The generated pages include
`noindex, nofollow`, the root robots file disallows `/cyberpunk/`, and no
Project Sable sitemap is created. Set the variable to `true` for the production
build to switch the page metadata and robots policy and generate
`/cyberpunk/sitemap.xml`.

The build also generates the favicon, web manifest, Open Graph metadata,
original Open Graph artwork, route robots file, and intentional Project Sable
404 page.

## Deployment

The static route works on any static host. The complete access channel requires
a server runtime for `api/access.ts`; Vercel can run it directly. A conventional
Node deployment can reuse `handleAccessRequest` from
`src/lib/waitlist/http.ts`. Cloudflare deployments should adapt that thin HTTP
wrapper to a Worker while preserving the schema and provider abstraction. The
repository includes that deployment adapter in `src/sites-worker.ts`, and
`npm run build:sites` bundles it with the generated route.

`vercel.json` supplies the route’s CSP, HSTS, content-type, referrer,
permissions, opener, and frame restrictions. If another platform is used,
reproduce those headers at the edge. The CSP intentionally avoids
`unsafe-eval` and `unsafe-inline`.

## Security and privacy limitations

- The default site uses no cookies, fingerprinting, advertising, session
  replay, or cross-site tracking.
- Input is parsed through a strict Zod schema; unknown JSON fields are rejected.
- Request bodies and strings are size-limited.
- The client receives no provider errors, stack traces, or duplicate-account
  signal.
- Complete visitor IP addresses are not stored with requests.
- The development file provider is never selected when `NODE_ENV` is
  production.
- The in-memory development rate limiter is not sufficient for a distributed
  production deployment.
- Operational access control, key rotation, backups, deletion workflows,
  abuse monitoring, and CDN rate limits remain deployment responsibilities.

## Claim-language restrictions

Public copy must not state or imply completed certification, guaranteed
performance, commercial availability, or a specific RF, ballistic, stab,
weather, or environmental rating without an approved configuration-specific
test record. Keep the global shell explicitly non-ballistic and treat any
future controlled configuration as legally and technically separate. Do not
add manufacturing guidance, tactical imagery, ecommerce, or protective-product
checkout.
