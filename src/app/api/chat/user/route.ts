import { db } from "@/lib/db";
import { Account } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = (await req.json()) as Account;
  if (await db.get(`user:${user.email}`)) {
    throw new Error("This user already exists");
  }
  await db.set(`user:${user.email}`, JSON.stringify(user));
  return NextResponse.json("ok");
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const user = (await db.get(`user:${email}`)) as string;
  if (!user) {
    throw new Error("No such user found");
  }
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  return NextResponse.error();
}
