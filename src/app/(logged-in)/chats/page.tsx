"use client";

import { useGetAccount } from "@/components/queries/account";
import RecentChats from "@/components/RecentChats";
import RequestsForChat from "@/components/RequestsForChat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatAccount } from "@/types/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session, status } = useSession();
  const [recentChats, setRecentChats] = useState<Array<string>>([]);
  const [isChatUser, setIsChatUser] = useState<boolean>(false);
  const { data: account } = useGetAccount({ email: session?.user?.email });
  async function optIn() {
    if (status == "unauthenticated" || !session?.user?.email) {
      toast.error("It seems you aren't logged in");
      return;
    }
    const chatAccount: ChatAccount | undefined = account
      ? {
          chats: [],
          email: account.email,
          image: account.image,
          image_third_party: account.image_third_party,
          name: account.name,
        }
      : undefined;
    await fetch("/api/chat/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatAccount),
    });

    setIsChatUser(true);
  }
  useEffect(() => {
    if (!session?.user?.email) {
      return;
    }
    async function getAccountData() {
      const rawUser = await fetch(
        `/api/chat/user?email=${session?.user?.email}`,
      );
      try {
        const user = (await rawUser.json()) as ChatAccount;
        setRecentChats(user.chats);
        setIsChatUser(true);
      } catch (e) {
        // means that user doesn't have
        setIsChatUser(false);
      }
    }
    getAccountData();
  }, [session?.user?.email]);
  return isChatUser ? (
    <div>
      {/* TODO: Show requests only when they exist */}
      <RequestsForChat />
      <Separator className="mx-auto my-4 max-w-prose" />
      <RecentChats recentChats={recentChats} />
    </div>
  ) : (
    <div className="flex h-[90vh] w-full flex-col items-center justify-center gap-10 px-10">
      <h1 className="text-center text-5xl">You have not opted in for chats</h1>
      <Button className="text-xl" onClick={optIn}>
        Opt in for chats
      </Button>
    </div>
  );
};

export default Page;
