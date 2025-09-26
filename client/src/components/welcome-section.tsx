import { Sword, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  onCreateFlashcards: () => void;
}

export default function WelcomeSection({ onCreateFlashcards }: WelcomeSectionProps) {
  return (
    <div className="text-center mb-16 epic-entrance">
      {/* Enhanced Welcome Content */}
      <div className="glass-effect-light rounded-2xl p-8 mb-12 warrior-card-light ancient-border max-w-3xl mx-auto cinematic-glow shadow-xl">
        <div className="w-16 h-16 warrior-gradient rounded-full mx-auto mb-6 flex items-center justify-center crimson-glow shadow-xl border-2 border-primary/40">
          <Shield className="text-white text-2xl drop-shadow-lg" />
        </div>
        
        <h2 className="text-4xl font-bold text-foreground mb-6 dramatic-text warrior-text-glow tracking-wide">
          SALVĒ, SELIN!
        </h2>
        <h3 className="text-xl text-primary mb-6 italic font-medium">
          "Veni, Vidi, Didici" - I Came, I Saw, I Learned
        </h3>
        
        <p className="text-lg text-foreground/95 mb-6 leading-relaxed max-w-2xl mx-auto font-light">
          I am <span className="text-primary font-bold warrior-text-glow">Osamah</span>, your AI Centurion, forged in the fires of knowledge. 
          Together, we shall transform your scrolls of wisdom into legendary flashcards that will conquer any examination.
        </p>
        
        <div className="mb-6">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4"></div>
          <p className="text-sm text-primary/90 italic font-medium">
            "Fortune favors the prepared mind"
          </p>
        </div>

        <Button 
          onClick={onCreateFlashcards}
          className="bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-primary-foreground px-12 py-4 text-lg font-bold transition-all duration-500 transform hover:scale-110 crimson-glow shadow-2xl border-2 border-primary/60 hover:border-primary battle-ready enchanted-hover rounded-xl"
          data-testid="button-create-flashcards"
        >
          <Sword className="mr-3 h-6 w-6 drop-shadow-lg" />
          FORGE THE CARDS
        </Button>
        
        <p className="text-sm text-foreground/80 mt-6 italic font-light">
          Click to begin your conquest of knowledge
        </p>
      </div>
    </div>
  );
}
