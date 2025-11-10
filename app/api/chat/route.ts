import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client.
// It automatically looks for the GEMINI_API_KEY in process.env.
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // --- 1. Basic Input Validation ---
    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "I'm here with you 💜 Tell me what's on your mind.",
      });
    }

    // --- 2. System Prompt for Persona ---
    const prompt = `
You are SoulCare 💜, a warm emotional support companion.
Your primary goals are to offer deep empathy and validate the user's feelings.
Your response must be concise and always end with one soft, open-ended follow-up question.
Do not use numbered lists or bullet points.

User: "${message}"
`;

    // --- 3. Call the Gemini API using the SDK ---
    const response = await ai.models.generateContent({
      // **CRITICAL FIX:** Changed model to the currently stable gemini-2.5-flash
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // Optional: Increase temperature slightly for more natural variation
        temperature: 0.8, 
      },
    });

    // --- 4. Extract and Return Reply ---
    // The SDK handles parsing the response and safely extracting the text
    const reply = response.text;

    return NextResponse.json({
      // Use the reply from the model, or the fallback if it's empty
      reply: reply || "I'm here with you 💜 You're not alone.",
    });

  } catch (error) {
    // Log the error for debugging purposes (this will show the 404 if the model name is wrong)
    console.error("Gemini API Error →", error); 
    
    // Return a soft error message to the user with a 500 status
    return NextResponse.json({
      reply: "I'm here with you 💜 Something went wrong on my end, but you're not alone. Please check my connection.",
    }, { status: 500 });
  }
}
