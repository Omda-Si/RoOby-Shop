import { formatPrice } from "./format.js";

export function buildCustomWhatsAppUrl(phone, message) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function specialOrderMessage(shopName, note) {
  return [
    `السلام عليكم، عايز أطلب طلب خاص من ${shopName}`,
    "",
    note || "عايز كيكة أو صينية حسب مناسبتي.",
    "",
    "النوع:",
    "الكمية:",
    "تاريخ الاستلام:",
    "المناسبة:"
  ].join("\n");
}

export function festivalOrderMessage(shopName, title, note) {
  return [
    `السلام عليكم، عايز أسأل عن حلويات ${title || "المناسبة"} من ${shopName}`,
    "",
    note || "",
    "",
    "الكمية:",
    "تاريخ الاستلام:"
  ].join("\n");
}

export function buildWhatsAppUrl(phone, shopName, items) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const lines = [
    `السلام عليكم، عايز أطلب من ${shopName} 🧡`,
    "",
    ...items.map((item) => `• ${item.name_ar} × ${item.qty} — ${formatPrice(item.price * item.qty)}`),
    "",
    `الإجمالي: ${formatPrice(total)}`,
    "",
    "متى أقدر أستلم الطلب؟ شكراً مقدماً"
  ];

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
