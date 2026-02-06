import { getClientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { username, email, firstname, lastname } = data;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          username,
          email,
          firstname,
          lastname,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("user").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500, headers: corsHeaders });
  }
}