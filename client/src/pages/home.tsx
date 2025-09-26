import { useState } from "react";
import { Brain, User } from "lucide-react";
import WelcomeSection from "@/components/welcome-section";
import NoteInput from "@/components/note-input";
import LoadingSection from "@/components/loading-section";
import FlashcardViewer from "@/components/flashcard-viewer";
import { type Note, type Flashcard } from "@shared/schema";
import backgroundImage from "@assets/image_1758907555042.png";

type Section = "welcome" | "input" | "loading" | "flashcards";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>("welcome");
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleNotesGenerated = (note: Note, cards: Flashcard[]) => {
    setCurrentNote(note);
    setFlashcards(cards);
    setCurrentSection("flashcards");
  };

  const handleMoreCardsGenerated = (newCards: Flashcard[]) => {
    setFlashcards(prev => [...prev, ...newCards]);
  };

  return (
    <div className="bg-background text-foreground min-h-screen relative overflow-hidden">
      {/* Professional Background with Warrior Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Warrior Background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50"></div>
      </div>
      
      {/* Subtle Animated Particles for Enhancement */}
      <div className="enhanced-particles opacity-30">
        {[...Array(4)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
        {[...Array(2)].map((_, i) => (
          <div
            key={`spark-${i}`}
            className="spark"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Professional Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-primary/30 blood-drip relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 warrior-gradient rounded-xl flex items-center justify-center crimson-glow shadow-2xl border border-primary/30">
                <Brain className="text-white text-2xl drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground dramatic-text warrior-text-glow tracking-wider">ARENA STUDIVM</h1>
                <p className="text-sm text-primary/90 italic font-medium mt-1">Where Knowledge Becomes Legend</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <p className="text-xl font-bold text-foreground dramatic-text warrior-text-glow">Ave, Selin!</p>
                <p className="text-sm text-primary font-medium">Your AI Centurion Awaits</p>
              </div>
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center crimson-glow border-2 border-primary/60 shadow-2xl">
                <User className="text-primary-foreground text-xl" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {currentSection === "welcome" && (
          <WelcomeSection onCreateFlashcards={() => setCurrentSection("input")} />
        )}
        
        {currentSection === "input" && (
          <NoteInput
            onCancel={() => setCurrentSection("welcome")}
            onGenerating={() => setCurrentSection("loading")}
            onGenerated={handleNotesGenerated}
          />
        )}
        
        {currentSection === "loading" && <LoadingSection />}
        
        {currentSection === "flashcards" && currentNote && flashcards.length > 0 && (
          <FlashcardViewer
            note={currentNote}
            flashcards={flashcards}
            onBackHome={() => setCurrentSection("welcome")}
            onNewFlashcards={() => setCurrentSection("input")}
            onMoreGenerated={handleMoreCardsGenerated}
          />
        )}
      </main>
    </div>
  );
}
