
import { GoogleGenAI, Modality, Type } from "@google/genai";

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export async function checkApiKey() {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }
}

/**
 * Structured response for the Concierge system.
 */
export interface ConciergeResponse {
  voiceLine: string;
  displayTitle: string;
  displayBody: string;
}

/**
 * Fetches a decision from the Gemini model based strictly on the Hotel Pack data.
 */
export async function getConciergeDecision(intent: string, pack: any, lang: string): Promise<ConciergeResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Minimize the pack data sent to context to keep it relevant
  const hotelContext = {
    profile: pack.profile,
    events: pack.events.map((e: any) => ({
      title: e.title[lang] || e.title.en,
      time: e.startTime,
      location: e.location[lang] || e.location.en,
      day: e.dayTag
    }))
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hotel Knowledge Base: ${JSON.stringify(hotelContext)}\n\nUser Intent/Topic: ${intent}`,
    config: {
      systemInstruction: `You are the Social Hub Concierge. 
      TONE: Friendly, modern, playful, and professional. Use "Hey!", "No stress", "Got it", "You're all set". Avoid "Dear Guest" or robotic language.
      STRICT BOUNDARY: Answer ONLY using the provided Hotel Knowledge Base. 
      If info is missing or the request is general knowledge (like "who is the president" or "where is a good bar" not in the list), say exactly: "I'm not sure about that, so it's best to reach out to the front desk. Our team's here 24/7."
      - Provide a warm, conversational answer (2-3 sentences max).
      SPECIFIC RULES:
      - For "issue/broken/dirty": Always tell them to reach out to the front desk immediately.
      - For "students": Mention the specific student policies (tokens, kitchen, visitors).
      - For "cleaning": Distinguish between guest and student schedules.
      RESPONSE FORMAT: Return valid JSON with:
      - voiceLine: A warm, short, friendly sentence for the high-quality TTS.
      - displayTitle: A catchy, short title for the UI card.
      - displayBody: 2-3 short, clear sentences of information.
      LANGUAGE: Respond in ${lang}. Ensure all text in the JSON is in ${lang}.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          voiceLine: { type: Type.STRING },
          displayTitle: { type: Type.STRING },
          displayBody: { type: Type.STRING },
        },
        required: ["voiceLine", "displayTitle", "displayBody"],
      },
      temperature: 0.7,
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      voiceLine: "Let me check that for you.",
      displayTitle: "Information",
      displayBody: "I'm looking into that right now."
    };
  }
}

/**
 * Generates high-quality speech using the Gemini TTS model.
 */
export async function generateSpeech(text: string, lang: string = 'en'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Mapping languages to high-quality specific female-leaning voices
  const voiceMap: Record<string, string> = {
    'en': 'Aoede',
    'fr': 'Kore',
    'de': 'Fenrir',
    'es': 'Kore',
    'it': 'Puck',
    'pt': 'Kore'
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voiceMap[lang] || 'Aoede' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No speech generated");
  return base64Audio;
}

/**
 * Generates an image using the Gemini image model.
 */
export async function generateMagicImage(prompt: string, aspectRatio: AspectRatio = "1:1"): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
      },
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No response from the image model.");
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64EncodeString}`;
    }
  }

  throw new Error("No image data found in the model response.");
}
