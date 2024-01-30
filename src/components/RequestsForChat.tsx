import ChatRequest from "@/components/ChatRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RequestsForChat = () => {
  return (
    <div>
      <Tabs defaultValue="received" className="mx-auto max-w-[80%]">
        <TabsList className="mx-auto grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="received">Requests Received</TabsTrigger>
          <TabsTrigger value="sent">Requests Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <ChatRequest name="Mr ABC" />
          <ChatRequest name="Ms XYZ" />
          <ChatRequest name="Mr PQR" />
        </TabsContent>
        <TabsContent value="sent">
          <ChatRequest name="Mrs PQR" sent />
          <ChatRequest name="Mr LMN" sent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsForChat;
