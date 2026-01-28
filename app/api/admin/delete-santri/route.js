import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });
    }

    // Hapus data berdasarkan ID
    await prisma.hasilUjian.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}