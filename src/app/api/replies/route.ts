import { Reply } from "@/types/post";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const new_doubt = (await req.json()) as Reply;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("replies");

    await collection.insertOne(new_doubt);
    await client.close();

    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in new post: ${e}`);
  }
}

export async function GET(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("replies");

    const post = await collection.findOne({ id });
    return NextResponse.json(post);
  } catch (e) {
    throw new Error(`Error in fetching post: ${e}`);
  }
}
