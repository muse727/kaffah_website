import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

// Best Practice: Mencegah too many connections di mode dev
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- 1. FUNGSI GET (Buat Ambil Data Realtime) ---
export async function GET(request) {
  try {
    // Ambil Data Campaign ID 1
    const campaign = await prisma.wakafCampaign.findUnique({
      where: { id: 1 }
    });

    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Campaign belum dibuat di Database' });
    }

    // Hitung Total Uang Masuk (Hanya yang statusnya 'paid')
    const aggregations = await prisma.wakafTransaction.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { 
        campaignId: 1, 
        status: 'paid' 
      }
    });

    // Ambil 10 Donatur Terakhir
    const latestDonors = await prisma.wakafTransaction.findMany({
      where: { 
        campaignId: 1, 
        status: 'paid' 
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        wakifName: true,
        amount: true,
        niatDoa: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        title: campaign.title,
        target: Number(campaign.targetAmount),
        collected: Number(aggregations._sum.amount || 0),
        donorCount: aggregations._count.id || 0,
        donors: latestDonors,
        description: campaign.description
      }
    });

  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal ambil data' }, { status: 500 });
  }
}

// --- 2. FUNGSI POST (Buat Terima Donasi & DOKU) ---
export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, wakif_name, wakif_phone, niat_doa } = body;

    // Validasi
    if (!amount || amount < 10000) {
      return NextResponse.json({ success: false, message: 'Minimal Rp 10.000' }, { status: 400 });
    }
    
    // Generate Invoice ID
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceId = `WKF-${date}-${random}`;

    // Simpan ke DB (Pending)
    const newTransaction = await prisma.wakafTransaction.create({
      data: {
        invoiceId,
        amount,
        wakifName: wakif_name || 'Hamba Allah',
        wakifPhone: wakif_phone || '-',
        niatDoa: niat_doa || '',
        status: 'pending',
        campaignId: 1,
      },
    });

    // --- INTEGRASI DOKU START ---
    const requestId = Math.random().toString(36).substring(7);
    const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z";
    const requestTarget = "/checkout/v1/payment"; 

    const dokuBody = {
      order: {
        amount: amount,
        invoice_number: invoiceId,
        currency: "IDR",
        callback_url: "http://localhost:3000/wakaf/status", // Arahkan balik ke laptop
      },
      payment: { payment_due_date: 60 },
      customer: {
        name: wakif_name || "Hamba Allah",
        email: "donatur@sitalmubarak.com",
        phone: wakif_phone || "08123456789"
      }
    };

    // Generate Signature DOKU
    const digest = crypto.createHash('sha256').update(JSON.stringify(dokuBody)).digest('base64');
    const signatureComponent = 
      `Client-Id:${process.env.DOKU_CLIENT_ID}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:${requestTarget}\n` +
      `Digest:${digest}`;
      
    const signature = crypto.createHmac('sha256', process.env.DOKU_SECRET_KEY)
      .update(signatureComponent).digest('base64');
    
    // Request ke DOKU
    const dokuRes = await fetch(`${process.env.DOKU_URL}${requestTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': process.env.DOKU_CLIENT_ID,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': `HMACSHA256=${signature}`,
      },
      body: JSON.stringify(dokuBody)
    });

    const dokuData = await dokuRes.json();

    if (!dokuRes.ok) throw new Error("Gagal request ke DOKU");

    // Update DB dengan Payment URL
    await prisma.wakafTransaction.update({
      where: { id: newTransaction.id },
      data: { paymentUrl: dokuData.response.payment.url }
    });

    return NextResponse.json({
      success: true,
      message: 'Link pembayaran berhasil dibuat',
      data: {
        invoiceId,
        paymentUrl: dokuData.response.payment.url
      }
    });

  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memproses: ' + error.message }, { status: 500 });
  }
}