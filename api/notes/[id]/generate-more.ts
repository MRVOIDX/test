import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { z } from 'zod';

// Input validation schema
const generateMoreSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  existingQuestions: z.array(z.string().min(1, "Question cannot be empty")),
  count: z.number().min(1).max(20).optional().default(10)
});

// Gemini client setup
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable is required');
  }
  
  return new GoogleGenAI({ apiKey });
}

// Generate more flashcards function
async function generateMoreFlashcards(title: string, content: string, existingQuestions: string[], count: number = 10) {
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

    return result;
  } catch (error) {
    console.error("Error generating additional flashcards:", error);
    throw new Error("Failed to generate additional flashcards. Please try again.");
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      // Validate request body
      const validation = generateMoreSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      
      const { title, content, existingQuestions, count } = validation.data;
      
      // Generate more flashcards (stateless - no database needed)
      const flashcardResponse = await generateMoreFlashcards(
        title, 
        content, 
        existingQuestions, 
        count
      );
      
      // Return the generated flashcards directly (frontend will handle adding to existing)
      res.json(flashcardResponse.flashcards);
    } catch (error) {
      console.error("Error generating more flashcards:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate more flashcards" 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
