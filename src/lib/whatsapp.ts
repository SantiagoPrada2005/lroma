export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

/**
 * Formats a list of order items into a pre-built WhatsApp message.
 *
 * Format:
 * Hola L'Roma! Quiero pedir:
 *
 * • {name} ×{qty} — ${subtotal}
 *
 * Total: ${total}
 */
export function formatOrderMessage(items: OrderItem[]): string {
  if (items.length === 0) {
    return "";
  }

  const lines = items.map((item) => {
    const subtotal = item.price * item.quantity;
    return `• ${item.name} ×${item.quantity} — $${subtotal.toLocaleString("es-AR")}`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return `Hola L'Roma! Quiero pedir:\n\n${lines.join("\n")}\n\nTotal: $${total.toLocaleString("es-AR")}`;
}

/**
 * Opens WhatsApp with a pre-built message.
 *
 * @param message - The formatted message text
 * @param phone - Phone number in international format (without +)
 * @default phone "+549XXXXXXXXX"
 */
export function openWhatsApp(
  message: string,
  phone: string = "+549XXXXXXXXX"
): void {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}
