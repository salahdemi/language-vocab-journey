
import React from "react";
import { Deck } from "@/types";

interface StudyStatsProps {
  deck: Deck;
  onStudy: () => void;
}

const StudyStats: React.FC<StudyStatsProps> = ({ deck, onStudy }) => {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-medium mb-4">Cards for today</h2>
      
      {/* Progress circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl font-bold">{deck.cardsForToday}</span>
          </div>
        </div>
      </div>
      
      {/* Study stats */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6 flex">
        <div className="flex-1 flex flex-col items-center">
          <span className="text-2xl font-bold">{deck.cardsForToday}</span>
          <span className="text-gray-600">Not studied</span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-2xl font-bold text-app-green">{deck.toReview}</span>
          <span className="text-gray-600">To review</span>
        </div>
      </div>
      
      {/* Study button */}
      <button
        onClick={onStudy}
        className="w-full py-4 bg-app-blue text-white rounded-lg font-medium"
      >
        Study cards
      </button>
    </div>
  );
};

export default StudyStats;
