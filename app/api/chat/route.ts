import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind."
      });
    }

    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Respond with empathy, short supportive sentences, no lists.
Always validate the user's feelings.
End with one gentle reflective question.

User says: "${message}"
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({
      reply: reply || "I'm here with you 💜 You're not alone."
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({
      reply: "I'm here with you 💜 Something went wrong, but you're not alone."
    }, { status: 500 });
  }
}

