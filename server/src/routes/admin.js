import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { uploadProductImage } from "../middleware/upload.js";
import { enrichProduct, readShop, updateShop } from "../store.js";
import { serializeProduct, slugify } from "../utils/product.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

function productPayload(body) {
  return {
    name_ar: String(body.name_ar || "").trim(),
    description: String(body.description || "").trim(),
    price: Number(body.price),
    image_url: body.image_url ? String(body.image_url) : null,
    category_id: body.category_id ? Number(body.category_id) : null,
    is_featured: Boolean(body.is_featured),
    is_available_today: body.is_available_today !== false,
    quantity: Math.max(0, Number(body.quantity || 0)),
    is_sold_out: Boolean(body.is_sold_out) || Number(body.quantity || 0) === 0,
    layout_variant: ["standard", "tall", "wide", "featured", "stamp"].includes(body.layout_variant)
      ? body.layout_variant
      : "standard",
    sort_order: Number(body.sort_order || 0)
  };
}

function allProducts(shop) {
  return shop.products
    .map((row) => serializeProduct(enrichProduct(row, shop.categories), { includeHidden: true }))
    .sort((a, b) => (a.category_name || "").localeCompare(b.category_name || "", "ar") || a.sort_order - b.sort_order);
}

function stamp(shop) {
  shop.settings.availability_updated_at = new Date().toISOString();
  shop.settings.updated_at = shop.settings.availability_updated_at;
}

adminRouter.get("/products", (_req, res) => {
  res.json(allProducts(readShop()));
});

adminRouter.post("/products", (req, res) => {
  const data = productPayload(req.body);
  if (!data.name_ar || Number.isNaN(data.price)) {
    return res.status(400).json({ error: "اسم المنتج والسعر مطلوبين" });
  }

  const created = updateShop((shop) => {
    const product = {
      id: shop.nextProductId++,
      ...data,
      image_url: data.image_url
    };
    shop.products.push(product);
    stamp(shop);
    return serializeProduct(enrichProduct(product, shop.categories), { includeHidden: true });
  });
  res.status(201).json(created);
});

adminRouter.put("/products/:id", (req, res) => {
  const data = productPayload(req.body);
  const updated = updateShop((shop) => {
    const product = shop.products.find((item) => String(item.id) === String(req.params.id));
    if (!product) return null;
    Object.assign(product, data, {
      image_url: data.image_url || product.image_url
    });
    stamp(shop);
    return serializeProduct(enrichProduct(product, shop.categories), { includeHidden: true });
  });
  if (!updated) {
    return res.status(404).json({ error: "المنتج غير موجود" });
  }
  res.json(updated);
});

adminRouter.delete("/products/:id", (req, res) => {
  updateShop((shop) => {
    shop.products = shop.products.filter((item) => String(item.id) !== String(req.params.id));
    stamp(shop);
  });
  res.json({ ok: true });
});

adminRouter.post("/products/:id/image", (req, res) => {
  uploadProductImage(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message || "فشل رفع الصورة" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "اختَر صورة للمنتج" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const updated = updateShop((shop) => {
      const product = shop.products.find((item) => String(item.id) === String(req.params.id));
      if (!product) return null;
      product.image_url = imageUrl;
      stamp(shop);
      return serializeProduct(enrichProduct(product, shop.categories), { includeHidden: true });
    });
    if (!updated) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }
    res.json(updated);
  });
});

adminRouter.put("/today", (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const shop = updateShop((current) => {
    for (const item of items) {
      const product = current.products.find((row) => String(row.id) === String(item.id));
      if (!product) continue;
      const quantity = Math.max(0, Number(item.quantity || 0));
      product.is_available_today = item.is_available_today !== false;
      product.quantity = quantity;
      product.is_sold_out = Boolean(item.is_sold_out) || quantity === 0;
      if (typeof item.is_featured === "boolean") {
        product.is_featured = item.is_featured;
      }
    }
    if (typeof req.body?.daily_news === "string") {
      current.settings.daily_news = req.body.daily_news.trim();
    }
    if (typeof req.body?.special_order_note === "string") {
      current.settings.special_order_note = req.body.special_order_note.trim();
    }
    if (typeof req.body?.special_order_enabled === "boolean") {
      current.settings.special_order_enabled = req.body.special_order_enabled;
    }
    if (typeof req.body?.festival_title === "string") {
      current.settings.festival_title = req.body.festival_title.trim();
    }
    if (typeof req.body?.festival_note === "string") {
      current.settings.festival_note = req.body.festival_note.trim();
    }
    if (typeof req.body?.festival_enabled === "boolean") {
      current.settings.festival_enabled = req.body.festival_enabled;
    }
    stamp(current);
    return current;
  });
  res.json(allProducts(shop));
});

adminRouter.get("/categories", (_req, res) => {
  res.json([...readShop().categories].sort((a, b) => a.sort_order - b.sort_order));
});

