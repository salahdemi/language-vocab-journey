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
      
      console.log("Speaking Arabic only:", text);
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
        toast({
          title: "Speech Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive"
        });
        reject(new Error('Speech synthesis failed'));
      };
      
      // Start speaking Arabic
      window.speechSynthesis.speak(utterance);
    });
  };

  // Function to speak a German word followed by its Arabic translation
  const speakVocabPair = (germanText: string, arabicText: string, cardId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSpeechSupported) {
        console.error("Speech synthesis not supported");
        reject(new Error("Speech synthesis not supported"));
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      console.log("Speaking vocab pair:", germanText, arabicText);
      setSpeakingWordId(cardId);
      
      // Create utterance for German word
      const utteranceGerman = new SpeechSynthesisUtterance(germanText);
      utteranceGerman.lang = 'de-DE';
      utteranceGerman.volume = 1.0;
      
      // Create utterance for Arabic translation
      const utteranceArabic = new SpeechSynthesisUtterance(arabicText);
      utteranceArabic.lang = 'ar-SA';
      utteranceArabic.rate = 0.7; // Slower rate for better Arabic pronunciation
      utteranceArabic.pitch = 1.0;
      utteranceArabic.volume = 1.0;
      
      // Add event listener for when German speaking ends
      utteranceGerman.onend = () => {
        // Add a short pause before speaking Arabic
        setTimeout(() => {
          window.speechSynthesis.speak(utteranceArabic);
        }, 500);
      };
      
      // Add event listener for when Arabic speaking ends
      utteranceArabic.onend = () => {
        setSpeakingWordId(null);
        resolve();
      };
      
      utteranceArabic.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeakingWordId(null);
        toast({
          title: "Speech Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive"
        });
        reject(new Error('Speech synthesis failed'));
      };
      
      // Start speaking German first
      window.speechSynthesis.speak(utteranceGerman);
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
    
    console.log("Starting playback");
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
            await speakArabicOnly(currentCard.back, currentCard.id);
            
            // Move to next card with a delay
            console.log("Successfully played card, moving to next after delay");
            timeoutRef.current = window.setTimeout(() => {
              setCurrentCardIndex(prev => prev + 1);
            }, 1500); // 1.5 second pause between card pairs
          } catch (error) {
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
    if (!isSpeechSupported) {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech features.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Testing speech synthesis with 'مرحبا' (Hello in Arabic)");
    
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Try to speak Arabic test word
    const utterance = new SpeechSynthesisUtterance("مرحبا");
    utterance.lang = 'ar-SA';
    utterance.volume = 1.0;
    utterance.rate = 0.7;
    
    utterance.onend = () => {
      console.log("Test speech completed successfully");
      toast({
        title: "Test completed",
        description: "If you didn't hear anything, check your volume settings.",
      });
    };
    
    utterance.onerror = (event) => {
      console.error("Test speech error:", event);
      toast({
        title: "Test failed",
        description: "Speech synthesis error. Check browser permissions.",
        variant: "destructive"
      });
    };
    
    window.speechSynthesis.speak(utterance);
  };

  return {
    isPlaying,
    currentCardIndex,
    speakingWordId,
    speakArabicOnly,
    speakVocabPair, // Add this to the returned object
    togglePlayback,
    stopPlayback,
    testAudioOutput,
    isSpeechSupported
  };
};
