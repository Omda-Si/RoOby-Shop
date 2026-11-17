import { Router } from "express";
import { updateShop } from "../store.js";

export const publicRouter = Router();

publicRouter.post("/feedback", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const comment = String(req.body?.comment || "").trim();
  const rating = Math.min(5, Math.max(1, Number(req.body?.rating || 5)));

  if (name.length < 2 || comment.length < 6) {
    return res.status(400).json({ error: "اكتب اسمك وتعليق واضح" });
  }

  const saved = await updateShop((shop) => {
    const feedback = {
      id: shop.nextFeedbackId++,
      name: name.slice(0, 40),
      comment: comment.slice(0, 280),
      rating,
      approved: false,
      created_at: new Date().toISOString()
    };
    shop.feedbacks.push(feedback);
    return feedback;
  });
  res.status(201).json(saved);
});

publicRouter.post("/orders", async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) {
    return res.status(400).json({ error: "الطلب فاضي" });
  }

  const normalized = items.map((item) => ({
    name_ar: String(item.name_ar || "").trim(),
    qty: Math.max(1, Number(item.qty || 1)),
    price: Math.max(0, Number(item.price || 0))
  }));
  const total = normalized.reduce((sum, item) => sum + item.price * item.qty, 0);

  const saved = await updateShop((shop) => {
    const order = {
      id: shop.nextOrderId++,
      created_at: new Date().toISOString(),
      total,
      items: normalized
    };
    shop.orders.push(order);
    return order;
  });
  res.status(201).json(saved);
});
