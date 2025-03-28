
import React from "react";
import { useVocab } from "@/context/VocabContext";
import DeckItem from "@/components/DeckItem";
import Navbar from "@/components/Navbar";
import AddDeckButton from "@/components/AddDeckButton";
import { Crown, Edit } from "lucide-react";

const HomePage: React.FC = () => {
  const { decks } = useVocab();

  return (
    <div className="pb-16 min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
            <span className="text-gray-600">0</span>
          </div>
        </div>
        <button className="bg-app-premium text-white px-4 py-2 rounded-full flex items-center">
          <Crown className="mr-2" size={18} />
          <span>Get Premium</span>
        </button>
        <button>
          <Edit size={24} />
        </button>
      </div>

      {/* Deck list */}
      <div className="divide-y divide-gray-100">
        {decks.map((deck) => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </div>

      {/* Add deck button */}
      <AddDeckButton />

      {/* Bottom navigation */}
      <Navbar />
    </div>
  );
};

export default HomePage;
