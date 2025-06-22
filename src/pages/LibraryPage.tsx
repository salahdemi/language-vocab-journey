
import React from "react";
import Navbar from "@/components/Navbar";
import { BookOpen, Clock, Trophy } from "lucide-react";

const LibraryPage: React.FC = () => {
  return (
    <div className="pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Your Library</h1>
        <p className="text-gray-600 mt-1">Manage your learning materials and progress</p>
      </div>
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Total Decks</h3>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Study Time</h3>
                  <p className="text-2xl font-bold text-green-600">0h</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Trophy className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Streak</h3>
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Empty State */}
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <BookOpen size={32} className="text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Start Your Learning Journey</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first deck and begin building your vocabulary. Your saved decks and progress will appear here.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Create Your First Deck
            </button>
          </div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default LibraryPage;
