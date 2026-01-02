import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 1. Cari Admin di Database
        const user = await prisma.admin.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!user) {
          return null; // User gak ketemu
        }

        // 2. Cek Password (Bandingkan inputan sama hash di DB)
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Password salah
        }

        return {
          id: user.id + "",
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Nanti kita buat halaman ini
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };