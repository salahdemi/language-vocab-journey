
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VocabProvider } from "./context/VocabContext";

import HomePage from "./pages/HomePage";
import DeckDetailPage from "./pages/DeckDetailPage";
import StudyPage from "./pages/StudyPage";
import LibraryPage from "./pages/LibraryPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

import "./index.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VocabProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deck/:deckId" element={<DeckDetailPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VocabProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
