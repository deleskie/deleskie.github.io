import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

test("default generated route is private to crawlers and has no sitemap", async () => {
  const html = await readFile(
    path.join(projectRoot, "cyberpunk", "index.html"),
    "utf8",
  );
  const robots = await readFile(path.join(projectRoot, "robots.txt"), "utf8");

  assert.match(html, /noindex, nofollow/);
  assert.match(robots, /Disallow: \/cyberpunk\//);
  await assert.rejects(
    access(path.join(projectRoot, "cyberpunk", "sitemap.xml")),
  );
});

test("generated browser files contain no server credentials", async () => {
  const files = [
    path.join(projectRoot, "cyberpunk", "index.html"),
    path.join(projectRoot, "cyberpunk", "assets", "client.js"),
    path.join(projectRoot, "cyberpunk", "site.webmanifest"),
  ];

  for (const file of files) {
    const contents = await readFile(file, "utf8");
    assert.doesNotMatch(contents, /SUPABASE_SERVICE_ROLE_KEY/);
    assert.doesNotMatch(contents, /replace-with-service-role-key/);
  }
});

test("generated public copy contains none of the prohibited phrases", async () => {
  const files = [
    path.join(projectRoot, "cyberpunk", "index.html"),
    path.join(projectRoot, "cyberpunk", "privacy", "index.html"),
    path.join(projectRoot, "cyberpunk", "legal", "index.html"),
  ];
  const prohibited = [
    "bulletproof",
    "emp-proof",
    "military grade",
    "untraceable",
    "invisible",
    "impenetrable",
    "indestructible",
    "guaranteed protection",
    "full-spectrum protection",
    "nij certified",
    "certified garment",
    "stops bullets",
    "defeats surveillance",
  ];

  for (const file of files) {
    const contents = (await readFile(file, "utf8")).toLowerCase();
    for (const phrase of prohibited) {
      assert.equal(
        contents.includes(phrase),
        false,
        `${path.relative(projectRoot, file)} includes "${phrase}"`,
      );
    }
  }
});

test("generated teaser uses the Jim voice and evidence-first copy", async () => {
  const html = await readFile(
    path.join(projectRoot, "cyberpunk", "index.html"),
    "utf8",
  );

  for (const line of [
    "THE FUTURE DIDN’T",
    "CLAIMS FOLLOW EVIDENCE.",
    "BUILT BELOW",
    "REAL DEVELOPMENT",
    "WE DO NOT USE MAGIC WORDS",
    "SIGNAL RECEIVED",
  ]) {
    assert.match(html, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const retiredLine of [
    "CAPABILITY WITHOUT SPECTACLE.",
    "NOT A PUBLIC LAUNCH.",
    "REQUEST PRIVATE ACCESS",
    "REQUEST RECORDED",
  ]) {
    assert.equal(html.includes(retiredLine), false);
  }
});
