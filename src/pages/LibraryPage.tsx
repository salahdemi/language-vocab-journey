
import React from "react";
import Navbar from "@/components/Navbar";

const LibraryPage: React.FC = () => {
  return (
    <div className="pb-16 min-h-screen bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Library</h1>
      </div>
      
      <div className="p-6 flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Your Library</h2>
        <p className="text-gray-500 mb-4">This is where you'll find your saved decks and resources.</p>
      </div>
      
      <Navbar />
    </div>
  );
};

export default LibraryPage;
