import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // 1. Ambil nama yang diketik user dari Frontend
    const { nama } = await req.json();

    if (!nama) {
      return NextResponse.json({ status: "ERROR", message: "Nama harus diisi" });
    }

    // 2. Cari di Database (Case Insensitive / Huruf besar kecil gak ngaruh)
    const hasil = await prisma.hasilUjian.findFirst({
      where: {
        nama: {
          contains: nama, // Cari yang namanya "mirip" (contoh: ketik "ahmad" ketemu "Ahmad Dahlan")
          // mode: 'insensitive' // Opsional: Tergantung database, MySQL biasanya default udah insensitive
        },
      },
    });

    // 3. Kalau Gak Ketemu
    if (!hasil) {
      return NextResponse.json({ status: "NOT_FOUND" });
    }

    // 4. Kalau Ketemu, kirim datanya balik ke Frontend
    return NextResponse.json({
      status: "LULUS", // Atau ambil dari database: hasil.status
      nama: hasil.nama,
      juz: hasil.juz,
      predikat: hasil.predikat,
      posterUrl: hasil.posterUrl, // <--- Ini PENTING biar gambarnya muncul
      pesan: hasil.pesan
    });

  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ status: "ERROR", error: error.message });
  }
}