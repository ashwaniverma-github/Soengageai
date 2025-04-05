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
      model: "black-forest-labs/flux-schnell",
      input: {
        prompt: message,
        go_fast: false,
        megapixels: "1",
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 100,
        num_inference_steps: 4,
      },
    });

    // Poll the prediction status until it's complete or failed
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "failed") {
      throw new Error("Image generation failed");
    }

    // Extract the output URL (assuming result.output is a URL or an array of URLs)
    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    console.log("Generated Image URL:", imageUrl);

    // In your API route
    return NextResponse.json({ response: imageUrl })
    
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in Artifex endpoint:", error.message);
    } else {
      console.error("Error in Artifex endpoint:", String(error));
    }
    return NextResponse.json(
      { error: "Failed to generate image: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
