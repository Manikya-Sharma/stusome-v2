"use client";

import ChatBlock from "./ChatBlock";

const RecentChats = ({ recentChats }: { recentChats: Array<string> }) => {
  return (
    <div>
      <h1 className="text-center text-5xl tracking-tight">Recent Chats</h1>
      <div className="my-2">
        {recentChats.map((chat) => {
          return <ChatBlock name={chat} key={chat} />;
        })}
      </div>
    </div>
  );
};

export default RecentChats;
