import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json(); // Extract prompt from request body

    if (!message) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Add system instruction to the prompt
    const systemInstruction = ""
    const fullPrompt = systemInstruction + message;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text(); // Get the generated text
    console.log(responseText)
    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}