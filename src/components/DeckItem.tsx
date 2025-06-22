
import React, { useState } from "react";
import { Deck } from "@/types";
import { ChevronRight, BookOpen, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";

interface DeckItemProps {
  deck: Deck;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck }) => {
  const [showWords, setShowWords] = useState(false);
  const { getCardsForDeck } = useVocab();
  const deckCards = getCardsForDeck(deck.id);

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWords(!showWords);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWords(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link 
            to={`/deck/${deck.id}`}
            className="flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{deck.name}</h3>
              <p className="text-sm text-blue-600 font-medium">
                {deck.cardsForToday} cards to study today
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {deckCards.length} total cards
              </p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePreviewClick}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 transition-colors shadow-md hover:shadow-lg"
              aria-label="Preview vocabulary"
            >
              <BookOpen size={18} />
            </button>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>
      
      {showWords && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Vocabulary Preview</h4>
            <button 
              onClick={handleCloseClick} 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {deckCards.length > 0 ? (
              <div className="space-y-3">
                {deckCards.slice(0, 5).map((card) => (
                  <div 
                    key={card.id} 
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="font-medium text-gray-800 mb-1">{card.front}</div>
                    <div className="text-gray-600 rtl text-sm">{card.back}</div>
                  </div>
                ))}
                {deckCards.length > 5 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    And {deckCards.length - 5} more cards...
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 italic">No cards in this deck yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckItem;
