import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  session: { strategy: "jwt", maxAge: 2 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        // 👇 TAMBAHIN INI BUAT NERIMA TOKEN CAPTCHA DARI FRONTEND 👇
        recaptchaToken: { label: "Captcha", type: "text" } 
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan Password wajib diisi!");
        }

        // 👇 1. VERIFIKASI RECAPTCHA DULU KE SERVER GOOGLE 👇
        if (!credentials.recaptchaToken) {
           throw new Error("Centang reCAPTCHA dulu bos!");
        }
        
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`;
        const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
        const recaptchaJson = await recaptchaRes.json();
        
        if (!recaptchaJson.success) {
           throw new Error("Verifikasi reCAPTCHA gagal! Dasar Bot!");
        }
        // 👆 BATAS VERIFIKASI RECAPTCHA 👆

        // 2. Cari Admin di Database
        const user = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        if (!user) throw new Error("Username tidak ditemukan!");

        // 3. Cek apakah akun sedang digembok (Anti Brute Force yang tadi)
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          const sisaWaktu = Math.ceil((user.lockoutUntil.getTime() - new Date().getTime()) / 60000);
          throw new Error(`Akun terkunci! Coba lagi dalam ${sisaWaktu} menit.`);
        }

        // 4. Cek Password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          const newFailedLogins = user.failedLogins + 1;
          let lockoutUntil = null;

          if (newFailedLogins >= 5) {
            lockoutUntil = new Date(Date.now() + 15 * 60000); 
            await prisma.admin.update({ where: { id: user.id }, data: { failedLogins: newFailedLogins, lockoutUntil } });
            throw new Error("Password salah 5x! Akun Anda diblokir 15 menit.");
          } else {
            await prisma.admin.update({ where: { id: user.id }, data: { failedLogins: newFailedLogins } });
            throw new Error(`Password salah! Sisa percobaan: ${5 - newFailedLogins}`);
          }
        }

        // 5. Kalau sukses, reset dosa (failedLogins)
        await prisma.admin.update({
          where: { id: user.id },
          data: { failedLogins: 0, lockoutUntil: null },
        });

        return { id: user.id + "", name: user.name, username: user.username, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.username = user.username; token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      if (token) { session.user.id = token.id; session.user.username = token.username; session.user.role = token.role; }
      return session;
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };