import { Pool } from "pg";
import { config } from "@/lib/cdb";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool(config);

export async function POST(req: Request) {
  const data = (await req.json()) as { id: string; data: string; type: string };
  const query = `INSERT INTO media (id, datas, media_type) values ('${data.id}', '${data.data}', '${data.type}')`;

  try {
    const client = await pool.connect();
    await client.query(query);
    return NextResponse.json({
      message: "Success!",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Not ok!" });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const query = `SELECT id, datas, media_type FROM media WHERE id='${id}'`;

  try {
    const client = await pool.connect();
    const data = await client.query(query);
    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Not ok!" });
  }
}
