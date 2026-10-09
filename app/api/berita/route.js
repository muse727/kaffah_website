import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const berita = await prisma.berita.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(berita);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// 🔥 FIX ERROR 500 DI SINI
export async function POST(request) {
  try {
    const data = await request.json();
    
    // KUNCI FIX: Kita pisahin (buang) 'id' biar Prisma yang bikin angka otomatisnya
    const { id, ...createData } = data; 

    const newBerita = await prisma.berita.create({ data: createData });
    return NextResponse.json(newBerita, { status: 201 });
  } catch (error) {
    console.error("Error dari Database:", error); // Biar ketahuan kalau error lagi
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    const updatedBerita = await prisma.berita.update({
      where: { id: Number(id) },
      data: updateData
    });
    return NextResponse.json(updatedBerita);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update data' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.berita.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus data' }, { status: 500 });
  }
}