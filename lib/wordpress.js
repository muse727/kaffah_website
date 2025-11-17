// lib/wordpress.js
export async function fetchGraphQL(query, variables = {}) {
  const url = process.env.WORDPRESS_API_URL;

  if (!url) {
    throw new Error(
      "WORDPRESS_API_URL is not defined in your .env.local file."
    );
  }

  try {
    // PERBAIKAN: Log yang lebih informatif
    console.log('📤 GraphQL Request:', { 
      query: query.split('\n')[0] + '...', // Hanya baris pertama query
      variables: JSON.stringify(variables)
    });

    const timeoutDuration = 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    // PERBAIKAN: Pastikan variables dikirim dengan benar
    const requestBody = {
      query,
      variables: variables || {} // Pastikan variables selalu object
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(requestBody),
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("HTTP Error:", res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    // PERBAIKAN: Handle errors dengan lebih baik
    if (json.errors) {
      console.error("GraphQL Errors Detail:", {
        errors: json.errors.map(err => ({
          message: err.message,
          locations: err.locations
        })),
        operation: query.split(' ')[1] // Nama operation
      });
      
      const errorMessage = json.errors[0]?.message || 'Unknown GraphQL error';
      throw new Error(`GraphQL Error: ${errorMessage}`);
    }

    console.log('✅ GraphQL Success - Data keys:', Object.keys(json.data || {}));

    return json.data;

  } catch (error) {
    console.error("Fetch GraphQL Error Details:", {
      message: error.message,
      name: error.name,
      url: url.replace(/(\/graphql).*$/, '$1') // Sembunyikan query parameters
    });
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: WordPress API tidak merespons dalam waktu 15 detik');
    }
    
    throw error; 
  }
}