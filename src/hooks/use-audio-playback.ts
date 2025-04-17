
import { useState, useRef, useEffect } from "react";
import { Flashcard } from "@/types";

export const useAudioPlayback = (cards: Flashcard[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Debug log to check speech synthesis availability
  useEffect(() => {
    console.log("Speech Synthesis available?", window.speechSynthesis !== undefined);
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices);
    }
  }, []);

  // Function to speak a single German word
  const speakGermanWord = (text: string, cardId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Set the currently speaking word
      setSpeakingWordId(cardId);
      
      console.log("Speaking German:", text);
      
      // Create utterance for German
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.volume = 1.0; // Ensure volume is at maximum
      
      // Add event listener for when speaking ends or errors
      utterance.onend = () => {
        console.log("German speech ended");
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
      console.log("Speaking Arabic:", text);
      
      // Create utterance for Arabic
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7; // Slower rate for better Arabic pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0; // Ensure volume is at maximum
      
      // Add event listener for when speaking ends or errors
      utterance.onend = () => {
        console.log("Arabic speech ended");
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
      console.log("Starting to speak vocab pair");
      
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
      
      console.log("Speaking Arabic only:", text);
      
      // Set the currently speaking word
      setSpeakingWordId(cardId);
      
      // Create utterance for Arabic only
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7; // Slower rate for better Arabic pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0; // Ensure volume is at maximum
      
      // Add event listener for when speaking ends or errors
      utterance.onend = () => {
        console.log("Arabic speech ended");
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
    console.log("Toggle playback, current state:", isPlaying);
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Start sequence playback
  const startPlayback = () => {
    if (cards.length === 0) {
      console.log("No cards to play");
      return;
    }
    
    console.log("Starting playback");
    setIsPlaying(true);
    setCurrentCardIndex(0);
  };

  // Stop sequence playback
  const stopPlayback = () => {
    console.log("Stopping playback");
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
      console.log("Cleaning up speech synthesis");
      window.speechSynthesis.cancel();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Effect to manage the sequence playback
  useEffect(() => {
    if (isPlaying && cards.length > 0) {
      console.log("Playing card at index:", currentCardIndex, "of", cards.length);
      
      const playNextCard = async () => {
        if (currentCardIndex >= cards.length) {
          console.log("Reached end of cards, stopping playback");
          stopPlayback();
          return;
        }
        
        const currentCard = cards[currentCardIndex];
        
        if (currentCard) {
          console.log("Playing card:", currentCard.front, currentCard.back);
          const success = await speakVocabPair(currentCard.front, currentCard.back, currentCard.id);
          
          // Move to next card with a delay
          if (success) {
            console.log("Successfully played card, moving to next after delay");
            timeoutRef.current = window.setTimeout(() => {
              setCurrentCardIndex(prev => prev + 1);
            }, 1500); // 1.5 second pause between card pairs
          } else {
            console.log("Failed to play card, stopping playback");
            stopPlayback();
          }
        }
      };
      
      playNextCard();
    }
  }, [isPlaying, currentCardIndex, cards]);

  // Function to manually test audio
  const testAudioOutput = () => {
    const testUtterance = new SpeechSynthesisUtterance("This is a test");
    testUtterance.volume = 1.0;
    window.speechSynthesis.speak(testUtterance);
    console.log("Testing speech synthesis with a simple utterance");
  };

  return {
    isPlaying,
    currentCardIndex,
    speakingWordId,
    speakVocabPair,
    speakArabicOnly,
    togglePlayback,
    stopPlayback,
    testAudioOutput
  };
};
