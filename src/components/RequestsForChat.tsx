"use client";

import ChatRequest from "@/components/ChatRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const RequestsForChat = () => {
  const { data: session } = useSession();
  const [received, setReceived] = useState<
    Array<{
      name: string;
      from: string;
    }>
  >([]);
  const [sent, setSent] = useState<
    Array<{
      name: string;
      to: string;
    }>
  >([]);
  useEffect(() => {
    async function getRequests() {
      try {
        const raw = await fetch(
          `/api/chat/request?email=${session?.user?.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const all_requests = (await raw.json()) as Array<string>;
        all_requests.map((request) => {
          const [where, by] = request.split(":");
          if (where == "to") {
            setSent((prev) => [
              ...prev,
              {
                name: by,
                to: by,
              },
            ]);
          } else {
            setReceived((prev) => [
              ...prev,
              {
                name: by,
                from: by,
              },
            ]);
          }
        });
      } catch (e) {
        console.log(`${e}`);
      }
    }
    getRequests();
  }, [session?.user?.email]);

  const reqRef = useRef<HTMLInputElement | null>(null);
  const sendRequest = async () => {
    if (!reqRef || !reqRef.current || !session?.user?.email) {
      return;
    }
    const email = reqRef.current.value;
    // send request
    await fetch("/api/chat/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: session.user.email,
        to: email,
      }),
    });
    // update state
    setSent((prev) => [...prev, { to: email, name: email }]);
    reqRef.current.value = "";
  };

  // TODO: Add a page to ask if user wants to join chat section of the app
  return (
    <div>
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
        />
        <Button className="text-lg" onClick={sendRequest}>
          Send Request
        </Button>
      </div>
      <Tabs defaultValue="received" className="mx-auto max-w-[80%]">
        <TabsList className="mx-auto grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="received">Requests Received</TabsTrigger>
          <TabsTrigger value="sent">Requests Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {received.map((rcv) => {
            return (
              <ChatRequest
                key={rcv.from}
                account={rcv}
                setState={setReceived}
              />
            );
          })}
        </TabsContent>
        <TabsContent value="sent">
          {sent.map((snd) => {
            return (
              <ChatRequest key={snd.to} account={snd} sent setState={setSent} />
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsForChat;
