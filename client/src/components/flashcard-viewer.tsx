import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Home, 
  RotateCcw, 
  Shield, 
  CheckCircle, 
  Clock,
  Scroll,
  Flame,
  Swords,
  Crown,
  Zap,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Note, type Flashcard } from "@shared/schema";

interface FlashcardViewerProps {
  note: Note;
  flashcards: Flashcard[];
  onBackHome: () => void;
  onNewFlashcards: () => void;
  onMoreGenerated: (newCards: Flashcard[]) => void;
}

export default function FlashcardViewer({ 
  note, 
  flashcards, 
  onBackHome, 
  onNewFlashcards,
  onMoreGenerated 
}: FlashcardViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const generateMoreMutation = useMutation({
    mutationFn: async () => {
      const existingQuestions = flashcards.map(card => card.question);
      const response = await apiRequest("POST", `/api/notes/${note.id}/generate-more`, { 
        title: note.title,
        content: note.content,
        existingQuestions,
        count: 10 
      });
      return response.json();
    },
    onSuccess: (newCards) => {
      onMoreGenerated(newCards);
      toast({
        title: "Success!",
        description: `Generated ${newCards.length} additional flashcards.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate more flashcards",
        variant: "destructive",
      });
    },
  });

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
          }
          break;
        case " ":
        case "Enter":
          event.preventDefault();
          setIsFlipped(!isFlipped);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCardIndex, flashcards.length, isFlipped]);

  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  const currentCard = flashcards[currentCardIndex];

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const exportToAnki = () => {
    // Create tab-separated format for Anki import
    const ankiData = flashcards.map(card => 
      `${card.question.replace(/\t/g, ' ').replace(/\n/g, ' ')}\t${card.answer.replace(/\t/g, ' ').replace(/\n/g, ' ')}`
    ).join('\n');
    
    // Create and download file
    const blob = new Blob([ankiData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}_flashcards.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: `Downloaded ${flashcards.length} flashcards for Anki import.`,
    });
  };

  if (!currentCard) return null;

  return (
    <div className="px-4 py-8">
      {/* Battle Header */}
      <div className="warrior-card-light glass-effect-light rounded-2xl p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 warrior-gradient rounded-xl flex items-center justify-center mr-6">
              <Crown className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground dramatic-text" data-testid="text-study-title">
                {note.title}
              </h3>
              <p className="text-primary text-lg italic">Arena Battle with Centurion Osamah</p>
            </div>
          </div>
          <Button
            onClick={() => generateMoreMutation.mutate()}
            disabled={generateMoreMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-bold border-2 border-primary"
            data-testid="button-generate-more"
          >
            <Swords className="mr-2 h-5 w-5" />
            {generateMoreMutation.isPending ? "FORGING..." : "FORGE MORE CARDS"}
          </Button>
        </div>
      </div>

      {/* Active Flashcard Study Section */}
      <div className="bg-gradient-to-br from-card to-background border border-border rounded-2xl p-8 mb-24 shadow-lg mt-16">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-foreground dramatic-text">📚 CURRENT STUDY CARD</h4>
          <p className="text-muted-foreground italic mt-2">Click the card to reveal the answer</p>
        </div>
        
        <div className="flip-card mx-auto max-w-4xl h-[28rem] relative mb-12 mt-24" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className={`flip-card-inner w-full h-full relative cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of card - Challenge */}
            <Card className="flip-card-face absolute w-full h-full bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-3 border-primary/30 shadow-2xl rounded-3xl backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center h-full p-12 text-center relative">
                <div className="absolute top-4 right-4">
                  <Scroll className="text-primary-foreground/60 w-8 h-8" />
                </div>
                <div className="mb-6">
                  <Shield className="text-6xl w-16 h-16 text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-6 dramatic-text">THE CHALLENGE</h4>
                <p className="text-xl leading-relaxed font-medium text-primary-foreground" data-testid="text-card-question">
                  {currentCard.question}
                </p>
              </CardContent>
            </Card>

            {/* Back of card - Wisdom */}
            <Card className="flip-card-face absolute w-full h-full bg-gradient-to-br from-card to-card/95 text-foreground border-3 border-primary/30 shadow-2xl rounded-3xl backdrop-blur-sm"
                  style={{ transform: "rotateY(180deg)" }}>
              <CardContent className="flex flex-col items-center justify-center h-full p-12 text-center relative">
                <div className="absolute top-4 right-4">
                  <Crown className="text-primary w-8 h-8" />
                </div>
                <div className="mb-6">
                  <Flame className="text-6xl text-primary w-16 h-16" />
                </div>
                <h4 className="text-2xl font-bold mb-6 text-primary dramatic-text">THE WISDOM</h4>
                <p className="text-xl leading-relaxed text-foreground" data-testid="text-card-answer">
                  {currentCard.answer}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center space-x-6 mb-8 mt-64">
        <Button
          onClick={previousCard}
          disabled={currentCardIndex === 0}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3 font-bold border-2 border-muted-foreground/30"
          data-testid="button-previous-card"
        >
          <ChevronLeft className="mr-3 h-5 w-5" />
          PREVIOUS BATTLE
        </Button>
        <Button
          onClick={nextCard}
          disabled={currentCardIndex === flashcards.length - 1}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-bold border-2 border-primary"
          data-testid="button-next-card"
        >
          NEXT CONQUEST
          <ChevronRight className="ml-3 h-5 w-5" />
        </Button>
      </div>

      {/* Battle Progress */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-6 mb-4">
          <span className="text-lg font-bold text-foreground dramatic-text">CONQUEST:</span>
          <div className="flex-1">
            <Progress value={progress} className="h-4 bg-muted/30 border border-primary/30" />
          </div>
          <span className="text-lg font-bold text-primary dramatic-text" data-testid="text-progress">
            {currentCardIndex + 1} / {flashcards.length}
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground italic">
            "Victory is forged through perseverance"
          </p>
        </div>
      </div>

      {/* Battle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-card text-center p-8 border-2 border-primary/30 shadow-lg">
          <div className="w-16 h-16 warrior-gradient rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Shield className="text-white text-2xl w-8 h-8" />
          </div>
          <h4 className="text-3xl font-bold text-foreground dramatic-text" data-testid="text-total-cards">
            {flashcards.length}
          </h4>
          <p className="text-primary font-semibold text-lg">TOTAL ARSENAL</p>
          <p className="text-muted-foreground text-sm italic mt-1">Cards forged for battle</p>
        </Card>
        <Card className="bg-card text-center p-8 border-2 border-primary/30 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
            <CheckCircle className="text-white text-2xl w-8 h-8" />
          </div>
          <h4 className="text-3xl font-bold text-foreground dramatic-text" data-testid="text-reviewed-cards">
            {currentCardIndex + 1}
          </h4>
          <p className="text-green-500 font-semibold text-lg">CONQUERED</p>
          <p className="text-muted-foreground text-sm italic mt-1">Battles won</p>
        </Card>
        <Card className="bg-card text-center p-8 border-2 border-primary/30 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Zap className="text-white text-2xl w-8 h-8" />
          </div>
          <h4 className="text-3xl font-bold text-foreground dramatic-text" data-testid="text-remaining-cards">
            {flashcards.length - (currentCardIndex + 1)}
          </h4>
          <p className="text-orange-500 font-semibold text-lg">AWAITING</p>
          <p className="text-muted-foreground text-sm italic mt-1">Challenges ahead</p>
        </Card>
      </div>

      {/* War Council Actions */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
        <h4 className="text-2xl font-bold text-center text-foreground dramatic-text mb-8">WAR COUNCIL</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button
            onClick={restartStudy}
            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-4 text-lg font-bold border-2 border-muted-foreground/30 transition-all duration-300"
            data-testid="button-restart-study"
          >
            <RotateCcw className="mr-3 h-6 w-6" />
            RESTART CAMPAIGN
          </Button>
          <Button
            onClick={onNewFlashcards}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-bold border-2 border-primary/50 transition-all duration-300"
            data-testid="button-new-flashcards"
          >
            <Swords className="mr-3 h-6 w-6" />
            FORGE NEW ARSENAL
          </Button>
          <Button
            onClick={exportToAnki}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold border-2 border-green-500 transition-all duration-300"
            data-testid="button-export-anki"
          >
            <Download className="mr-3 h-6 w-6" />
            EXPORT TO ANKI
          </Button>
          <Button
            onClick={onBackHome}
            className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground py-4 text-lg font-bold border-2 border-muted-foreground/30 transition-all duration-300"
            data-testid="button-back-home"
          >
            <Home className="mr-3 h-6 w-6" />
            RETURN TO COLOSSEUM
          </Button>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground italic">
            "Every master was once a beginner. Every pro was once an amateur."
          </p>
        </div>
      </div>
    </div>
  );
}
