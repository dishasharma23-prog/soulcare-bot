// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("DEBUG | Loaded Key:", apiKey ? "✅ Yes" : "❌ No");

    if (!apiKey) {
      return NextResponse.json(
        { reply: "I'm here with you 💜 My voice is temporarily unavailable." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Speak softly, validate feelings, and end with a gentle supportive question.
User says: "${message}"
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text() || "I'm here with you 💜 You're not alone.";

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { reply: "I'm here with you 💜 Something went wrong, but you're not alone." },
      { status: 500 }
    );
  }
}
