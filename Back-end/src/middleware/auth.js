// src/middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretubah";

export const requireAuth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token tidak ditemukan" });

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // { sub: userId, role }
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Akses ditolak" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token tidak valid" });
    }
  };
};
