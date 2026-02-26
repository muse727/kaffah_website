import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' }, // Urutkan dari yang paling baru
      take: 100 // Ambil 100 aktivitas terakhir aja biar server gak berat
    });
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil log aktivitas' }, { status: 500 });
  }
}