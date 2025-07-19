import Navbar from "@/components/Navbar";
import Providers from "@/providers/providers";
import type { Metadata } from "next";
import "./globals.css";

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
    <Providers>
      <Navbar />
      <div className="pt-16">{children}</div>
    </Providers>
  );
}
