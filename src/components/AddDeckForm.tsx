
import React, { useState } from "react";
import { useVocab } from "@/context/VocabContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";

const AddDeckForm: React.FC = () => {
  const [deckName, setDeckName] = useState("");
  const { addDeck } = useVocab();
  const navigate = useNavigate();

  const handleCreateDeck = () => {
    if (deckName.trim()) {
      const newDeck = {
        name: deckName.trim(),
        description: "",
        totalCards: 0,
        language: "Default"
      };
      
      const deckId = addDeck(newDeck);
      navigate(`/deck/${deckId}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">New deck</h2>
        <SheetClose className="rounded-full p-1 hover:bg-gray-100">
          <X size={24} />
        </SheetClose>
      </div>
      
      <div className="p-6">
        <p className="text-lg font-medium mb-2">Create your own deck.</p>
        <p className="text-gray-500 mb-6">You get the best results from the cards you create yourself.</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Name"
            className="w-full bg-transparent border-b border-blue-400 pb-1 focus:outline-none text-lg"
            autoFocus
          />
        </div>
      </div>
      
      <div className="mt-auto p-4">
        <SheetClose asChild>
          <button
            onClick={handleCreateDeck}
            disabled={!deckName.trim()}
            className="w-full py-4 bg-[#0EA5E9] text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create new deck
          </button>
        </SheetClose>
      </div>
    </div>
  );
};

export default AddDeckForm;
