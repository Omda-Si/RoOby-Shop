import { Router } from "express";
import bcrypt from "bcryptjs";
import { readShop } from "../store.js";
import { clearAuthCookie, requireAdmin, setAuthCookie, signAdminToken } from "../middleware/auth.js";

const loginAttempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED = 10;

function clientKey(req) {
  const forwarded = String(req.headers["x-nf-client-connection-ip"] || req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwarded || req.ip || "local";
}

function isLocked(key) {
  const record = loginAttempts.get(key);
  if (!record) return false;
  if (Date.now() > record.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  return record.count >= MAX_FAILED;
}

function recordFailure(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    record.count += 1;
  }
}

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const key = clientKey(req);
  if (isLocked(key)) {
    return res.status(429).json({ error: "محاولات كثيرة. انتظر شوية وجرّب تاني." });
  }

  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  if (!username || !password) {
    return res.status(400).json({ error: "اكتب اسم المستخدم وكلمة المرور" });
  }

  const admin = (await readShop()).admin;
  if (!admin || admin.username !== username || !(await bcrypt.compare(password, admin.password_hash))) {
    recordFailure(key);
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  loginAttempts.delete(key);
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
