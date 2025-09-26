import { useState } from "react";
import { Scroll, Sword, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Note, type Flashcard } from "@shared/schema";

interface NoteInputProps {
  onCancel: () => void;
  onGenerating: () => void;
  onGenerated: (note: Note, flashcards: Flashcard[]) => void;
}

export default function NoteInput({ onCancel, onGenerating, onGenerated }: NoteInputProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const createNoteMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/notes", data);
      return response.json();
    },
    onSuccess: (data) => {
      onGenerated(data.note, data.flashcards);
      toast({
        title: "Success!",
        description: "Your flashcards have been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate flashcards",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and your notes!",
        variant: "destructive",
      });
      return;
    }

    onGenerating();
    createNoteMutation.mutate({ title: title.trim(), content: content.trim() });
  };

  return (
    <div className="warrior-card-light glass-effect-light rounded-2xl p-12 mb-12 mysterious-fade-in max-w-4xl mx-auto shadow-xl">
      <div className="flex items-center mb-10">
        <div className="w-16 h-16 warrior-gradient rounded-xl flex items-center justify-center mr-6 shadow-xl">
          <Scroll className="text-white text-2xl drop-shadow-lg" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-foreground dramatic-text warrior-text-glow tracking-wide">INSCRIBE YOUR WISDOM</h3>
          <p className="text-primary text-lg italic font-medium mt-1">Your scrolls shall become 20 cards of knowledge</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="noteTitle" className="text-lg font-bold text-foreground mb-3 dramatic-text warrior-text-glow block">
            📜 CODEX TITLE
          </Label>
          <Input
            id="noteTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Sacred Arts of Biology - Chapter V"
            className="warrior-input text-lg p-4 border-2 rounded-lg bg-black/20 backdrop-blur-sm"
            data-testid="input-note-title"
          />
        </div>
        
        <div>
          <Label htmlFor="noteContent" className="text-lg font-bold text-foreground mb-3 dramatic-text warrior-text-glow block">
            ⚔️ SACRED SCROLLS OF KNOWLEDGE
          </Label>
          <Textarea
            id="noteContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Inscribe your wisdom here, noble scholar. The more detailed your scrolls, the mightier the flashcards I shall forge for your conquest!"
            className="warrior-input text-base p-4 border-2 resize-none rounded-lg bg-black/20 backdrop-blur-sm"
            data-testid="textarea-note-content"
          />
        </div>
        
        <div className="flex space-x-4">
          <Button
            onClick={handleSubmit}
            disabled={createNoteMutation.isPending}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-bold border-2 border-primary/60 transition-all duration-300 rounded-xl shadow-xl"
            data-testid="button-generate-flashcards"
          >
            <Sword className="mr-3 h-6 w-6" />
            FORGE 20 BATTLE CARDS
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="px-8 py-4 text-lg border-2 border-foreground/30 hover:border-primary/60 transition-all duration-300 bg-black/20 backdrop-blur-sm rounded-xl hover:bg-primary/10"
            data-testid="button-cancel"
          >
            <Shield className="mr-2 h-5 w-5" />
            RETREAT
          </Button>
        </div>
      </div>
    </div>
  );
}
