import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export default async function GET(){
    try{
        const posts  = await prisma.post.findMany({
            include:{influencer:true , comments:true}
        })

        return NextResponse.json(posts)

    }catch(error){
        console.error(error)
    }
}