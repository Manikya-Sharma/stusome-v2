"use client";

import { Ban, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSession } from "next-auth/react";

export default function ChatRequest({
  sent,
  account,
}: {
  sent?: boolean;
  account: {
    name: string;
    from?: string;
    to?: string;
  };
}) {
  const { data: session } = useSession();

  async function acceptRequest() {
    if (!session?.user?.email) {
      return;
    }
    await fetch(`/api/chat/request/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: account.from,
        to: session?.user?.email,
        how: "accept",
      }),
    });
  }

  return (
    <div className="mx-auto my-2 flex max-w-prose items-center justify-between rounded-lg bg-slate-200 px-3 py-4 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      <div>{account.name}</div>
      <div>
        {sent ? (
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <X className="text-pink-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-2"
                    onClick={() => {
                      acceptRequest();
                    }}
                  >
                    <Check className="text-emerald-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Accept</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <X className="text-pink-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reject</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <Ban className="text-orange-800" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Block</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
