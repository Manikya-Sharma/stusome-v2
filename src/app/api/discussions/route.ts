import { Discussion } from "@/types/post";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const new_discussion = (await req.json()) as Discussion;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("discussions");

    await collection.insertOne(new_discussion);
    await client.close();

    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in new discussion: ${e}`);
  }
}

export async function GET(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("discussions");

    const post = await collection.findOne({ id });
    return NextResponse.json(post);
  } catch (e) {
    throw new Error(`Error in fetching discussion: ${e}`);
  }
}
