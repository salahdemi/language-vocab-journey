
import React from "react";
import { Flashcard } from "@/types";
import { X } from "lucide-react";
import { useVocab } from "@/context/VocabContext";
import { Link } from "react-router-dom";

interface FlashcardViewProps {
  card: Flashcard;
  cardNumber: number;
  totalCards: number;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, cardNumber, totalCards }) => {
  const { answerShown, showAnswer, saveCardReview } = useVocab();

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
        <div className="w-6"></div> {/* Spacer for alignment */}
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
          {/* Front of card */}
          <div className="text-3xl text-center font-medium my-auto py-16">
            {card.front}
          </div>

          {/* Answer divider */}
          {answerShown && (
            <div className="border-t border-gray-200 my-4"></div>
          )}

          {/* Back of card (answer) */}
          {answerShown && (
            <div className="text-3xl text-center font-medium my-auto py-16 rtl">
              {card.back}
            </div>
          )}
        </div>
      </div>

      {/* Card actions */}
      <div className="p-4">
        {!answerShown ? (
          <button
            onClick={showAnswer}
            className="w-full py-4 text-center text-gray-700 bg-gray-100 rounded-md flex justify-center items-center"
          >
            <span className="mr-2">⌨️</span> Tap to show answer
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => saveCardReview('again')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-app-red bg-opacity-20 rounded-lg"
            >
              <span className="font-medium">Again</span>
              <span className="text-xs mt-1">1m</span>
            </button>
            <button
              onClick={() => saveCardReview('hard')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-app-yellow bg-opacity-20 rounded-lg"
            >
              <span className="font-medium">Hard</span>
              <span className="text-xs mt-1">8m</span>
            </button>
            <button
              onClick={() => saveCardReview('good')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-app-green bg-opacity-20 rounded-lg"
            >
              <span className="font-medium">Good</span>
              <span className="text-xs mt-1">15m</span>
            </button>
            <button
              onClick={() => saveCardReview('easy')}
              className="py-3 px-2 flex flex-col items-center justify-center bg-app-blue bg-opacity-20 rounded-lg"
            >
              <span className="font-medium">Easy</span>
              <span className="text-xs mt-1">4d</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
