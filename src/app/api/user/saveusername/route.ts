import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }
    const { wallet, username } = body;
    if (!wallet || !username) {
      return NextResponse.json({ error: "Missing wallet or username" }, { status: 400 });
    }

    // Upsert the user based on wallet address
    const user = await prisma.user.upsert({
      where: { wallet },
      update: { username },
      create: { wallet, username },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error saving username:", error || "Unknown error");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
