import { Router } from "express";
import { enrichProduct, readShop } from "../store.js";
import { serializeProduct } from "../utils/product.js";

export const catalogRouter = Router();

catalogRouter.get("/", (_req, res) => {
  const shop = readShop();
  const products = shop.products
    .map((row) => serializeProduct(enrichProduct(row, shop.categories), { showUnavailable: shop.settings.show_unavailable }))
    .filter(Boolean)
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order);

  res.json({
    settings: publicSettings(shop.settings),
    categories: [...shop.categories].sort((a, b) => a.sort_order - b.sort_order),
    products,
    featured: products.filter((product) => product.is_featured && product.is_open),
    today: products.filter((product) => product.is_available_today),
    feedbacks: [...shop.feedbacks]
      .filter((item) => item.approved)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  });
});

function publicSettings(settings) {
  return {
    shop_name: settings.shop_name,
    tagline: settings.tagline,
    about: settings.about,
    whatsapp_number: settings.whatsapp_number,
    phone: settings.phone,
    address: settings.address,
    tiktok: settings.tiktok || "",
    instagram: "",
    facebook: "",
    show_unavailable: settings.show_unavailable,
    daily_news: settings.daily_news || "",
    special_order_enabled: settings.special_order_enabled !== false,
    special_order_note: settings.special_order_note || "",
    festival_enabled: Boolean(settings.festival_enabled),
    festival_title: settings.festival_title || "",
    festival_note: settings.festival_note || "",
    availability_updated_at: settings.availability_updated_at
  };
}
