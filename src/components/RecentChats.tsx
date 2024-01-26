import ChatBlock from "./ChatBlock";

const RecentChats = () => {
  return (
    <div>
      <h1 className="text-center text-5xl tracking-tight">Recent Chats</h1>
      <div className="my-2">
        <ChatBlock name="ABC" />
        <ChatBlock name="123" />
        <ChatBlock name="XYZ" />
        <ChatBlock name="PQR" />
      </div>
    </div>
  );
};

export default RecentChats;
