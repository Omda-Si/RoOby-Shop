import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { config } from "./config.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { catalogRouter } from "./routes/catalog.js";
import { publicRouter } from "./routes/public.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(config.uploadDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, shop: "RoOby" });
});

app.use("/api/auth", authRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "حصل خطأ في السيرفر" });
});

app.listen(config.port, "0.0.0.0", () => {
  console.log(`RoOby API running on http://localhost:${config.port}`);
});
