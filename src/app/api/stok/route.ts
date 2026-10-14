import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.stokLog.findMany({
    include: {
      barang: { select: { kode: true, nama: true, satuan: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const userId = (session.user as any).id;

  try {
    const barang = await prisma.barang.findUnique({ where: { id: body.barangId } });
    if (!barang) throw new Error("Barang tidak ditemukan");

    const jumlah = parseInt(body.jumlah);
    if (jumlah <= 0) throw new Error("Jumlah harus lebih dari 0");

    if (body.type === "KELUAR" && barang.stok < jumlah) {
      throw new Error(`Stok tidak cukup. Stok saat ini: ${barang.stok}`);
    }

    // Update stok + catat log dalam 1 transaksi
    const [log] = await prisma.$transaction([
      prisma.stokLog.create({
        data: {
          barangId: body.barangId,
          userId,
          type: body.type,
          jumlah,
          keterangan: body.keterangan || null,
        },
      }),
      prisma.barang.update({
        where: { id: body.barangId },
        data: {
          stok: body.type === "MASUK"
            ? { increment: jumlah }
            : { decrement: jumlah },
        },
      }),
    ]);

    return NextResponse.json(log);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
