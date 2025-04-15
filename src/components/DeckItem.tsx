
import React, { useState } from "react";
import { Deck } from "@/types";
import { ChevronRight, Play, X, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/button";

interface DeckItemProps {
  deck: Deck;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck }) => {
  const [showWords, setShowWords] = useState(false);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const { getCardsForDeck } = useVocab();
  const deckCards = getCardsForDeck(deck.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWords(!showWords);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWords(false);
  };

  const speakWord = (text: string, cardId: string) => {
    // Stop any previous speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language to German (since we're using German words)
    utterance.lang = 'de-DE';
    
    // Set indicator for currently speaking word
    setSpeakingWordId(cardId);
    
    // Add event listener for when speaking ends
    utterance.onend = () => {
      setSpeakingWordId(null);
    };
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative flex flex-col border-b border-gray-200 py-4 px-4">
      <div className="flex items-center justify-between">
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
          <button 
            onClick={handlePlayClick}
            className="bg-black rounded-full p-2 mr-2"
            aria-label="Play deck"
          >
            <Play size={20} className="text-white fill-white" />
          </button>
          <ChevronRight className="text-gray-400" />
        </div>
      </div>
      
      {showWords && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Vocabulary List</h4>
            <button onClick={handleCloseClick} className="text-gray-500">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {deckCards.length > 0 ? (
              <div className="space-y-2">
                {deckCards.map((card) => (
                  <div key={card.id} className="flex flex-col border-b border-gray-200 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{card.front}</div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`p-1 ${speakingWordId === card.id ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => speakWord(card.front, card.id)}
                      >
                        <Volume2 size={16} />
                      </Button>
                    </div>
                    <div className="text-gray-600 rtl">{card.back}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-2">No cards in this deck</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckItem;
