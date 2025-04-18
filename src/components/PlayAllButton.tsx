
import React from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/types";

interface PlayAllButtonProps {
  cards: Flashcard[];
  isPlaying: boolean;
  onPlayToggle: () => void;
}

const PlayAllButton: React.FC<PlayAllButtonProps> = ({ cards, isPlaying, onPlayToggle }) => {
  return (
    <Button 
      onClick={onPlayToggle}
      variant={isPlaying ? "destructive" : "default"}
      className="flex items-center gap-2"
      disabled={cards.length === 0}
    >
      {isPlaying ? (
        <>
          <Pause size={18} />
          <span>Stop Audio</span>
        </>
      ) : (
        <>
          <Volume2 size={18} />
          <span>Play All Words</span>
        </>
      )}
    </Button>
  );
};

export default PlayAllButton;
