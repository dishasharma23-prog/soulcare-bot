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

    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Speak softly, validate feelings, and always end with a gentle, open-ended question.
No bullet points. No lists.

User: "${message}"
`;

    // ✅ Use new SDK constructor
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // ✅ Load model correctly for API v1
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ✅ Generate response
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({
      reply: reply || "I'm here with you 💜 You're not alone.",
    });
  } catch (error) {
    console.error("Gemini API Error →", error);

    return NextResponse.json(
      {
        reply:
          "I'm here with you 💜 Something went wrong on my end. We'll get through it together.",
      },
      { status: 500 }
    );
  }
}

