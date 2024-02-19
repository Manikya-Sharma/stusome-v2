import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const new_doubt = (await req.json()) as Doubt;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("doubts");

    await collection.insertOne(new_doubt);
    await client.close();
    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in new doubt: ${e}`);
  }
}

export async function GET(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("doubts");

    const post = await collection.findOne({ id: id });
    await client.close();
    return NextResponse.json(post);
  } catch (e) {
    throw new Error(`Error in fetching doubts: ${e}`);
  }
}

export async function PUT(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  const field = req.nextUrl.searchParams.get("field") as
    | "answers"
    | "title"
    | "author"
    | "content"
    | "tags";
  if (!field || !id) throw new Error("Missing query parameters");

  const new_doubt = (await req.json()) as Doubt;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("doubts");

    await collection.updateOne({ id }, { $set: { [field]: new_doubt[field] } });

    await client.close();

    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in updating doubt: ${e}`);
  }
}
