import { Post } from "@/types/post";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const new_post = (await req.json()) as Post;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("posts");

    await collection.insertOne(new_post);

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
    const collection = database.collection("posts");

    const post = await collection.findOne({ id });
    await client.close();
    return NextResponse.json(post);
  } catch (e) {
    throw new Error(`Error in fetching post: ${e}`);
  }
}

export async function PUT(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const id = req.nextUrl.searchParams.get("id");
  const field = req.nextUrl.searchParams.get("field") as
    | "discussions"
    | "title"
    | "author"
    | "content"
    | "tags"
    | "coverImgFull"
    | "published";
  if (!id) throw new Error("Missing query parameters");

  const new_post = (await req.json()) as Post;
  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("posts");

    if (field) {
      await collection.updateOne(
        { id },
        { $set: { [field]: new_post[field] } },
      );
    } else {
      await collection.updateOne({ id }, { $set: new_post });
    }

    await client.close();

    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in updating post: ${e}`);
  }
}

export async function DELETE(req: NextRequest) {
  const client = new MongoClient(process.env.MONGODB_URI!);
  const id = req.nextUrl.searchParams.get("id");
  if (!id) throw new Error("Missing query parameter");

  try {
    await client.connect();
    const database = client.db("stusome");
    const collection = database.collection("posts");

    await collection.deleteOne({ id });

    await client.close();

    return NextResponse.json({});
  } catch (e) {
    throw new Error(`Error in deleting post: ${e}`);
  }
}
