import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.tim.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch (error) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const { id, ...data } = await request.json();
    const newData = await prisma.tim.create({ data });
    return NextResponse.json(newData, { status: 201 });
  } catch (error) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    const updatedData = await prisma.tim.update({ where: { id: Number(id) }, data });
    return NextResponse.json(updatedData);
  } catch (error) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.tim.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}