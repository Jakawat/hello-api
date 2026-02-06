import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const users = await db.collection("user").find({}).toArray();
    
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { username, email, password, firstname, lastname } = data;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("user").insertOne({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      status: "ACTIVE"
    });

    return NextResponse.json({ id: result.insertedId }, { status: 200, headers: corsHeaders });
  } catch (e) {
    const msg = e.message.includes("username") ? "Duplicate Username!!" : "Duplicate Email!!";
    return NextResponse.json({ message: msg }, { status: 400, headers: corsHeaders });
  }
}