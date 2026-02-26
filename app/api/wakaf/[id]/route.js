import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// GET: Ambil Detail Transaksi (Kodingan lu udah bener banget, gua biarin utuh)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const wakafId = parseInt(id);

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
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// POST: Upload Bukti Bayar (UDAH DIGABUNG SAMA SENSOR X-RAY 🛡️)
export async function POST(request, { params }) {
  try {
    const { id } = await params; 
    const wakafId = parseInt(id);
    const formData = await request.formData();
    const file = formData.get('buktiBayar');

    if (!file || file === 'null') {
      return NextResponse.json({ success: false, message: "File tidak ada" }, { status: 400 });
    }

    // 🛡️ SENSOR 1: BATASAN UKURAN FILE (Maksimal 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: 'Ukuran file terlalu besar! Maksimal 5MB.' }, { status: 400 });
    }

    // 🛡️ SENSOR 2: CEK DNA FILE (MIME TYPE HARUS GAMBAR)
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.warn(`[SECURITY ALERT] Percobaan upload ilegal di ID ${wakafId}`);
      return NextResponse.json({ success: false, message: 'Ditolak! Hanya boleh mengunggah file gambar (JPG/PNG).' }, { status: 403 });
    }

    // 🛡️ SENSOR 3: PEMBERSIH NAMA FILE (Sanitization)
    // Hapus karakter aneh dari nama asli biar gak ngerusak folder server
    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Nama file digabung biar unik dan rapi
    const fileName = `WAKAF-${wakafId}-${Date.now()}_${safeOriginalName}`;
    
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
        status: 'PENDING' // Update status biar admin tau ada bukti baru
      }
    });

    return NextResponse.json({ success: true, message: 'Bukti berhasil diupload' });

  } catch (error) {
    console.error("API Upload Error:", error);
    return NextResponse.json({ success: false, message: "Gagal upload file" }, { status: 500 });
  }
}