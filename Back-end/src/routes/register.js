import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const r = Router();

// REGISTER USER BARU
r.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Semua field wajib diisi" });

    // validasi password minimal 8 char & 1 special char
    if (password.length < 8)
      return res.status(400).json({ error: "Password minimal 8 karakter" });
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChar.test(password))
      return res
        .status(400)
        .json({ error: "Password harus mengandung karakter unik (!@#$...)" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email sudah terdaftar" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hash },
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// LOGIN ADMIN & USER
r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: "Email tidak ditemukan" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ error: "Email atau password salah" });

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

export default r;
