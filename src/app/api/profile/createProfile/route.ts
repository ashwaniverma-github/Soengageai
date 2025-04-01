import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // Step 1: Verify Admin Access Code
    const formData = await req.formData();
    const adminAccessCode = formData.get("adminAccessCode") as string;

    if (!adminAccessCode || adminAccessCode !== process.env.ADMIN_ACCESS_CODE) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid admin access code" },
        { status: 401 }
      );
    }

    // Step 2: Process the Request
    const name = formData.get("name") as string;
    const file = formData.get("profilePicture") as File;

    if (!name || !file) {
      return NextResponse.json(
        { error: "Name and profile picture are required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop() || "bin";
    const fileName = `${timestamp}.${fileExt}`;

    const fileBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(fileBuffer);

    const { error: uploadError } = await supabase.storage
      .from("influencer-profiles")
      .upload(fileName, fileData, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("influencer-profiles")
      .getPublicUrl(fileName);

    const influencer = await prisma.aIInfluencer.create({
      data: {
        name,
        bio: formData.get("bio") as string || "",
        profilePicture: urlData.publicUrl,
      },
    });

    return NextResponse.json(influencer, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}