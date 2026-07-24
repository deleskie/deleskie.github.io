import type { siteContent } from "../../content/site";
import { escapeHtml, renderLines } from "../../lib/utils";
import type { PublicEnvironment } from "../../lib/env";
import { renderBrandLockup, renderSigil } from "./mark";

type Content = typeof siteContent;

export function renderDocumentHead(
  content: Content,
  environment: PublicEnvironment,
  options: {
    title?: string;
    description?: string;
    path?: string;
    analyticsMarkup?: string;
  } = {},
): string {
  const title = options.title || content.metadata.title;
  const description = options.description || content.metadata.description;
  const path = options.path || "";
  const canonical = `${content.brand.canonicalBaseUrl}${path}`;
  const robots = environment.indexable
    ? "index, follow"
    : "noindex, nofollow, noarchive, nosnippet";

  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#050505">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(content.metadata.keywords.join(", "))}">
  <meta name="robots" content="${robots}">
  <meta name="googlebot" content="${robots}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="icon" href="/cyberpunk/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/cyberpunk/site.webmanifest">
  <link rel="stylesheet" href="/cyberpunk/assets/site.css">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(content.brand.name)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(content.brand.canonicalBaseUrl)}/opengraph-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(content.metadata.ogAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(content.brand.canonicalBaseUrl)}/opengraph-image.png">
  <title>${escapeHtml(title)}</title>
${options.analyticsMarkup ? `  ${options.analyticsMarkup}\n` : ""}</head>`;
}

export function renderHeader(
  content: Content,
  options: { compact?: boolean } = {},
): string {
  const navItems = options.compact
    ? `<a class="header-back" href="/cyberpunk/">${escapeHtml(content.brand.product)}</a>`
    : `<nav class="site-nav" id="site-navigation" aria-label="${escapeHtml(content.navigation.menuLabel)}">
        <ul>
          ${content.navigation.items
            .map(
              (item) =>
                `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`,
            )
            .join("")}
        </ul>
        <a class="nav-access" href="#access" data-access-trigger>${escapeHtml(content.navigation.accessLabel)}</a>
      </nav>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" data-open-label="${escapeHtml(content.navigation.openMenu)}" data-close-label="${escapeHtml(content.navigation.closeMenu)}">
        <span data-menu-label>${escapeHtml(content.navigation.openMenu)}</span>
        <span class="menu-toggle__lines" aria-hidden="true"><i></i><i></i></span>
      </button>`;

  return `<header class="site-header" data-header>
    <div class="site-header__inner">
      ${renderBrandLockup(content.brand.name, content.brand.markLabel)}
      ${navItems}
    </div>
  </header>`;
}

export function renderFooter(content: Content): string {
  const year = new Date().getUTCFullYear();

  return `<footer class="site-footer">
    <div class="site-footer__top">
      <div class="footer-brand">
        ${renderSigil(undefined, "footer-sigil")}
        <div>
          <strong>${escapeHtml(content.brand.name)}</strong>
          <span>${escapeHtml(content.footer.descriptor)}</span>
        </div>
      </div>
      <nav aria-label="${escapeHtml(content.navigation.footerLabel)}">
        <ul>
          ${content.footer.links
            .map(
              (item) =>
                `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
            )
            .join("")}
        </ul>
      </nav>
    </div>
    <div class="footer-statement">
      <p>${renderLines(content.footer.line)}</p>
    </div>
    <p class="footer-legal">${escapeHtml(content.footer.legal)}</p>
    <div class="site-footer__base">
      <span>© ${year} ${escapeHtml(content.brand.name)}</span>
      <span>${escapeHtml(content.footer.microcopy)}</span>
    </div>
  </footer>`;
}

export function renderGrainOverlay(): string {
  return '<div class="page-grain" aria-hidden="true"></div>';
}
