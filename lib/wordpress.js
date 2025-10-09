// lib/wordpress.js

export async function fetchGraphQL(query, variables = {}) {
  // 1. AMBIL URL DARI .env.local, BUKAN HARDCODE
  const url = process.env.WORDPRESS_API_URL;

  // Jika URL tidak ada di .env, kasih error yang jelas
  if (!url) {
    throw new Error(
      "WORDPRESS_API_URL is not defined in your .env.local file."
    );
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      // 2. GUNAKAN CACHING NEXT.JS (LEBIH BAIK DARI 'no-store')
      next: { revalidate: 60 }, // Data akan di-cache selama 60 detik
    });

    if (!res.ok) {
      console.error("HTTP Error:", res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
      throw new Error('Failed to fetch GraphQL data');
    }

    return json.data;

  } catch (error) {
    console.error("Fetch GraphQL Error:", error);
    // 3. LEMPAR LAGI ERROR-NYA, JANGAN RETURN NULL
    // Biar bisa ditangkap oleh try...catch di page.js
    throw error;
  }
}