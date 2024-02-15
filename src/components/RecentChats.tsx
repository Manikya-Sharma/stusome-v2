"use client";

import { useSession } from "next-auth/react";
import ChatBlock from "./ChatBlock";
import { useEffect, useState } from "react";
import { ChatAccount } from "@/types/user";

const RecentChats = () => {
  const { data: session } = useSession();
  const [recentChats, setRecentChats] = useState<Array<string>>([]);
  useEffect(() => {
    if (!session?.user?.email) return;
    async function getAccountData() {
      const rawUser = await fetch(
        `/api/chat/user?email=${session?.user?.email}`,
      );
      const user = (await rawUser.json()) as ChatAccount;
      setRecentChats(user.chats);
    }
    getAccountData();
  }, [session?.user?.email]);
  return (
    <div>
      <h1 className="text-center text-5xl tracking-tight">Recent Chats</h1>
      <div className="my-2">
        {recentChats.map((chat) => {
          return <ChatBlock name={chat} key={chat} />;
        })}
      </div>
    </div>
  );
};

export default RecentChats;
