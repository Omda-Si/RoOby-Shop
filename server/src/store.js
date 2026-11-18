import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { config, onNetlify } from "./config.js";

const dataDir = config.dataDir;
const shopPath = path.join(dataDir, "shop.json");

function now() {
  return new Date().toISOString();
}

function defaultShop() {
  const categories = [
    { id: 1, name_ar: "كيك بيتي", slug: "cake", sort_order: 1, accent: "pink" },
    { id: 2, name_ar: "كوكيز وبراونيز", slug: "cookies", sort_order: 2, accent: "rose" },
    { id: 3, name_ar: "حلويات شرقية", slug: "oriental", sort_order: 3, accent: "blush" },
    { id: 4, name_ar: "معمول وتمر", slug: "maamoul", sort_order: 4, accent: "pink" },
    { id: 5, name_ar: "تشيز كيك", slug: "cheesecake", sort_order: 5, accent: "rose" },
    { id: 6, name_ar: "حلويات الشوكولاتة", slug: "chocolate", sort_order: 6, accent: "blush" }
  ];

  const products = [
    {
      id: 1,
      name_ar: "كيكة شوكولاتة بيتية",
      description: "كيكة طرية معمولة في البيت، غنية بالكاكاو ومغطاة بصوص شوكولاتة.",
      price: 8500,
      image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
      category_id: 1,
      is_featured: true,
      is_available_today: true,
      quantity: 6,
      is_sold_out: false,
      layout_variant: "featured",
      sort_order: 1
    },
    {
      id: 2,
      name_ar: "كيكة فانيليا بالكريمة",
      description: "كيكة بيتية خفيفة، بطعم الفانيليا وكريمة زبدة ناعمة.",
      price: 7500,
      image_url: "https://images.unsplash.com/photo-1464349095431-e9a7ceb1d5b1?auto=format&fit=crop&w=900&q=80",
      category_id: 1,
      is_featured: true,
      is_available_today: true,
      quantity: 5,
      is_sold_out: false,
      layout_variant: "wide",
      sort_order: 2
    },
    {
      id: 3,
      name_ar: "ريد فيلفيت",
      description: "قطعة حمراء ناعمة بكريمة الجبن، مناسبة للمناسبات.",
      price: 9000,
      image_url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
      category_id: 1,
      is_featured: false,
      is_available_today: true,
      quantity: 4,
      is_sold_out: false,
      layout_variant: "tall",
      sort_order: 3
    },
    {
      id: 4,
      name_ar: "كوكيز شوكولاتة",
      description: "كوكيز طري من الوسط، قطع شوكولاتة ظاهرة في كل حبة.",
      price: 2500,
      image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
      category_id: 2,
      is_featured: true,
      is_available_today: true,
      quantity: 20,
      is_sold_out: false,
      layout_variant: "standard",
      sort_order: 4
    },
    {
      id: 5,
      name_ar: "براونيز بيتي",
      description: "براونيز كثيف ورطب، طعمه شوكولاتة واضح.",
      price: 3000,
      image_url: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=900&q=80",
      category_id: 2,
      is_featured: false,
      is_available_today: true,
      quantity: 12,
      is_sold_out: false,
      layout_variant: "stamp",
      sort_order: 5
    },
    {
      id: 6,
      name_ar: "بقلاوة بيتية",
      description: "طبقات رقيقة مع فستق وعسل، محمصة في البيت.",
      price: 5500,
      image_url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=80",
      category_id: 3,
      is_featured: true,
      is_available_today: true,
      quantity: 10,
      is_sold_out: false,
      layout_variant: "wide",
      sort_order: 6
    },
    {
      id: 7,
      name_ar: "كنافة بالقشطة",
      description: "كنافة طرية من الفرن، قشطة بيتية وسكر خفيف.",
      price: 6000,
      image_url: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=80",
      category_id: 3,
      is_featured: false,
      is_available_today: true,
      quantity: 8,
      is_sold_out: false,
      layout_variant: "featured",
      sort_order: 7
    },
    {
      id: 8,
      name_ar: "بسبوسة",
      description: "بسبوسة سميد طرية، مسقية بشربات خفيف وليمون.",
      price: 3500,
      image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=80",
      category_id: 3,
      is_featured: false,
      is_available_today: true,
      quantity: 14,
      is_sold_out: false,
      layout_variant: "standard",
      sort_order: 8
    },
    {
      id: 9,
      name_ar: "معمول بالتمر",
      description: "معمول هش بحشوة تمر ناعمة، معمول يدوي.",
      price: 4000,
      image_url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=80",
      category_id: 4,
      is_featured: false,
      is_available_today: true,
      quantity: 18,
      is_sold_out: false,
      layout_variant: "tall",
      sort_order: 9
    },
    {
      id: 10,
      name_ar: "تمر محشي",
      description: "تمر سكري محشي لوز، مرتب في علبة صغيرة.",
      price: 4800,
      image_url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80",
      category_id: 4,
      is_featured: false,
      is_available_today: false,
      quantity: 0,
      is_sold_out: true,
      layout_variant: "standard",
      sort_order: 10
    },
    {
      id: 11,
      name_ar: "تشيز كيك فراولة",
      description: "تشيز كيك بارد بطعم الفراولة، طبقة كريمة ناعمة.",
      price: 7000,
      image_url: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&w=900&q=80",
      category_id: 5,
      is_featured: true,
      is_available_today: true,
      quantity: 7,
      is_sold_out: false,
      layout_variant: "featured",
      sort_order: 11
    },
    {
      id: 12,
      name_ar: "تشيز كيك سادة",
      description: "قطعة كلاسيكية، مناسبة مع القهوة أو الهدية.",
      price: 6500,
      image_url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=900&q=80",
      category_id: 5,
      is_featured: false,
      is_available_today: true,
      quantity: 6,
      is_sold_out: false,
      layout_variant: "stamp",
      sort_order: 12
    },
    {
      id: 13,
      name_ar: "كرات الشوكولاتة",
      description: "كرات بيتية صغيرة، كاكاو وجوز هند من بره.",
      price: 2200,
      image_url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
      category_id: 6,
      is_featured: false,
      is_available_today: true,
      quantity: 16,
      is_sold_out: false,
      layout_variant: "standard",
      sort_order: 13
    },
    {
      id: 14,
      name_ar: "تارت شوكولاتة",
      description: "قاعدة مقرمشة وحشوة شوكولاتة كثيفة.",
      price: 5000,
      image_url: "https://images.unsplash.com/photo-1511381939415-e44015466831?auto=format&fit=crop&w=900&q=80",
      category_id: 6,
      is_featured: false,
      is_available_today: true,
      quantity: 5,
      is_sold_out: false,
      layout_variant: "wide",
      sort_order: 14
    }
  ];

  return {
    admin: {
      id: 1,
      username: config.adminUsername,
      password_hash: bcrypt.hashSync(config.adminPassword, 10)
    },
    settings: {
      shop_name: "RoOby",
      tagline: "حلو يومك يبدأ من هنا!",
      about: "متجر حلويات بيتية أونلاين. بنحدّث المتوفر كل يوم، والطلب يتم مباشرة عبر واتساب.",
      whatsapp_number: "249997533834",
      phone: "0997533834",
      address: "طلب أونلاين — التوصيل حسب الاتفاق",
      tiktok: "https://www.tiktok.com/@dyrdzcak1sug",
      instagram: "",
      facebook: "",
      show_unavailable: true,
      daily_news: "اليوم في كيكة شوكولاتة، كنافة، وتشيز كيك فراولة. اطلب بدري قبل ما يخلص.",
      special_order_enabled: true,
      special_order_note:
        "تقدر تطلب كيكة أو صينية خاصة حسب مناسبتك. اكتبي النوع، الكمية، وتاريخ الاستلام، ونرد عليك في واتساب.",
      festival_enabled: true,
      festival_title: "مناسبات وأعياد",
      festival_note:
        "في رمضان، العيد، أو أي مناسبة، نقدر نجهّز صواني وحلويات حسب طلبك. اكتبي المناسبة والكمية في واتساب.",
      availability_updated_at: now(),
      updated_at: now()
    },
    categories,
    products,
    feedbacks: defaultFeedbacks(),
    orders: defaultOrders(),
    nextProductId: 15,
    nextCategoryId: 7,
    nextFeedbackId: 5,
    nextOrderId: 40
  };
}

