
import React from "react";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddDeckForm from "./AddDeckForm";

const AddDeckButton: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-20 right-4 flex items-center justify-center w-16 h-16 bg-[#0EA5E9] rounded-full shadow-lg z-10"
          aria-label="Add deck"
        >
          <Plus size={32} color="white" />
        </button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <AddDeckForm />
      </SheetContent>
    </Sheet>
  );
};

export default AddDeckButton;
