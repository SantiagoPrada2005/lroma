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

  test("featured dishes section renders", async ({ page }) => {
    await page.goto("/");

    // Section heading
    await expect(
      page.getByRole("heading", { name: /Lo mejor de nuestra cocina/i })
    ).toBeVisible();

    // Scope to featured dishes list to avoid collision with hero floating card
    const featuredList = page.locator('[aria-label="Platos destacados"]');

    // All 4 dishes are rendered — use heading semantics (h3) to avoid ambiguity
    await expect(
      featuredList.getByRole("heading", { name: "Pizza Margherita" })
    ).toBeVisible();
    await expect(
      featuredList.getByText("Baby Beef")
    ).toBeVisible();
    await expect(
      featuredList.getByText("Pasta Carbonara")
    ).toBeVisible();
    await expect(
      featuredList.getByText("Hamburguesa L'Roma")
    ).toBeVisible();

    // CTA to full menu
    await expect(
      page.getByRole("link", { name: "Ver Menú Completo" })
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
