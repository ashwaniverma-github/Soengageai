import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("Base URL:", baseUrl); // Log the base URL

  try {
    // 1. Get prompt text from autoPostGenerationText endpoint.
    const autoTextUrl = `${baseUrl}/api/ai/autoPostGenerationText`;
    console.log("Fetching auto post text from:", autoTextUrl);
    
    // For the Image generations prompt
    const autoTextRes = await fetch(autoTextUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "give me a prompt to generate a image of hot women describe the environment and style of the girl . give only one prompt 20-30 words nothing else directly give the prompt" }),
    });
    if (!autoTextRes.ok) {
      throw new Error("Failed to get auto post text");
    }
    const autoTextData = await autoTextRes.json();
    const prompt = autoTextData.response || "Default prompt";
    console.log("Generated prompt:", prompt);

    // For the Post Title 
    const autoTitleRes = await fetch(autoTextUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "give me a hot girl pic post title in 5-10 words , just directly give one title nothing else , dont define the environment  it should be about the girl" }),
      });
      if (!autoTextRes.ok) {
        throw new Error("Failed to get auto post text");
      }
      const autoTitleData = await autoTitleRes.json();
      const title = autoTitleData.response || "Default prompt";
      console.log("Generated title:", title);

    // 2. Call /api/ai/donna with the generated prompt to create an image.
    const donnaUrl = `${baseUrl}/api/ai/donna`;
    console.log("Calling Donna endpoint at:", donnaUrl);
    
    const donnaRes = await fetch(donnaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "image of " + prompt }),
    });
    if (!donnaRes.ok) {
      throw new Error("Failed to generate image from Donna");
    }
    const donnaData = await donnaRes.json();
    console.log("Donna response:", donnaData);
    
    const imageUrl = donnaData.response;
    console.log("Generated image URL:", imageUrl);
    if (!imageUrl) {
      throw new Error("Image URL not received from Donna");
    }

    // 3. Download the image from imageUrl as a stream using axios.
    const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
    const fileStream = imageResponse.data;
    console.log("Image stream retrieved");

    // 4. Prepare form data to create a new post.
    const formData = new FormData();
    formData.append("file", fileStream, { filename: "generated-image.webp" });
    formData.append("content", title);
    const influencerId = "7d3f444c-8bb1-45f7-860b-58fe296bc1f2";
    formData.append("influencerId", influencerId);

    // Log formData info if needed (formData itself won't stringify easily)
    console.log("Form data prepared");

    // Send POST request to your posts creation endpoint using the absolute URL.
    const createPostUrl = `${baseUrl}/api/posts/createPost`;
    console.log("Creating post at:", createPostUrl);
    
    const postResponse = await axios.post(createPostUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        "x-internal-secret": process.env.INTERNAL_SECRET,
      },
    });
    console.log("Automated post created:", postResponse.data);

    return NextResponse.json({ success: true, post: postResponse.data.post });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error automating post:", errMsg);
    return NextResponse.json({ error: errMsg || "Failed to create post" }, { status: 500 });
  }
}
