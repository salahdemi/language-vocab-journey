
import React from "react";
import { useNavigate } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import FlashcardView from "@/components/FlashcardView";
import { useToast } from "@/hooks/use-toast";

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { studySession, currentDeck } = useVocab();
  const { toast } = useToast();

  // Always call hooks at the top level
  React.useEffect(() => {
    // If there's no active study session or current deck, redirect to home
    if (!studySession || !currentDeck) {
      navigate("/");
    }
  }, [studySession, currentDeck, navigate]);

  // Check if there are no cards to study - show toast and redirect
  React.useEffect(() => {
    if (studySession && currentDeck && (!studySession.cardsToStudy || studySession.cardsToStudy.length === 0)) {
      toast({
        title: "No Cards to Study",
        description: "There are no cards due for review at this time",
        variant: "destructive",
      });
      navigate(`/deck/${currentDeck?.id || ""}`);
    }
  }, [studySession, currentDeck, toast, navigate]);

  // Check if we've gone past the last card
  React.useEffect(() => {
    if (studySession && currentDeck && studySession.currentCardIndex >= studySession.cardsToStudy.length) {
      navigate(`/deck/${currentDeck.id}`);
    }
  }, [studySession, currentDeck, navigate]);

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

  return (
    <div className="min-h-screen bg-white">
      <FlashcardView 
        card={currentCard} 
        cardNumber={cardNumber} 
        totalCards={totalCards} 
      />
    </div>
  );
};

export default StudyPage;
