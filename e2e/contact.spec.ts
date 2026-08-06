import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);
  });

  test("contact page renders with heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Hablanos", level: 1 })
    ).toBeVisible();
  });

  test("phone number is visible and tappable", async ({ page }) => {
    // Scope to contact card region to avoid ambiguity with map links
    const contactCard = page.locator('[aria-label="Información de contacto"]');

    const phoneLink = contactCard.locator('a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();

    const href = await phoneLink.getAttribute("href");
    expect(href).toMatch(/^tel:/);
  });

  test("address and hours are visible", async ({ page }) => {
    const contactCard = page.locator('[aria-label="Información de contacto"]');

    // Address label
    await expect(contactCard.getByText("Dirección")).toBeVisible();

    // "Rosario, Santa Fe" appears in both contact card and map — scope
    await expect(
      contactCard.getByText("Rosario, Santa Fe")
    ).toBeVisible();

    // Google Maps link
    await expect(
      contactCard.getByRole("link", { name: /Ver en Google Maps/ })
    ).toBeVisible();

    // Hours section
    await expect(contactCard.getByText("Horarios")).toBeVisible();
    await expect(contactCard.getByText("Lunes – Jueves")).toBeVisible();
    await expect(contactCard.getByText("Viernes – Sábado")).toBeVisible();
    await expect(contactCard.getByText("Domingo")).toBeVisible();
  });

  test("WhatsApp CTA and social links are visible", async ({ page }) => {
    const contactCard = page.locator('[aria-label="Información de contacto"]');

    // WhatsApp CTA button
    await expect(
      contactCard.getByRole("link", { name: /Contactanos por WhatsApp/ })
    ).toBeVisible();

    // Social links — scoped to contact card (avoids footer ambiguity)
    await expect(
      contactCard.getByLabel("Instagram")
    ).toBeVisible();
    await expect(
      contactCard.getByLabel("Facebook")
    ).toBeVisible();
  });

  test("map section renders", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Dónde estamos" })
    ).toBeVisible();

    // Map links — contact card + map section
    const mapLinks = page.locator('a[href*="google.com/maps"]');
    expect(await mapLinks.count()).toBeGreaterThanOrEqual(2);
  });
});
