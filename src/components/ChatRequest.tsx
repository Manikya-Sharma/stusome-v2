"use client";

import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSession } from "next-auth/react";
import { usePostChatRequestResponse } from "./queries/chats";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const { mutate: respondToRequest, isPending: isResponding } =
    usePostChatRequestResponse({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getChatRequest", account.from],
        });
        queryClient.invalidateQueries({
          queryKey: ["getChatRequest", account.to],
        });
      },
    });

  async function acceptRequest() {
    if (!session?.user?.email || !account.from) {
      return;
    }
    respondToRequest({
      from: account.from,
      to: session.user.email,
      how: "accept",
    });
  }

  async function removeReceivedRequest() {
    if (!account.from || !session?.user?.email) return;
    respondToRequest({
      from: account.from,
      to: session.user.email,
      how: "reject",
    });
  }

  async function removeSentRequest() {
    if (!account.to || !session?.user?.email || !sent) return;
    respondToRequest({
      from: session.user.email,
      to: account.to,
      how: "reject",
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
                  <Button
                    variant="ghost"
                    className="px-2"
                    onClick={removeSentRequest}
                    disabled={isResponding}
                  >
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
                    disabled={isResponding}
                  >
                    <Check className="text-emerald-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Accept</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-2"
                    onClick={removeReceivedRequest}
                    disabled={isResponding}
                  >
                    <X className="text-pink-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reject</TooltipContent>
              </Tooltip>
              {/* TODO: Add option to block later */}
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <Ban className="text-orange-800" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Block</TooltipContent>
              </Tooltip> */}
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
