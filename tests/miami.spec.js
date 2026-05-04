const { test, expect } = require('@playwright/test');

const baseUrl = process.env.MIAMI_TEST_BASE_URL || 'http://127.0.0.1:8123';
const routes = [
  '/miami/',
  '/miami-wedding-dj/',
  '/miami-bilingual-wedding-dj/',
  '/miami-quinceanera-dj/',
  '/miami-corporate-event-dj/',
  '/miami-event-lighting/',
  '/miami-ceremony-audio/',
  '/es/blog/',
  '/blog/how-to-choose-miami-wedding-dj/',
  '/es/blog/como-elegir-dj-bilingue-boda-latina-miami/',
  '/es/dj-para-bodas-miami/',
  '/es/dj-bilingue-para-bodas-miami/',
  '/es/dj-para-quinceanera-miami/',
  '/es/dj-para-eventos-corporativos-miami/',
  '/es/iluminacion-para-eventos-miami/',
  '/TommyC/'
];

const viewports = [
  { width: 390, height: 1200 },
  { width: 768, height: 1200 },
  { width: 1024, height: 1200 },
  { width: 1440, height: 1200 }
];

for (const route of routes) {
  for (const viewport of viewports) {
    test(`${route} has no console errors or horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      const consoleErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));

      await page.setViewportSize(viewport);
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      expect(response && response.ok()).toBeTruthy();
      expect(consoleErrors).toEqual([]);

      const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(hasHorizontalOverflow).toBe(false);
    });
  }
}

test('/miami smart form validates and shows recommendation', async ({ page }) => {
  await page.goto(`${baseUrl}/miami/`, { waitUntil: 'networkidle' });
  await page.locator('#name').fill('Miami Test Lead');
  await page.locator('#email').fill('lead@example.com');
  await page.locator('#phone').fill('305-555-0100');
  await page.locator('#eventType').selectOption('wedding');
  await page.locator('#eventDate').fill('2026-12-12');
  await page.locator('#venue').fill('Coral Gables ballroom');
  await page.locator('#guestCount').fill('160');
  await page.locator('#budgetRange').selectOption('2500-4000');
  await page.locator('input[name="servicesNeeded"][value="ceremony-audio"]').check();
  await page.locator('input[name="ceremonyAudio"]').check();
  await page.locator('input[name="bilingualMc"]').check();
  await expect(page.locator('[data-recommendation]')).toBeVisible();
  await expect(page.locator('[data-recommendation-title]')).toContainText('Bilingual Premium Wedding');
});
