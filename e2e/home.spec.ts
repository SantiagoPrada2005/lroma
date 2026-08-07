import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("hero renders with heading and CTAs", async ({ page }) => {
    await page.goto("/");

    // Scope to hero section
    const hero = page.locator('section[aria-label="Hero principal"]');

    // Hero headline is visible — exact match to avoid collision with dish cards
    await expect(
      hero.getByRole("heading", { name: "L'ROMA", level: 1 })
    ).toBeVisible();

    // Hero subtitle
    await expect(
      hero.getByText("Pizza & Grill")
    ).toBeVisible();

    // Tagline
    await expect(
      hero.getByText("Más que una pizza, una experiencia.")
    ).toBeVisible();

    // CTAs are visible within hero
    await expect(
      hero.getByRole("link", { name: /Ver Menú/i })
    ).toBeVisible();
    await expect(
      hero.getByRole("link", { name: /Pedir por WhatsApp/i })
    ).toBeVisible();
  });

  test("circular gallery section renders", async ({ page }) => {
    await page.goto("/");

    // Section heading
    await expect(
      page.getByRole("heading", { name: /Girá para descubrir/i })
    ).toBeVisible();

    // Badge
    await expect(
      page.getByText("Nuestra Carta")
    ).toBeVisible();

    // Scope to circular gallery
    const gallery = page.locator('[aria-label="Galería circular del menú"]');
    await expect(gallery).toBeVisible();

    // Some menu items are present in the 3D gallery
    await expect(
      gallery.getByRole("group", { name: "Pizza Margherita" })
    ).toBeVisible();
    await expect(
      gallery.getByRole("group", { name: "Baby Beef" })
    ).toBeVisible();
  });

  test("stats section renders", async ({ page }) => {
    await page.goto("/");

    // Stats are present — use section context to avoid collisions
    const statsSection = page.locator('section[aria-label="Estadísticas del restaurante"]');
    await expect(statsSection).toBeVisible();

    // Check each stat label is visible
    await expect(statsSection.getByText("años")).toBeVisible();
    await expect(statsSection.getByText("platos")).toBeVisible();
    await expect(statsSection.getByText("clientes")).toBeVisible();
  });

  test("reservation CTA section renders", async ({ page }) => {
    await page.goto("/");

    // Heading — redesigned: editorial "Una experiencia te espera"
    await expect(
      page.getByRole("heading", { name: /Una experiencia/i })
    ).toBeVisible();

    // WhatsApp link
    await expect(
      page.getByRole("link", { name: /Contactanos por WhatsApp/i })
    ).toBeVisible();
  });
});
