import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth";
// Sesuaikan path import authOptions ini kalau error
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// 👉 MENGAMBIL SEMUA BERITA
export async function GET() {
  try {
    const kabar = await prisma.kabarTerbaru.findMany({
      orderBy: { createdAt: 'desc' } // Yang paling baru muncul duluan
    });
    return NextResponse.json({ success: true, data: kabar }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil kabar terbaru' }, { status: 500 });
  }
}

// 👉 MENAMBAH BERITA BARU & UPLOAD FOTO
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const adminName = session?.user?.name || "Admin Yayasan";

    const formData = await req.formData();
    const judul = formData.get('judul');
    const konten = formData.get('konten');
    const file = formData.get('gambar'); // File foto dari frontend

    let fileName = null;

    // Kalau admin upload foto progres, kita simpan fotonya
    if (file && file !== 'null' && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      fileName = Date.now() + '_kabar_' + file.name.replace(/\s+/g, '_');
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      // Bikin folder kalau belum ada
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    }

    // Simpan data tulisan ke database
    const newKabar = await prisma.kabarTerbaru.create({
      data: { judul, konten, gambar: fileName }
    });

    // 🚨 REKAM KE CCTV 🚨
    await prisma.activityLog.create({
      data: {
        adminName: adminName,
        action: "POSTING KABAR",
        description: `Mempublikasikan kabar terbaru: "${judul}"`
      }
    });

    return NextResponse.json({ success: true, message: 'Berhasil diposting' }, { status: 201 });
  } catch (error) {
    console.error("Gagal Posting:", error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan kabar' }, { status: 500 });
  }
}

// 👉 MENGHAPUS BERITA
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const adminName = session?.user?.name || "Admin Yayasan";

    const { id } = await req.json();

    // Cari dulu beritanya buat nyatet judulnya di CCTV
    const kabar = await prisma.kabarTerbaru.findUnique({ where: { id } });
    if (!kabar) return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });

    await prisma.kabarTerbaru.delete({ where: { id } });

    // 🚨 REKAM KE CCTV 🚨
    await prisma.activityLog.create({
      data: {
        adminName: adminName,
        action: "HAPUS KABAR",
        description: `Menghapus kabar terbaru: "${kabar.judul}"`
      }
    });

    return NextResponse.json({ success: true, message: 'Berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus kabar' }, { status: 500 });
  }
}