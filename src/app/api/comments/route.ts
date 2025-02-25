import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export default async function POST(req:Request){
    try{
        const {wallet , postId , text} = await req.json()

        if(!wallet || !postId || !text){
            return NextResponse.json({message:"Empty input"})
        }
        const user = await prisma.user.findUnique({
            where:{wallet:wallet}
        })
        if(!user){
            return NextResponse.json({message:"Please Login first"} , {status:404})
        }

        const comment = await prisma.comment.create({
            data:{
                post: {
                    connect: {
                        id: postId
                    }
                },
                text,
                user:{
                    connect:{
                        id:user.id
                    }
                }
            }
        })
        return NextResponse.json({message:"Comment created successfully"} , {status:201})
        
    }catch(error){
        console.error(error)
    }
}