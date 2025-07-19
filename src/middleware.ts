export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/chats",
    "/dashboard",
    "/explore",
    "/settings/:path*",
    "/mychat/:path*",
  ],
};
