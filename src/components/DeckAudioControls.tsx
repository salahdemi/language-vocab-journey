
import React, { useState } from "react";
import { Volume2, Pause, Headphones, VolumeX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { Flashcard } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ElevenLabsApiInfo from "./ElevenLabsApiInfo";

interface DeckAudioControlsProps {
  cards: Flashcard[];
}

const DeckAudioControls: React.FC<DeckAudioControlsProps> = ({ cards }) => {
  const [testingAudio, setTestingAudio] = useState(false);
  const { toast } = useToast();
  
  const { 
    isPlaying, 
    togglePlayback, 
    currentCardIndex,
    testAudioOutput,
    isSpeechSupported
  } = useAudioPlayback(cards);

  if (cards.length === 0) {
    return null;
  }
  
  const handleTestAudio = () => {
    setTestingAudio(true);
    testAudioOutput();
    setTimeout(() => setTestingAudio(false), 3000);
  };
  
  // If speech is not supported, show a warning
  if (!isSpeechSupported) {
    return (
      <>
        <Card className="mb-4 mx-4 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <VolumeX size={24} className="text-red-500" />
              <div>
                <h3 className="font-medium text-red-700">Speech Not Supported</h3>
                <p className="text-sm text-red-600">
                  Your browser doesn't support the built-in text-to-speech features. Consider using ElevenLabs API instead.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Show ElevenLabs API info as an alternative */}
        <ElevenLabsApiInfo />
      </>
    );
  }

  return (
    <>
      <Card className="mb-4 mx-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Arabic Audio Playback</h3>
              <p className="text-sm text-gray-500">
                {isPlaying 
                  ? `Playing ${currentCardIndex + 1} of ${cards.length}`
                  : `Listen to all ${cards.length} Arabic vocabulary items`}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestAudio}
                className="flex items-center gap-2"
                disabled={testingAudio || isPlaying}
              >
                <Headphones size={16} />
                {testingAudio ? 'Testing...' : 'Test Audio'}
              </Button>
              
              <button
                onClick={togglePlayback}
                className={`flex items-center justify-center p-3 rounded-full ${
                  isPlaying ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}
                aria-label={isPlaying ? "Stop audio playback" : "Start audio playback"}
              >
                {isPlaying ? <Pause size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
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
      
      {/* Display ElevenLabs API information */}
      <ElevenLabsApiInfo />
    </>
  );
};

export default DeckAudioControls;
