import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { z } from 'zod';
import { randomUUID } from 'crypto';

// Schema validation
const insertNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
});

// Gemini client setup
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable is required');
  }
  
  return new GoogleGenAI({ apiKey });
}

// Generate flashcards function (optimized for Vercel timeout limits)
async function generateFlashcards(title: string, content: string, count: number = 10) {
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

    return result;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. Please try again.");
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { title, content } = insertNoteSchema.parse(req.body);
      
      // Generate flashcards using Gemini (stateless - no storage)
      const flashcardResponse = await generateFlashcards(title, content, 10);
      
      // Create note object (client-side only, no server storage)
      const note = {
        id: randomUUID(),
        title,
        content,
        createdAt: new Date()
      };
      
      // Format flashcards for client
      const flashcards = flashcardResponse.flashcards.map((card, index) => ({
        id: randomUUID(),
        noteId: note.id,
        question: card.question,
        answer: card.answer,
        cardIndex: index,
        createdAt: new Date()
      }));
      
      res.json({
        note,
        flashcards
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate flashcards" 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
