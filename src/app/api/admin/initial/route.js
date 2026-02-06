import { ensureIndexes } from "@/lib/ensureIndexes";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("pass") !== "1234") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  await ensureIndexes();
  return NextResponse.json({ message: "Indexes initialized" });
}