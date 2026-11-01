export function formatPrice(value) {
  const amount = Number(value || 0);
  return `${amount.toLocaleString("en-US")} SDG`;
}

export function formatArabicDate(value = new Date()) {
  return new Intl.DateTimeFormat("ar-SD", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date(value));
}

export function formatArabicTime(value) {
  return new Intl.DateTimeFormat("ar-SD", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function productImage(url) {
  if (!url) return "/placeholder-snack.svg";
  if (url.startsWith("http")) return url;
  const base = import.meta.env.VITE_API_URL || "";
  return `${base}${url}`;
}
