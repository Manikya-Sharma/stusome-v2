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
  setState,
}: {
  sent?: boolean;
  account: {
    name: string;
    from?: string;
    to?: string;
  };
  setState?: Function;
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
    if (!setState) return;
    setState(
      (
        prev: Array<{ name: string; from: string }>,
      ): Array<{ name: string; from: string }> => {
        return prev.filter(
          (elem) => elem.name != account.from && elem.from != account.from,
        );
      },
    );
  }

  async function removeReceivedRequest() {
    if (!session?.user?.email) return;
    await fetch("/api/chat/request/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: account.from,
        to: session.user.email,
        how: "reject",
      }),
    });
    if (setState) {
      setState(
        (
          prev: Array<{ name: string; from: string }>,
        ): Array<{ name: string; from: string }> => {
          return prev.filter(
            (elem) => elem.name != account.from && elem.from != account.from,
          );
        },
      );
    }
  }

  async function removeSentRequest() {
    if (!session?.user?.email || !sent) return;
    await fetch("/api/chat/request/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: session.user.email,
        to: account.to,
        how: "reject",
      }),
    });
    if (setState) {
      setState(
        (
          prev: Array<{ name: string; to: string }>,
        ): Array<{ name: string; to: string }> => {
          return prev.filter(
            (elem) => elem.name != account.to && elem.to != account.to,
          );
        },
      );
    }
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
                  >
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
