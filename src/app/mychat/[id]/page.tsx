"use client";
import ShowProfileImage from "@/components/ShowProfileImage";
import { Button } from "@/components/ui/button";
import { cn, getEmailsFromChatId } from "@/lib/utils";
import { Loader, SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { use, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import TextareaAutoSize from "react-textarea-autosize";
import { format } from "date-fns";
import { getPusherId, pusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import {
  useGetChat,
  usePostChat,
  useGetChatUser,
} from "@/components/queries/chats";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const chatRef = useRef<HTMLTextAreaElement | null>(null);
  let { data: session, status } = useSession();
  const { id: _id } = use(params);
  const id = _id.replaceAll("%3A", ":").replaceAll("%40", "@");
  let [from_user, to_user] = getEmailsFromChatId(id);
  let from_user_is_me = session?.user?.email == from_user;

  const { data: chats, isLoading: isLoadingChats } = useGetChat({ id });
  const { mutate: postChat, isPending: isSending } = usePostChat();

  const [pusherRecv, setPusherRecv] = useState<
    Array<{
      id: string;
      message: string;
      to: string;
      time: number;
    }>
  >([]);

  const router = useRouter();
  // prevent unauthorized access
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
    if (status === "loading") return;
    if (
      session?.user?.email !== from_user &&
      session?.user?.email !== to_user
    ) {
      router.replace("/login");
    }
  }, [router, status, session?.user?.email, from_user, to_user]);

  const { data: fromAccount, isLoading: isLoadingFromAccount } = useGetChatUser(
    { email: from_user },
  );
  const { data: toAccount, isLoading: isLoadingToAccount } = useGetChatUser({
    email: to_user,
  });

  const friend = from_user_is_me ? toAccount : fromAccount;

  useEffect(() => {
    // subscribe to real time websocket
    const chatHandler = ({
      id,
      message,
      to,
      time,
    }: {
      id: string;
      message: string;
      to: string;
      time: number;
    }) => {
      // this is triggered automatically when message is sent from either side
      setPusherRecv((prev) => {
        return [
          ...prev,
          {
            id,
            message,
            time,
            to,
          },
        ];
      });
    };
    pusherClient.subscribe(getPusherId(id));
    pusherClient.bind("chat", chatHandler);
    return () => {
      pusherClient.unsubscribe(getPusherId(id));
      pusherClient.unbind("chat", chatHandler);
    };
  }, [id]);

  async function sendChat() {
    if (
      !chatRef ||
      !chatRef.current ||
      !session?.user?.email ||
      !friend?.email
    ) {
      return;
    }
    const value = chatRef.current.value;
    if (value.trim().length === 0) return;
    const new_id = uuid();
    postChat({
      from_email: session?.user?.email,
      to_email: friend?.email,
      message: {
        id: new_id,
        message: value,
        to: friend.email,
        time: Date.now(),
      },
    });

    chatRef.current.value = "";
    chatRef.current.focus();
  }

  return (
    <div className="selection:bg-green-100 selection:text-green-950">
      <IndeterminateLoader
        loading={isLoadingChats || isLoadingFromAccount || isLoadingToAccount}
      />
      <h1 className="fixed inset-x-0 top-14 z-10 mr-auto flex items-center gap-2 bg-[rgba(236,253,245,0.6)] py-2 pl-5 text-3xl tracking-tighter text-slate-900 backdrop-blur-sm dark:bg-[rgba(30,41,59,0.6)] dark:text-slate-200">
        <ShowProfileImage authorEmail={friend?.email} />
        <div>{friend?.name}</div>
      </h1>
      <div className="flex h-[86vh] flex-col-reverse overflow-y-auto px-5 pb-20 pt-14 dark:bg-slate-900">
        {[...(chats ?? []), ...pusherRecv]
          ?.toReversed()
          .filter((chat) => typeof chat !== "number")
          .map((chat) => {
            return (
              <div key={chat.id}>
                <div
                  className={cn(
                    "relative my-3 w-fit max-w-[60%] rounded-bl-md rounded-br-md px-5 py-3",

                    chat.to === (from_user_is_me ? from_user : to_user)
                      ? "rounded-tl-md rounded-tr-xl bg-emerald-300 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-300"
                      : cn(
                          "ml-auto rounded-tl-xl rounded-tr-md",
                          "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-50",
                        ),
                  )}
                >
                  {chat.message}
                </div>
                <div
                  className={cn(
                    "-mt-2 w-fit text-xs text-muted-foreground",
                    chat.to === (from_user_is_me ? from_user : to_user)
                      ? ""
                      : "ml-auto",
                  )}
                >
                  {format(chat.time, "HH:mm")}
                </div>
              </div>
            );
          })}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex h-fit items-center justify-between bg-[rgba(236,253,245,0.6)] px-2 py-3 backdrop-blur-md dark:bg-[rgba(30,41,59,0.6)]">
        <TextareaAutoSize
          className="mx-auto w-[90%] resize-none rounded-md border px-2 py-2 text-slate-900 dark:bg-slate-700 dark:text-slate-200"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              sendChat();
            }
          }}
          ref={chatRef}
          disabled={isLoadingChats}
        />
        <Button
          variant={"ghost"}
          className="mx-2 px-2"
          onClick={() => sendChat()}
          disabled={isLoadingChats}
        >
          {isSending ? <Loader className="animate-spin" /> : <SendHorizontal />}
        </Button>
      </div>
    </div>
  );
}
