import assert from "node:assert/strict";
import test from "node:test";

import { accessRequestSchema } from "../src/lib/waitlist/schema";

test("access schema normalizes and constrains valid input", () => {
  const parsed = accessRequestSchema.parse({
    email: "  PRIVATE.CLIENT@Example.COM ",
    name: "  A Private Client  ",
    region: "united-states",
    interest: "global-shell",
    invitationCode: "  SABLE-001  ",
    companyWebsite: "",
  });

  assert.equal(parsed.email, "private.client@example.com");
  assert.equal(parsed.name, "A Private Client");
  assert.equal(parsed.region, "united-states");
  assert.equal(parsed.interest, "global-shell");
  assert.equal(parsed.invitationCode, "SABLE-001");
});

test("access schema rejects unknown fields and arbitrary select values", () => {
  const unknownField = accessRequestSchema.safeParse({
    email: "client@example.com",
    privilege: "administrator",
  });
  const arbitraryRegion = accessRequestSchema.safeParse({
    email: "client@example.com",
    region: "somewhere-unlisted",
  });

  assert.equal(unknownField.success, false);
  assert.equal(arbitraryRegion.success, false);
});

test("access schema rejects invalid email and oversized strings", () => {
  const invalid = accessRequestSchema.safeParse({
    email: "not-an-email",
    name: "x".repeat(101),
  });

  assert.equal(invalid.success, false);
});
