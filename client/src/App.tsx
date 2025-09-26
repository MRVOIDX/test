import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
// Background music file will be served from public directory

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Set to 30% volume
      audio.loop = true;
      
      // Try to play music when component mounts
      const playMusic = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay was prevented, user will need to click to start
          console.log("Autoplay prevented, user interaction required");
        }
      };
      
      playMusic();
    }
  }, []);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (audio) {
      if (!isPlaying) {
        try {
          await audio.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (error) {
          console.log("Failed to play audio");
        }
      } else {
        if (isMuted) {
          audio.muted = false;
          setIsMuted(false);
        } else {
          audio.muted = true;
          setIsMuted(true);
        }
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Background Music */}
        <video
          ref={audioRef}
          style={{ display: 'none' }}
          preload="auto"
          playsInline
        >
          <source src="/background-music.mp4" type="video/mp4" />
        </video>

        {/* Music Control Button */}
        <Button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-2xl border-2 border-primary/50 backdrop-blur-sm transition-all duration-300"
          data-testid="button-music-toggle"
        >
          {isMuted || !isPlaying ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>

        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
