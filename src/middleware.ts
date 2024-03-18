export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/chats",
    "/dashboard",
    "/explore",
    "/settings/:path*",
    "/mychat/:path*",
  ],
};
