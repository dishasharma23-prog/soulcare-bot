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
You are SoulCare 💜, a warm emotional support companion.
Your job is to validate emotions, comfort gently, and ask one open follow-up question.
Be soft, supportive, and human — never formal or clinical.

User: "${message}"
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({
      reply: reply || "I'm here with you 💜 You're not alone.",
    });

  } catch (error) {
    console.error("Gemini API Error →", error);
    return NextResponse.json(
      { reply: "I'm here with you 💜 Something went wrong, but you're not alone." },
      { status: 500 }
    );
  }
}

