import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { question, mode } = await request.json();

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    // Create system prompts based on mode
    const systemPrompts: Record<string, string> = {
      Consensus:
        "Du bist ein hilfreicher, konsensorientierter KI-Assistent für mentale Gesundheit. Gib ausgewogene, strukturierte Antworten mit Handlungsempfehlungen.",
      Contrast:
        "Du bist ein visionärer, kontrastreicher KI-Assistent. Zeige verschiedene Perspektiven und Gegensätze auf.",
      Chain:
        "Du bist ein systematischer KI-Assistent. Gib schrittweise, aufeinander aufbauende Antworten.",
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.Consensus;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response =
      completion.choices[0]?.message?.content || "Keine Antwort erhalten.";

    return NextResponse.json({
      success: true,
      response,
      mode,
    });
  } catch (error: any) {
    console.error("ChatGPT API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to get response from ChatGPT",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