function defaultFeedbacks() {
  return [
    {
      id: 1,
      name: "منى عبد الله",
      comment: "الكيكة طرية وريحة البيت ظاهرة. طلبت مرتين والحمد لله ثابتين.",
      rating: 5,
      approved: true,
      created_at: daysAgo(2)
    },
    {
      id: 2,
      name: "أحمد إبراهيم",
      comment: "الطلب من واتساب سهل، والكنافة وصلت سخنة ومرتبة.",
      rating: 5,
      approved: true,
      created_at: daysAgo(5)
    },
    {
      id: 3,
      name: "سلمى حسن",
      comment: "تشيز كيك الفراولة خفيف وحلو بمقدار مظبوط. محل يثق فيه الواحد.",
      rating: 4,
      approved: true,
      created_at: daysAgo(8)
    },
    {
      id: 4,
      name: "ياسر محمد",
      comment: "المعمول طعمه بيتي فعلاً. لو زادت كمية اليوم أحسن.",
      rating: 5,
      approved: true,
      created_at: daysAgo(12)
    }
  ];
}

function defaultOrders() {
  const names = ["كيكة شوكولاتة بيتية", "كنافة بالقشطة", "كوكيز شوكولاتة", "تشيز كيك فراولة", "بقلاوة بيتية", "معمول بالتمر"];
  const prices = [8500, 6000, 2500, 7000, 5500, 4000];
  const orders = [];
  let id = 1;
  for (let day = 27; day >= 0; day -= 1) {
    const count = 1 + (day % 3);
    for (let n = 0; n < count; n += 1) {
      const index = (day + n) % names.length;
      const qty = 1 + (n % 2);
      orders.push({
        id: id++,
        created_at: daysAgo(day, n * 2 + 10),
        total: prices[index] * qty,
        items: [{ name_ar: names[index], qty, price: prices[index] }]
      });
    }
  }
  return orders;
}

