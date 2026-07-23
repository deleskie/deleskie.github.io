import { siteContent } from "./content/site";
import { StorageUnavailableError } from "./lib/waitlist/provider";
import type { AccessRequestProvider } from "./lib/waitlist/provider";
import { accessRequestSchema } from "./lib/waitlist/schema";
import {
  processAccessSubmission,
  unavailableResponse,
} from "./lib/waitlist/service";
import { SupabaseAccessRequestProvider } from "./lib/waitlist/supabase-provider";

type AssetBinding = {
  fetch(request: Request): Promise<Response>;
};

type WorkerEnvironment = {
  ASSETS?: AssetBinding;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const MAX_BODY_BYTES = 12_000;

export default {
  async fetch(
    request: Request,
    environment: WorkerEnvironment,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return withSecurityHeaders(
        Response.redirect(new URL("/cyberpunk/", url), 302),
      );
    }

    if (url.pathname === "/api/access") {
      return handleWorkerAccessRequest(request, environment);
    }

    if (!environment.ASSETS) {
      return withSecurityHeaders(
        new Response("Site assets are temporarily unavailable.", {
          status: 503,
        }),
      );
    }

    const response = await environment.ASSETS.fetch(request);
    if (response.status === 404 && url.pathname.startsWith("/cyberpunk/")) {
      const notFoundUrl = new URL("/cyberpunk/404/index.html", url.origin);
      const notFoundAsset = await environment.ASSETS.fetch(
        new Request(notFoundUrl, request),
      );
      return withSecurityHeaders(
        new Response(notFoundAsset.body, {
          status: 404,
          statusText: "Not Found",
          headers: notFoundAsset.headers,
        }),
      );
    }

    return withSecurityHeaders(response);
  },
};

async function handleWorkerAccessRequest(
  request: Request,
  environment: WorkerEnvironment,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        state: "error",
        message: siteContent.access.error,
      },
      405,
      { Allow: "POST" },
    );
  }

  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return jsonResponse(
      {
        ok: false,
        state: "invalid",
        message: siteContent.access.validation.formInvalid,
      },
      415,
    );
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return invalidResponse();
  }

  let input: unknown;
  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > MAX_BODY_BYTES) {
      return invalidResponse();
    }
    input = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return invalidResponse();
  }

  const parsed = accessRequestSchema.safeParse(input);
  if (parsed.success && parsed.data.companyWebsite.length > 0) {
    return jsonResponse(
      {
        ok: true,
        state: "success",
        message: siteContent.access.successMessage,
      },
      200,
    );
  }

  const provider = createWorkerProvider(environment);
  const result = provider
    ? await processAccessSubmission(input, provider)
    : unavailableResponse();

  return jsonResponse(result.body, result.status);
}

function createWorkerProvider(
  environment: WorkerEnvironment,
): AccessRequestProvider | null {
  if (!environment.SUPABASE_URL || !environment.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  try {
    return new SupabaseAccessRequestProvider({
      url: environment.SUPABASE_URL,
      serviceRoleKey: environment.SUPABASE_SERVICE_ROLE_KEY,
    });
  } catch {
    throw new StorageUnavailableError();
  }
}

function invalidResponse(): Response {
  return jsonResponse(
    {
      ok: false,
      state: "invalid",
      message: siteContent.access.validation.formInvalid,
    },
    400,
  );
}

function jsonResponse(
  body: object,
  status: number,
  additionalHeaders: Record<string, string> = {},
): Response {
  return withSecurityHeaders(
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        ...additionalHeaders,
      },
    }),
  );
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set(
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
      "upgrade-insecure-requests",
    ].join("; "),
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  );
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
