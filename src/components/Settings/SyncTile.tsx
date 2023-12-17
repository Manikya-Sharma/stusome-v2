"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LucideFolderSync } from "lucide-react";

export default function SyncTile() {
  const [syncing, setSyncing] = useState(false);
  const { data: session } = useSession();
  async function syncData() {
    setSyncing(true);
    let synced = false;
    if (session && session.user && session.user.email) {
      try {
        const rawData = await fetch(
          `/api/getAccountByEmail/${session.user.email}`,
        );
        const dataFromCloud = await rawData.json();
        localStorage.setItem("account", JSON.stringify(dataFromCloud));
        synced = true;
      } catch {
        synced = false;
      }
    }
    setSyncing(false);
    // if (synced) {
    //   toast.success("Account synced successfully");
    // } else {
    //   toast.error("Could not sync account, please try again later");
    // }
  }

  return (
    <div>
      <button
        className="mx-auto my-3 flex w-fit max-w-[80%] items-center justify-center gap-2 rounded-md border border-green-500 bg-green-200 px-4 py-2 text-green-900 transition-all duration-300 hover:bg-green-400"
        onClick={() => {
          syncData();
        }}
      >
        <p className={`${syncing ? "animate-spin" : "animate-none"}`}>
          <LucideFolderSync />
        </p>
        <p>Sync Account</p>
      </button>
    </div>
  );
}
