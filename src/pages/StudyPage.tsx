
import React from "react";
import { useNavigate } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import FlashcardView from "@/components/FlashcardView";

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { studySession, currentDeck } = useVocab();

  // If there's no active study session, redirect to home
  React.useEffect(() => {
    if (!studySession || !currentDeck) {
      navigate("/");
    }
  }, [studySession, currentDeck, navigate]);

  if (!studySession || !currentDeck) {
    return null;
  }

  const currentCard = studySession.cardsToStudy[studySession.currentCardIndex];
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
