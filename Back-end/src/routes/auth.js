// src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const r = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretubah";

// register
r.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Semua field wajib diisi" });

    // password rules enforced also on frontend; double-check here
    if (password.length < 8) return res.status(400).json({ error: "Password minimal 8 karakter" });
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChar.test(password)) return res.status(400).json({ error: "Password harus mengandung karakter unik" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email sudah terdaftar" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hash } });

    return res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// login
r.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password wajib" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Email tidak ditemukan" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Email atau password salah" });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Kesalahan server" });
  }
});

// seed-admin (optional small endpoint)
// ====== Seed admin endpoint (opsional, hanya dev) ======
r.post("/seed-admin", async (req, res) => {
  try {
    const email = req.body.email || "admin@desa.id";
    const password = req.body.password || "admin123";
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.json({ ok: true, message: "Admin exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name: "Admin Desa", email, password: hash, role: "admin" } });
    return res.json({ ok: true, message: "Admin seeded", user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("seed-admin error:", err);
    return res.status(500).json({ error: "Gagal seed admin" });
  }
});


export default r;
