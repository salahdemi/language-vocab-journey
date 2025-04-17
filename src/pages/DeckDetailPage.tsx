
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVocab } from "@/context/VocabContext";
import DeckHeader from "@/components/DeckHeader";
import StudyStats from "@/components/StudyStats";
import DeckCards from "@/components/DeckCards";
import Navbar from "@/components/Navbar";
import DeckAudioControls from "@/components/DeckAudioControls";

const DeckDetailPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { getDeck, getCardsForDeck, startStudySession } = useVocab();

  const deck = getDeck(deckId || "");
  const cards = getCardsForDeck(deckId || "");

  if (!deck) {
    return <div>Deck not found</div>;
  }

  const handleStartStudy = () => {
    startStudySession(deck.id);
    navigate(`/study/${deck.id}`);
  };

  return (
    <div className="pb-16 min-h-screen bg-white">
      <DeckHeader deck={deck} />
      <StudyStats deck={deck} onStudy={handleStartStudy} />
      <DeckAudioControls cards={cards} />
      <DeckCards cards={cards} deckId={deck.id} />
      <Navbar />
    </div>
  );
};

export default DeckDetailPage;
