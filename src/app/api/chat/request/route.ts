import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { from, to } = (await req.json()) as {
    from: string;
    to: string;
  };
  if (to === from) {
    throw new Error("Cannot send request to yourself");
  }
  if (!(await db.get(`user:${from}`))) {
    throw new Error(`No such user exists: ${from}`);
  }
  if (!(await db.get(`user:${to}`))) {
    throw new Error(`No such user exists: ${to}`);
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
