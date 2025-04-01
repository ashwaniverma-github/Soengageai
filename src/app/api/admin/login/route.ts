import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const correctUsername = process.env.ADMIN_USERNAME;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (username === correctUsername && password === correctPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
}