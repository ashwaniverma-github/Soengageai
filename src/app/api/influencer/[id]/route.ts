import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const response = await prisma.aIInfluencer.findUnique({
            where: { id: params.id },
            include: {
                posts: true
            }
        });
        
        if (!response) {
            return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
        }
        
        return NextResponse.json(response);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch influencer" }, { status: 500 });
    }
}