function daysAgo(days, hour = 14) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
}

function normalizeShop(shop) {
  let changed = false;
  if (!Array.isArray(shop.feedbacks) || shop.feedbacks.length === 0) {
    shop.feedbacks = defaultFeedbacks();
    shop.nextFeedbackId = 5;
    changed = true;
  }
  if (!Array.isArray(shop.orders) || shop.orders.length === 0) {
    shop.orders = defaultOrders();
    shop.nextOrderId = shop.orders.length + 1;
    changed = true;
  }
  shop.nextFeedbackId = shop.nextFeedbackId || (Math.max(0, ...shop.feedbacks.map((item) => item.id)) + 1);
  shop.nextOrderId = shop.nextOrderId || (Math.max(0, ...shop.orders.map((item) => item.id)) + 1);
  for (const feedback of shop.feedbacks) {
    if (typeof feedback.approved !== "boolean") {
      feedback.approved = Number(feedback.id) <= 4;
      changed = true;
    }
  }
  if (!shop.settings.tiktok) {
    shop.settings.tiktok = "https://www.tiktok.com/@dyrdzcak1sug";
    changed = true;
  }
  shop.settings.instagram = "";
  shop.settings.facebook = "";
  if (shop.settings.whatsapp_number === "249900000000") {
    shop.settings.whatsapp_number = "249997533834";
    shop.settings.phone = "0997533834";
    changed = true;
  }
  if (typeof shop.settings.special_order_enabled !== "boolean") {
    shop.settings.special_order_enabled = true;
    changed = true;
  }
  if (!shop.settings.special_order_note) {
    shop.settings.special_order_note =
      "تقدر تطلب كيكة أو صينية خاصة حسب مناسبتك. اكتبي النوع، الكمية، وتاريخ الاستلام، ونرد عليك في واتساب.";
    changed = true;
  }
  if (typeof shop.settings.festival_enabled !== "boolean") {
    shop.settings.festival_enabled = true;
    changed = true;
  }
  if (typeof shop.settings.festival_title !== "string") {
    shop.settings.festival_title = "مناسبات وأعياد";
    changed = true;
  }
  if (typeof shop.settings.festival_note !== "string") {
    shop.settings.festival_note =
      "في رمضان، العيد، أو أي مناسبة، نقدر نجهّز صواني وحلويات حسب طلبك. اكتبي المناسبة والكمية في واتساب.";
    changed = true;
  }
  return { shop, changed };
}

export function useBlobStore() {
  return onNetlify || process.env.USE_NETLIFY_BLOBS === "1";
}

async function shopBlobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("rooby-data");
}

export async function uploadBlobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("rooby-uploads");
}

function envSignature() {
  return crypto
    .createHash("sha256")
    .update(`${config.adminUsername}:${config.adminPassword}`)
    .digest("hex");
}

// Netlify env vars are the source of truth until the owner changes the account in Settings.
function applyEnvAdmin(shop, { force = false } = {}) {
  const signature = envSignature();
  if (!force && (shop.admin?.custom || shop.admin?.env_sig === signature)) {
    return false;
  }
  shop.admin = {
    id: shop.admin?.id || 1,
    username: config.adminUsername,
    password_hash: bcrypt.hashSync(config.adminPassword, 10),
    env_sig: signature
  };
  return true;
}

export async function readShop() {
  if (useBlobStore()) {
    const store = await shopBlobStore();
    let shop = await store.get("shop", { type: "json" });
    if (!shop) {
      shop = fs.existsSync(shopPath)
        ? JSON.parse(fs.readFileSync(shopPath, "utf8"))
        : defaultShop();
      applyEnvAdmin(shop, { force: true });
      await store.setJSON("shop", shop);
    } else if (applyEnvAdmin(shop, { force: process.env.ADMIN_RESET === "1" })) {
      await writeShop(shop);
    }
    const normalized = normalizeShop(shop);
    if (normalized.changed) {
      await writeShop(normalized.shop);
    }
    return normalized.shop;
  }

  if (!fs.existsSync(shopPath)) {
    const created = defaultShop();
    await writeShop(created);
    return created;
  }

  const normalized = normalizeShop(JSON.parse(fs.readFileSync(shopPath, "utf8")));
  if (normalized.changed) {
    await writeShop(normalized.shop);
  }
  return normalized.shop;
}

export async function writeShop(data) {
  if (useBlobStore()) {
    const store = await shopBlobStore();
    await store.setJSON("shop", data);
    return;
  }

  fs.mkdirSync(dataDir, { recursive: true });
  const tmp = `${shopPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, shopPath);
}

export async function updateShop(mutator) {
  const shop = await readShop();
  const result = await mutator(shop);
  await writeShop(shop);
  return result === undefined ? shop : result;
}

export function enrichProduct(product, categories = []) {
  const category = categories.find((item) => Number(item.id) === Number(product.category_id));
  return {
    ...product,
    category_name: category?.name_ar || null,
    category_slug: category?.slug || null
  };
}
