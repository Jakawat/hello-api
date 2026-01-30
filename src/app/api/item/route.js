import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req) {
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 5; 
    const skip = (page - 1) * limit;

    const items = await db
      .collection("item")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection("item").countDocuments();

    return NextResponse.json({
      data: items,
      total: totalCount,
      page: page,
      totalPages: Math.ceil(totalCount / limit)
    }, {
      headers: corsHeaders,
    });
  } catch (exception) {
    console.log("exception", exception.toString());
    return NextResponse.json(
      { message: exception.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const { itemName, itemCategory, itemPrice, status } = data;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").insertOne({
      itemName: itemName,
      itemCategory: itemCategory,
      itemPrice: parseFloat(itemPrice),
      status: status || "ACTIVE",
    });

    return NextResponse.json(
      { id: result.insertedId, message: "Item created successfully" },
      { status: 201, headers: corsHeaders }
    );
  } catch (exception) {
    console.log("exception", exception.toString());
    return NextResponse.json(
      { message: exception.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}