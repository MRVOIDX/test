import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateMoreFlashcards } from '../../../server/services/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { title, content, existingQuestions, count = 10 } = req.body;
      
      if (!title || !content || !Array.isArray(existingQuestions)) {
        return res.status(400).json({ message: "Missing required fields: title, content, and existingQuestions" });
      }
      
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