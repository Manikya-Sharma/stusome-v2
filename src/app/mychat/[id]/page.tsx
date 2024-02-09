"use client";
import ShowProfileImage from "@/components/ShowProfileImage";
import { Button } from "@/components/ui/button";
import { cn, getEmailsFromChatId } from "@/lib/utils";
import { Account } from "@/types/user";
import { SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import TextareaAutoSize from "react-textarea-autosize";

export default function Page({ params }: { params: { id: string } }) {
  const chatRef = useRef<HTMLTextAreaElement | null>(null);
  let [chats, setChats] = useState<
    Array<{
      id: string;
      message: string;
      to: string;
      read: boolean;
    }>
  >([]);
  let { data: session } = useSession();
  const id = params.id.replaceAll("%3A", ":").replaceAll("%40", "@");
  let [from_user, to_user] = getEmailsFromChatId(id);
  let from_user_is_me = session?.user?.email == from_user;

  const [friend, setFriend] = useState<Account | null>(null);

  useEffect(() => {
    // get user account
    async function getData() {
      const rawAccount = await fetch(
        `/api/chat/user?email=${from_user_is_me ? to_user : from_user}`,
      );
      const account = await rawAccount.json();
      setFriend(account);
    }
    getData();
  }, [from_user, from_user_is_me, to_user]);

  useEffect(() => {
    // get chats
    async function getData() {
      const rawChats = await fetch(`/api/chat?id=${id}`);
      const parsedChats = (await rawChats.json()) as Array<{
        id: string;
        message: string;
        to: string;
        read: boolean;
      }>;
      setChats(parsedChats.filter((chat) => typeof chat !== "number"));
    }
    getData();
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
    const new_id = uuid();
    await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_email: session?.user?.email,
        to_email: friend?.email,
        message: {
          id: new_id,
          message: value,
          to: friend.email,
          read: false,
        },
      }),
    });
    setChats((prev) => {
      return [
        ...prev,
        { id: new_id, message: value, to: friend.email, read: false },
      ];
    });
    chatRef.current.value = "";
    chatRef.current.focus();
  }

  return (
    <div className="selection:bg-green-100 selection:text-green-950">
      <h1 className="fixed inset-x-0 top-14 z-10 mr-auto flex items-center gap-2 bg-[rgba(236,253,245,0.6)] py-2 pl-5 text-3xl tracking-tighter text-slate-900 backdrop-blur-sm dark:bg-[rgba(30,41,59,0.6)] dark:text-slate-200">
        <ShowProfileImage />
        <div>{friend?.name}</div>
      </h1>
      <div className="min-h-screen px-5 pb-20 pt-14 dark:bg-slate-900">
        {chats
          .filter((chat) => typeof chat !== "number")
          .map((chat) => {
            return (
              <div
                //@ts-ignore
                key={chat.id}
                className={cn(
                  "relative my-3 w-fit max-w-[60%] rounded-bl-md rounded-br-md px-5 py-3",
                  //@ts-ignore
                  from_user_is_me
                    ? "rounded-tl-md rounded-tr-xl bg-emerald-300 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-300"
                    : cn(
                        "ml-auto rounded-tl-xl rounded-tr-md",
                        //@ts-ignore
                        chat.read
                          ? "bg-lime-300 text-lime-800 dark:bg-teal-950 dark:text-teal-100"
                          : "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-50",
                      ),
                )}
              >
                {typeof chat != "number" ? chat.message : ""}
              </div>
            );
          })}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex h-fit items-center justify-between bg-[rgba(236,253,245,0.6)] px-2 py-3 backdrop-blur-md dark:bg-[rgba(30,41,59,0.6)]">
        <TextareaAutoSize
          className="mx-auto w-[90%] resize-none rounded-md border px-2 py-2 text-slate-900 dark:text-slate-200"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              sendChat();
            }
          }}
          ref={chatRef}
        />
        <Button
          variant={"ghost"}
          className="mx-2 px-2"
          onClick={() => sendChat()}
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
