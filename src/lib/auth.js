import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "mydefaultjwtsecret"; // Use a strong secret in production

export function verifyJWT(req) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}