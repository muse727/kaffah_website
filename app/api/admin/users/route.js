import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, name: true, username: true, role: true },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const superAdminName = session?.user?.name || "Sistem Rabbani";

    const { name, username, role, password } = await req.json();
    
    const existingAdmin = await prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) return NextResponse.json({ message: 'Username sudah digunakan' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.admin.create({
      data: { name, username, role, password: hashedPassword }
    });

    // 🚨 REKAM KE CCTV 🚨
    await prisma.activityLog.create({
      data: {
        adminName: superAdminName,
        action: "TAMBAH PENGURUS",
        description: `Membuat akun ${role} baru untuk ${name} (@${username})`
      }
    });
    
    return NextResponse.json({ message: 'Admin berhasil ditambahkan' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambah admin' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const superAdminName = session?.user?.name || "Sistem Rabbani";

    const { id } = await req.json();
    
    // Cari nama admin yang mau dihapus buat dicatet
    const targetAdmin = await prisma.admin.findUnique({ where: { id } });
    
    await prisma.admin.delete({ where: { id } });

    // 🚨 REKAM KE CCTV 🚨
    if (targetAdmin) {
      await prisma.activityLog.create({
        data: {
          adminName: superAdminName,
          action: "CABUT AKSES",
          description: `Mencabut akses dan menghapus akun pengurus milik ${targetAdmin.name}`
        }
      });
    }

    return NextResponse.json({ message: 'Admin dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus admin' }, { status: 500 });
  }
}