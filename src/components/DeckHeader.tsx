
import React from "react";
import { Deck } from "@/types";
import { ArrowLeft, Search, Share, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

interface DeckHeaderProps {
  deck: Deck;
}

const DeckHeader: React.FC<DeckHeaderProps> = ({ deck }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <Link to="/">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex space-x-4">
          <Search size={24} />
          <Share size={24} />
          <MoreVertical size={24} />
        </div>
      </div>
      <div className="px-4 pb-4">
        <h1 className="text-2xl font-bold">{deck.name}</h1>
        <p className="text-gray-600">
          Learning algorithm: <span className="text-app-blue">General spaced repetition ⓘ</span>
        </p>
      </div>
    </div>
  );
};

export default DeckHeader;
