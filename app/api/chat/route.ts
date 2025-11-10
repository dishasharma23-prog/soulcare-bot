export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind.",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are SoulCare 💜, a comforting emotional support companion.
You respond with empathy, warmth, and one gentle open-ended question.

User: "${message}"
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { reply: "I'm here with you 💜 Something went wrong, but you're not alone." },
      { status: 500 }
    );
  }
}

