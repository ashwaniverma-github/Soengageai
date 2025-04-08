import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  // Check if request contains internal secret header
  const internalSecret = req.headers.get("x-internal-secret");
  if (internalSecret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const content = formData.get("content") as string;
    const influencerId = formData.get("influencerId") as string;

    console.log("File:", file);
    console.log("Content:", content);
    console.log("Influencer ID:", influencerId);

    if (!content || !influencerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl: string | null = null;

    // Only upload file if it exists
    if (file && file.size > 0) {
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

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${filePath}`;
      console.log('saved image' + imageUrl)
    }

    // Save post in database; if imageUrl is null, it won't be saved.
    const post = await prisma.post.create({
      data: {
        content,
        influencerId,
        ...(imageUrl && { imageUrl }), // Only include imageUrl if defined
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    const errMsg =
      error && typeof error === "object" && "message" in error
        ? error.message
        : "Unknown error";
    console.error("Error in API:", errMsg);
    return NextResponse.json(
      { error: errMsg || "Internal Server Error" },
      { status: 500 }
    );
  }
}
