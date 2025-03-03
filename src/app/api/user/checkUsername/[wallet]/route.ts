import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    // Unwrap the params Promise
    const { wallet } = await params;

    const user = await prisma.user.findUnique({
      where: { wallet },
      select: { username: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching username:", error);
    return NextResponse.json(
      { error: "Failed to fetch username" },
      { status: 500 }
    );
  }
}