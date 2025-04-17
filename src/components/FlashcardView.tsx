import React, { useState } from "react";
import { Flashcard } from "@/types";
import { X, Volume2 } from "lucide-react";
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
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Function to speak only Arabic text
  const speakArabicText = (text: string) => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.7; // Slower rate for better Arabic pronunciation
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Function to speak German text
  const speakGermanText = (text: string) => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Function to speak both German and Arabic in sequence
  const speakBothLanguages = async () => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    setIsSpeaking(true);
    
    // First speak German
    const utteranceGerman = new SpeechSynthesisUtterance(card.front);
    utteranceGerman.lang = 'de-DE';
    utteranceGerman.rate = 0.9;
    
    // Create promise for German speech
    const germanSpeech = new Promise<void>((resolve) => {
      utteranceGerman.onend = () => resolve();
      utteranceGerman.onerror = () => resolve(); // Continue even if error
      window.speechSynthesis.speak(utteranceGerman);
    });
    
    // Wait for German to finish
    await germanSpeech;
    
    // Small pause
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // If answer is shown, also speak Arabic
    if (answerShown) {
      const utteranceArabic = new SpeechSynthesisUtterance(card.back);
      utteranceArabic.lang = 'ar-SA';
      utteranceArabic.rate = 0.7;
      utteranceArabic.pitch = 1.0;
      
      const arabicSpeech = new Promise<void>((resolve) => {
        utteranceArabic.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        utteranceArabic.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        window.speechSynthesis.speak(utteranceArabic);
      });
      
      await arabicSpeech;
    } else {
      setIsSpeaking(false);
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
          size="sm"
          className="p-2"
          onClick={speakBothLanguages}
          disabled={isSpeaking}
        >
          <Volume2 size={18} className={isSpeaking ? "text-blue-500" : ""} />
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
          <div className="text-3xl text-center font-medium my-auto py-16 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              {card.front}
              <Button 
                variant="ghost" 
                size="sm"
                className={`p-1 ${isSpeaking ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={() => speakGermanText(card.front)}
                disabled={isSpeaking}
              >
                <Volume2 size={20} />
              </Button>
            </div>
            {card.imageUrl && (
              <img 
                src={card.imageUrl} 
                alt={card.front} 
                className="max-h-40 max-w-40 object-contain mt-4 mx-auto" 
              />
            )}
          </div>

          {/* Answer divider */}
          {answerShown && (
            <div className="border-t border-gray-200 my-4"></div>
          )}

          {/* Back of card (answer) */}
          {answerShown && (
            <div className="text-3xl text-center font-medium my-auto py-16 rtl flex flex-col items-center">
              <div className="flex items-center gap-2">
                {card.back}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`p-1 ${isSpeaking ? 'text-blue-500' : 'text-gray-500'}`}
                  onClick={() => speakArabicText(card.back)} 
                  disabled={isSpeaking}
                >
                  <Volume2 size={20} />
                </Button>
              </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
