
import React from "react";
import { useNavigate } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import FlashcardView from "@/components/FlashcardView";
import { useToast } from "@/hooks/use-toast";

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { studySession, currentDeck } = useVocab();
  const { toast } = useToast();

  // If there's no active study session, redirect to home
  React.useEffect(() => {
    if (!studySession || !currentDeck) {
      navigate("/");
    }
  }, [studySession, currentDeck, navigate]);

  // Add a safety check to ensure we have valid data before rendering
  if (!studySession || !currentDeck || !studySession.cardsToStudy || studySession.cardsToStudy.length === 0) {
    // Show toast and redirect if no cards to study
    React.useEffect(() => {
      toast({
        title: "No Cards to Study",
        description: "There are no cards due for review at this time",
        variant: "destructive",
      });
      navigate(`/deck/${currentDeck?.id || ""}`);
    }, []);
    return null;
  }

  // Add a guard to ensure the current card index is valid
  if (studySession.currentCardIndex >= studySession.cardsToStudy.length) {
    // If we've gone past the last card, return to the deck page
    navigate(`/deck/${currentDeck.id}`);
    return null;
  }

  const currentCard = studySession.cardsToStudy[studySession.currentCardIndex];
  
  // Ensure current card exists before continuing
  if (!currentCard) {
    navigate(`/deck/${currentDeck.id}`);
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
