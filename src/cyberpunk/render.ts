import { renderAnalyticsMarkup } from "../lib/analytics";
import { getPublicEnvironment } from "../lib/env";
import { escapeHtml, escapeXml } from "../lib/utils";
import { siteContent } from "../content/site";
import {
  renderDocumentHead,
  renderFooter,
  renderGrainOverlay,
  renderHeader,
} from "./components/chrome";
import {
  renderAccessForm,
  renderArchitecture,
  renderEdition,
  renderHero,
  renderManifesto,
  renderPrinciples,
  renderSignalControl,
} from "./components/sections";
import { renderSigil } from "./components/mark";

const environment = getPublicEnvironment();
const analyticsMarkup = renderAnalyticsMarkup(environment);

export function renderMainPage(): string {
  return `<!doctype html>
<html lang="en" class="no-js">
${renderDocumentHead(siteContent, environment, { analyticsMarkup })}
<body class="sable-site">
  <a class="skip-link" href="#main-content">${escapeHtml(siteContent.navigation.skip)}</a>
  ${renderGrainOverlay()}
  ${renderHeader(siteContent)}
  <main id="main-content">
    ${renderHero(siteContent)}
    ${renderManifesto(siteContent)}
    ${renderPrinciples(siteContent)}
    ${renderArchitecture(siteContent)}
    ${renderSignalControl(siteContent)}
    ${renderEdition(siteContent)}
    ${renderAccessForm(siteContent)}
  </main>
  ${renderFooter(siteContent)}
  <script type="module" src="/cyberpunk/assets/client.js"></script>
</body>
</html>`;
}

export function renderPrivacyPage(): string {
  const page = siteContent.privacy;
  return renderEditorialPage({
    title: `${page.heading} — ${siteContent.brand.name}`,
    description: page.intro,
    path: "/privacy/",
    eyebrow: page.eyebrow,
    heading: page.heading,
    intro: page.intro,
    meta: `${page.updatedLabel} / ${page.updated}`,
    sections: page.sections,
    backLabel: page.backLabel,
  });
}

export function renderLegalPage(): string {
  const page = siteContent.legal;
  return renderEditorialPage({
    title: `${page.heading} — ${siteContent.brand.name}`,
    description: page.intro,
    path: "/legal/",
    eyebrow: page.eyebrow,
    heading: page.heading,
    intro: page.intro,
    sections: page.sections,
    backLabel: page.backLabel,
  });
}

export function renderNotFoundPage(): string {
  const page = siteContent.notFound;
  return `<!doctype html>
<html lang="en" class="no-js">
${renderDocumentHead(siteContent, environment, {
  title: `${page.heading} — ${siteContent.brand.name}`,
  description: page.body,
  path: "/404/",
})}
<body class="sable-site error-page">
  <a class="skip-link" href="#main-content">${escapeHtml(siteContent.navigation.skip)}</a>
  ${renderGrainOverlay()}
  ${renderHeader(siteContent, { compact: true })}
  <main id="main-content" class="error-page__main">
    <div class="error-page__graphic" aria-hidden="true">
      ${renderSigil(undefined, "error-sigil")}
      <span>404</span>
    </div>
    <div class="error-page__copy">
      <p class="section-label"><span aria-hidden="true"></span>${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.heading)}</h1>
      <p>${escapeHtml(page.body)}</p>
      <a class="button button--primary" href="/cyberpunk/">${escapeHtml(page.action)} <span class="button__arrow" aria-hidden="true">↖</span></a>
    </div>
  </main>
  ${renderFooter(siteContent)}
  <script type="module" src="/cyberpunk/assets/client.js"></script>
</body>
</html>`;
}

export function renderManifest(): string {
  return JSON.stringify(
    {
      name: `${siteContent.brand.name} / ${siteContent.brand.product}`,
      short_name: siteContent.brand.name,
      description: siteContent.metadata.description,
      start_url: "/cyberpunk/",
      scope: "/cyberpunk/",
      display: "standalone",
      background_color: "#050505",
      theme_color: "#050505",
      icons: [
        {
          src: "/cyberpunk/icon-192.svg",
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/cyberpunk/icon-512.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any",
        },
      ],
    },
    null,
    2,
  );
}

