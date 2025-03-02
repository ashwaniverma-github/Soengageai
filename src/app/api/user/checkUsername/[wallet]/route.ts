import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// This endpoint expects a dynamic route parameter "wallet"
export async function GET(
  req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const wallet = params.wallet;
    const user = await prisma.user.findUnique({
      where: { wallet: wallet },
      select: { username: true }
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
