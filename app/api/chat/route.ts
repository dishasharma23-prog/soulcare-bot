export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Explicitly retrieve and check the API Key inside the function
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      console.error("API_KEY_ERROR: GEMINI_API_KEY environment variable is not set.");
      return NextResponse.json(
        { reply: "I'm here with you 💜 Companion setup error: My voice is currently unavailable due to a configuration issue." },
        { status: 503 } 
      );
    }
    
    // Handle empty message
    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind.",
      });
    }

    // 2. Instantiate genAI and model inside the function scope (Fixes undefined error)
    const genAI = new GoogleGenerativeAI(apiKey);
    // 3. Use the correct, stable model name (Fixes 404 Not Found error)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Respond with empathy, short supportive sentences, no lists.
Always validate the user's feelings.
End with one gentle reflective question.

User says: "${message}"
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const reply = result.response.text?.trim();

    return NextResponse.json({
      reply: reply || "I'm here with you 💜 You're not alone.",
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    // Provide a kind message for any unexpected server error
    return NextResponse.json(
      {
        reply: "I'm here with you 💜 Something went wrong, but you're not alone. I'll try to reply better next time.",
      },
      { status: 500 }
    );
  }
}

