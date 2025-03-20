import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Force serverless runtime to allow longer execution times
export const runtime = "nodejs";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    // Start the prediction
    const prediction = await replicate.predictions.create({
      version: "c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6",
      input: {
        width: 1024,
        height: 1024,
        prompt: message,
        guidance_scale: 5,
        negative_prompt: "",
        pag_guidance_scale: 2,
        num_inference_steps: 18,
      },
    });

    // Poll the prediction status until it's complete or failed
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "failed") {
      throw new Error("Image generation failed");
    }

    // Extract the final output URL (assuming result.output is a URL or an array of URLs)
    const imageUrl = result.output;
    console.log("Generated Image URL:", imageUrl);
    
    return NextResponse.json({ response: imageUrl });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in Artifex endpoint:", error.message);
    } else {
      console.error("Error in Artifex endpoint:", error);
    }
    return NextResponse.json(
      { error: "Failed to generate image: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
