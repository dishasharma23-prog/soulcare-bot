import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ Missing Gemini API Key");
      return NextResponse.json(
        { reply: "I’m having trouble connecting right now 💜" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🟣 Balanced SoulCare Prompt
    const prompt = `
You are SoulCare 💜 — a warm, calming emotional companion.

Your communication style:
• Speak gently, clearly, and supportively.
• DO NOT ask a question in every response.
• Instead use a *natural mix* of:
  – gentle advice  
  – reflections  
  – emotional validation  
  – supportive insights  
  – occasional soft questions  
• Never pressure the user to answer.
• Never ask two questions back-to-back unless the user is actively engaging.
• Avoid dead-end replies — always offer either:
  – a gentle guiding thought, or  
  – a soft optional invitation to share more.

Tone:
• Soft, grounded, comforting, youthful.
• No over-enthusiasm or dramatic positivity.
• No exclamation marks.
• Keep responses warm and human.

Follow-up rules:
• If user is sharing something emotional → validate + reflect.
• If user is celebrating something positive → acknowledge softly + reflect on why it feels good.
• If user gives short/neutral answers → do NOT interrogate, simply offer gentle support.
• If user opens up → ask a soft question to help them explore, but only occasionally.

Your output must be JSON ONLY:

{
  "reply": "SoulCare's response",
  "emotion": "detected emotion of the user",
  "triggers": ["possible triggers"],
  "insight": "brief reflective insight",
  "suggestion": "gentle optional suggestion"
}

User message: "${message}"
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Remove ```json wrappers if Gemini adds them
    text = text.replace(/```json|```/g, "");

    // Validate JSON before returning
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON Parse Error:", text);
      return NextResponse.json(
        {
          reply:
            "I'm here with you 💜 Something went wrong, but you're still safe with me."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      {
        reply:
          "I'm here with you 💜 Something went wrong, but you're still safe with me."
      },
      { status: 500 }
    );
  }
}
