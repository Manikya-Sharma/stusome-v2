"use client";
import ShowProfileImage from "@/components/ShowProfileImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import TextareaAutoSize from "react-textarea-autosize";

export default function Page() {
  let receiver = {
    name: "Manikya",
    img: "",
    chats: [
      {
        id: 1,
        message: "Hello",
        to: 1,
        read: true,
      },
      {
        id: 2,
        message: "Hi!",
        to: 0,
        read: true,
      },
      {
        id: 3,
        message: "How are you these days? I hope all is well.",
        to: 1,
        read: true,
      },
      {
        id: 4,
        message:
          "Yeah all good at my side. 😊 What about you? Long time no see",
        to: 0,
        read: true,
      },
      {
        id: 5,
        message: "I am also good. Just a little busy these days.",
        to: 1,
        read: true,
      },
      {
        id: 6,
        message: "Exams are approaching, so I was preparing.",
        to: 1,
        read: true,
      },
      {
        id: 7,
        message: "I was missing you a lot.. can we meet someday",
        to: 1,
        read: true,
      },
      {
        id: 8,
        message: "Sure! Will tomorrow be fine?",
        to: 0,
        read: true,
      },
      {
        id: 9,
        message: "Yes done 👍🏽 Will see you tomorrow 11am 😊",
        to: 1,
        read: false,
      },
    ],
  };
  return (
    <div className="selection:bg-green-100 selection:text-green-950">
      <h1 className="fixed inset-x-0 top-14 z-10 mr-auto flex items-center gap-2 bg-[rgba(236,253,245,0.6)] py-2 pl-5 text-3xl tracking-tighter text-slate-900 backdrop-blur-sm dark:bg-[rgba(30,41,59,0.6)] dark:text-slate-200">
        <ShowProfileImage />
        <div>{receiver.name}</div>
      </h1>
      <div className="min-h-screen px-5 pb-20 pt-14 dark:bg-slate-900">
        {receiver.chats.map((chat) => {
          return (
            <div
              key={chat.id}
              className={cn(
                "relative my-3 w-fit max-w-[60%] rounded-bl-md rounded-br-md px-5 py-3",
                chat.to == 0
                  ? "rounded-tl-md rounded-tr-xl bg-emerald-300 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-300"
                  : cn(
                      "ml-auto rounded-tl-xl rounded-tr-md",
                      chat.read
                        ? "bg-lime-300 text-lime-800 dark:bg-teal-950 dark:text-teal-100"
                        : "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-50",
                    ),
              )}
            >
              {chat.message}
            </div>
          );
        })}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex h-fit items-center justify-between bg-[rgba(236,253,245,0.6)] px-2 py-3 backdrop-blur-md dark:bg-[rgba(30,41,59,0.6)]">
        <TextareaAutoSize className="mx-auto w-[90%] resize-none rounded-md border px-2 py-2 text-slate-900 dark:text-slate-200" />
        <Button variant={"ghost"} className="mx-2 px-2">
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
