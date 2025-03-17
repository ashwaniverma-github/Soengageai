// src/app/api/credits/spend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (user.credits < amount) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }
    
    // Deduct credits
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { credits: { decrement: amount } },
    });
    
    return NextResponse.json({ credits: updatedUser.credits });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error spending credits:", error.message);
    } else {
      console.error("Error spending credits:", error);
    }
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
