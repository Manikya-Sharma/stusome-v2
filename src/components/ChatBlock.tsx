"use client";

import { getChatId } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ChatBlock({ name }: { name: string }) {
  const { data: session } = useSession();
  return (
    <Link
      href={`/mychat/${getChatId(session?.user?.email ?? "", name)}`}
      className="mx-auto my-2 flex w-[80%] min-w-fit max-w-prose items-center justify-between rounded-lg bg-slate-200 px-3 py-4 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <div>{name}</div>
    </Link>
  );
}
