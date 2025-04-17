
import React from "react";
import { Play, Pause } from "lucide-react";
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
      variant="outline"
      className={`flex items-center gap-2 ${isPlaying ? 'bg-gray-200' : ''}`}
      disabled={cards.length === 0}
    >
      {isPlaying ? (
        <>
          <Pause size={18} />
          <span>Stop Audio</span>
        </>
      ) : (
        <>
          <Play size={18} />
          <span>Play All</span>
        </>
      )}
    </Button>
  );
};

export default PlayAllButton;
