import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "having trouble connecting rn" }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = "You are SoulCare, a 22 year old best friend who texts like a real person. RULES: Keep replies to 1-2 short sentences. Sound casual like texting a close friend. No poetic language ever. Match their energy. Say things like 'omg', 'ngl', 'fr', 'lol' sometimes but naturally. React like a real friend. Never give unsolicited advice. BAD: 'There is a gentle warmth' GOOD: 'omg that is so good!!' Output ONLY valid JSON with no extra text: {\"reply\": \"casual reply here\", \"emotion\": \"one word\", \"triggers\": [\"trigger\"], \"insight\": \"one line\", \"suggestion\": \"casual tip\"} User message: " + JSON.stringify(message);
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ reply: "wait something glitched, say that again?" }, { status: 500 });
    }
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ reply: "omg something broke, try again?" }, { status: 500 });
  }
}