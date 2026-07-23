import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import path from "node:path";

import { handleAccessRequest } from "../src/lib/waitlist/http";

const projectRoot = process.cwd();
const requestedPort = Number(process.env.PORT || 8124);
const host = process.env.HOST || "127.0.0.1";

const server = createServer(async (request, response) => {
  const requestUrl = new URL(
    request.url || "/",
    `http://${request.headers.host || `${host}:${requestedPort}`}`,
  );

  if (requestUrl.pathname === "/api/access") {
    await handleAccessRequest(request, response);
    return;
  }

  applySecurityHeaders(response);

  const requestedFile = await resolveStaticFile(requestUrl.pathname);
  if (!requestedFile) {
    response.statusCode = requestUrl.pathname.startsWith("/cyberpunk")
      ? 404
      : 404;
    await sendFile(
      path.join(projectRoot, "cyberpunk", "404", "index.html"),
      response,
    );
    return;
  }

  await sendFile(requestedFile, response);
});

server.listen(requestedPort, host, () => {
  process.stdout.write(
    `PROJECT SABLE development server: http://${host}:${requestedPort}/cyberpunk/\n`,
  );
});

async function resolveStaticFile(pathname: string): Promise<string | null> {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = decoded.replace(/^\/+/, "");
  const baseCandidate = path.resolve(projectRoot, relativePath);
  if (
    baseCandidate !== projectRoot &&
    !baseCandidate.startsWith(`${projectRoot}${path.sep}`)
  ) {
    return null;
  }

  const candidates = decoded.endsWith("/")
    ? [path.join(baseCandidate, "index.html")]
    : [baseCandidate, path.join(baseCandidate, "index.html")];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) {
        return candidate;
      }
    } catch {
      // Continue to the next safe candidate.
    }
  }

  return null;
}

async function sendFile(
  filePath: string,
  response: ServerResponse,
): Promise<void> {
  try {
    const details = await stat(filePath);
    response.setHeader("Content-Length", details.size);
    response.setHeader(
      "Content-Type",
      contentTypeForExtension(path.extname(filePath)),
    );
    createReadStream(filePath).pipe(response);
  } catch {
    response.statusCode = 404;
    response.end("Not found");
  }
}

function applySecurityHeaders(response: ServerResponse): void {
  response.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data:",
      "style-src 'self'",
      "script-src 'self' https://plausible.io",
      "connect-src 'self' https://plausible.io",
      "font-src 'self'",
      "frame-src 'none'",
      "worker-src 'none'",
      "manifest-src 'self'",
    ].join("; "),
  );
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  );
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

function contentTypeForExtension(extension: string): string {
  const types: Record<string, string> = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
  };

  return types[extension] || "application/octet-stream";
}
