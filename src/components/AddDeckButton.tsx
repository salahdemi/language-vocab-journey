
import React from "react";
import { Plus } from "lucide-react";

const AddDeckButton: React.FC = () => {
  return (
    <button
      className="fixed bottom-20 right-4 flex items-center justify-center w-16 h-16 bg-app-blue rounded-full shadow-lg z-10"
      aria-label="Add deck"
    >
      <Plus size={32} color="white" />
    </button>
  );
};

export default AddDeckButton;
