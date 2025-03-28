
import React, { useState } from "react";
import { useVocab } from "@/context/VocabContext";
import { X, FileText, Upload } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import ImportCSVOption from "./ImportCSVOption";

interface ImportCardsDialogProps {
  deckId: string;
}

const ImportCardsDialog: React.FC<ImportCardsDialogProps> = ({ deckId }) => {
  const [activeImport, setActiveImport] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">Import cards</h2>
        <DialogClose className="rounded-full p-1 hover:bg-gray-100">
          <X size={24} />
        </DialogClose>
      </div>
      
      {activeImport === "csv" ? (
        <ImportCSVOption deckId={deckId} onBack={() => setActiveImport(null)} />
      ) : (
        <div className="p-4">
          <p className="text-lg mb-4">You can import cards from:</p>
          
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <div className="bg-white p-2 rounded-lg mr-3">
                <img src="https://placehold.co/30x30" alt="Anki" className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">Anki</h3>
                <p className="text-gray-500 text-sm">We support .apkg, .colpkg and .ofc file formats</p>
              </div>
              <div className="ml-2">
                <button className="p-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <div className="bg-white p-2 rounded-lg mr-3">
                <img src="https://placehold.co/30x30" alt="Quizlet" className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">Quizlet</h3>
                <p className="text-gray-500 text-sm">Import sets / cards from Quizlet</p>
              </div>
              <div className="ml-2">
                <button className="p-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveImport("csv")}
              className="bg-gray-100 p-4 rounded-lg flex items-center w-full"
            >
              <div className="bg-white p-2 rounded-lg mr-3">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-grow text-left">
                <h3 className="font-medium">CSV (Docs, Excel, etc.)</h3>
                <p className="text-gray-500 text-sm">Import from any .csv document</p>
              </div>
              <div className="ml-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCardsDialog;
