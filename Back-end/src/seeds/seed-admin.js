// Back-end/src/seeds/seed-admin.js
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

async function main() {
  const email = "admin@desa.id";
  const password = "admin123";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log("Admin exists");
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: "Admin Desa",
      email,
      password: hash,
      role: "admin",
    },
  });

  console.log("Admin seeded:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
