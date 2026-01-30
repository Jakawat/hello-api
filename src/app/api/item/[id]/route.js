import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db.collection("item").findOne({ _id: new ObjectId(id) });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (exception) {
    return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const updatedResult = await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          itemName: data.itemName,
          itemCategory: data.itemCategory,
          itemPrice: parseFloat(data.itemPrice),
          status: data.status,
        },
      }
    );

    return NextResponse.json(updatedResult, { status: 200, headers: corsHeaders });
  } catch (exception) {
    return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (exception) {
    return NextResponse.json({ message: exception.toString() }, { status: 400, headers: corsHeaders });
  }
}