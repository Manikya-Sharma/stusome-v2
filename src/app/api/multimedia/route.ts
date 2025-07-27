import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileKey = req.nextUrl.searchParams.get("key");
  const fileType = req.nextUrl.searchParams.get("type");
  if (!fileKey || !fileType) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  const url = `https://${process.env.UPLOADTHING_APPID}.ufs.sh/f/${fileKey}`;

  return NextResponse.json({ url, type: fileType });
}
