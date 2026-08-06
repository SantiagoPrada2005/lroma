import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
    await page.waitForTimeout(1000);
  });

  test("about page renders with heading and story sections", async ({ page }) => {
    // Page heading
    await expect(
      page.getByRole("heading", {
        name: "Una historia de fuego y pasión",
        level: 1,
      })
    ).toBeVisible();

    // Story sections exist
    await expect(
      page.getByRole("heading", { name: "Cómo empezó todo" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nuestra cocina" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "La experiencia L'Roma" })
    ).toBeVisible();
  });

  test("values grid renders with three cards", async ({ page }) => {
    // Section heading
    await expect(
      page.getByRole("heading", { name: "Lo que nos define" })
    ).toBeVisible();

    // Three value cards
    const valuesList = page.locator('[aria-label="Valores de L\'Roma"]');
    await expect(valuesList).toBeVisible();

    const cards = valuesList.locator('[role="listitem"]');
    expect(await cards.count()).toBe(3);

    // Content of cards
    await expect(valuesList.getByText("Calidad")).toBeVisible();
    await expect(valuesList.getByText("Pasión")).toBeVisible();
    await expect(valuesList.getByText("Comunidad")).toBeVisible();
  });
});
