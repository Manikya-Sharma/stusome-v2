import RecentChats from "@/components/RecentChats";
import RequestsForChat from "@/components/RequestsForChat";
import { Separator } from "@/components/ui/separator";
const Page = () => {
  return (
    <div>
      {/* TODO: Show requests only when they exist */}
      <RequestsForChat />
      <Separator className="mx-auto my-4 max-w-prose" />
      <RecentChats />
    </div>
  );
};

export default Page;
