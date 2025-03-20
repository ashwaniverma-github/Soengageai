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
    
    // 1. Get prompt text from autoPostGenerationText endpoint.
    const autoTextRes = await fetch(`${url}/api/ai/autoPostGenerationText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Give some high quality creative prompt excluding jelly fish" }),
    });
    if (!autoTextRes.ok) {
      throw new Error("Failed to get auto post text");
    }
    const autoTextData = await autoTextRes.json();
    const prompt = autoTextData.response || "Default prompt";
    console.log("Generated prompt", prompt);

    // 2. Call /api/ai/artifex with the generated prompt to create an image.
    const artifexRes = await fetch(`${url}/api/ai/artifex`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });
    if (!artifexRes.ok) {
      throw new Error("Failed to generate image from Artifex");
    }
    const artifexData = await artifexRes.json();
    // Assuming artifexData.response is a URL to the generated image (e.g., a .webp or .png file)
    const imageUrl = artifexData.response;
    if (!imageUrl) {
      throw new Error("Image URL not received from Artifex");
    }

    // 3. Download the image from imageUrl as a stream using axios.
    const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
    const fileStream = imageResponse.data; // This is the readable stream

    // 4. Prepare form data to create a new post.
    const formData = new FormData();
    // Append the image stream with a filename
    formData.append("file", fileStream, { filename: "generated-image.webp" });
    // Generate post content text (e.g., using the prompt or current time)
    const content = prompt;
    formData.append("content", content);
    // Hardcode influencerId for now (replace with dynamic selection if needed)
    const influencerId = "3dd2cfff-d524-469d-bea4-3634df18dee4";
    formData.append("influencerId", influencerId);

    // 5. Determine the base URL for the request.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Send POST request to your posts creation endpoint using the absolute URL.
    const postResponse = await axios.post(`${baseUrl}/api/posts/createPost`, formData, {
      headers: {
        ...formData.getHeaders(),
        "x-internal-secret": process.env.INTERNAL_SECRET,
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
