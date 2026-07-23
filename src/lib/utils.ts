export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function escapeXml(value: string): string {
  return escapeHtml(value);
}

export function renderLines(lines: readonly string[]): string {
  return lines.map((line) => escapeHtml(line)).join("<br>");
}
