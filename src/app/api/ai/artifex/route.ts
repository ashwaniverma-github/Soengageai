// app/api/ai/artifex/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

const hfToken = process.env.HUGGING_TOKEN as `hf_${string}` | undefined;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const client = await Client.connect("black-forest-labs/FLUX.1-dev",{hf_token:hfToken})

    const result = await client.predict("/infer", {
      prompt: message,
      seed: 0,
      randomize_seed: true,
      width: 1024,
      height: 1024,
    //   guidance_scale: 3.5,
      num_inference_steps: 28,
    });

    // Extract image URL from Gradio response
    const imageData = (result.data as { url: string }[])[0];
    if (!imageData?.url) {
      throw new Error("Invalid response format from Gradio");
    }

    return NextResponse.json({ response: imageData.url });
    
  } catch (error) {
    console.error("Error in Artifex endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}