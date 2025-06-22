
import React from "react";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/types";

interface PlayAllButtonProps {
  cards: Flashcard[];
  onStudyAll: () => void;
}

const PlayAllButton: React.FC<PlayAllButtonProps> = ({ cards, onStudyAll }) => {
  return (
    <Button 
      onClick={onStudyAll}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
      disabled={cards.length === 0}
    >
      <BookOpen size={18} />
      <span>Study All Cards ({cards.length})</span>
    </Button>
  );
};

export default PlayAllButton;
