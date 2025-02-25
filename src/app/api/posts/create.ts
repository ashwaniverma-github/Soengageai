import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, influencerId, imageUrl } = await req.json();

    const post = await prisma.post.create({
      data: {
        content,
        influencerId,
        imageUrl,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Post creation failed" }, { status: 500 });
  }
}
