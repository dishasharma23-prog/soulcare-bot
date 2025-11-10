export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      console.error("API_KEY_ERROR: GEMINI_API_KEY environment variable is not set.");
      return NextResponse.json(
        { reply: "I'm here with you 💜 Companion setup error: My voice is currently unavailable due to a configuration issue." },
        { status: 503 } 
      );
    }
    
    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Respond with empathy, short supportive sentences, no lists.
Always validate the user's feelings.
End with one gentle reflective question.

User says: "${message}"
`;

    const result = await model.generateContent(prompt);
    
    // This line fixes the Type Error:
    const reply = (result.response.text || "").trim();

    return NextResponse.json({
      reply: reply || "I'm here with you 💜 You're not alone.",
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json(
      {
        reply: "I'm here with you 💜 Something went wrong, but you're not alone. I'll try to reply better next time.",
      },
      { status: 500 }
    );
  }
}