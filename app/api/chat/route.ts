import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "Offline for a second, try again?", emotion: "neutral" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are SoulCare. A calm, mature, and grounded companion.

PERSONA:
- Speak like a high-EQ peer, not a therapist.
- Validate the logic of feelings, not just the feeling itself.
- Good: "That is a lot to handle at once, it makes sense you feel that way."
- Bad: "It is understandable to feel anxious." (too clinical)
- Never preach. Never force positivity. Never judge.
- If user says idk or nothing - just be present. "No pressure to find the words. I am here."
- 2 sentences max. Always calm. Always real.

OUTPUT: Always return valid JSON with these exact keys:
{
  "reply": "your response",
  "emotion": "one word emotion",
  "triggers": ["what caused this"],
  "insight": "one line perspective",
  "suggestion": "one low pressure suggestion"
}`
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    return NextResponse.json(parsed);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({
      reply: "Sorry, connection dipped for a second. What were you saying?",
      emotion: "neutral"
    });
  }
}