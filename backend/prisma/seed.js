import bcrypt from "bcryptjs";
import prisma from "../src/prisma.js";

const username = "admin";
const password = "Admin123";

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: {
      username,
    },
    update: {
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      username,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("=================================");
  console.log("Akun admin berhasil disiapkan");
  console.log("Username :", user.username);
  console.log("Role     :", user.role);
  console.log("Status   :", user.status);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("Gagal membuat akun admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });