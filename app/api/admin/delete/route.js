import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; 

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    // 1. Cek siapa yang lagi login
    const session = await getServerSession(authOptions);
    const adminName = session?.user?.name || "Sistem Rabbani";

    const { id } = await req.json();

    // 2. Cari datanya sebelum dihapus biar namanya bisa dicatet
    const wakaf = await prisma.wakaf.findUnique({ where: { id } });
    if (!wakaf) return NextResponse.json({ message: 'Data tidak ditemukan' }, { status: 404 });

    // 3. Hapus datanya
    await prisma.wakaf.delete({
      where: { id },
    });

    // 4. 🚨 REKAM KE CCTV 🚨
    await prisma.activityLog.create({
      data: {
        adminName: adminName,
        action: "HAPUS DONASI",
        description: `Menghapus data/riwayat donasi atas nama ${wakaf.nama} (Rp ${wakaf.nominal})`
      }
    });

    return NextResponse.json({ message: 'Data berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}