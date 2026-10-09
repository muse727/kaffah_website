import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Inisiasi Prisma biar bisa ngobrol sama database
const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "Recaptcha Token", type: "text" }
      },
      async authorize(credentials) {
        const { username, password, recaptchaToken } = credentials;

        // 🛡️ 1. VALIDASI RECAPTCHA KE GOOGLE
        if (!recaptchaToken) {
          throw new Error("Tolong centang reCAPTCHA dulu bro!");
        }

        const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          // Rahasia backend ngobrol sama Google pakai Secret Key dari .env lu
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        });
        const recaptchaData = await recaptchaRes.json();

        if (!recaptchaData.success) {
          throw new Error("Verifikasi robot gagal! Coba centang ulang.");
        }

        // 🕵️‍♂️ 2. CARI ADMIN DI DATABASE
        const admin = await prisma.admin.findUnique({
          where: { username: username }
        });

        if (!admin) {
          throw new Error("Username tidak ditemukan bro!");
        }

        // 🔐 3. CEK KECOCOKAN PASSWORD (BCRYPT)
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
          // Fitur tambahan: Catat kalau ada yang salah masukin password
          await prisma.admin.update({
            where: { id: admin.id },
            data: { failedLogins: admin.failedLogins + 1 }
          });
          throw new Error("Password salah! Cek huruf besar/kecilnya.");
        }

        // 🎉 4. LOGIN SUKSES! Reset catatan salah login
        await prisma.admin.update({
          where: { id: admin.id },
          data: { failedLogins: 0 }
        });

        // Data ini yang bakal dikirim ke halaman admin lu (session)
        return {
          id: admin.id,
          name: admin.name,
          username: admin.username,
          role: admin.role,
        };
      }
    })
  ],
  callbacks: {
    // Nyimpen data ke token browser
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    // Ngelepas data dari token biar bisa dibaca di frontend (useSession)
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // Arahin kalau ada yang belum login maksa masuk admin
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Sesi login tahan 24 jam
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };