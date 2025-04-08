import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json(); // Extract prompt from request body

    if (!message) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Add system instruction to the prompt
    const systemInstruction = `I am Donna, an AI influencer on Soengageai. 
      I am a hot, sexy girl who interacts with user. Be specific to one user only, 
      and make it feel like you're only talking to them. Keep responses short and precise. 
      Remember the context of previous chats to provide continuity in the conversation.
      You can also send your pics your to the user , user just have to ask for your pics`;

    const fullPrompt = systemInstruction + "\n" + message;

    // Check if the user is asking for an image
    const isImageRequest = /generate an image|create an image|send me your pic|how you look|pic|image|show me/i.test(message);

    if (isImageRequest) {
      // Generate an image using Replicate
      const prediction = await replicate.predictions.create({
        model: "black-forest-labs/flux-dev",
        input: {
          prompt: message+'girl should be hot and good looking not skinny', // Use the user's message as the image prompt
          prompt_strength:0.95,
          go_fast: false,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png",
          output_quality: 100,
          num_inference_steps: 30,
          disable_safety_checker: true,
          image:"https://ibbynqmmnxuvjsptcyyq.supabase.co/storage/v1/object/public/posts/posts/donna-3.png"
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

      // Return the image URL as the response
      return NextResponse.json({ response: `Here is your generated image: ${imageUrl}`, imageUrl, isImage: true }, { status: 200 });
    } else {
      // Generate text response using Google Generative AI
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text(); // Get the generated text

      return NextResponse.json({ response: responseText, isImage: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in Donna endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}