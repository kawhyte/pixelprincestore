import { test, expect } from "@playwright/test";

const footerPaths = [
  "/",
  "/free-downloads",
  "/blog",
  "/about",
  "/collections/game-room-wall-art",
];

for (const path of footerPaths) {
  test(`footer is visible on ${path}`, async ({ page }) => {
    await page.goto(path);
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Printed in the USA/i);
    await expect(footer).toContainText(new RegExp(`© ${new Date().getFullYear()}`));
  });
}

test("footer is absent on /studio", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.locator("footer")).toHaveCount(0);
});
