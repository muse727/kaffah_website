const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Kita samarkan password "admin123" biar aman di database
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Masukin data lu ke database
  const admin = await prisma.admin.create({
    data: {
      name: 'Mus',            // Nama asli lu yang bakal tampil di Dashboard
      username: 'admin',      // Username buat login
      password: hashedPassword, // Password yang udah diacak
      role: 'SUPERADMIN',
    },
  });

  console.log('🚀 MANTAP! Akun Admin berhasil dibuat:');
  console.log(`Username: ${admin.username}`);
  console.log(`Password: admin123`);
}

main()
  .catch((e) => {
    console.error('Ada error nih bro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });