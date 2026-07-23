import type { PublicEnvironment } from "./env";

const DEFAULT_PLAUSIBLE_SCRIPT = "https://plausible.io/js/script.js";

export function renderAnalyticsMarkup(environment: PublicEnvironment): string {
  if (
    environment.analyticsProvider !== "plausible" ||
    !environment.analyticsDomain
  ) {
    return "";
  }

  const domain = escapeAttribute(environment.analyticsDomain);
  const source = escapeAttribute(
    environment.analyticsScriptUrl || DEFAULT_PLAUSIBLE_SCRIPT,
  );

  return `<script defer data-domain="${domain}" src="${source}"></script>`;
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
