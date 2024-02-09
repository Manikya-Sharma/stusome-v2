import { db } from "@/lib/db";
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
    };
  };
  await db.zadd(getChatId(from_email, to_email), {
    score: Date.now(),
    member: JSON.stringify(message),
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
  return NextResponse.error();
}
