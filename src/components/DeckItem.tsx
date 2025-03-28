
import React from "react";
import { Deck } from "@/types";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DeckItemProps {
  deck: Deck;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck }) => {
  return (
    <Link 
      to={`/deck/${deck.id}`}
      className="flex items-center justify-between border-b border-gray-200 py-4 px-2"
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">{deck.name}</h3>
        <p className="text-sm text-gray-500">
          Cards for today: {deck.cardsForToday}
        </p>
      </div>
      <ChevronRight className="text-gray-400" />
    </Link>
  );
};

export default DeckItem;
