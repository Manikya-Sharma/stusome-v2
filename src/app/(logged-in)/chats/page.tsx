"use client";

import { useGetAccount } from "@/components/queries/accounts";
import { usePostChatUser, useGetChatUser } from "@/components/queries/chats";
import RecentChats from "@/components/RecentChats";
import RequestsForChat from "@/components/RequestsForChat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatAccount } from "@/types/user";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session } = useSession();
  const { data: account } = useGetAccount({ email: session?.user?.email });
  const queryClient = useQueryClient();
  const { mutate: createChatAccount, isPending: isCreatingChatAccount } =
    usePostChatUser({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getChatUser", session?.user?.email],
        });
      },
      onError: () => {
        toast.error("Could not create new chat account");
      },
    });
  const { data: chatAccount, isLoading: isLoadingChatAccount } = useGetChatUser(
    { email: session?.user?.email },
  );
  const isChatUser = Boolean(chatAccount);
  async function optIn() {
    if (!session?.user?.email) {
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
    createChatAccount(chatAccount);
  }
  return isChatUser ? (
    <div>
      {/* TODO: Show requests only when they exist */}
      <RequestsForChat />
      <Separator className="mx-auto my-4 max-w-prose" />
      <RecentChats recentChats={chatAccount?.chats ?? []} />
    </div>
  ) : (
    <div className="flex h-[90vh] w-full flex-col items-center justify-center gap-10 px-10">
      <h1 className="text-center text-5xl">You have not opted in for chats</h1>
      <Button
        className="text-xl"
        onClick={optIn}
        disabled={isLoadingChatAccount || isCreatingChatAccount}
      >
        Opt in for chats
      </Button>
    </div>
  );
};

export default Page;
