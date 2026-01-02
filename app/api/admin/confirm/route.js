import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  // Ambil ID wakaf yang mau dikonfirmasi
  const { id } = await request.json();

  const updateWakaf = await prisma.wakaf.update({
    where: { id: parseInt(id) },
    data: { status: 'SUCCESS' }, // Ubah jadi SUCCESS
  });

  return NextResponse.json(updateWakaf);
}