import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { config } from "../config.js";
import { uploadBlobStore, useBlobStore } from "../store.js";

if (!useBlobStore()) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
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

export async function persistUploadedImage(file) {
  const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
  const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

  if (useBlobStore()) {
    const store = await uploadBlobStore();
    await store.set(filename, file.buffer, {
      metadata: { contentType: file.mimetype || "image/jpeg" }
    });
  } else {
    fs.writeFileSync(path.join(config.uploadDir, filename), file.buffer);
  }

  return `/uploads/${filename}`;
}
