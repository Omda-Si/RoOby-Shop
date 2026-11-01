import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin.id, username: admin.username }, config.jwtSecret, {
    expiresIn: "7d"
  });
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: config.crossSite ? "none" : "lax",
    secure: config.crossSite || process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  };
}

export function setAuthCookie(res, token) {
  res.cookie("rooby_token", token, cookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie("rooby_token", cookieOptions());
}

export function requireAdmin(req, res, next) {
  const token = req.cookies?.rooby_token;
  if (!token) {
    return res.status(401).json({ error: "يلزم تسجيل الدخول" });
  }

  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: "الجلسة انتهت، سجّل دخولك مرة ثانية" });
  }
}
