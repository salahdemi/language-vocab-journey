
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import FlashcardView from "@/components/FlashcardView";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { studySession, currentDeck, getNextDueCard } = useVocab();
  const { toast } = useToast();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [showRepeatButton, setShowRepeatButton] = useState(false);

  // Always call hooks at the top level
  useEffect(() => {
    // If there's no active study session or current deck, redirect to home
    if (!studySession || !currentDeck) {
      navigate("/");
    }
    
    // Clear any existing timeout when unmounting or changing sessions
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [studySession, currentDeck, navigate, timeoutId]);

  // Check if there are no cards to study - show toast and redirect
  useEffect(() => {
    if (studySession && currentDeck && (!studySession.cardsToStudy || studySession.cardsToStudy.length === 0)) {
      toast({
        title: "No Cards to Study",
        description: "There are no cards due for review at this time",
        variant: "destructive",
      });
      navigate(`/deck/${currentDeck?.id || ""}`);
    }
  }, [studySession, currentDeck, toast, navigate]);

  // Check for newly due cards every second
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (studySession && currentDeck) {
        // Check for any cards that are now due
        getNextDueCard(currentDeck.id);
        
        // Only check if the card is due when the answer has been shown
        if (studySession.cardsToStudy.length > 0 && 
            studySession.currentCardIndex < studySession.cardsToStudy.length) {
          const card = studySession.cardsToStudy[studySession.currentCardIndex];
          if (card.nextReview && new Date(card.nextReview) <= new Date() && studySession.answerShown) {
            setShowRepeatButton(true);
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, [studySession, currentDeck, getNextDueCard]);

  // Render conditions - return null early if we don't have valid data
  if (!studySession || !currentDeck) {
    return null;
  }

  if (!studySession.cardsToStudy || studySession.cardsToStudy.length === 0) {
    return null;
  }

  if (studySession.currentCardIndex >= studySession.cardsToStudy.length) {
    return null;
  }

  const currentCard = studySession.cardsToStudy[studySession.currentCardIndex];
  
  // Ensure current card exists before continuing
  if (!currentCard) {
    return null;
  }
  
  const cardNumber = studySession.currentCardIndex + 1;
  const totalCards = studySession.cardsToStudy.length;

  // Function to handle repeating the card now
  const handleRepeatNow = () => {
    setShowRepeatButton(false);
    // Reset the card to be reviewed again
    // No toast notification here as requested
  };

  return (
    <div className="min-h-screen bg-white">
      {showRepeatButton && currentCard.nextReview && new Date(currentCard.nextReview) <= new Date() && studySession.answerShown && (
        <div className="fixed top-0 left-0 right-0 bg-green-100 p-4 flex justify-center items-center z-10">
          <Button 
            onClick={handleRepeatNow}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
          >
            <Clock size={16} />
            <span>Review Time! Test Yourself Now</span>
          </Button>
        </div>
      )}
      <FlashcardView 
        card={currentCard} 
        cardNumber={cardNumber} 
        totalCards={totalCards} 
      />
    </div>
  );
};

export default StudyPage;
