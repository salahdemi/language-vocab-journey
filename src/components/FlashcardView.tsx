import React, { useState, useRef, useEffect } from "react";
import { Flashcard } from "@/types";
import { X, Volume2, VolumeX, ListMusic, Play, Pause, Headphones } from "lucide-react";
import { useVocab } from "@/context/VocabContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FlashcardViewProps {
  card: Flashcard;
  cardNumber: number;
  totalCards: number;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, cardNumber, totalCards }) => {
  const { answerShown, showAnswer, saveCardReview, studySession } = useVocab();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const currentCardIndex = useRef(0);

  // Function to get text-to-speech URL
  const getAudioUrl = (text: string, lang: string) => {
    // Use a more reliable TTS service API
    return `https://api.voicerss.org/?key=2759723d03804ea899e2a0cad6d634c8&hl=${lang === "German" ? "de-de" : "ar-sa"}&v=Oda&c=MP3&f=16khz_16bit_stereo&src=${encodeURIComponent(text)}`;
  };

  // Function to play audio for current card
  const playAudio = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Event listener for when audio ends
      audioRef.current.onended = () => {
        if (answerShown) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.src = getAudioUrl(card.back, "Arabic");
              audioRef.current.play()
                .catch(err => {
                  console.error("Error playing back audio:", err);
                  setIsPlaying(false);
                });
            }
          }, 1000);
        } else {
          setIsPlaying(false);
        }
      };
    }

    // Play the front text audio
    audioRef.current.src = getAudioUrl(card.front, card.language);
    audioRef.current.play()
      .then(() => {
        console.log("Audio started playing");
      })
      .catch(err => {
        console.error("Error playing front audio:", err);
        setIsPlaying(false);
      });
  };

  // Function to play all cards in sequence
  const playAllCards = () => {
    if (isPlayingAll) {
      // Stop the audio playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAll(false);
      setIsPlaying(false);
      return;
    }

    if (!studySession || !studySession.cardsToStudy) {
      toast({
        title: "Error",
        description: "No cards available to play",
        variant: "destructive",
      });
      return;
    }

    setIsPlayingAll(true);
    currentCardIndex.current = 0;
    
    // Create or reset audio player
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    // Function to play next card
    const playNextCard = () => {
      const cards = studySession.cardsToStudy;
      if (currentCardIndex.current >= cards.length) {
        // End of playlist
        setIsPlayingAll(false);
        setIsPlaying(false);
        toast({
          title: "Complete",
          description: "Finished playing all cards",
        });
        return;
      }

      const currentCard = cards[currentCardIndex.current];
      
      // Play front (German word)
      audioRef.current!.src = getAudioUrl(currentCard.front, currentCard.language);
      audioRef.current!.play()
        .then(() => {
          // Set up handler for when front audio finishes
          audioRef.current!.onended = () => {
            // Wait a short pause then play the back (Arabic translation)
            setTimeout(() => {
              audioRef.current!.src = getAudioUrl(currentCard.back, "Arabic");
              audioRef.current!.play()
                .then(() => {
                  // When back audio finishes, move to next card
                  audioRef.current!.onended = () => {
                    currentCardIndex.current++;
                    setTimeout(playNextCard, 1000); // Pause between cards
                  };
                })
                .catch(err => {
                  console.error("Error playing back audio:", err);
                  setIsPlayingAll(false);
                  setIsPlaying(false);
                });
            }, 500);
          };
        })
        .catch(err => {
          console.error("Error playing front audio:", err);
          setIsPlayingAll(false);
          setIsPlaying(false);
        });
    };

    // Start playing sequence
    playNextCard();
  };

  // Stop audio when component unmounts or card changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPlayingAll(false);
      }
    };
  }, [card.id]);

  // Reset play state when card changes
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current && !isPlayingAll) {
      audioRef.current.pause();
    }
  }, [card.id, isPlayingAll]);

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
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={playAudio} 
            className="w-10 h-10"
            aria-label={isPlaying && !isPlayingAll ? "Pause audio" : "Play audio"}
          >
            {isPlaying && !isPlayingAll ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={playAllCards} 
            className="w-10 h-10"
            aria-label={isPlayingAll ? "Stop playlist" : "Play all cards"}
          >
            {isPlayingAll ? <Pause size={20} /> : <ListMusic size={20} />}
          </Button>
        </div>
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
              {isPlaying && !isPlayingAll ? <VolumeX size={16} /> : <Volume2 size={16} />}
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
          <div className="space-y-3">
            <button
              onClick={showAnswer}
              className="w-full py-4 text-center text-gray-700 bg-gray-100 rounded-md flex justify-center items-center"
            >
              <span className="mr-2">⌨️</span> Tap to show answer
            </button>
            <button 
              onClick={playAllCards}
              className="w-full py-4 flex items-center justify-center gap-2 text-center text-white bg-blue-500 rounded-md"
            >
              {isPlayingAll ? <Pause size={16} /> : <Headphones size={16} />}
              {isPlayingAll ? "Stop Audio Learning" : "Learn by Listening"}
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-2 mb-3">
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
            <button 
              onClick={playAllCards}
              className="w-full py-3 flex items-center justify-center gap-2 text-center text-white bg-blue-500 rounded-md"
            >
              {isPlayingAll ? <Pause size={16} /> : <Headphones size={16} />}
              {isPlayingAll ? "Stop Audio Learning" : "Learn by Listening"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
