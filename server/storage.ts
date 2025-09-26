import { type Note, type InsertNote, type Flashcard, type InsertFlashcard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Notes
  createNote(note: InsertNote): Promise<Note>;
  getNote(id: string): Promise<Note | undefined>;
  getNotes(): Promise<Note[]>;
  
  // Flashcards
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  getFlashcardsByNoteId(noteId: string): Promise<Flashcard[]>;
  createMultipleFlashcards(flashcards: InsertFlashcard[]): Promise<Flashcard[]>;
}

export class MemStorage implements IStorage {
  private notes: Map<string, Note>;
  private flashcards: Map<string, Flashcard>;

  constructor() {
    this.notes = new Map();
    this.flashcards = new Map();
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: new Date()
    };
    this.notes.set(id, note);
    return note;
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const id = randomUUID();
    const flashcard: Flashcard = { 
      ...insertFlashcard, 
      id, 
      createdAt: new Date()
    };
    this.flashcards.set(id, flashcard);
    return flashcard;
  }

  async getFlashcardsByNoteId(noteId: string): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values())
      .filter(card => card.noteId === noteId)
      .sort((a, b) => a.cardIndex - b.cardIndex);
  }

  async createMultipleFlashcards(flashcards: InsertFlashcard[]): Promise<Flashcard[]> {
    const createdCards: Flashcard[] = [];
    for (const flashcardData of flashcards) {
      const flashcard = await this.createFlashcard(flashcardData);
      createdCards.push(flashcard);
    }
    return createdCards;
  }
}

export const storage = new MemStorage();
