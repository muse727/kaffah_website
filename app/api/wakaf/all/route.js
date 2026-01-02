import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
// PENTING: Tambahkan ini biar gak cache (biar data selalu fresh saat admin buka)
export const dynamic = 'force-dynamic'; 

export async function GET() {
  const allWakaf = await prisma.wakaf.findMany({
    orderBy: {
      createdAt: 'desc', // Yang terbaru paling atas
    },
  });

  return NextResponse.json(allWakaf);
}