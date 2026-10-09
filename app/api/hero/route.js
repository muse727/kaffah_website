import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hero = await prisma.pengaturanHero.findUnique({ where: { id: 1 } });
    // Kalau belum disetting, kita kasih nilai default (foto bawaan lu)
    return NextResponse.json(hero || { tipe: 'IMAGE', mediaUrl: '/hero-bg.jpg' });
  } catch (error) { 
    return NextResponse.json({ error: 'Error' }, { status: 500 }); 
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Pake upsert: Kalau id 1 belum ada dia bikin baru, kalau udah ada dia update isinya
    const upsertHero = await prisma.pengaturanHero.upsert({
      where: { id: 1 },
      update: { tipe: data.tipe, mediaUrl: data.mediaUrl },
      create: { id: 1, tipe: data.tipe, mediaUrl: data.mediaUrl },
    });
    
    return NextResponse.json(upsertHero);
  } catch (error) { 
    return NextResponse.json({ error: 'Error' }, { status: 500 }); 
  }
}