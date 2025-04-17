
import React from "react";
import { Volume2, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { Flashcard } from "@/types";

interface DeckAudioControlsProps {
  cards: Flashcard[];
}

const DeckAudioControls: React.FC<DeckAudioControlsProps> = ({ cards }) => {
  const { 
    isPlaying, 
    togglePlayback, 
    currentCardIndex 
  } = useAudioPlayback(cards);

  if (cards.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 mx-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Audio Playback</h3>
            <p className="text-sm text-gray-500">
              {isPlaying 
                ? `Playing ${currentCardIndex + 1} of ${cards.length}`
                : `Play all ${cards.length} vocabulary items`}
            </p>
          </div>
          
          <button
            onClick={togglePlayback}
            className={`flex items-center justify-center p-3 rounded-full ${
              isPlaying ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {isPlaying ? <Pause size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
        
        {isPlaying && cards.length > 1 && (
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentCardIndex) / cards.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeckAudioControls;
