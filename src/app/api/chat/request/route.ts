import { db } from "@/lib/db";
import type { ChatAccount } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { from, to } = (await req.json()) as {
    from: string;
    to: string;
  };
  if (to === from) {
    return NextResponse.json(
      { message: "Cannot send request to yourself" },
      { status: 400 },
    );
  }
  const fromUser = (await db.get(`user:${from}`)) as ChatAccount;
  if (!fromUser) {
    return NextResponse.json(
      { message: `No such user exists: ${from}` },
      { status: 404 },
    );
  }
  const toUser = (await db.get(`user:${to}`)) as ChatAccount;
  if (!toUser) {
    return NextResponse.json(
      { message: `No such user exists: ${to}` },
      { status: 404 },
    );
  }

  if (fromUser.chats.includes(to) && toUser.chats.includes(from)) {
    return NextResponse.json({ message: "Already friends" }, { status: 400 });
  }

  await db.sadd(`req:${from}`, `to:${to}`);
  await db.sadd(`req:${to}`, `from:${from}`);
  return NextResponse.json("ok");
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const all_requests = await db.smembers(`req:${email}`);
  return NextResponse.json(all_requests);
}
