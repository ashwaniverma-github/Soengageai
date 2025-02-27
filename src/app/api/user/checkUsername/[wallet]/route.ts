import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This endpoint expects a dynamic route parameter "wallet"
export async function GET(
  request: Request,
  { params }: { params: { wallet: string } }
) {
  try {
    const { wallet } = params;
    const user = await prisma.user.findUnique({
      where: { wallet },
    });

    // Return the user if found, otherwise return an empty object
    return NextResponse.json(user || {});
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
