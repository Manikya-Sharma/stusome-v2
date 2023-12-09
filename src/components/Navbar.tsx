"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const path = usePathname();
  const query = useSearchParams();

  return (
    <nav className="fixed inset-x-0 z-10 flex items-center justify-between bg-[rgba(239,246,255,0.7)] px-3 py-2 backdrop-blur-sm dark:bg-[rgba(29,36,45,0.7)]">
      <Link
        href={"/"}
        className="rounded-lg px-2 py-px dark:bg-[rgba(255,255,255,0.5)]"
      >
        <div className="relative h-10 w-28">
          <Image src={"/logo-full.svg"} alt="stusome" fill />
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {path !== "/login" && status === "unauthenticated" && (
          <Button
            className="text-sm"
            onClick={() => router.push(`/login?from=${path}`)}
          >
            <span className="hidden sm:block">Login </span>
            <LogIn className="h-4 w-4 sm:ml-2" />
          </Button>
        )}

        {status === "authenticated" && (
          <Button className="text-sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        )}

        {mounted && (
          <div
            className={cn(
              "flex h-10 w-8 items-center justify-center px-2",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              "whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <Around
              duration={750}
              toggled={theme === "dark"}
              toggle={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-8"
            />
          </div>
        )}
      </div>
    </nav>
  );
}
