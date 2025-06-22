
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

  const formatReviewTime = (difficulty: 'again' | 'hard' | 'good' | 'easy'): string => {
    switch (difficulty) {
      case 'again':
        return '1m';
      case 'hard':
        return '8m';
      case 'good':
        return '15m';
      case 'easy':
        return '4d';
      default:
        return '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white shadow-sm">
        <Link to={`/deck/${card.deckId}`} className="text-gray-600 hover:text-gray-800 transition-colors">
          <X size={24} />
        </Link>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
          {cardNumber} / {totalCards}
        </div>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${(cardNumber / totalCards) * 100}%` }}
        ></div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[60vh] flex flex-col">
          {/* Front of card */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold text-gray-800 mb-6">
              {card.front}
            </div>
            {card.imageUrl && (
              <img 
                src={card.imageUrl} 
                alt={card.front} 
                className="max-h-48 max-w-48 object-contain rounded-lg shadow-md" 
              />
            )}
          </div>

          {/* Answer divider */}
          {answerShown && (
            <div className="border-t-2 border-gray-200 my-8"></div>
          )}

          {/* Back of card (answer) */}
          {answerShown && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-indigo-700 rtl">
                {card.back}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card actions */}
      <div className="p-6 bg-white">
        {!answerShown ? (
          <button
            onClick={showAnswer}
            className="w-full py-4 text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Show Answer
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => saveCardReview('again')}
              className="py-4 px-3 flex flex-col items-center justify-center bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-semibold transition-colors"
            >
              <span className="text-lg">Again</span>
              <span className="text-sm opacity-75">{formatReviewTime('again')}</span>
            </button>
            <button
              onClick={() => saveCardReview('hard')}
              className="py-4 px-3 flex flex-col items-center justify-center bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl font-semibold transition-colors"
            >
              <span className="text-lg">Hard</span>
              <span className="text-sm opacity-75">{formatReviewTime('hard')}</span>
            </button>
            <button
              onClick={() => saveCardReview('good')}
              className="py-4 px-3 flex flex-col items-center justify-center bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-semibold transition-colors"
            >
              <span className="text-lg">Good</span>
              <span className="text-sm opacity-75">{formatReviewTime('good')}</span>
            </button>
            <button
              onClick={() => saveCardReview('easy')}
              className="py-4 px-3 flex flex-col items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl font-semibold transition-colors"
            >
              <span className="text-lg">Easy</span>
              <span className="text-sm opacity-75">{formatReviewTime('easy')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
