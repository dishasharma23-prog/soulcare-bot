import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "Having trouble connecting right now." }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = "You are SoulCare. You are a mature, grounded, and high-intelligence companion. Your goal is to be a steady outlet for the user's thoughts. CRITICAL RULES: 1. NO DISMISSIVE ADVICE: If the user rants about someone, NEVER tell them to be friends or apologize. Validate their frustration first. 2. NO TOXIC POSITIVITY: Do not try to fix the mood. Stay calm and objective. 3. GROUNDED VALIDATION: Use phrases like 'That is a completely fair reaction' or 'It makes sense why that would get under your skin.' 4. Be articulate but concise. Use clear sentences. No flowery metaphors, no slang. 5. NO JUDGMENT: If the user is being petty or angry, let them. Be the safe space where they do not have to be perfect. Tone: Calm, observant, rational. Like a mentor who is also a peer. 2-3 sentences max. Output JSON ONLY: {\"reply\": \"your grounded response\", \"emotion\": \"detected_emotion\", \"triggers\": [\"logic_behind_frustration\"], \"insight\": \"a mature perspective\", \"suggestion\": \"one low-pressure way to decompress\"} User message: " + JSON.stringify(message);
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ reply: "Something went wrong on my end. Could you say that again?" }, { status: 500 });
    }
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ reply: "Something went wrong. Please try again." }, { status: 500 });
  }
}