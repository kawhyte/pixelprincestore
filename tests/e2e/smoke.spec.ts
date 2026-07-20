import { test, expect } from "@playwright/test";

test("home page renders nav and free-downloads link", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "The Pixel Prince", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Free Prints" }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Art for your walls/i })
  ).toBeVisible();
  await expect(page.locator('input[type="email"]').first()).toBeVisible();
  await expect(page.getByText("Loved by 7,000+ buyers")).toBeVisible();
  await expect(page.locator('main a[href="/prints"]')).toHaveCount(1); // the single Etsy band CTA
  await expect(page.locator('main a[href^="/collections/"]')).toHaveCount(3); // the three tiles
  await expect(page.locator("text=/\\$\\d+\\.\\d{2}/")).toHaveCount(0);
});

test("free downloads gallery renders and navigates to art detail", async ({ page }) => {
  await page.goto("/free-downloads");
  await expect(
    page.getByRole("heading", { name: /Free printable wall art/i })
  ).toBeVisible();
  const firstCard = page.locator('a[href^="/art/"]').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/art\//);
  await expect(page.locator("main").getByRole("heading", { level: 1 })).toBeVisible();
});

test("art detail: free CTA appears above the Etsy card", async ({ page }) => {
  await page.goto("/free-downloads");
  await page.locator('a[href^="/art/"]').first().click();
  await expect(page).toHaveURL(/\/art\//);
  const cta = page.getByRole("button", { name: /Email me this print/i });
  const etsy = page.locator('main a[href*="etsy"]').first();
  await expect(cta).toBeVisible();
  await expect(etsy).toBeVisible();
  const ctaBox = await cta.boundingBox();
  const etsyBox = await etsy.boundingBox();
  expect(ctaBox!.y).toBeLessThan(etsyBox!.y);
});

test("prints page renders two etsy paths with utm", async ({ page }) => {
  await page.goto("/prints");
  await expect(page.getByRole("heading", { name: /Want it on real paper/i })).toBeVisible();
  const etsyLinks = page.locator('main a[href*="etsy.com"], main a[href*="etsy"]').filter({ hasText: /print shop|printables/i });
  await expect(etsyLinks).toHaveCount(2);
  for (const href of await etsyLinks.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))) {
    expect(href).toContain("utm_campaign=prints-page");
  }
});

test("collection page renders grid, faq and email form", async ({ page }) => {
  await page.goto("/collections/game-room-wall-art");
  await expect(page.locator("main").getByRole("heading", { level: 1 })).toContainText(/game room/i);
  await expect(page.locator("details").first()).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test("basketball hub renders waitlist and faq", async ({ page }) => {
  await page.goto("/collections/basketball-wall-art");
  await expect(page.locator("main").getByRole("heading", { level: 1 })).toContainText(/basketball/i);
  await expect(page.locator('input[type="email"]').first()).toBeVisible();
  await expect(page.locator("details").first()).toBeVisible();
});
