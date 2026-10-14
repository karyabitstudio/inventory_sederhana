import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  const password = await hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@inventory.local" },
    update: {},
    create: {
      email: "admin@inventory.local",
      password,
      name: "Admin Gudang",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@inventory.local" },
    update: {},
    create: {
      email: "staff@inventory.local",
      password,
      name: "Staff Gudang",
      role: "STAFF",
    },
  });

  // Contoh barang
  const barangList = [
    { kode: "BRG001", nama: "Kertas A4", kategori: "ATK", satuan: "rim", stok: 50, stokMinimum: 10, hargaBeli: 45000, hargaJual: 55000 },
    { kode: "BRG002", nama: "Pulpen Standard", kategori: "ATK", satuan: "box", stok: 30, stokMinimum: 5, hargaBeli: 25000, hargaJual: 35000 },
    { kode: "BRG003", nama: "Tinta Printer Hitam", kategori: "Elektronik", satuan: "pcs", stok: 8, stokMinimum: 5, hargaBeli: 120000, hargaJual: 150000 },
    { kode: "BRG004", nama: "Map Plastik", kategori: "ATK", satuan: "pcs", stok: 100, stokMinimum: 20, hargaBeli: 3000, hargaJual: 5000 },
    { kode: "BRG005", nama: "Stapler", kategori: "ATK", satuan: "pcs", stok: 15, stokMinimum: 5, hargaBeli: 18000, hargaJual: 25000 },
  ];

  for (const b of barangList) {
    await prisma.barang.upsert({
      where: { kode: b.kode },
      update: {},
      create: b,
    });
  }

  console.log("✅ Seed selesai!");
  console.log("\nAkun demo:");
  console.log("  admin@inventory.local  / password123  (ADMIN)");
  console.log("  staff@inventory.local  / password123  (STAFF)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
