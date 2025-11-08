// src/lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

if (!globalForPrisma._prisma) {
  globalForPrisma._prisma = new PrismaClient();
}

export const prisma = globalForPrisma._prisma;
