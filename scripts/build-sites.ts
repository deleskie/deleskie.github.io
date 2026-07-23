import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { build } from "esbuild";

const projectRoot = process.cwd();
const distributionRoot = path.join(projectRoot, "dist");
const clientRoot = path.join(distributionRoot, "client");
const serverRoot = path.join(distributionRoot, "server");
const cyberpunkSource = path.join(projectRoot, "cyberpunk");

void main();

async function main(): Promise<void> {
  await rm(distributionRoot, { recursive: true, force: true });
  await Promise.all([
    mkdir(clientRoot, { recursive: true }),
    mkdir(serverRoot, { recursive: true }),
  ]);

  await cp(cyberpunkSource, path.join(clientRoot, "cyberpunk"), {
    recursive: true,
  });

  await build({
    entryPoints: [path.join(projectRoot, "src", "sites-worker.ts")],
    outfile: path.join(serverRoot, "index.js"),
    bundle: true,
    format: "esm",
    minify: true,
    platform: "browser",
    target: "es2022",
    define: {
      "process.env.NEXT_PUBLIC_CONTACT_EMAIL": JSON.stringify(
        process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
      ),
      "process.env.PUBLIC_CONTACT_EMAIL": JSON.stringify(
        process.env.PUBLIC_CONTACT_EMAIL || "",
      ),
      "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify(
        process.env.NEXT_PUBLIC_SITE_URL || "",
      ),
    },
  });

  process.stdout.write("Built Cloudflare-compatible Sites output in dist/.\n");
}
