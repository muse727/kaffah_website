// lib/wordpress.js

// Fungsi untuk ambil data via GraphQL (Untuk daftar berita)
export async function fetchGraphQL(query, variables = {}) {
  const url = process.env.WORDPRESS_API_URL;

  if (!url) {
    throw new Error("WORDPRESS_API_URL is not defined in your .env.local file.");
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
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
    throw error; 
  }
}

// Fungsi untuk ambil data via REST API (Untuk detail berita)
export async function fetchREST(endpoint) {
  // Ubah URL /graphql menjadi /wp-json/wp/v2
  const baseUrl = process.env.WORDPRESS_API_URL.replace('/graphql', '/wp-json/wp/v2');
  const url = `${baseUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Jika 404, kita return null saja, jangan throw error biar halaman bisa handle
      if (res.status === 404) return null;
      
      console.error("HTTP Error (REST):", res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json;

  } catch (error) {
    console.error("Fetch REST Error:", error);
    throw error;
  }
}