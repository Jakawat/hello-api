import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  const { setupPassword, email, password, firstname, lastname } = data;

  // Check setup password (from .env.local)
  if (setupPassword !== process.env.ADMIN_SETUP_PASS) {
    return NextResponse.json(
      { message: "Invalid setup password" },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert or update user
    const result = await db.collection("user").updateOne(
      { email },
      {
        $set: {
          email,
          password: hashedPassword,
          firstname: firstname || "",
          lastname: lastname || "",
          profileImage: null,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "User created/updated successfully", result },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log("Setup Exception:", error.toString());
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}