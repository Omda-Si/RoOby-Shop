import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

function resolveProjectRoot() {
  const candidates = [
    process.env.LAMBDA_TASK_ROOT,
    process.cwd(),
    path.resolve(process.cwd(), "..")
  ].filter(Boolean);

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "data", "shop.json"))) {
      return dir;
    }
  }
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
  }
  return candidates[0] || process.cwd();
}

export const projectRoot = resolveProjectRoot();
dotenv.config({ path: path.join(projectRoot, ".env") });

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const onNetlify = Boolean(process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT);

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin,
  crossSite: !clientOrigin.includes("localhost") && !onNetlify,
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "rooby2026",
  uploadDir: onNetlify ? path.join("/tmp", "rooby-uploads") : path.join(projectRoot, "uploads"),
  dataDir: path.join(projectRoot, "data")
};
