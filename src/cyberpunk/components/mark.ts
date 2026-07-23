import { escapeHtml } from "../../lib/utils";

export function renderSigil(
  accessibleLabel?: string,
  className = "sigil",
): string {
  const accessibility = accessibleLabel
    ? `role="img" aria-label="${escapeHtml(accessibleLabel)}"`
    : 'aria-hidden="true" focusable="false"';

  return `<svg class="${className}" viewBox="0 0 40 40" ${accessibility}>
    <path d="M8 6.5 31 33.5" />
    <path d="M31.5 6 8.5 34" />
    <path d="M3.5 21.5 36.5 17.5" />
    <path d="M20.5 2.5 18.5 37.5" />
  </svg>`;
}

export function renderBrandLockup(name: string, label: string): string {
  return `<a class="brand-lockup" href="/cyberpunk/" aria-label="${escapeHtml(name)} home">
    ${renderSigil(undefined, "brand-sigil")}
    <span>${escapeHtml(name)}</span>
    <span class="sr-only">${escapeHtml(label)}</span>
  </a>`;
}
