import { Swords, Flame, Zap } from "lucide-react";

export default function LoadingSection() {
  return (
    <div className="text-center py-20 mysterious-fade-in">
      <div className="warrior-card-light glass-effect-light rounded-2xl p-16 max-w-3xl mx-auto shadow-xl">
        {/* Enhanced Animated Icons */}
        <div className="flex justify-center items-center mb-12">
          <div className="w-24 h-24 warrior-gradient rounded-full flex items-center justify-center mx-3 animate-pulse shadow-2xl">
            <Swords className="text-white text-4xl drop-shadow-lg" />
          </div>
          <div className="w-20 h-20 warrior-gradient rounded-full flex items-center justify-center mx-3 animate-pulse shadow-2xl" style={{ animationDelay: '0.2s' }}>
            <Flame className="text-white text-3xl drop-shadow-lg" />
          </div>
          <div className="w-24 h-24 warrior-gradient rounded-full flex items-center justify-center mx-3 animate-pulse shadow-2xl" style={{ animationDelay: '0.4s' }}>
            <Zap className="text-white text-4xl drop-shadow-lg" />
          </div>
        </div>
        
        <h3 className="text-5xl font-bold text-foreground mb-8 dramatic-text warrior-text-glow tracking-wide">THE FORGE BURNS BRIGHT</h3>
        <h4 className="text-3xl text-primary mb-12 italic font-medium">"Per aspera ad astra" - Through hardships to the stars</h4>
        
        <p className="text-2xl text-foreground/90 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
          Your AI Centurion <span className="text-primary font-bold warrior-text-glow">Osamah</span> is forging your wisdom into legendary battle cards...
        </p>
        
        <div className="mb-8">
          <div className="w-96 h-4 bg-black/50 rounded-full mx-auto overflow-hidden backdrop-blur-sm">
            <div className="h-full progress-bar rounded-full shadow-lg" style={{ width: "75%" }}></div>
          </div>
        </div>
        
        <p className="text-base text-primary/80 italic font-medium">
          "Victory belongs to the most persevering"
        </p>
      </div>
    </div>
  );
}
