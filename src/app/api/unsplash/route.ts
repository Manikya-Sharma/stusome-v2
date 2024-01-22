import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let search = req.nextUrl.searchParams.get("query");
  const rawData = await fetch(
    `https://api.unsplash.com/search/photos?page=1&client_id=${
      process.env.UNSPLASH_ACCESS_KEY
    }${search ? `&query=${search}` : '&query="students"'}`,
  );
  const data = await rawData.json();
  return NextResponse.json(data);
}
