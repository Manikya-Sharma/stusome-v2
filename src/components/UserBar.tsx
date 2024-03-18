"use client";

import {
  CircleUserRound,
  Compass,
  LayoutDashboard,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const UserBar = () => {
  const [hover, setHover] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(true); // hide on mobile screens
  const [scroll, setScroll] = useState<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scroll < scrollPos) {
        setHide(false);
      } else {
        setHide(true);
      }
      setScroll(scrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scroll]);
  const router = useRouter();
  const path = usePathname();
  return (
    <TooltipProvider>
      <nav
        className={cn(
          "fixed left-1/2 z-10 flex w-fit -translate-x-1/2 items-center justify-center gap-3 rounded-xl bg-gray-300 px-2 py-2 transition-all md:inset-y-0 md:left-0 md:mt-16 md:translate-x-0 md:flex-col md:justify-start md:bg-[rgba(175,175,175,0.3)] md:px-2 md:pt-5 md:backdrop-blur-sm dark:bg-gray-700 md:dark:bg-[rgba(50,50,50,0.3)]",
          {
            "bottom-3": hide,
            "-bottom-14": !hide,
          },
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className={cn(
                "z-10 cursor-pointer hover:bg-gray-800 hover:text-white/80 md:flex md:w-full md:items-center md:justify-start dark:hover:bg-gray-300 dark:hover:text-black/80",
                {
                  "bg-gradient-to-br from-[rgba(50,150,250,0.8)] to-[rgba(50,250,150,0.8)] text-white dark:from-[rgba(0,50,150,0.8)] dark:to-[rgba(0,150,50,0.8)]":
                    path === "/dashboard",
                },
              )}
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard
                className={cn("h-5 w-5", {
                  "md:mr-2": hover,
                })}
              />
              <div
                className={cn("hidden md:block", {
                  "scale-100": hover,
                  "w-0 scale-0": !hover,
                })}
              >
                Dashboard
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className={cn(
                "z-10 cursor-pointer hover:bg-gray-800 hover:text-white/80 md:flex md:w-full md:items-center md:justify-start dark:hover:bg-gray-300 dark:hover:text-black/80",
                {
                  "bg-gradient-to-br from-[rgba(50,150,250,0.8)] to-[rgba(50,250,150,0.8)] text-white dark:from-[rgba(0,50,150,0.8)] dark:to-[rgba(0,150,50,0.8)]":
                    path === "/chats",
                },
              )}
              onClick={() => router.push("/chats")}
            >
              <MessageCircle
                className={cn("h-5 w-5", {
                  "md:mr-2": hover,
                })}
              />
              <div
                className={cn("hidden md:block", {
                  "scale-100": hover,
                  "w-0 scale-0": !hover,
                })}
              >
                Chats
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chats</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className={cn(
                "z-10 cursor-pointer hover:bg-gray-800 hover:text-white/80 md:flex md:w-full md:items-center md:justify-start dark:hover:bg-gray-300 dark:hover:text-black/80",
                {
                  "bg-gradient-to-br from-[rgba(50,150,250,0.8)] to-[rgba(50,250,150,0.8)] text-white dark:from-[rgba(0,50,150,0.8)] dark:to-[rgba(0,150,50,0.8)]":
                    path === "/explore",
                },
              )}
              onClick={() => router.push("/explore")}
            >
              <Compass
                className={cn("h-5 w-5", {
                  "md:mr-2": hover,
                })}
              />
              <div
                className={cn("hidden md:block", {
                  "scale-100": hover,
                  "w-0 scale-0": !hover,
                })}
              >
                Explore
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Explore</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className={cn(
                "z-10 cursor-pointer hover:bg-gray-800 hover:text-white/80 md:flex md:w-full md:items-center md:justify-start dark:hover:bg-gray-300 dark:hover:text-black/80",
                {
                  "bg-gradient-to-br from-[rgba(50,150,250,0.8)] to-[rgba(50,250,150,0.8)] text-white dark:from-[rgba(0,50,150,0.8)] dark:to-[rgba(0,150,50,0.8)]":
                    path === "/settings",
                },
              )}
              onClick={() => router.push("/settings")}
            >
              <CircleUserRound
                className={cn("h-5 w-5", {
                  "md:mr-2": hover,
                })}
              />
              <div
                className={cn("hidden md:block", {
                  "scale-100": hover,
                  "w-0 scale-0": !hover,
                })}
              >
                Account
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Account</TooltipContent>
        </Tooltip>

        <div className="absolute bottom-2 hidden w-full px-2 md:block">
          <Button className="w-full text-sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default UserBar;
