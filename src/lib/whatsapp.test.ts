import { describe, it, expect } from "vitest";
import { formatOrderMessage } from "./whatsapp";
import type { OrderItem } from "./whatsapp";

describe("formatOrderMessage", () => {
  it("formats a single item correctly", () => {
    const items: OrderItem[] = [
      { name: "Pizza Margherita", quantity: 1, price: 4500 },
    ];

    const result = formatOrderMessage(items);

    expect(result).toContain("Hola L'Roma! Quiero pedir:");
    expect(result).toContain("• Pizza Margherita ×1 — $4.500");
    expect(result).toContain("Total: $4.500");
  });

  it("formats multiple items with different quantities", () => {
    const items: OrderItem[] = [
      { name: "Pizza Margherita", quantity: 2, price: 4500 },
      { name: "Burger Clásica", quantity: 1, price: 3800 },
    ];

    const result = formatOrderMessage(items);

    expect(result).toContain("• Pizza Margherita ×2 — $9.000");
    expect(result).toContain("• Burger Clásica ×1 — $3.800");
    expect(result).toContain("Total: $12.800");
  });

  it("returns empty string for empty items array", () => {
    const result = formatOrderMessage([]);
    expect(result).toBe("");
  });

  it("handles single item with quantity greater than 1", () => {
    const items: OrderItem[] = [
      { name: "Coca-Cola", quantity: 3, price: 1200 },
    ];

    const result = formatOrderMessage(items);

    expect(result).toContain("• Coca-Cola ×3 — $3.600");
    expect(result).toContain("Total: $3.600");
    expect(result).not.toContain("Hola L'Roma!" + "\n\n\n"); // No extra blank lines
  });

  it("formats items with zero price correctly", () => {
    const items: OrderItem[] = [
      { name: "Cortesía", quantity: 1, price: 0 },
    ];

    const result = formatOrderMessage(items);

    expect(result).toContain("• Cortesía ×1 — $0");
    expect(result).toContain("Total: $0");
  });

  it("includes note on a new line when provided", () => {
    const items: OrderItem[] = [
      { name: "Pizza Margherita", quantity: 2, price: 4500, note: "Sin cebolla" },
      { name: "Burger Clásica", quantity: 1, price: 3800 },
    ];

    const result = formatOrderMessage(items);

    expect(result).toContain("• Pizza Margherita ×2 — $9.000\n  Nota: Sin cebolla");
    expect(result).toContain("• Burger Clásica ×1 — $3.800");
    expect(result).toContain("Total: $12.800");
  });

  it("skips empty or whitespace-only notes", () => {
    const items: OrderItem[] = [
      { name: "Pizza", quantity: 1, price: 4500, note: "   " },
      { name: "Burger", quantity: 1, price: 3800, note: "" },
      { name: "Pasta", quantity: 1, price: 3200, note: undefined },
    ];

    const result = formatOrderMessage(items);

    expect(result).not.toContain("Nota:");
    expect(result).toContain("• Pizza ×1 — $4.500");
    expect(result).toContain("• Burger ×1 — $3.800");
    expect(result).toContain("• Pasta ×1 — $3.200");
  });
});
