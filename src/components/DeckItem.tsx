
import React from "react";
import { Deck } from "@/types";
import { ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface DeckItemProps {
  deck: Deck;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4 px-4">
      <Link 
        to={`/deck/${deck.id}`}
        className="flex-1"
      >
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">{deck.name}</h3>
          <p className="text-sm text-gray-500">
            Cards for today: {deck.cardsForToday}
          </p>
        </div>
      </Link>
      
      <div className="flex items-center">
        <Link 
          to={`/study/${deck.id}`}
          className="bg-black rounded-full p-2 mr-2"
          aria-label="Play deck"
        >
          <Play size={20} className="text-white fill-white" />
        </Link>
        <ChevronRight className="text-gray-400" />
      </div>
    </div>
  );
};

export default DeckItem;
