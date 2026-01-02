import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Ambil Data Statistik (Sama kayak kemarin)
export async function GET() {
  const data = await prisma.wakaf.findMany({ orderBy: { createdAt: 'desc' } });
  
  const totalCollected = data
    .filter(item => item.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  return NextResponse.json({
    success: true,
    data: {
      collected: totalCollected,
      donorCount: data.filter(i => i.status === 'SUCCESS').length,
      donors: data.filter(i => i.status === 'SUCCESS').map(d => ({
        wakifName: d.nama,
        amount: d.nominal,
        niatDoa: d.message,
        createdAt: d.createdAt
      }))
    }
  });
}

// POST: Bikin Invoice Baru (Step 1)
export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, wakif_name, wakif_phone, niat_doa, unit } = body;

    const transaksi = await prisma.wakaf.create({
      data: {
        nama: wakif_name,
        whatsapp: wakif_phone,
        nominal: parseInt(amount),
        message: niat_doa,
        unit: unit,
        status: 'UNPAID', // Status awal belum bayar
      },
    });

    return NextResponse.json({ success: true, id: transaksi.id });
    
  } catch (error) {
    console.error("Error create invoice:", error);
    return NextResponse.json({ success: false, message: "Gagal membuat invoice" }, { status: 500 });
  }
}