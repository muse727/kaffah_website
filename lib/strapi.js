// Fungsi ini sekarang jadi satu-satunya sumber kebenaran untuk mengambil data Strapi

export async function getStrapiData(path) {
  // GANTI DENGAN ALAMAT NGROK LO YANG AKTIF DI SINI
  const baseUrl = 'https://05cc4b31b564.ngrok-free.app'; // <-- Ganti ini jika ngrok restart

  // Cek apakah Strapi lo pake /api atau tidak
  const apiUrl = `${baseUrl}/api`; // Sesuaikan jika perlu

  try {
    const response = await fetch(`${apiUrl}${path}`, { 
      cache: 'no-store',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      console.error("Strapi response error:", await response.text());
      throw new Error('Gagal mengambil data dari Strapi');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    return null;
  }
}