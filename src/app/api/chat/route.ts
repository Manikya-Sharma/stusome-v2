import { db } from "@/lib/db";
import { getPusherId, pusherServer } from "@/lib/pusher";
import { getChatId } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { from_email, to_email, message } = (await req.json()) as {
    from_email: string;
    to_email: string;
    message: {
      id: string;
      message: string;
      to: string;
      read: boolean;
      time: number;
    };
  };
  const id = getChatId(from_email, to_email);
  await db.zadd(id, {
    score: message.time,
    member: JSON.stringify(message),
  });

  await pusherServer.trigger(getPusherId(id), "chat", {
    id: message.id,
    message: message.message,
    to: message.to,
    read: message.read,
    time: message.time,
  });

  return NextResponse.json("ok");
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    throw new Error("Invalid Request");
  }

  const chats = (await db.zrange(id, 0, -1, {
    withScores: true,
  })) as [{ id: string; message: string; to: string; read: boolean }, number];

  return NextResponse.json(chats);
}

export async function PUT(req: NextRequest) {
  // only to mark chats as read
  const { from_email, to_email, message } = (await req.json()) as {
    from_email: string;
    to_email: string;
    message: {
      id: string;
      message: string;
      to: string;
      read: boolean;
      time: number;
    };
  };

  if (message.read) return NextResponse.json("ok");

  const id = getChatId(from_email, to_email);

  await db.zrem(id, JSON.stringify(message));

  await db.zadd(id, {
    score: message.time,
    member: JSON.stringify({ ...message, read: true }),
  });

  await pusherServer.trigger(getPusherId(id), "read", {
    id: message.id,
  });

  return NextResponse.json("ok");
}
