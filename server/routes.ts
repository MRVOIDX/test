import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema } from "@shared/schema";
import { generateFlashcards, generateMoreFlashcards } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new note with flashcards
  app.post("/api/notes", async (req, res) => {
    try {
      const { title, content } = insertNoteSchema.parse(req.body);
      
      // Create the note
      const note = await storage.createNote({ title, content });
      
      // Generate flashcards using OpenAI
      const flashcardResponse = await generateFlashcards(title, content, 20);
      
      // Store flashcards in database
      const flashcardsToCreate = flashcardResponse.flashcards.map((card, index) => ({
        noteId: note.id,
        question: card.question,
        answer: card.answer,
        cardIndex: index
      }));
      
      const flashcards = await storage.createMultipleFlashcards(flashcardsToCreate);
      
      res.json({
        note,
        flashcards
      });
    } catch (error) {
      console.error("Error creating note and flashcards:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create note and flashcards" 
      });
    }
  });

  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Get a specific note
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const note = await storage.getNote(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  // Get flashcards for a note
  app.get("/api/notes/:id/flashcards", async (req, res) => {
    try {
      const flashcards = await storage.getFlashcardsByNoteId(req.params.id);
      res.json(flashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });

  // Generate more flashcards for an existing note
  app.post("/api/notes/:id/generate-more", async (req, res) => {
    try {
      const noteId = req.params.id;
      const { count = 10 } = req.body;
      
      // Get the note
      const note = await storage.getNote(noteId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      // Get existing flashcards to avoid duplicates
      const existingFlashcards = await storage.getFlashcardsByNoteId(noteId);
      const existingQuestions = existingFlashcards.map(card => card.question);
      
      // Generate more flashcards
      const flashcardResponse = await generateMoreFlashcards(
        note.title, 
        note.content, 
        existingQuestions, 
        count
      );
      
      // Store new flashcards
      const flashcardsToCreate = flashcardResponse.flashcards.map((card, index) => ({
        noteId: noteId,
        question: card.question,
        answer: card.answer,
        cardIndex: existingFlashcards.length + index
      }));
      
      const newFlashcards = await storage.createMultipleFlashcards(flashcardsToCreate);
      
      res.json(newFlashcards);
    } catch (error) {
      console.error("Error generating more flashcards:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate more flashcards" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
