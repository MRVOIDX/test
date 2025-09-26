import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertNoteSchema } from '../../shared/schema';
import { generateFlashcards } from '../../server/services/gemini';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { title, content } = insertNoteSchema.parse(req.body);
      
      // Generate flashcards using Gemini (stateless - no storage)
      const flashcardResponse = await generateFlashcards(title, content, 20);
      
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