"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <main className="relative min-h-screen dark:bg-slate-800 dark:text-slate-200">
      <div className="absolute left-2 top-2 z-[100]">
        <button
          onClick={() => router.back()}
          className="text-lg text-slate-800 underline-offset-2 hover:underline dark:text-slate-200"
        >
          <ArrowLeft />
        </button>
      </div>

      {children}
    </main>
  );
}
