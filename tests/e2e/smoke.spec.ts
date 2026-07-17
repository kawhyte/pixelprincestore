import { test, expect } from "@playwright/test";

test("home page renders nav and free-downloads link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "The Pixel Prince" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Free Downloads" }).first()
  ).toBeVisible();
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
