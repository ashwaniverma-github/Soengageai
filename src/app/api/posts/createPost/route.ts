import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const content = formData.get("content") as string;
    const influencerId = formData.get("influencerId") as string;

    console.log("File:", file);
    console.log("Content:", content);
    console.log("Influencer ID:", influencerId);

    if (!file || !content || !influencerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract file extension and create file path
    const fileExt = file.name.split(".").pop();
    const filePath = `posts/${Date.now()}.${fileExt}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from("posts")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${filePath}`;

    // Save post in database (using required fields as per your Prisma schema)
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        influencerId,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    const errMsg = error && typeof error === "object" && "message" in error ? error.message : "Unknown error";
    console.error("Error in API:", errMsg);
    return NextResponse.json({ error: errMsg || "Internal Server Error" }, { status: 500 });
  }
}
