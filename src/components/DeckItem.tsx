
import React, { useState, useEffect, useRef } from "react";
import { Deck } from "@/types";
import { ChevronRight, Play, X, Volume2, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/button";

interface DeckItemProps {
  deck: Deck;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck }) => {
  const [showWords, setShowWords] = useState(false);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const { getCardsForDeck } = useVocab();
  const deckCards = getCardsForDeck(deck.id);
  const timeoutRef = useRef<number | null>(null);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWords(!showWords);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWords(false);
    // Stop autoplay if active
    if (isPlayingAll) {
      stopAutoPlay();
    }
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

  const startAutoPlay = () => {
    if (deckCards.length === 0) return;
    
    setIsPlayingAll(true);
    setCurrentPlayIndex(0);
    
    // Open the vocabulary list if it's not already open
    if (!showWords) {
      setShowWords(true);
    }
  };

  const stopAutoPlay = () => {
    setIsPlayingAll(false);
    setSpeakingWordId(null);
    window.speechSynthesis.cancel();
    
    // Clear any pending timeouts
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlayingAll) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  // Effect to manage the auto-play sequence
  useEffect(() => {
    if (isPlayingAll && deckCards.length > 0) {
      // Speak the current word
      const currentCard = deckCards[currentPlayIndex];
      if (currentCard) {
        speakWord(currentCard.front, currentCard.id);
        
        // Set up the next word with a delay
        timeoutRef.current = window.setTimeout(() => {
          // Move to the next word
          if (currentPlayIndex < deckCards.length - 1) {
            setCurrentPlayIndex(prev => prev + 1);
          } else {
            // We've reached the end of the list
            stopAutoPlay();
          }
        }, 3000); // 3 second delay between words
      }
    }
    
    // Cleanup
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlayingAll, currentPlayIndex, deckCards]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
            aria-label="Show vocabulary"
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
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleAutoPlay} 
                className={`p-2 rounded-full ${isPlayingAll ? 'bg-red-500' : 'bg-green-500'}`}
                aria-label={isPlayingAll ? "Stop auto-play" : "Start auto-play"}
              >
                {isPlayingAll ? (
                  <Pause size={16} className="text-white" />
                ) : (
                  <Play size={16} className="text-white fill-white" />
                )}
              </button>
              <button onClick={handleCloseClick} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {deckCards.length > 0 ? (
              <div className="space-y-2">
                {deckCards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className={`flex flex-col border-b border-gray-200 pb-2 ${
                      isPlayingAll && index === currentPlayIndex ? 'bg-blue-50 rounded p-1' : ''
                    }`}
                  >
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
