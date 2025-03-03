import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const influencers = await prisma.aIInfluencer.findMany({
        include: {
            posts: true,
        },
    });
    console.log(influencers);
    return NextResponse.json(influencers);
}
