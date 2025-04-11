
import React, { useState, useRef } from "react";
import { Flashcard } from "@/types";
import { X, Volume2, VolumeX } from "lucide-react";
import { useVocab } from "@/context/VocabContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FlashcardViewProps {
  card: Flashcard;
  cardNumber: number;
  totalCards: number;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, cardNumber, totalCards }) => {
  const { answerShown, showAnswer, saveCardReview } = useVocab();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to get text-to-speech URL
  const getAudioUrl = (text: string, lang: string) => {
    // Using a free TTS service - in a real app, you might want to use a more reliable service
    const language = lang === "German" ? "de" : "en";
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;
  };

  // Function to play both front and back audio
  const playAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Event listener for when first audio ends
      audioRef.current.onended = () => {
        // Play back translation after a short pause
        if (answerShown) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.src = getAudioUrl(card.back, "ar");
              audioRef.current.play()
                .catch(err => console.error("Error playing audio:", err));
            }
          }, 1000);
        } else {
          setIsPlaying(false);
        }
      };
    }

    // Start with the front text
    audioRef.current.src = getAudioUrl(card.front, card.language);
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing audio:", err));
    }
  };

  // Stop audio when component unmounts
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Format the review time for display
  const formatReviewTime = (difficulty: 'again' | 'hard' | 'good' | 'easy'): string => {
    switch (difficulty) {
      case 'again':
        return '1m';
      case 'hard':
        return '8m';
      case 'good':
        return '15m';
      case 'easy':
        return '4d';
      default:
        return '';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Link to={`/deck/${card.deckId}`}>
          <X size={24} />
        </Link>
        <div className="px-4 py-1 bg-gray-200 rounded-full">
          <span>{cardNumber}/{totalCards}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={playAudio} 
          className="w-6"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-green-100">
        <div 
          className="h-full bg-green-500"
          style={{ width: `${(cardNumber / totalCards) * 100}%` }}
        ></div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 min-h-[50vh] flex flex-col">
          {/* Only show card review time if answer is shown */}
          {answerShown && card.nextReview && (
            <div className="absolute top-2 right-2 text-xs text-gray-500">
              Next review: {new Date(card.nextReview).toLocaleTimeString()}
            </div>
          )}
          
          {/* Front of card */}
          <div className="text-3xl text-center font-medium my-auto py-16 flex items-center justify-center gap-3">
            {card.front}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={playAudio} 
              className="ml-2"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>

          {/* Answer divider */}
          {answerShown && (
            <div className="border-t border-gray-200 my-4"></div>
          )}

          {/* Back of card (answer) */}
          {answerShown && (
            <div className="text-3xl text-center font-medium my-auto py-16 rtl">
              {card.back}
            </div>
          )}
        </div>
      </div>

      {/* Card actions */}
      <div className="p-4">
        {!answerShown ? (
          <button
            onClick={showAnswer}
            className="w-full py-4 text-center text-gray-700 bg-gray-100 rounded-md flex justify-center items-center"
          >
            <span className="mr-2">⌨️</span> Tap to show answer
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => saveCardReview('again')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-red-100 text-red-600 rounded-lg"
            >
              <span className="font-medium">Again</span>
              <span className="text-xs mt-1">{formatReviewTime('again')}</span>
            </button>
            <button
              onClick={() => saveCardReview('hard')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-yellow-100 text-yellow-600 rounded-lg"
            >
              <span className="font-medium">Hard</span>
              <span className="text-xs mt-1">{formatReviewTime('hard')}</span>
            </button>
            <button
              onClick={() => saveCardReview('good')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-green-100 text-green-600 rounded-lg"
            >
              <span className="font-medium">Good</span>
              <span className="text-xs mt-1">{formatReviewTime('good')}</span>
            </button>
            <button
              onClick={() => saveCardReview('easy')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-blue-100 text-blue-600 rounded-lg"
            >
              <span className="font-medium">Easy</span>
              <span className="text-xs mt-1">{formatReviewTime('easy')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
