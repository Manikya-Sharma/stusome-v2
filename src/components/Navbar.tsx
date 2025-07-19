"use client";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Loader2, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeSwitch from "./miscellaneous/ThemeSwitch";
import { Button } from "./ui/button";

export default function Navbar() {
  const { status } = useSession();
  const router = useRouter();
  const path = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 z-10 flex items-center justify-between px-3 py-2",
        {
          "bg-[rgba(239,246,255,0.7)] backdrop-blur-sm dark:bg-[rgba(29,36,45,0.7)]":
            !path.includes("post"),
        },
      )}
    >
      <Link
        href={"/"}
        className={cn("rounded-lg dark:bg-[rgba(255,255,255,0.5)]", {
          "px-2 py-px": status !== "authenticated",
        })}
      >
        <div
          className={cn("relative h-10 w-28", {
            hidden: status === "authenticated",
          })}
        >
          <Image src={"/logo-full.svg"} alt="stusome" fill />
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {path !== "/login" &&
          (status !== "authenticated" ? (
            <Button
              className="text-sm"
              onClick={() => router.push(`/login?from=${path}`)}
              disabled={status === "loading"}
            >
              <span className="hidden sm:block">Login</span>
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin sm:ml-2" />
              ) : (
                <LogIn className="h-4 w-4 sm:ml-2" />
              )}
            </Button>
          ) : path !== "/dashboard" ? (
            <Button
              className="text-sm"
              onClick={() => router.push(`/dashboard`)}
            >
              <span className="hidden sm:block">Dashboard</span>
              <LayoutDashboard className="h-4 w-4 sm:ml-2" />
            </Button>
          ) : null)}
        <ThemeSwitch />
      </div>
    </nav>
  );
}
