"use client";
import { cn } from "@/lib/utils";
import { Around } from "@theme-toggles/react";
import "@theme-toggles/react/css/Around.css";
import { LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function Navbar() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  const { status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const path = usePathname();
  const query = useSearchParams();

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
          className={cn(
            "relative h-10 w-28",
            status === "authenticated" && "hidden",
          )}
        >
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
        <TooltipProvider>
          {mounted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex h-10 w-8 items-center justify-center px-2",
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    "whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <Around
                    placeholder={"toggle theme"}
                    duration={750}
                    toggled={theme === "dark"}
                    toggle={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="h-10 w-8"
                    title=""
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Switch to {theme === "dark" ? "light" : "dark"} mode
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </nav>
  );
}
