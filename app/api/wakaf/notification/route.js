import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // 1. Ambil Data yang Dikirim DOKU
    const textBody = await request.text(); // Kita butuh mentahannya buat cek signature
    const notification = JSON.parse(textBody);
    
    // Ambil Header Penting
    const clientId = request.headers.get('Client-Id');
    const requestId = request.headers.get('Request-Id');
    const requestTimestamp = request.headers.get('Request-Timestamp');
    const requestTarget = '/api/wakaf/notification'; // Sesuaikan path file ini
    const signature = request.headers.get('Signature');
    
    // 2. CEK KEASLIAN DATA (Wajib Biar Gak Ditembak Hacker)
    // Rumus Signature DOKU Notification (Sedikit beda sama Request)
    const digest = crypto.createHash('sha256').update(textBody).digest('base64');
    
    const rawSignature = 
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:${requestTarget}\n` +
      `Digest:${digest}`;

    const secretKey = process.env.DOKU_SECRET_KEY;
    const hmac = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('base64');
    const generatedSignature = `HMACSHA256=${hmac}`;

    // Kalau Signature beda, berarti data palsu
    if (signature !== generatedSignature) {
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 401 });
    }

    // 3. Update Status di Database
    const invoiceNumber = notification.order.invoice_number;
    const transactionStatus = notification.transaction.status; // 'SUCCESS' atau 'FAILED'

    if (transactionStatus === 'SUCCESS') {
      await prisma.wakafTransaction.update({
        where: { invoiceId: invoiceNumber },
        data: { 
          status: 'paid',
          paidAt: new Date()
        }
      });
      
      // Opsional: Update Total Terkumpul di Campaign
      // await prisma.wakafCampaign.update(...)
    } else {
      await prisma.wakafTransaction.update({
        where: { invoiceId: invoiceNumber },
        data: { status: 'failed' }
      });
    }

    // 4. Balas DOKU (Wajib balas biar DOKU tau kita udah terima)
    return NextResponse.json({ message: 'Notification Received' });

  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json({ message: 'Error processing notification' }, { status: 500 });
  }
}