export function renderOpenGraphImage(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(siteContent.metadata.title)}</title>
  <desc id="desc">${escapeXml(siteContent.metadata.ogAlt)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050505"/>
      <stop offset=".62" stop-color="#0b0c0d"/>
      <stop offset="1" stop-color="#141618"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2=".4">
      <stop offset="0" stop-color="#8d9399" stop-opacity="0"/>
      <stop offset=".48" stop-color="#eceeed" stop-opacity=".62"/>
      <stop offset="1" stop-color="#8d9399" stop-opacity=".08"/>
    </linearGradient>
    <radialGradient id="light" cx=".72" cy=".35" r=".58">
      <stop offset="0" stop-color="#aeb4ba" stop-opacity=".16"/>
      <stop offset="1" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#aeb4ba" stroke-opacity=".18"/>
  <circle cx="875" cy="254" r="330" fill="url(#light)"/>
  <g transform="translate(805 70)" fill="#08090a" stroke="url(#edge)" stroke-width="1.2">
    <path d="M90 130C95 68 127 29 166 29s72 39 77 101l34 27c37 29 55 89 59 170l14 235H-18l14-235c4-81 23-141 59-170z"/>
    <path d="M104 129c7-46 31-73 62-75 31 2 56 29 63 75-22-14-42-20-63-20s-41 6-62 20z" fill="#0d0f10" stroke-opacity=".35"/>
    <path d="M166 151v411M55 157c28 71 29 142 22 231M277 157c-28 71-29 142-22 231" fill="none" stroke="#8d9399" stroke-opacity=".15"/>
  </g>
  <g transform="translate(80 72)" stroke="#aeb4ba" stroke-width="2.2" stroke-linecap="square" fill="none">
    <path d="M8 4l46 54M55 3L9 59M0 34l65-8M34 0l-4 65"/>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" fill="#eceeed">
    <text x="80" y="190" font-size="22" letter-spacing="7" fill="#aeb4ba">${escapeXml(siteContent.hero.eyebrow)}</text>
    <text x="76" y="322" font-size="78" font-weight="600" letter-spacing="-3">${escapeXml(siteContent.brand.tagline)}</text>
    <text x="80" y="385" font-size="25" fill="#d4d7d9">${escapeXml(siteContent.brand.name)} / ${escapeXml(siteContent.brand.product)}</text>
    <text x="80" y="540" font-size="16" letter-spacing="4" fill="#8d9399">${escapeXml(siteContent.metadata.cardDescriptor)}</text>
  </g>
  <path d="M80 438h515" stroke="#aeb4ba" stroke-opacity=".3"/>
</svg>`;
}

export function renderRobots(): string {
  if (!environment.indexable) {
    return `User-agent: *
Disallow: /
`;
  }

  return `User-agent: *
Allow: /

Sitemap: ${siteContent.brand.canonicalBaseUrl}/sitemap.xml
`;
}

export function renderSitemap(): string {
  const base = siteContent.brand.canonicalBaseUrl;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${escapeXml(base)}/</loc></url>
  <url><loc>${escapeXml(base)}/privacy/</loc></url>
  <url><loc>${escapeXml(base)}/legal/</loc></url>
</urlset>
`;
}

function renderEditorialPage(options: {
  title: string;
  description: string;
  path: string;
  eyebrow: string;
  heading: string;
  intro: string;
  meta?: string;
  sections: readonly {
    heading: string;
    paragraphs: readonly string[];
  }[];
  backLabel: string;
}): string {
  return `<!doctype html>
<html lang="en" class="no-js">
${renderDocumentHead(siteContent, environment, {
  title: options.title,
  description: options.description,
  path: options.path,
  analyticsMarkup,
})}
<body class="sable-site editorial-page">
  <a class="skip-link" href="#main-content">${escapeHtml(siteContent.navigation.skip)}</a>
  ${renderGrainOverlay()}
  ${renderHeader(siteContent, { compact: true })}
  <main id="main-content" class="editorial-main">
    <header class="editorial-hero">
      <p class="section-label"><span aria-hidden="true"></span>${escapeHtml(options.eyebrow)}</p>
      <h1>${escapeHtml(options.heading)}</h1>
      <p>${escapeHtml(options.intro)}</p>
${options.meta ? `      <span>${escapeHtml(options.meta)}</span>\n` : ""}
    </header>
    <div class="editorial-sections">
      ${options.sections
        .map(
          (
            section,
            index,
          ) => `<section aria-labelledby="editorial-section-${index + 1}">
            <span class="editorial-sections__index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 id="editorial-section-${index + 1}">${escapeHtml(section.heading)}</h2>
              ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
          </section>`,
        )
        .join("")}
    </div>
    <a class="text-link editorial-back" href="/cyberpunk/">${escapeHtml(options.backLabel)} <span aria-hidden="true">↖</span></a>
  </main>
  ${renderFooter(siteContent)}
  <script type="module" src="/cyberpunk/assets/client.js"></script>
</body>
</html>`;
}
