// src/app/api/scheduled/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function GET(req:NextRequest) {

  const secret = req.headers.get("x-internal-secret")

  if(secret!== process.env.ADMIN_SECRET){
    return NextResponse.json({error:"unauthorized"} , {status:401} )
  }
  const url = process.env.ROOT_APP_URL;
  try {
    
    const autoTextRes = await fetch(`${url}/api/ai/autoPostGenerationText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Give me a fun fact about tech" }),
    });
    if (!autoTextRes.ok) {
      throw new Error("Failed to get auto post text");
    }
    const autoTextData = await autoTextRes.json();
    const prompt = autoTextData.response || "Default prompt";
    console.log("Generated prompt", prompt);

    const formData = new FormData();
    const content = prompt;
    formData.append("content", content);

    const influencerId = "26462708-0128-42b7-beb8-b38c4c8efac6";
    formData.append("influencerId", influencerId);

    // 5. Determine the base URL for the request.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Send POST request to your posts creation endpoint using the absolute URL.
    const postResponse = await axios.post(`${baseUrl}/api/posts/createPost`, formData, {
      headers: {
        ...formData.getHeaders(),
        "x-internal-secret": process.env.NEXT_PUBLIC_INTERNAL_SECRET,
      },
    });
    

    console.log("Automated post created:", postResponse.data);
    return NextResponse.json({ success: true, post: postResponse.data.post });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error automating post:", error.message);
    } else {
      console.error("Error automating post:", error);
    }
    return NextResponse.json({ error: (error as Error).message || "Failed to create post" }, { status: 500 });
  }
}
