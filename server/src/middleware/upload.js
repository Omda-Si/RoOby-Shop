import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { config } from "../config.js";

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

export const uploadProductImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("صيغة الصورة غير مدعومة"));
    }
  }
}).single("image");
