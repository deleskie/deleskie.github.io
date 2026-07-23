import { expect, test } from "@playwright/test";

test("main page renders the single supplied H1 and private metadata", async ({
  page,
}) => {
  await page.goto("/cyberpunk/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "WEAR THE PERIMETER.",
    }),
  ).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex, nofollow/,
  );
});

test("primary CTA scrolls to access and focuses the email field", async ({
  page,
}) => {
  await page.goto("/cyberpunk/");
  await page.getByRole("link", { name: "REQUEST PRIVATE ACCESS" }).click();

  await expect(page.locator("#access-email")).toBeFocused();
});

test("invalid email produces an accessible validation error", async ({
  page,
}) => {
  await page.goto("/cyberpunk/#access");
  const email = page.locator("#access-email");
  await email.fill("invalid-address");
  await page.getByRole("button", { name: "REQUEST ACCESS" }).click();

  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#access-email-error")).toHaveText(
    "Enter a valid email address.",
  );
  await expect(page.locator("[data-form-status]")).toHaveText(
    "Review the highlighted field and try again.",
  );
});

test("valid access data reaches the endpoint and reports generic success", async ({
  page,
}) => {
  let capturedPayload: Record<string, unknown> | undefined;
  await page.route("**/api/access", async (route) => {
    capturedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        state: "success",
        message:
          "If the project is relevant to your request, we will make contact.",
      }),
    });
  });

  await page.goto(
    "/cyberpunk/?utm_source=private-note&utm_campaign=system-001",
  );
  await page.locator("#access-email").fill("CLIENT@EXAMPLE.COM");
  await page.locator("#access-name").fill("Private Client");
  await page.locator("#access-region").selectOption("united-states");
  await page.locator("#access-interest").selectOption("global-shell");
  await page.getByRole("button", { name: "REQUEST ACCESS" }).click();

  await expect(page.locator("[data-form-status]")).toContainText(
    "REQUEST RECORDED",
  );
  expect(capturedPayload).toMatchObject({
    email: "client@example.com",
    name: "Private Client",
    region: "united-states",
    interest: "global-shell",
    utmSource: "private-note",
    utmCampaign: "system-001",
  });
});

test("mobile navigation opens and closes from the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/cyberpunk/");
  const menu = page.locator(".menu-toggle");

  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "SYSTEM", exact: true }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
});

test("privacy, legal, and custom 404 routes render intentionally", async ({
  page,
}) => {
  await page.goto("/cyberpunk/privacy/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "PRIVACY, WITHOUT THE THEATER.",
    }),
  ).toBeVisible();

  await page.goto("/cyberpunk/legal/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "CONCEPT, SCOPE, AND JURISDICTION.",
    }),
  ).toBeVisible();

  const response = await page.goto("/cyberpunk/private-channel/unknown");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "NO RECORD AT THIS COORDINATE.",
    }),
  ).toBeVisible();
});

test("route has no horizontal overflow or console errors at target widths", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/cyberpunk/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }

  expect(errors).toEqual([]);
});

test("main content remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:8124/cyberpunk/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "WEAR THE PERIMETER.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "SYSTEM", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#access-email")).toBeVisible();

  await context.close();
});

test("reduced motion keeps content visible and removes long animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cyberpunk/");
  const revealState = await page
    .locator(".architecture__intro")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        opacity: style.opacity,
        transform: style.transform,
        duration: style.transitionDuration,
      };
    });

  expect(revealState.opacity).toBe("1");
  expect(revealState.transform).toBe("none");
  expect(revealState.duration).not.toContain("0.9s");
});
