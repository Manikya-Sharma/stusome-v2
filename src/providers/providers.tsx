"use client";

import { Toaster } from "react-hot-toast";
import NextAuthProvider from "../components/auth/GlobalAuth";
import { ThemeProvider, useTheme } from "@/context/themeContext";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

function WithTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <html lang="en" className={theme}>
      <body className={cn(inter.className, "relative min-h-screen")}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextAuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <WithTheme>{children}</WithTheme>
          </ThemeProvider>
        </QueryClientProvider>
      </NextAuthProvider>
    </>
  );
}
