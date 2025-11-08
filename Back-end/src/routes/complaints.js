// src/routes/complaints.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import fs from "fs";

const r = Router();

// ensure uploads dir
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Hanya gambar yg diizinkan"));
    cb(null, true);
  },
});

// POST /api/complaints  (user must be logged in)
r.post("/", requireAuth(["masyarakat", "user"]), upload.single("attachment"), async (req, res) => {
  try {
    const { title, category, location, message } = req.body;
    if (!title || !category || !message) return res.status(400).json({ error: "title, category, and message are required" });

    const created = await prisma.complaint.create({
      data: {
        title,
        category,
        location: location ?? null,
        message,
        attachment: req.file ? `/uploads/${req.file.filename}` : null,
        userId: req.user.sub,
      },
    });

    return res.status(201).json({ ticket: created.id, status: created.status });
  } catch (err) {
    console.error("Create complaint error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/complaints/mine  (user)
r.get("/mine", requireAuth(["masyarakat", "user"]), async (req, res) => {
  try {
    const list = await prisma.complaint.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: "desc" },
    });
    return res.json(list);
  } catch (err) {
    console.error("Get mine error:", err);
    return res.status(500).json({ error: "Gagal mengambil data pengaduan" });
  }
});

// GET /api/complaints/all  (admin)
r.get("/all", requireAuth(["admin"]), async (_req, res) => {
  try {
    const list = await prisma.complaint.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json(list);
  } catch (err) {
    console.error("Get all error:", err);
    return res.status(500).json({ error: "Gagal mengambil data semua pengaduan" });
  }
});

// GET /api/complaints/:ticket  (public)
r.get("/:ticket", async (req, res) => {
  try {
    const t = await prisma.complaint.findUnique({ where: { id: req.params.ticket } });
    if (!t) return res.status(404).json({ error: "Tiket tidak ditemukan" });
    return res.json(t);
  } catch (err) {
    console.error("Get ticket error:", err);
    return res.status(500).json({ error: "Gagal mengambil tiket" });
  }
});

// PATCH /api/complaints/:ticket/status  (admin)
r.patch("/:ticket/status", requireAuth(["admin"]), async (req, res) => {
  try {
    const { status, reason } = req.body;
    const allowed = ["submitted", "in_progress", "resolved", "rejected"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Status tidak valid" });

    const data = { status };
    if (status === "rejected" && reason) data.rejectionReason = reason;

    const updated = await prisma.complaint.update({
      where: { id: req.params.ticket },
      data,
    });

    return res.json({ id: updated.id, status: updated.status, rejectionReason: updated.rejectionReason ?? null });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ error: "Gagal update status" });
  }
});

export default r;
