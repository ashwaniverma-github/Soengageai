import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, res: Response) {
    const influencers = await prisma.aIInfluencer.findMany({
        include: {
            posts: true,
        },
    });
    console.log(influencers);
    return NextResponse.json(influencers);
}
