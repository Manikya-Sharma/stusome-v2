"use client";

import ChatRequest from "@/components/ChatRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRef, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import toast from "react-hot-toast";
import { useGetChatRequest, usePostChatRequest } from "./queries/chats";

const RequestsForChat = () => {
  const { data: session } = useSession();
  const { data: all_requests, isLoading: isLoadingRequests } =
    useGetChatRequest({ email: session?.user?.email });
  const { mutate: sendChatRequest, isPending: isSendingChatRequest } =
    usePostChatRequest();

  const parsed_requests = useMemo(
    () => all_requests?.map((req) => req.split(":")),
    [all_requests],
  );
  const sent = useMemo(
    () =>
      parsed_requests
        ?.filter((req) => req[0] === "to")
        .map((req) => ({ name: req[1], to: req[1] })),
    [parsed_requests],
  );
  const received = useMemo(
    () =>
      parsed_requests
        ?.filter((req) => req[0] !== "to")
        .map((req) => ({ name: req[1], from: req[1] })),
    [parsed_requests],
  );

  const reqRef = useRef<HTMLInputElement | null>(null);
  const sendRequest = async () => {
    if (!reqRef || !reqRef.current || !session?.user?.email) {
      return;
    }
    const email = reqRef.current.value;
    if (email.trim().length === 0) {
      toast.error("Invalid email");
      return;
    }
    if (email == session.user.email) {
      toast.error("You cannot chat with yourself");
      return;
    }
    sendChatRequest({ from: session.user.email, to: email });
  };

  return (
    <>
      <div className="mx-auto flex max-w-[80%] items-center justify-center gap-3">
        <Input
          ref={reqRef}
          className="mx-auto my-5 max-w-prose text-lg"
          placeholder="somebody@example.com"
          onKeyDown={(key) => {
            if (key.key == "Enter") {
              sendRequest();
            }
          }}
          disabled={isSendingChatRequest}
        />
        <Button
          className="text-lg"
          onClick={sendRequest}
          disabled={isSendingChatRequest}
        >
          Send Request
        </Button>
      </div>
      <Tabs defaultValue="received" className="mx-auto max-w-[80%]">
        <TabsList className="mx-auto grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="received">
            Requests Received ({received?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Requests Pending ({sent?.length ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {isLoadingRequests ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  className="mx-auto my-2 max-w-prose rounded-lg px-3 py-4"
                  key={index}
                />
              ))
          ) : received?.length == 0 ? (
            <div className="text-center text-muted-foreground">
              No requests received
            </div>
          ) : (
            received?.map((rcv) => {
              return <ChatRequest key={rcv.from} account={rcv} />;
            })
          )}
        </TabsContent>
        <TabsContent value="sent">
          {isLoadingRequests ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  className="mx-auto my-2 max-w-prose rounded-lg px-3 py-4"
                  key={index}
                />
              ))
          ) : sent?.length == 0 ? (
            <div className="text-center text-muted-foreground">
              No requests sent
            </div>
          ) : (
            sent?.map((snd) => {
              return <ChatRequest key={snd.to} account={snd} sent />;
            })
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RequestsForChat;
