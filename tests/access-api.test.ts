import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { DevFileAccessRequestProvider } from "../src/lib/waitlist/dev-file-provider";
import type {
  AccessRequestProvider,
  AccessRequestStoreResult,
} from "../src/lib/waitlist/provider";
import { StorageUnavailableError } from "../src/lib/waitlist/provider";
import {
  getAccessRequestProvider,
  resetAccessRequestProviderForTests,
} from "../src/lib/waitlist/provider-factory";
import type { StoredAccessRequest } from "../src/lib/waitlist/schema";
import { processAccessSubmission } from "../src/lib/waitlist/service";

class MockProvider implements AccessRequestProvider {
  readonly stored: StoredAccessRequest[] = [];

  constructor(private readonly result: AccessRequestStoreResult = "created") {}

  async store(request: StoredAccessRequest): Promise<AccessRequestStoreResult> {
    this.stored.push(request);
    return this.result;
  }
}

test("valid form data reaches the mocked provider", async () => {
  const provider = new MockProvider();
  const response = await processAccessSubmission(
    {
      email: "  Founder@Example.com ",
      name: "  System Client  ",
      region: "canada",
      interest: "atelier-client",
      invitationCode: "  PRIVATE-01 ",
      companyWebsite: "",
      utmSource: "private-briefing",
    },
    provider,
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.deepEqual(provider.stored, [
    {
      email: "founder@example.com",
      name: "System Client",
      region: "canada",
      interest: "atelier-client",
      invitationCode: "PRIVATE-01",
      utmSource: "private-briefing",
    },
  ]);
});

test("honeypot submissions return generic success without storage", async () => {
  const provider = new MockProvider();
  const response = await processAccessSubmission(
    {
      email: "bot@example.com",
      companyWebsite: "https://spam.example",
    },
    provider,
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.equal(provider.stored.length, 0);
});

test("new and duplicate submissions have the same public response", async () => {
  const input = {
    email: "repeat@example.com",
    companyWebsite: "",
  };
  const created = await processAccessSubmission(
    input,
    new MockProvider("created"),
  );
  const duplicate = await processAccessSubmission(
    input,
    new MockProvider("duplicate"),
  );

  assert.deepEqual(duplicate, created);
});

test("provider failure returns a restrained unavailable response", async () => {
  const provider: AccessRequestProvider = {
    async store() {
      throw new StorageUnavailableError();
    },
  };
  const response = await processAccessSubmission(
    { email: "client@example.com", companyWebsite: "" },
    provider,
  );

  assert.equal(response.status, 503);
  assert.equal(response.body.state, "unavailable");
  assert.equal(response.body.ok, false);
  assert.equal("stack" in response.body, false);
});

test("development file provider stores sanitized requests idempotently", async () => {
  const temporaryDirectory = await mkdtemp(
    path.join(os.tmpdir(), "sable-provider-"),
  );
  const filePath = path.join(temporaryDirectory, "access-requests.jsonl");
  const provider = new DevFileAccessRequestProvider(filePath);
  const request: StoredAccessRequest = {
    email: "file-client@example.com",
    region: "european-union",
  };

  try {
    assert.equal(await provider.store(request), "created");
    assert.equal(await provider.store(request), "duplicate");
    const lines = (await readFile(filePath, "utf8")).trim().split("\n");
    assert.equal(lines.length, 1);
    assert.equal(
      (JSON.parse(lines[0]) as { email: string }).email,
      request.email,
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("production never falls back to development file storage", () => {
  const previousNodeEnvironment = process.env.NODE_ENV;
  const previousSupabaseUrl = process.env.SUPABASE_URL;
  const previousServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    resetAccessRequestProviderForTests();

    assert.equal(getAccessRequestProvider(), null);
  } finally {
    restoreEnvironmentVariable("NODE_ENV", previousNodeEnvironment);
    restoreEnvironmentVariable("SUPABASE_URL", previousSupabaseUrl);
    restoreEnvironmentVariable(
      "SUPABASE_SERVICE_ROLE_KEY",
      previousServiceRoleKey,
    );
    resetAccessRequestProviderForTests();
  }
});

function restoreEnvironmentVariable(
  key: string,
  value: string | undefined,
): void {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
