export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin-dashboard/:path*"], // Ganti sesuai nama folder admin lu
};