import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
// Sesuaikan path import ini kalau error (biasanya foldernya ada di /api/auth/[...nextauth]/route)
import { authOptions } from "../../auth/[...nextauth]/route"; 

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // 1. Cek identitas siapa yang lagi pencet tombol (Buat dicatet di CCTV)
    const session = await getServerSession(authOptions);
    const adminName = session?.user?.name || "Admin Yayasan";

    // 2. Ambil ID dari frontend
    const { id } = await request.json();

    // 3. Update status jadi SUCCESS (Ini persis kodingan lu yang lama)
    const updateWakaf = await prisma.wakaf.update({
      where: { id: parseInt(id) },
      data: { status: 'SUCCESS' },
    });

    // 4. 🚨 REKAM KE BUKU TAMU / CCTV 🚨
    // Karena updateWakaf nge-return data aslinya, kita bisa langsung comot nama donaturnya
    await prisma.activityLog.create({
      data: {
        adminName: adminName,
        action: "KONFIRMASI DONASI",
        description: `Mengkonfirmasi donasi dari ${updateWakaf.nama} (Rp ${updateWakaf.nominal.toLocaleString('id-ID')})`
      }
    });

    // 5. Balikin response ke frontend
    return NextResponse.json(updateWakaf, { status: 200 });

  } catch (error) {
    console.error("Gagal Konfirmasi:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}