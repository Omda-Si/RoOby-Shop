import { Router } from "express";
import bcrypt from "bcryptjs";
import { readShop } from "../store.js";
import { clearAuthCookie, requireAdmin, setAuthCookie, signAdminToken } from "../middleware/auth.js";

const loginAttempts = new Map();

function tooManyAttempts(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + 15 * 60 * 1000;
  }
  record.count += 1;
  loginAttempts.set(ip, record);
  return record.count > 8;
}

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const ip = req.ip || "local";
  if (tooManyAttempts(ip)) {
    return res.status(429).json({ error: "محاولات كثيرة. انتظر شوية وجرّب تاني." });
  }

  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  if (!username || !password) {
    return res.status(400).json({ error: "اكتب اسم المستخدم وكلمة المرور" });
  }

  const admin = readShop().admin;
  if (!admin || admin.username !== username || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  const token = signAdminToken(admin);
  setAuthCookie(res, token);
  return res.json({ username: admin.username });
});

authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});
