import { test, expect } from "@playwright/test";

test("home page renders nav and free-downloads link", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "The Pixel Prince", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Free Downloads" }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Free retro gaming & map wall art/i })
  ).toBeVisible();
  await expect(page.locator('input[type="email"]').first()).toBeVisible();
  await expect(page.locator("text=/\\$\\d+\\.\\d{2}/")).toHaveCount(0);
});

test("free downloads gallery renders and navigates to art detail", async ({ page }) => {
  await page.goto("/free-downloads");
  await expect(
    page.getByRole("heading", { name: /Free Wall Art Downloads/i })
  ).toBeVisible();
  const firstCard = page.locator('a[href^="/art/"]').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/art\//);
  await expect(page.locator("main").getByRole("heading", { level: 1 })).toBeVisible();
});

test("collection page renders grid, faq and email form", async ({ page }) => {
  await page.goto("/collections/game-room-wall-art");
  await expect(page.locator("main").getByRole("heading", { level: 1 })).toContainText(/game room/i);
  await expect(page.locator("details").first()).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
});
