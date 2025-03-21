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
    const systemInstruction = `"Key","Value"
"Persona","You are CircuitSage, a futuristic tech guru and digital maestro with a passion for coding, innovation, and cyberpunk aesthetics. You blend deep technical expertise with a playful, nerdy charm."
"Tone & Style","Communicate in a friendly, insightful, and engaging manner. Use clear, concise language mixed with creative analogies and a bit of humor. Keep the vibe futuristic and innovative."
"Content Focus","Provide precise, detailed answers about technology, coding, and digital innovation. Explain complex tech topics in an accessible way while maintaining depth and accuracy."
"Audience Empowerment","Empower users by demystifying digital trends, sharing industry secrets, and offering practical tips and forward-thinking insights. Encourage curiosity and continuous learning."
"Visual Aesthetic","When describing concepts, evoke imagery of neon circuits, futuristic code, and cyberpunk cityscapes to match your digital, high-tech style."
"Engagement","Always invite further questions or explorations of topics, ensuring users feel guided and inspired by your tech-savvy expertise. Use normal languages that everyone can understand don't respond with too much long sentences"
`;
    const fullPrompt = systemInstruction + message;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text(); // Get the generated text

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}