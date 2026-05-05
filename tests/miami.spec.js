const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.MIAMI_TEST_BASE_URL || 'http://127.0.0.1:8123';
const routes = [
  '/miami/',
  '/miami/resources/',
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

test('/miami checkbox controls stay compact on desktop and mobile', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 1200 }, { width: 1440, height: 1200 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${baseUrl}/miami/#availability`, { waitUntil: 'networkidle' });
    const boxes = await page.locator('.miami-checks input[type="checkbox"]').evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    );
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.width).toBeLessThanOrEqual(24);
      expect(box.height).toBeLessThanOrEqual(24);
    }
  }
});

test('Miami first 20 image test asset matches metadata and files exist', async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const fixturePath = path.join(repoRoot, 'tests/fixtures/miami-first-20-assets.json');
  const metadataPath = path.join(repoRoot, 'assets/miami/image-metadata.tsv');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const metadataLines = fs.readFileSync(metadataPath, 'utf8').trim().split(/\r?\n/);
  const headers = metadataLines[0].split('\t');
  const firstTwentyRows = metadataLines.slice(1, 21).map((line) => {
    const values = line.split('\t');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });

  expect(fixture.count).toBe(20);
  expect(fixture.items).toHaveLength(20);
  expect(fixture.items.map((item) => item.index)).toEqual(firstTwentyRows.map((row) => row.index));
  expect(fixture.items.map((item) => item.file)).toEqual(firstTwentyRows.map((row) => row.file));

  for (const item of fixture.items) {
    const matchingRow = firstTwentyRows.find((row) => row.index === item.index);
    expect(item.path).toBe(`/assets/miami/${item.file}`);
    expect(item.width).toBe(Number(matchingRow.width));
    expect(item.height).toBe(Number(matchingRow.height));
    expect(item.category).toBe(matchingRow.category);
    expect(item.eventType).toBe(matchingRow.event_type);
    expect(item.recommendedUse).toBe(matchingRow.recommended_use);
    expect(fs.existsSync(path.join(repoRoot, 'assets/miami', item.file))).toBe(true);
  }
});
