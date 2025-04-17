
import { useState, useRef, useEffect } from "react";
import { Flashcard } from "@/types";

export const useAudioPlayback = (cards: Flashcard[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Function to speak a single German word
  const speakGermanWord = (text: string, cardId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Set the currently speaking word
      setSpeakingWordId(cardId);
      
      // Create utterance for German
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      
      // Add event listener for when speaking ends or errors
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(new Error('Speech synthesis failed'));
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
  };

  // Function to speak a single Arabic word
  const speakArabicWord = (text: string, cardId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // No need to cancel as this will be chained after German
      
      // Create utterance for Arabic
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7; // Slower rate for better Arabic pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Add event listener for when speaking ends or errors
      utterance.onend = () => {
        // Only clear the speaking indicator when completely done
        setSpeakingWordId(null);
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeakingWordId(null);
        reject(new Error('Speech synthesis failed'));
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
  };

  // Function to speak a vocabulary pair (German followed by Arabic)
  const speakVocabPair = async (germanText: string, arabicText: string, cardId: string) => {
    try {
      // First speak German
      await speakGermanWord(germanText, cardId);
      
      // Short pause between German and Arabic
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Then speak Arabic
      await speakArabicWord(arabicText, cardId);
      
      return true;
    } catch (error) {
      console.error('Error speaking vocab pair:', error);
      setSpeakingWordId(null);
      return false;
    }
  };

  // Function to speak only Arabic (for testing or specific use cases)
  const speakArabicOnly = (text: string, cardId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Set the currently speaking word
      setSpeakingWordId(cardId);
      
      // Create utterance for Arabic only
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7; // Slower rate for better Arabic pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Add event listener for when speaking ends or errors
      utterance.onend = () => {
        setSpeakingWordId(null);
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeakingWordId(null);
        reject(new Error('Speech synthesis failed'));
      };
      
      // Start speaking Arabic
      window.speechSynthesis.speak(utterance);
    });
  };

  // Toggle play/pause for sequence playback
  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Start sequence playback
  const startPlayback = () => {
    if (cards.length === 0) return;
    
    setIsPlaying(true);
    setCurrentCardIndex(0);
  };

  // Stop sequence playback
  const stopPlayback = () => {
    setIsPlaying(false);
    setSpeakingWordId(null);
    window.speechSynthesis.cancel();
    
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Effect to manage the sequence playback
  useEffect(() => {
    if (isPlaying && cards.length > 0) {
      const playNextCard = async () => {
        if (currentCardIndex >= cards.length) {
          stopPlayback();
          return;
        }
        
        const currentCard = cards[currentCardIndex];
        
        if (currentCard) {
          const success = await speakVocabPair(currentCard.front, currentCard.back, currentCard.id);
          
          // Move to next card with a delay
          if (success) {
            timeoutRef.current = window.setTimeout(() => {
              setCurrentCardIndex(prev => prev + 1);
            }, 1500); // 1.5 second pause between card pairs
          } else {
            stopPlayback();
          }
        }
      };
      
      playNextCard();
    }
  }, [isPlaying, currentCardIndex, cards]);

  return {
    isPlaying,
    currentCardIndex,
    speakingWordId,
    speakVocabPair,
    speakArabicOnly,
    togglePlayback,
    stopPlayback
  };
};
