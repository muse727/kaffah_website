import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { nama } = await req.json();

    if (!nama) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }

    // Cari santri berdasarkan nama (Flexible search)
    const santri = await prisma.hasilUjian.findFirst({
      where: {
        nama: {
          contains: nama, // Cari yang namanya mirip
        },
      },
    });

    if (!santri) {
      return NextResponse.json({ status: 'NOT_FOUND' });
    }

    // KIRIM SEMUA DATA PENTING KE FRONTEND
    return NextResponse.json({
      status: santri.status, // LULUS atau BELUM_LULUS
      nama: santri.nama,
      posterUrl: santri.posterUrl,
      pesan: santri.pesan, // Pesan semangat buat yang ga lulus
    });

  } catch (error) {
    console.error("Cek Error:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}