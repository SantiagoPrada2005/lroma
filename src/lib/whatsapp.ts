import { CONTACT_INFO } from "@/config/contact";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

/**
 * Formats a list of order items into a pre-built WhatsApp message.
 *
 * Format:
 * Hola L'Roma! Quiero pedir:
 *
 * • {name} ×{qty} — ${subtotal}
 *   Nota: {note}   ← only when note is provided
 *
 * Total: ${total}
 */
export function formatOrderMessage(items: OrderItem[]): string {
  if (items.length === 0) {
    return "";
  }

  const lines = items.map((item) => {
    const subtotal = item.price * item.quantity;
    const base = `• ${item.name} ×${item.quantity} — $${subtotal.toLocaleString("es-AR")}`;
    if (item.note && item.note.trim().length > 0) {
      return `${base}\n  Nota: ${item.note.trim()}`;
    }
    return base;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return `Hola L'Roma! Quiero pedir:\n\n${lines.join("\n")}\n\nTotal: $${total.toLocaleString("es-AR")}`;
}

/**
 * Opens WhatsApp with a pre-built message.
 *
 * @param message - The formatted message text
 * @param phone - Phone number in international format
 * @default phone CONTACT_INFO.whatsapp.number
 */
export function openWhatsApp(
  message: string,
  phone: string = CONTACT_INFO.whatsapp.number
): void {
  const sanitizedPhone = phone.replace(/[^\d+]/g, "");
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${sanitizedPhone}?text=${encoded}`, "_blank");
}
