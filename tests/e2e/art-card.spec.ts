import { test, expect } from "@playwright/test";

for (const path of ["/", "/free-downloads"]) {
  test(`art card is keyboard-focusable and navigates on ${path}`, async ({ page }) => {
    await page.goto(path);
    const firstCard = page.locator('a[href^="/art/"]').first();
    await expect(firstCard).toBeVisible();

    // Focus the card link directly (Tab order varies by page chrome) and
    // confirm it receives focus, then Enter navigates to the art detail page.
    await firstCard.focus();
    await expect(firstCard).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/art\//);
    await expect(
      page.locator("main").getByRole("heading", { level: 1 })
    ).toBeVisible();
  });
}
