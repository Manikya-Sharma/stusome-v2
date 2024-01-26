import { Ban, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function ChatRequest({
  sent,
  name,
}: {
  sent?: boolean;
  name: string;
}) {
  return (
    <div className="mx-auto my-2 flex max-w-prose items-center justify-between rounded-lg bg-slate-200 px-3 py-4 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      <div>{name}</div>
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
                  <Button variant="ghost" className="px-2">
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
