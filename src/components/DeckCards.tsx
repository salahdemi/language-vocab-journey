
import React from "react";
import { Flashcard } from "@/types";
import { MoreVertical, Upload, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ImportCardsDialog from "./ImportCardsDialog";
import PlayAllButton from "./PlayAllButton";
import { Button } from "@/components/ui/button";

interface DeckCardsProps {
  cards: Flashcard[];
  deckId: string;
}

const DeckCards: React.FC<DeckCardsProps> = ({ cards, deckId }) => {
  const handleStudyAll = () => {
    // Navigate to study mode or trigger study session
    console.log("Starting study session for all cards");
  };

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Cards</h2>
            <p className="text-gray-600">{cards.length} cards in this deck</p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Alphabetical</option>
            </select>
            <Button variant="outline" className="px-4 py-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7h18M6 12h12M10 17h4"
                />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Study Button */}
        {cards.length > 0 && (
          <div className="mb-8">
            <PlayAllButton 
              cards={cards}
              onStudyAll={handleStudyAll}
            />
          </div>
        )}
        
        {/* Cards Grid */}
        <div className="space-y-4">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{card.front}</h3>
                    <p className="text-lg text-gray-600 rtl">{card.back}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen size={32} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No cards yet</h3>
              <p className="text-gray-500 mb-8">Start building your vocabulary by adding some cards</p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-12 space-y-4 max-w-md mx-auto">
          <Button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all">
            <Plus className="mr-2" size={20} />
            Add New Cards
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full py-4 border-2 border-gray-300 hover:border-blue-500 rounded-lg font-medium text-lg hover:bg-blue-50 transition-all">
                <Upload className="mr-2" size={20} />
                Import Cards
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-md">
              <ImportCardsDialog deckId={deckId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DeckCards;
