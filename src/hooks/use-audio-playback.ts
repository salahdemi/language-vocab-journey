
import { useState, useRef, useEffect } from "react";
import { Flashcard } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useAudioPlayback = (cards: Flashcard[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Check speech synthesis availability on mount
  useEffect(() => {
    const speechSupported = 'speechSynthesis' in window;
    console.log("Speech Synthesis available?", speechSupported);
    setIsSpeechSupported(speechSupported);
    
    if (!speechSupported) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech features.",
        variant: "destructive"
      });
      return;
    }
    
    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices.length);
      voices.forEach(voice => {
        console.log(`Voice: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default}`);
      });
    };
    
    // Some browsers need this event to load voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Initial load of voices
    loadVoices();
    
    // Fix for Chrome bug where audio stops after ~15 seconds
    const resetSpeechSynthesis = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    
    // Reset speech synthesis every 10 seconds to prevent Chrome bug
    const intervalId = setInterval(resetSpeechSynthesis, 10000);
    
    return () => {
      clearInterval(intervalId);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [toast]);

  // Function to speak a single Arabic word
  const speakArabicOnly = (text: string, cardId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSpeechSupported) {
        console.error("Speech synthesis not supported");
        reject(new Error("Speech synthesis not supported"));
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      console.log("Speaking Arabic:", text);
      setSpeakingWordId(cardId);
      
      // Create utterance for Arabic
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7; // Slower rate for better pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Add event listeners
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

  // Function to speak both German and Arabic
  const speakBothLanguages = async (germanText: string, arabicText: string, cardId: string): Promise<void> => {
    if (!isSpeechSupported) {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech features.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Speaking both languages - German:", germanText, "Arabic:", arabicText);
      
      // Cancel any previous speech
      window.speechSynthesis.cancel();
      
      // Set the speaking word ID
      setSpeakingWordId(cardId);
      
      // First speak German
      const germanUtterance = new SpeechSynthesisUtterance(germanText);
      germanUtterance.lang = 'de-DE';
      germanUtterance.volume = 1.0;
      germanUtterance.rate = 0.9;

      await new Promise<void>((resolve) => {
        germanUtterance.onend = () => {
          console.log("German speech ended");
          resolve();
        };
        
        germanUtterance.onerror = () => {
          console.error("German speech error");
          resolve(); // Continue even if there's an error
        };
        
        window.speechSynthesis.speak(germanUtterance);
      });

      // Short pause between languages
      await new Promise(resolve => setTimeout(resolve, 800));

      // Then speak Arabic
      const arabicUtterance = new SpeechSynthesisUtterance(arabicText);
      arabicUtterance.lang = 'ar-SA';
      arabicUtterance.rate = 0.7;
      arabicUtterance.pitch = 1.0;
      arabicUtterance.volume = 1.0;
      
      await new Promise<void>((resolve, reject) => {
        arabicUtterance.onend = () => {
          console.log("Arabic speech ended");
          setSpeakingWordId(null);
          resolve();
        };
        
        arabicUtterance.onerror = (event) => {
          console.error("Arabic speech error:", event);
          setSpeakingWordId(null);
          reject(new Error('Arabic speech failed'));
        };
        
        window.speechSynthesis.speak(arabicUtterance);
      });
      
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      setSpeakingWordId(null);
      toast({
        title: "Speech Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive"
      });
    }
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
      toast({
        title: "No cards to play",
        description: "This deck has no vocabulary cards.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isSpeechSupported) {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech features.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Starting playback with", cards.length, "cards");
    setIsPlaying(true);
    setCurrentCardIndex(0);
  };

  // Stop sequence playback
  const stopPlayback = () => {
    console.log("Stopping playback");
    setIsPlaying(false);
    setSpeakingWordId(null);
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

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
          try {
            // Use speakBothLanguages instead of speakArabicOnly for 'Play All'
            await speakBothLanguages(currentCard.front, currentCard.back, currentCard.id);
            
            // Move to next card with a delay
            timeoutRef.current = window.setTimeout(() => {
              setCurrentCardIndex(prev => prev + 1);
            }, 1500);
          } catch (error) {
            console.error("Failed to play card:", error);
            stopPlayback();
          }
        }
      };
      
      playNextCard();
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentCardIndex, cards]);

  // Function to manually test audio
  const testAudioOutput = () => {
    if (!isSpeechSupported) {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech features.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Testing speech synthesis with German 'sehen' and Arabic 'يرى'");
    
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Trigger the test with both German and Arabic
    speakBothLanguages("sehen", "يرى", "test-audio");
    
    toast({
      title: "Test in progress",
      description: "Testing audio with 'sehen' and 'يرى'. If you don't hear anything, check your volume settings.",
    });
  };

  return {
    isPlaying,
    currentCardIndex,
    speakingWordId,
    speakArabicOnly,
    speakBothLanguages,
    togglePlayback,
    stopPlayback,
    testAudioOutput,
    isSpeechSupported
  };
};
