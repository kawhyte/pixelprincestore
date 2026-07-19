import { test, expect } from "@playwright/test";

// Smoke-checks that the email-gate dialog opens (no submit — avoids sending
// real email) at phone and desktop viewports.
const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`download dialog opens on an art page (${vp.name})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    // Reach an art detail page via the gallery.
    await page.goto("/free-downloads");
    await page.locator('a[href^="/art/"]').first().click();
    await expect(page).toHaveURL(/\/art\//);

    // Open the gate dialog.
    await page.getByRole("button", { name: /Email me this print/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[type="email"]')).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: /Send my download link/i })
    ).toBeVisible();
  });
}
