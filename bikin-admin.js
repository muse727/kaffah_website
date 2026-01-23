const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 1. Kita bikin password "admin123" versi enkripsi
  const hashedPassword = await bcrypt.hash('admin123', 10);

  console.log("Sedang membuat admin...");

  try {
    // 2. Masukkan ke tabel Admin
    const user = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: { password: hashedPassword }, // Kalau udah ada, reset passwordnya
      create: {
        username: 'admin',
        password: hashedPassword,
        // Kalau di database kamu ada kolom 'role' atau 'nama', 
        // uncomment baris di bawah ini dan sesuaikan:
        // role: 'SUPER_ADMIN', 
        // name: 'Admin Lokal',
      },
    });

    console.log('✅ SUKSES! Admin berhasil dibuat.');
    console.log('👉 Username: admin');
    console.log('👉 Password: admin123');

  } catch (e) {
    console.error('❌ Gagal membuat admin:', e);
    
    // Tips kalau error kolom kurang
    if (e.message.includes("Argument")) {
      console.log("\n💡 TIPS: Sepertinya tabel Admin kamu butuh kolom lain (misal: 'role', 'email', dll).");
      console.log("Cek file prisma/schema.prisma kamu, lalu tambahkan field itu di script ini.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();