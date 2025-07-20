import { DoubtAnswer } from "@/types/doubt";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const new_answer = (await req.json()) as DoubtAnswer;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("doubt_answers");

    await collection.insertOne(new_answer);
    await client.close();

    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in new answer: ${e}`);
  }
}

export async function GET(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("doubt_answers");

    const post = await collection.findOne({ id });
    await client.close();
    return NextResponse.json(post);
  } catch (e) {
    throw new Error(`Error in fetching answer: ${e}`);
  }
}

export async function PUT(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  const field = req.nextUrl.searchParams.get("field") as
    | "content"
    | "author"
    | "replies";
  if (!field || !id) throw new Error("Missing query parameters");

  const new_answer = (await req.json()) as DoubtAnswer;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("doubt_answers");

    await collection.updateOne(
      { id },
      { $set: { [field]: new_answer[field] } },
    );

    await client.close();
    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in updating answer: ${e}`);
  }
}
