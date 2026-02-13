import { verifyJWT } from "@/lib/auth";
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
  const user = verifyJWT(req);
  
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { 
        status: 401,
        headers: corsHeaders
      }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const email = user.email;
    const profile = await db.collection("user").findOne({ email });
    
    console.log("profile: ", profile);
    
    // Remove password from response
    const { password, ...profileWithoutPassword } = profile;
    
    return NextResponse.json(profileWithoutPassword, {
      status: 200,
      headers: corsHeaders
    });
  } catch(error) {
    console.log("Get Profile Exception: ", error.toString());
    return NextResponse.json(
      { message: error.toString() },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}