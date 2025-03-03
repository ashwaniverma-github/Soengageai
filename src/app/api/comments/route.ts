import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { wallet, postId, text } = await req.json();

    if (!wallet || !postId || !text) {
      return NextResponse.json({ message: "Empty input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { wallet: wallet },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 404 }
      );
    }

    await prisma.comment.create({
      data: {
        post: {
          connect: {
            id: postId,
          },
        },
        text,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Comment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}