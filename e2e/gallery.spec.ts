import { test, expect } from "@playwright/test";

test.describe("Gallery page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/gallery");
    // Wait for images to start loading
    await page.waitForTimeout(1500);
  });

  test("gallery page loads with heading and image grid", async ({ page }) => {
    // Page heading
    await expect(
      page.getByRole("heading", { name: "Nuestra cocina", level: 1 })
    ).toBeVisible();

    // Gallery section label
    await expect(page.getByText("Galería", { exact: true }).first()).toBeVisible();

    // Images are rendered in the grid
    const galleryImages = page.locator('[role="listitem"] img');
    const count = await galleryImages.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test("clicking a gallery image opens lightbox", async ({ page }) => {
    // Click first gallery image
    const firstImage = page.locator("[data-gallery-image='0']");
    await firstImage.click();

    // Lightbox dialog is visible
    const lightbox = page.locator('[role="dialog"]');
    await expect(lightbox).toBeVisible();

    // Counter shows 1/10
    await expect(lightbox.getByText("1 / 10")).toBeVisible();

    // Close button is visible
    await expect(
      lightbox.getByRole("button", { name: "Cerrar visor" })
    ).toBeVisible();
  });

  test("Escape key closes lightbox", async ({ page }) => {
    // Open lightbox
    const firstImage = page.locator("[data-gallery-image='0']");
    await firstImage.click();

    const lightbox = page.locator('[role="dialog"]');
    await expect(lightbox).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Lightbox should close
    await expect(lightbox).not.toBeVisible();
  });

  test("scroll choreography section renders", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "El arte en cada plato" })
    ).toBeVisible();
  });
});
