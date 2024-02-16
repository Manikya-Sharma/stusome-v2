import { db } from "@/lib/db";
import { ChatAccount } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { from, to, how } = (await req.json()) as {
    from: string;
    to: string;
    how: "accept" | "reject" | "block";
  };
  if (to === from) {
    throw new Error("Cannot accept your own request");
  }

  if (!["accept", "reject", "block"].includes(how)) {
    throw new Error("Invalid `how` option");
  }
  const fromAccount = (await db.get(`user:${from}`)) as ChatAccount;
  const toAccount = (await db.get(`user:${to}`)) as ChatAccount;
  if (!fromAccount) {
    throw new Error(`No such user exists: ${from}`);
  }
  if (!toAccount) {
    throw new Error(`No such user exists: ${to}`);
  }

  await db.srem(`req:${from}`, `to:${to}`);
  await db.srem(`req:${to}`, `from:${from}`);

  // if rejected then just ignore
  if (how == "accept") {
    fromAccount.chats.push(to);
    await db.set(`user:${from}`, JSON.stringify(fromAccount));
    toAccount.chats.push(from);
    await db.set(`user:${to}`, JSON.stringify(toAccount));
  } else if (how == "block") {
  }

  return NextResponse.json("ok");
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const all_requests = await db.smembers(`req:${email}`);
  return NextResponse.json(all_requests);
}
