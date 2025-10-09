import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inisialisasi Resend dengan API Key dari .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { fullName, email, phone, service, message } = await request.json();

    // Kirim email menggunakan Resend
    const { data, error } = await resend.emails.send({
      from: 'kontak@sitalmubarak.com', // WAJIB email dari domain yang kamu verifikasi
      to: ['almubaraksit@gmail.com'], // Email yayasan kamu
      subject: `Pesan Baru dari Website: ${service}`,
      // Kita pakai React untuk membuat template email yang bagus
      react: (
        <div>
          <h1>Pesan dari Formulir Kontak Website</h1>
          <p><strong>Nama Lengkap:</strong> {fullName}</p>
          <p><strong>Email Pengirim:</strong> {email}</p>
          <p><strong>Telepon:</strong> {phone}</p>
          <p><strong>Unit Tujuan:</strong> {service}</p>
          <hr />
          <p><strong>Pesan:</strong></p>
          <p>{message}</p>
        </div>
      ),
    });

    // Jika ada error dari Resend
    if (error) {
      console.error({ error });
      throw new Error('Gagal mengirim pesan via Resend.');
    }

    return NextResponse.json({ success: true, message: 'Pesan berhasil terkirim' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal mengirim pesan' }, { status: 500 });
  }
}