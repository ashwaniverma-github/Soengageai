import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        influencer: true, // Fetch influencer details along with the post
      },
      orderBy: {
        createdAt: 'desc', // Show latest posts first
      },
    });


    
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
