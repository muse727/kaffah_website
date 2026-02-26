import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, oldPassword, newPassword } = await req.json();

    const adminUser = await prisma.admin.findUnique({ where: { username } });
    if (!adminUser) return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });

    const isPasswordValid = await bcrypt.compare(oldPassword, adminUser.password);
    if (!isPasswordValid) return NextResponse.json({ message: 'Password lama salah!' }, { status: 400 });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { username },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ message: 'Password berhasil diubah' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengubah password' }, { status: 500 });
  }
}