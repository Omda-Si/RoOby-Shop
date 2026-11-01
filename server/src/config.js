import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: path.join(rootDir, ".env") });

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin,
  crossSite: !clientOrigin.includes("localhost"),
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "rooby2026",
  uploadDir: path.join(rootDir, "uploads")
};
