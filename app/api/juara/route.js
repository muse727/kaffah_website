import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const juara = await prisma.juara.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(juara);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { id, ...createData } = data; // Buang ID biar Prisma yang bikin otomatis
    const newJuara = await prisma.juara.create({ data: createData });
    return NextResponse.json(newJuara, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    const updatedJuara = await prisma.juara.update({ where: { id: Number(id) }, data: updateData });
    return NextResponse.json(updatedJuara);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update data' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.juara.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus data' }, { status: 500 });
  }
}