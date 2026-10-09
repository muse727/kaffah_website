import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // Tangkap file yang dikirim dari form
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diupload' }, { status: 400 });
    }

    // Ubah file jadi bentuk Buffer (data mentah biar bisa disimpen)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bikin nama file unik (Pake tambahan angka jam biar gak bentrok kalau namanya sama)
    const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    
    // Tentukan lokasi penyimpanan (di dalam folder public/uploads)
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Otomatis bikin folder 'uploads' kalau ternyata belum ada
    await mkdir(uploadDir, { recursive: true });

    // Simpan file fisik ke folder
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Balikin alamat URL gambarnya ke frontend
    return NextResponse.json({ url: `/uploads/${filename}` });
    
  } catch (error) {
    console.error('Error saat upload:', error);
    return NextResponse.json({ error: 'Gagal mengupload gambar' }, { status: 500 });
  }
}