
import React from "react";
import { Flashcard } from "@/types";
import { MoreVertical } from "lucide-react";

interface DeckCardsProps {
  cards: Flashcard[];
}

const DeckCards: React.FC<DeckCardsProps> = ({ cards }) => {
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Cards in deck ({cards.length})</h2>
        <div className="flex space-x-4">
          <select className="bg-gray-100 rounded-lg px-3 py-1 text-sm border-none">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Alphabetical</option>
          </select>
          <button className="bg-gray-100 rounded-lg px-3 py-1">
            <span className="sr-only">Filters</span>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 7h18M6 12h12M10 17h4"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Card list */}
      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-medium">{card.front}</h3>
              <button>
                <MoreVertical size={20} />
              </button>
            </div>
            <p className="text-right mt-2 text-gray-600 rtl">{card.back}</p>
          </div>
        ))}
      </div>
      
      {/* Add card button */}
      <div className="mt-6">
        <button className="w-full py-4 bg-gray-800 text-white rounded-lg font-medium">
          Add cards
        </button>
      </div>
    </div>
  );
};

export default DeckCards;
