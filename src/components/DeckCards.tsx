
import React from "react";
import { Flashcard } from "@/types";
import { MoreVertical, Upload, Volume2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ImportCardsDialog from "./ImportCardsDialog";
import PlayAllButton from "./PlayAllButton";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { Button } from "@/components/ui/button";

interface DeckCardsProps {
  cards: Flashcard[];
  deckId: string;
}

const DeckCards: React.FC<DeckCardsProps> = ({ cards, deckId }) => {
  const { 
    isPlaying, 
    speakingWordId, 
    speakArabicOnly, // Use speakArabicOnly instead of speakVocabPair
    togglePlayback, 
    currentCardIndex 
  } = useAudioPlayback(cards);

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
      
      {/* Play All Button */}
      {cards.length > 0 && (
        <div className="mb-4">
          <PlayAllButton 
            cards={cards}
            isPlaying={isPlaying}
            onPlayToggle={togglePlayback}
          />
        </div>
      )}
      
      {/* Card list */}
      <div className="space-y-4">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              key={card.id}
              className={`bg-white rounded-lg border border-gray-200 p-4 ${
                isPlaying && index === currentCardIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-medium">{card.front}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`p-1 ${speakingWordId === card.id ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => speakArabicOnly(card.back, card.id)} // Use speakArabicOnly here
                    disabled={isPlaying}
                  >
                    <Volume2 size={16} />
                  </Button>
                </div>
                <button>
                  <MoreVertical size={20} />
                </button>
              </div>
              <p className="text-right mt-2 text-gray-600 rtl">{card.back}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M10 4v16" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-8">This deck has no cards</h3>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="mt-6 space-y-4">
        <button className="w-full py-4 bg-gray-800 text-white rounded-lg font-medium">
          Add cards
        </button>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full py-4 border border-gray-400 rounded-lg font-medium flex items-center justify-center">
              <Upload className="mr-2" size={20} />
              Import cards
            </button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-md">
            <ImportCardsDialog deckId={deckId} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeckCards;
