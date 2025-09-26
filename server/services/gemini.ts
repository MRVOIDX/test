import { GoogleGenAI } from "@google/genai";
import { type FlashcardResponse } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Using Gemini 2.5 Flash model as requested by user
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable is required');
  }
  
  return new GoogleGenAI({ apiKey });
}

export async function generateFlashcards(title: string, content: string, count: number = 20): Promise<FlashcardResponse> {
  try {
    const prompt = `You are Osamah, an AI study assistant helping Selin create flashcards from her study notes.

Create exactly ${count} high-quality flashcards from the following study material:

Title: ${title}
Content: ${content}

Guidelines:
- Create clear, concise questions that test understanding
- Provide comprehensive but not overly long answers
- Cover different aspects and details from the material
- Make questions progressively cover the content thoroughly
- Ensure questions are study-friendly and educational
- Mix different question types (definition, comparison, explanation, application)

Respond with JSON in this exact format:
{
  "flashcards": [
    {"question": "What is...", "answer": "The answer is..."},
    {"question": "How does...", "answer": "It works by..."}
  ]
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            flashcards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["flashcards"]
        }
      },
      contents: prompt,
    });

    const responseText = response.text || "{}";
    const result = JSON.parse(responseText);
    
    if (!result.flashcards || !Array.isArray(result.flashcards)) {
      throw new Error("Invalid response format from Gemini");
    }

    // Ensure we have the requested number of flashcards
    if (result.flashcards.length < count) {
      console.warn(`Expected ${count} flashcards, got ${result.flashcards.length}. Gemini provided fewer cards than requested.`);
    }

    // If we got more than requested, trim to exact count
    if (result.flashcards.length > count) {
      result.flashcards = result.flashcards.slice(0, count);
    }

    return result as FlashcardResponse;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. Please try again.");
  }
}

export async function generateMoreFlashcards(title: string, content: string, existingQuestions: string[], count: number = 10): Promise<FlashcardResponse> {
  try {
    const existingQuestionsText = existingQuestions.join("\n- ");
    
    const prompt = `You are Osamah, an AI study assistant helping Selin create additional flashcards from her study notes.

Create exactly ${count} NEW flashcards from the following study material. Make sure these are DIFFERENT from the existing questions.

Title: ${title}
Content: ${content}

Existing questions to avoid duplicating:
- ${existingQuestionsText}

Guidelines:
- Create completely new questions not covered by existing ones
- Focus on different aspects, details, or perspectives from the material
- Maintain the same quality and educational value
- Ensure questions complement the existing set
- Mix different question types and difficulty levels

Respond with JSON in this exact format:
{
  "flashcards": [
    {"question": "What is...", "answer": "The answer is..."},
    {"question": "How does...", "answer": "It works by..."}
  ]
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            flashcards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["flashcards"]
        }
      },
      contents: prompt,
    });

    const responseText = response.text || "{}";
    const result = JSON.parse(responseText);
    
    if (!result.flashcards || !Array.isArray(result.flashcards)) {
      throw new Error("Invalid response format from Gemini");
    }

    // Ensure we got some flashcards
    if (result.flashcards.length === 0) {
      throw new Error("No additional flashcards could be generated");
    }

    return result as FlashcardResponse;
  } catch (error) {
    console.error("Error generating additional flashcards:", error);
    throw new Error("Failed to generate additional flashcards. Please try again.");
  }
}