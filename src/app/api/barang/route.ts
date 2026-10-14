import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const data = await prisma.barang.findMany({
    where: search
      ? {
          OR: [{ nama: { contains: search } }, { kode: { contains: search } }],
          isActive: true,
        }
      : { isActive: true },
    orderBy: { nama: "asc" },
  });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Hanya Admin yang boleh tambah/edit barang
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Hanya Admin yang boleh mengelola barang" }, { status: 403 });
  }

  const body = await req.json();

  try {
    if (body.action === "create") {
      const existing = await prisma.barang.findUnique({ where: { kode: body.kode } });
      if (existing) throw new Error("Kode barang sudah ada");

      const data = await prisma.barang.create({
        data: {
          kode: body.kode,
          nama: body.nama,
          kategori: body.kategori || null,
          satuan: body.satuan || "pcs",
          stok: body.stok || 0,
          stokMinimum: body.stokMinimum || 5,
          hargaBeli: body.hargaBeli || null,
          hargaJual: body.hargaJual || null,
          deskripsi: body.deskripsi || null,
        },
      });
      return NextResponse.json(data);
    }

    if (body.action === "update") {
      const data = await prisma.barang.update({
        where: { id: body.id },
        data: {
          nama: body.nama,
          kategori: body.kategori,
          satuan: body.satuan,
          stokMinimum: body.stokMinimum,
          hargaBeli: body.hargaBeli,
          hargaJual: body.hargaJual,
          deskripsi: body.deskripsi,
        },
      });
      return NextResponse.json(data);
    }

    if (body.action === "delete") {
      await prisma.barang.update({
        where: { id: body.id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
