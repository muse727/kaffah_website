import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Ambil semua data, urutkan dari yang paling baru diinput
    const santri = await prisma.hasilUjian.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(santri);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}