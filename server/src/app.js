import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { config } from "./config.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { catalogRouter } from "./routes/catalog.js";
import { publicRouter } from "./routes/public.js";
import { uploadBlobStore, useBlobStore } from "./store.js";

export function createApp() {
  const app = express();
  const onNetlify = Boolean(process.env.NETLIFY);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin: onNetlify ? true : config.clientOrigin,
      credentials: true
    })
  );
  app.use(cookieParser());
  // On Netlify the body can arrive already read (Buffer/string), so express.json skips it.
  app.use((req, _res, next) => {
    const type = String(req.headers["content-type"] || "");
    if (!type.includes("application/json")) return next();

    let raw = null;
    if (Buffer.isBuffer(req.body)) raw = req.body.toString("utf8");
    else if (typeof req.body === "string") raw = req.body;
    else if (typeof req.apiGateway?.event?.body === "string" && (req.body === undefined || req.body === null)) {
      const event = req.apiGateway.event;
      raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    }

    if (raw !== null) {
      try {
        req.body = raw ? JSON.parse(raw) : {};
        req._body = true;
      } catch {
        req.body = {};
        req._body = true;
      }
    }
    next();
  });
  app.use(express.json({ limit: "2mb" }));

  if (useBlobStore()) {
    app.get("/uploads/:filename", async (req, res) => {
      try {
        const filename = pathSafe(req.params.filename);
        if (!filename) {
          return res.status(404).end();
        }
        const store = await uploadBlobStore();
        const blob = await store.getWithMetadata(filename, { type: "arrayBuffer" });
        if (!blob?.data) {
          return res.status(404).end();
        }
        res.set("Content-Type", blob.metadata?.contentType || "application/octet-stream");
        res.set("Cache-Control", "public, max-age=31536000, immutable");
        res.send(Buffer.from(blob.data));
      } catch (error) {
        console.error(error);
        res.status(404).end();
      }
    });
  } else {
    app.use("/uploads", express.static(config.uploadDir));
  }

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      shop: "RoOby",
      build: "auth-env-sync-2",
      env: {
        admin_username: JSON.stringify(process.env.ADMIN_USERNAME ?? null),
        admin_password_length: String(process.env.ADMIN_PASSWORD ?? "").length,
        jwt_secret: Boolean(process.env.JWT_SECRET),
        admin_reset: process.env.ADMIN_RESET === "1"
      }
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/catalog", catalogRouter);
  app.use("/api", publicRouter);
  app.use("/api/admin", adminRouter);

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: "حصل خطأ في السيرفر" });
  });

  return app;
}

function pathSafe(name) {
  const value = String(name || "");
  if (!value || value.includes("..") || value.includes("/") || value.includes("\\")) {
    return null;
  }
  return value;
}
