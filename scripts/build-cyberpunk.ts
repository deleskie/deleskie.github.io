import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

import { getPublicEnvironment } from "../src/lib/env";
import {
  renderLegalPage,
  renderMainPage,
  renderManifest,
  renderNotFoundPage,
  renderOpenGraphImage,
  renderPrivacyPage,
  renderRobots,
  renderSitemap,
} from "../src/cyberpunk/render";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "cyberpunk");
const assetOutput = path.join(outputRoot, "assets");
const sourceRoot = path.join(projectRoot, "src", "cyberpunk");
const sourceAssets = path.join(sourceRoot, "assets");
const environment = getPublicEnvironment();

void main();

async function main(): Promise<void> {
  await Promise.all([
    mkdir(assetOutput, { recursive: true }),
    mkdir(path.join(outputRoot, "privacy"), { recursive: true }),
    mkdir(path.join(outputRoot, "legal"), { recursive: true }),
    mkdir(path.join(outputRoot, "404"), { recursive: true }),
    mkdir(path.join(outputRoot, "marks"), { recursive: true }),
  ]);

  const clientSource = await readFile(
    path.join(sourceRoot, "client.ts"),
    "utf8",
  );
  const compiledClient = ts.transpileModule(clientSource, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
      strict: true,
      removeComments: true,
    },
    fileName: "client.ts",
  });

  await Promise.all([
    writeFile(path.join(outputRoot, "index.html"), renderMainPage(), "utf8"),
    writeFile(
      path.join(outputRoot, "privacy", "index.html"),
      renderPrivacyPage(),
      "utf8",
    ),
    writeFile(
      path.join(outputRoot, "legal", "index.html"),
      renderLegalPage(),
      "utf8",
    ),
    writeFile(
      path.join(outputRoot, "404", "index.html"),
      renderNotFoundPage(),
      "utf8",
    ),
    writeFile(path.join(outputRoot, "404.html"), renderNotFoundPage(), "utf8"),
    writeFile(
      path.join(outputRoot, "site.webmanifest"),
      renderManifest(),
      "utf8",
    ),
    writeFile(
      path.join(outputRoot, "opengraph-image.svg"),
      renderOpenGraphImage(),
      "utf8",
    ),
    copyFile(
      path.join(sourceAssets, "opengraph-image.png"),
      path.join(outputRoot, "opengraph-image.png"),
    ),
    writeFile(path.join(outputRoot, "robots.txt"), renderRobots(), "utf8"),
    writeFile(
      path.join(assetOutput, "client.js"),
      compiledClient.outputText,
      "utf8",
    ),
    copyFile(
      path.join(sourceRoot, "site.css"),
      path.join(assetOutput, "site.css"),
    ),
    copyFile(
      path.join(sourceAssets, "grain.svg"),
      path.join(assetOutput, "grain.svg"),
    ),
    copyFile(
      path.join(sourceAssets, "favicon.svg"),
      path.join(outputRoot, "favicon.svg"),
    ),
    copyFile(
      path.join(sourceAssets, "icon-192.svg"),
      path.join(outputRoot, "icon-192.svg"),
    ),
    copyFile(
      path.join(sourceAssets, "icon-512.svg"),
      path.join(outputRoot, "icon-512.svg"),
    ),
    copyFile(
      path.join(sourceAssets, "sigil.svg"),
      path.join(outputRoot, "marks", "sable-sigil.svg"),
    ),
  ]);

  const sitemapPath = path.join(outputRoot, "sitemap.xml");
  if (environment.indexable) {
    await writeFile(sitemapPath, renderSitemap(), "utf8");
  } else {
    await rm(sitemapPath, { force: true });
  }

  await updateRootRobots(environment.indexable);

  process.stdout.write(
    `Built /cyberpunk with indexing ${environment.indexable ? "enabled" : "disabled"}.\n`,
  );
}

async function updateRootRobots(indexable: boolean): Promise<void> {
  const robotsPath = path.join(projectRoot, "robots.txt");
  const startMarker = "# PROJECT SABLE INDEXING START";
  const endMarker = "# PROJECT SABLE INDEXING END";
  const block = indexable
    ? `${startMarker}
Allow: /cyberpunk/
Sitemap: https://deleskie.com/cyberpunk/sitemap.xml
${endMarker}`
    : `${startMarker}
Disallow: /cyberpunk/
${endMarker}`;
  const existing = await readFile(robotsPath, "utf8");
  const matcher = new RegExp(
    `${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`,
  );
  const updated = matcher.test(existing)
    ? existing.replace(matcher, block)
    : existing.replace(/(\nSitemap:\s)/, `\n\n${block}\n$1`);

  await writeFile(robotsPath, updated, "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
