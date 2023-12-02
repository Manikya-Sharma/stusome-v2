"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const path = usePathname();
  const query = useSearchParams();

  if (!mounted) return null;

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
        {path !== "/login" && (
          <Button
            className="text-sm"
            onClick={() => router.push(`/login?from=${path}`)}
          >
            <span className="hidden sm:block">Login </span>
            <LogIn className="h-4 w-4 sm:ml-2" />
          </Button>
        )}

        <Button
          variant={"secondary"}
          className="flex h-10 w-8 items-center justify-center"
        >
          <Around
            duration={750}
            toggled={theme === "dark"}
            toggle={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-8"
          />
        </Button>
      </div>
    </nav>
  );
}
