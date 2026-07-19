import { test, expect } from "@playwright/test";

// Single-image artworks (the entire existing catalogue) must render with NO
// carousel chrome. We navigate into the first art card from the gallery.
test("single-image art page shows no carousel controls", async ({ page, request }) => {
  // Grab a real art slug from the gallery HTML, then navigate directly — a
  // single load avoids the app-router dev-mode chunk churn of chaining navs.
  const html = await (await request.get("/free-downloads")).text();
  const slug = html.match(/\/art\/[a-z0-9-]+/)?.[0];
  expect(slug).toBeTruthy();

  await page.goto(slug!);
  await expect(
    page.getByRole("button", { name: /Email me this print/i })
  ).toBeVisible();

  // No prev/next chevrons when there's only one image.
  await expect(page.getByRole("button", { name: /Next photo/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Previous photo/i })).toHaveCount(0);
});

// Multi-image carousel test. No multi-image artwork exists in the dataset yet,
// so this skips itself until one is added.
// TODO: set MULTI_IMAGE_SLUG to a slug that has 2+ galleryImages, then this runs.
const MULTI_IMAGE_SLUG = process.env.MULTI_IMAGE_SLUG ?? "";

test("multi-image art page: clicking next reveals the second slide", async ({ page }) => {
  test.skip(!MULTI_IMAGE_SLUG, "No multi-image artwork configured (set MULTI_IMAGE_SLUG).");

  await page.goto(`/art/${MULTI_IMAGE_SLUG}`);
  const next = page.getByRole("button", { name: /Next photo/i });
  await expect(next).toBeVisible();

  const secondSlide = page.getByRole("group", { name: /2 of/ });
  await next.click();
  await expect(secondSlide).toBeInViewport();
});
