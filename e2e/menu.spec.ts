import { test, expect } from "@playwright/test";

test.describe("Menu page", () => {
  test("menu page loads with categories and items", async ({ page }) => {
    await page.goto("/menu");

    // Page heading
    await expect(
      page.getByRole("heading", { name: "Nuestro Menú", level: 1 })
    ).toBeVisible();

    // "Todos" pill exists and is the default active filter
    const allPill = page.locator("button", { hasText: "Todos" });
    await expect(allPill).toBeVisible();
    await expect(allPill).toHaveAttribute("aria-selected", "true");

    // Category pills for available item categories are rendered
    await expect(page.locator("button", { hasText: "Pizzas" })).toBeVisible();
    await expect(
      page.locator("button", { hasText: "Hamburguesas" })
    ).toBeVisible();
    await expect(page.locator("button", { hasText: "Parrilla" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Pastas" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Bebidas" })).toBeVisible();

    // All 15 menu items are rendered when "Todos" is active
    const cards = page.locator("[data-menu-card]");
    expect(await cards.count()).toBe(15);
  });

  test("menu cards display correct structure", async ({ page }) => {
    await page.goto("/menu");
    await page.waitForSelector("[data-menu-card]", { timeout: 10000 });

    const cards = page.locator("[data-menu-card]");
    expect(await cards.count()).toBe(15);

    // Every card has an image and a heading
    const firstCard = cards.first();
    await expect(firstCard.locator("img")).toBeVisible();
    await expect(firstCard.locator("h3")).toBeVisible();

    // "Agregar" button exists on every card
    await expect(
      firstCard.getByRole("button", { name: /Agregar/ })
    ).toBeVisible();

    // The featured item ("Pizza Margherita") has a "Destacado" badge
    const pizzaMargherita = page.locator("[data-menu-card]", {
      hasText: "Pizza Margherita",
    });
    await expect(pizzaMargherita.getByText("Destacado")).toBeVisible();
  });
});
