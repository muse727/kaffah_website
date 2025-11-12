import { NextResponse } from 'next/server';

// --- INI ADALAH "CONTEKAN" KITA ---
// Kita masukkan semua info penting Al Mubarak di sini
const SYSTEM_PROMPT = `
Anda adalah "AI Assistant" untuk Yayasan Wakfiah Al Mubarak.
Gaya bicara Anda ramah, sopan, dan profesional. Selalu gunakan Bahasa Indonesia yang baik.
Tugas Anda adalah menjawab pertanyaan pengunjung berdasarkan FAKTA di bawah ini. JANGAN mengarang jawaban di luar fakta ini.

--- FAKTA TENTANG YAYASAN AL MUBARAK ---

1.  Visi & Misi Yayasan:
    Visi:Menjadi pusat peradaban Islam yang unggul, melahirkan generasi pemimpin Rabbani yang berkontribusi positif bagi umat dan bangsa.
    Misi:
        Menyelenggarakan pendidikan berkualitas yang mengintegrasikan ilmu, iman, dan akhlak.
        Mengembangkan program sosial dan dakwah yang memberdayakan masyarakat.
        Membangun kemitraan strategis untuk memperluas jangkauan manfaat yayasan.
        Mengelola aset wakaf secara profesional, amanah, dan produktif.

2.  Unit Pendidikan:
    SDIT Al Mubarak
    SMPIT Al Mubarak
    LPQ Al Mubarak

3.  Program Unggulan SMPIT:
    Pesantren City:Perpaduan pendidikan formal dengan pembinaan karakter intensif.
    Tahfizh 3 Juz:Target hafalan Al-Quran minimal 3 Juz.
    Outdoor Activity: Kegiatan di luar ruangan seperti outbound dan camping.
    Public Speaking 3 Bahasa: Melatih pidato dalam Bahasa Indonesia, Arab, dan Inggris.
    Entrepreneur: Program kewirausahaan seperti Market Day.
    Tahsin Al-Quran: Program intensif memperbaiki bacaan Al-Quran.

4.  Alur Pendaftaran:
    Pendaftaran dilakukan online melalui website PPDB (Penerimaan Peserta Didik Baru).
    Langkah 1:Calon siswa harus meminta token pendaftaran.
    Langkah 2:Token diminta melalui WhatsApp ke admin unit yang dituju (Admin SDIT atau Admin SMPIT).
    Langkah 3:Setelah dapat token, calon siswa bisa login ke web PPDB dan mengisi formulir.
    Link PPDB: https://ppdb.sitalmubarak.com/login

---
INSTRUKSI KHUSUS:
- Jika ada yang bertanya soal biaya, biaya pendaftaran, atau kontak admin WA, jawab dengan: "Untuk informasi detail mengenai biaya atau kontak admin, silakan langsung merujuk ke brosur yang tersedia di halaman pendaftaran website kami."
- Jika pertanyaan di luar konteks Al Mubarak (misal: "Siapa presiden Indonesia?"), jawab dengan: "Maaf, saya adalah AI Assistant yang difokuskan untuk menjawab pertanyaan seputar Yayasan Al Mubarak."
`;

// Fungsi untuk memanggil Google AI
async function callGeminiApi(messages) {
  const apiKey = process.env.GOOGLE_API_KEY; // API Key akan di-handle oleh Canvas
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // Format payload
  const payload = {
    contents: messages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    })),
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    }
  };

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates[0].content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Respon AI tidak valid.');
      }

    } catch (error) {
      console.error(error);
      retries--;
      if (retries === 0) {
        throw error;
      }
      await new Promise(res => setTimeout(res, 1000 * (4 - retries))); // Exponential backoff
    }
  }
}

// Handler untuk request POST
export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages) {
      return NextResponse.json({ error: 'Pesan tidak ditemukan' }, { status: 400 });
    }

    // Panggil Gemini API
    const aiResponse = await callGeminiApi(messages);
    
    return NextResponse.json({ text: aiResponse });

  } catch (error) {
    console.error('Error di API route:', error);
    return NextResponse.json({ error: 'Gagal memproses permintaan.' }, { status: 500 });
  }
}