adminRouter.post("/categories", (req, res) => {
  const name_ar = String(req.body?.name_ar || "").trim();
  if (!name_ar) {
    return res.status(400).json({ error: "اسم التصنيف مطلوب" });
  }
  const created = updateShop((shop) => {
    const category = {
      id: shop.nextCategoryId++,
      name_ar,
      slug: slugify(req.body?.slug || name_ar),
      sort_order: Number(req.body?.sort_order || shop.categories.length + 1),
      accent: req.body?.accent || "pink"
    };
    shop.categories.push(category);
    return category;
  });
  res.status(201).json(created);
});

adminRouter.put("/categories/:id", (req, res) => {
  const name_ar = String(req.body?.name_ar || "").trim();
  const updated = updateShop((shop) => {
    const category = shop.categories.find((item) => String(item.id) === String(req.params.id));
    if (!category) return null;
    category.name_ar = name_ar;
    category.slug = slugify(req.body?.slug || name_ar);
    category.sort_order = Number(req.body?.sort_order || 0);
    category.accent = req.body?.accent || "pink";
    return category;
  });
  if (!updated) {
    return res.status(404).json({ error: "التصنيف غير موجود" });
  }
  res.json(updated);
});

adminRouter.delete("/categories/:id", (req, res) => {
  updateShop((shop) => {
    shop.categories = shop.categories.filter((item) => String(item.id) !== String(req.params.id));
    shop.products = shop.products.map((product) =>
      String(product.category_id) === String(req.params.id) ? { ...product, category_id: null } : product
    );
  });
  res.json({ ok: true });
});

adminRouter.get("/feedbacks", (_req, res) => {
  res.json([...readShop().feedbacks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

adminRouter.put("/feedbacks/:id/approve", (req, res) => {
  const updated = updateShop((shop) => {
    const feedback = shop.feedbacks.find((item) => String(item.id) === String(req.params.id));
    if (!feedback) return null;
    feedback.approved = true;
    return feedback;
  });
  if (!updated) {
    return res.status(404).json({ error: "التعليق غير موجود" });
  }
  res.json(updated);
});

adminRouter.delete("/feedbacks/:id", (req, res) => {
  updateShop((shop) => {
    shop.feedbacks = shop.feedbacks.filter((item) => String(item.id) !== String(req.params.id));
  });
  res.json({ ok: true });
});

adminRouter.get("/analytics", (_req, res) => {
  const orders = [...readShop().orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  function summarize(from) {
    const list = orders.filter((order) => new Date(order.created_at) >= from);
    return {
      orders: list.length,
      revenue: list.reduce((sum, order) => sum + Number(order.total || 0), 0)
    };
  }

  res.json({
    today: summarize(startOfDay),
    week: summarize(startOfWeek),
    month: summarize(startOfMonth),
    days: buildDays(orders, 7),
    weeks: buildWeeks(orders, 4),
    months: buildMonths(orders, 6),
    recent: orders.slice(0, 12)
  });
});

function buildDays(orders, count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    const key = date.toISOString().slice(0, 10);
    const list = orders.filter((order) => order.created_at.slice(0, 10) === key);
    return {
      label: new Intl.DateTimeFormat("ar-SD", { weekday: "short" }).format(date),
      orders: list.length,
      revenue: list.reduce((sum, order) => sum + Number(order.total || 0), 0)
    };
  });
}

function buildWeeks(orders, count) {
  return Array.from({ length: count }, (_, index) => {
    const end = new Date();
    end.setDate(end.getDate() - (count - 1 - index) * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const list = orders.filter((order) => {
      const created = new Date(order.created_at);
      return created >= start && created <= end;
    });
    return {
      label: `أسبوع ${index + 1}`,
      orders: list.length,
      revenue: list.reduce((sum, order) => sum + Number(order.total || 0), 0)
    };
  });
}

function buildMonths(orders, count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (count - 1 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const list = orders.filter((order) => order.created_at.slice(0, 7) === key);
    return {
      label: new Intl.DateTimeFormat("ar-SD", { month: "short" }).format(date),
      orders: list.length,
      revenue: list.reduce((sum, order) => sum + Number(order.total || 0), 0)
    };
  });
}

adminRouter.get("/settings", (_req, res) => {
  res.json(readShop().settings);
});

adminRouter.put("/settings", (req, res) => {
  const saved = updateShop((shop) => {
    Object.assign(shop.settings, {
      shop_name: String(req.body?.shop_name || "RoOby").trim(),
      tagline: String(req.body?.tagline || "").trim(),
      about: String(req.body?.about || "").trim(),
      whatsapp_number: String(req.body?.whatsapp_number || "").replace(/\D/g, ""),
      phone: String(req.body?.phone || "").trim(),
      address: String(req.body?.address || "").trim(),
      tiktok: String(req.body?.tiktok || "").trim(),
      instagram: "",
      facebook: "",
      show_unavailable: req.body?.show_unavailable !== false,
      daily_news: String(req.body?.daily_news || "").trim(),
      special_order_enabled: req.body?.special_order_enabled !== false,
      special_order_note: String(req.body?.special_order_note || "").trim(),
      festival_enabled: Boolean(req.body?.festival_enabled),
      festival_title: String(req.body?.festival_title || "").trim(),
      festival_note: String(req.body?.festival_note || "").trim(),
      updated_at: new Date().toISOString()
    });
    return shop.settings;
  });
  res.json(saved);
});
