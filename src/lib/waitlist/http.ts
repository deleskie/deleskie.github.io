import type { IncomingMessage, ServerResponse } from "node:http";

import { siteContent } from "../../content/site";
import { getAccessRequestProvider } from "./provider-factory";
import { checkDevelopmentRateLimit } from "./rate-limit";
import {
  processAccessSubmission,
  unavailableResponse,
  type AccessResponseBody,
} from "./service";

const MAX_BODY_BYTES = 12_000;

export async function handleAccessRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  applyResponseHeaders(response);

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, {
      ok: false,
      state: "error",
      message: siteContent.access.error,
    });
    return;
  }

  if (
    !request.headers["content-type"]
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    sendJson(response, 415, {
      ok: false,
      state: "invalid",
      message: siteContent.access.validation.formInvalid,
    });
    return;
  }

  if (!checkDevelopmentRateLimit(request.socket.remoteAddress || undefined)) {
    sendJson(response, 429, {
      ok: false,
      state: "limited",
      message: siteContent.access.error,
    });
    return;
  }

  let body: unknown;
  try {
    body = JSON.parse(await readBody(request));
  } catch {
    sendJson(response, 400, {
      ok: false,
      state: "invalid",
      message: siteContent.access.validation.formInvalid,
    });
    return;
  }

  const provider = getAccessRequestProvider();
  const result = provider
    ? await processAccessSubmission(body, provider)
    : unavailableResponse();

  sendJson(response, result.status, result.body);
}

function applyResponseHeaders(response: ServerResponse): void {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: AccessResponseBody,
): void {
  response.statusCode = status;
  response.end(JSON.stringify(body));
}

async function readBody(request: IncomingMessage): Promise<string> {
  const declaredLength = Number(request.headers["content-length"] || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }

  const chunks: Buffer[] = [];
  let received = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    received += buffer.length;

    if (received > MAX_BODY_BYTES) {
      throw new Error("Request body is too large.");
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}
