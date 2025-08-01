import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI!);

  // const id = req.nextUrl.searchParams.get("id");
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("posts");

    const posts = await collection.find({}).toArray();
    await client.close();
    return NextResponse.json(posts);
  } catch (e) {
    throw new Error(`Error in fetching post: ${e}`);
  }
}
