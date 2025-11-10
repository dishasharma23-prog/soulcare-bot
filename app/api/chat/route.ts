export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind.",
      });
    }

    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Speak gently, validate emotions, and always ask one soft follow-up question.
No lists. No bullet points.

User: ${message}
`;

    // ✅ Correct model + correct call format
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    // ✅ Correct .text() usage
    const reply = result.response.text();

    return NextResponse.json({
      reply: reply || "I'm still here with you 💜 You're not alone.",
    });

  } catch (error) {
    console.error("Gemini API Error →", error);
    return NextResponse.json({
      reply: "I'm here with you 💜 Something went wrong.",
    }, { status: 500 });
  }
}
