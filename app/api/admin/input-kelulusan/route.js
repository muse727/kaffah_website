import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, status, juz, predikat, posterUrl, pesan } = body;

    // Simpan pake Prisma (Gampang banget kan?)
    const dataBaru = await prisma.hasilUjian.create({
      data: {
        nama,
        status,
        juz: status === 'LULUS' ? juz : null,      // Kalau ga lulus, null
        predikat: status === 'LULUS' ? predikat : null,
        posterUrl: status === 'LULUS' ? posterUrl : null,
        pesan: pesan || null, // Simpan pesan semangat
      },
    });

    return NextResponse.json({ success: true, data: dataBaru });
    
  } catch (error) {
    console.error("Input Error:", error);
    return NextResponse.json({ success: false, error: "Gagal simpan data" }, { status: 500 });
  }
}