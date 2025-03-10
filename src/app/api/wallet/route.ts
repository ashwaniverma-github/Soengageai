import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();
    if (!wallet) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // Check if the user already exists with this wallet address
    let user = await prisma.user.findUnique({
      where: { wallet },
    });

    // If not, create a new user record (you can also update an existing record if needed)
    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet,
          // Optionally, set a default username or leave it null
          username: wallet.slice(0, 6), // Example: first 6 characters as username
          provider: "Wallet", // Add the provider property
        },
      });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Error saving wallet:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
