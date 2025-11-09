// src/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// expose uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// expose uploads folder — set headers supaya gambar bisa di-embed lintas-origin (dev)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, filePath) => {
      // izinkan origin frontend (atau ganti menjadi "*" jika kamu mau terbuka ke semua origin)
      const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
      res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
      // pastikan browser mengizinkan embedding resource lintas-origin
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);


// basic root & health
app.get("/", (_req, res) => res.send("Backend Desa — API is running. Use /api/health to check."));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err instanceof Error && err.message === "Hanya gambar yg diizinkan") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
