"use client";

import ShowProfileImage from "../ShowProfileImage";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { useSession } from "next-auth/react";

import { Turn as Hamburger } from "hamburger-react";
import QuickSetup from "./QuickSetup";

export default function UserInfoContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const { data: session } = useSession();

  return (
    <div className="pt-10 sm:flex sm:justify-between sm:pr-5 sm:pt-0">
      <div className="absolute right-2 top-2 z-[100] sm:hidden">
        <Hamburger
          toggled={showMenu}
          onToggle={() => setShowMenu(!showMenu)}
          size={22}
        />
      </div>

      <div
        className={
          "fixed h-[100vh] max-w-fit overflow-y-hidden rounded-tl-3xl border-l border-t border-zinc-300 bg-[rgba(226,232,240,0.7)] px-5 backdrop-blur-sm transition-all duration-200 sm:static sm:mr-3 sm:block sm:max-w-full sm:grow sm:rounded-tr-3xl sm:border-none lg:max-w-[30vw] dark:bg-[rgba(51,65,85,0.7)]" +
          (showMenu
            ? " translate-x-[calc(100vw-100%)] sm:translate-x-0"
            : " translate-x-[110vw] sm:translate-x-0")
        }
      >
        <div className="flex flex-col items-center space-y-3 pt-[4rem] text-center">
          <div className="flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-full bg-slate-300 align-middle dark:border-2 dark:border-slate-400">
            <ShowProfileImage />
          </div>
          <p className="font-merri text-3xl">{session?.user?.name}</p>
          <p className={"text-sm text-slate-500 dark:text-slate-400 "}>
            {session?.user?.email}
          </p>
          <div className="my-10 h-[3px] w-[80%] bg-slate-500" />
          <QuickSetup />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
