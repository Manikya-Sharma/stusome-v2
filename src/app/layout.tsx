import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "@/components/auth/GlobalAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "stusome",
  description: "Student Social Media: The social media website you need",
  openGraph: {
    title: "stusome",
    description: "Social media by students, for students",
    type: "website",
    url: "https://stusome-v2.vercel.app",
    siteName: "stusome",
    images: [
      {
        url: "https://stusome-v2.vercel.app/logo.png",
      },
    ],
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "relative min-h-screen")}>
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider>
            <Navbar />
            <div className="pt-16">{children}</div>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
