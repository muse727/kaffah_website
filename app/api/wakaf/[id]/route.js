import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// GET: Ambil Detail Transaksi
export async function GET(request, { params }) {
  try {
    // Wajib await params di Next.js terbaru!
    const { id } = await params;
    const wakafId = parseInt(id);

    // Cek ID Valid
    if (!wakafId || isNaN(wakafId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const transaksi = await prisma.wakaf.findUnique({
      where: { id: wakafId }
    });

    if (!transaksi) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: transaksi });

  } catch (error) {
    console.error("API GET Error:", error);
    // Return JSON error biar frontend gak kaget "Unexpected end of JSON"
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// POST: Upload Bukti Bayar
export async function POST(request, { params }) {
  try {
    const { id } = await params; // Await params juga disini
    const wakafId = parseInt(id);
    const formData = await request.formData();
    const file = formData.get('buktiBayar');

    if (!file) {
      return NextResponse.json({ success: false, message: "File tidak ada" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `WAKAF-${wakafId}-${Date.now()}${path.extname(file.name)}`;
    
    // Auto Create Folder Uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Folder already exists, ignore
    }
    
    await writeFile(path.join(uploadDir, fileName), buffer);

    await prisma.wakaf.update({
      where: { id: wakafId },
      data: {
        buktiBayar: fileName,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("API Upload Error:", error);
    return NextResponse.json({ success: false, message: "Gagal upload file" }, { status: 500 });
  }
}