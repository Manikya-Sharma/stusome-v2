"use client";

import Tile from "@/components/Settings/Tile";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Settings() {
  return (
    <div className="transition-colors duration-200 sm:min-w-[60vw]">
      <div className="mb-7 pt-5">
        <h1 className="text-center text-6xl tracking-tighter">Settings</h1>
      </div>

      <div className="text-lg">
        <div className="">
          <div>
            <Link href={`/settings/account`}>
              <Tile description="Account" type="normal" logo={"user"} />
            </Link>
          </div>
          <div>
            <Link href={`/settings/app`}>
              <Tile description="App Settings" type="normal" logo="settings" />
            </Link>
          </div>
        </div>
        <div
          onClick={() => {
            signOut();
          }}
        >
          <Tile description="Logout" type="danger" logo="logout" />
        </div>
      </div>
    </div>
  );
}
