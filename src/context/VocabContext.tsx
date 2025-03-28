import React, { createContext, useState, useContext, useEffect } from "react";
import { Deck, Flashcard, StudySession } from "@/types";

// Initial data for the application
const initialDecks: Deck[] = [
  {
    id: "1",
    name: "Deutsch: 4000 German Words",
    description: "Common German words with translations",
    cardsForToday: 11,
    totalCards: 39,
    language: "German",
    studiedToday: 0,
    toReview: 0
  },
  {
    id: "2",
    name: "Gut",
    description: "Basic German vocabulary",
    cardsForToday: 0,
    totalCards: 0,
    language: "German",
    studiedToday: 0,
    toReview: 0
  }
];

const initialCards: Flashcard[] = [
  { id: "1", front: "sehen", back: "يرى", language: "German", deckId: "2" },
  { id: "2", front: "zeigen", back: "يظهر", language: "German", deckId: "2" },
  { id: "3", front: "nehmen", back: "يأخذ", language: "German", deckId: "2" },
  { id: "4", front: "bringen", back: "يجلب", language: "German", deckId: "2" },
  { id: "5", front: "laufen", back: "يمشي", language: "German", deckId: "2" },
  { id: "6", front: "mögen", back: "يحب", language: "German", deckId: "2" },
  { id: "7", front: "brauchen", back: "يحتاج", language: "German", deckId: "2" },
  { id: "8", front: "fragen", back: "يسأل", language: "German", deckId: "2" },
  { id: "9", front: "arbeiten", back: "يعمل", language: "German", deckId: "2" },
  { id: "10", front: "wohnen", back: "يسكن", language: "German", deckId: "2" }
];

// Define the context type
interface VocabContextType {
  decks: Deck[];
  cards: Flashcard[];
  studySession: StudySession | null;
  currentDeck: Deck | null;
  addDeck: (deck: Omit<Deck, "id" | "cardsForToday" | "studiedToday" | "toReview">) => string;
  addCard: (card: Omit<Flashcard, "id">) => void;
  importCardsFromCSV: (deckId: string, csvData: string) => void;
  startStudySession: (deckId: string) => void;
  endStudySession: () => void;
  nextCard: () => void;
  showAnswer: () => void;
  answerShown: boolean;
  saveCardReview: (difficulty: 'again' | 'hard' | 'good' | 'easy') => void;
  getDeck: (deckId: string) => Deck | undefined;
  getCardsForDeck: (deckId: string) => Flashcard[];
  progress: number;
}

// Create the context
const VocabContext = createContext<VocabContextType | undefined>(undefined);

// Create a provider component
export const VocabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [answerShown, setAnswerShown] = useState(false);
  const [progress, setProgress] = useState(0);

  // Function to add a new deck
  const addDeck = (deck: Omit<Deck, "id" | "cardsForToday" | "studiedToday" | "toReview">) => {
    const newId = Date.now().toString();
    const newDeck: Deck = {
      ...deck,
      id: newId,
      cardsForToday: 0,
      studiedToday: 0,
      toReview: 0
    };
    setDecks([...decks, newDeck]);
    return newId;
  };

  // Function to add a new card
  const addCard = (card: Omit<Flashcard, "id">) => {
    const newCard: Flashcard = {
      ...card,
      id: Date.now().toString()
    };
    setCards([...cards, newCard]);
    
    // Update deck total cards
    setDecks(decks.map(deck => {
      if (deck.id === card.deckId) {
        return { ...deck, totalCards: deck.totalCards + 1 };
      }
      return deck;
    }));
  };

  // Function to import cards from CSV
  const importCardsFromCSV = (deckId: string, csvData: string) => {
    try {
      // Parse CSV data (simple implementation, can be improved)
      const lines = csvData.split('\n');
      const newCards: Omit<Flashcard, "id">[] = [];
      
      lines.forEach(line => {
        if (line.trim()) {
          const [front, back] = line.split(',').map(item => item.trim());
          if (front && back) {
            newCards.push({
              front,
              back,
              deckId,
              language: getDeck(deckId)?.language || "Default"
            });
          }
        }
      });
      
      // Add all cards
      newCards.forEach(card => addCard(card));
      
      return newCards.length;
    } catch (error) {
      console.error("Error importing CSV:", error);
      return 0;
    }
  };

  // Function to get a deck by ID
  const getDeck = (deckId: string): Deck | undefined => {
    return decks.find(deck => deck.id === deckId);
  };

  // Function to get cards for a specific deck
  const getCardsForDeck = (deckId: string): Flashcard[] => {
    return cards.filter(card => card.deckId === deckId);
  };

  // Function to start a study session
  const startStudySession = (deckId: string) => {
    const deckCards = getCardsForDeck(deckId);
    const deck = getDeck(deckId);
    
    if (deck) {
      setCurrentDeck(deck);
      
      // Set up the study session
      const session: StudySession = {
        deckId,
        cardsToStudy: [...deckCards].sort(() => Math.random() - 0.5).slice(0, 10),
        currentCardIndex: 0,
        reviewedCards: []
      };
      
      setStudySession(session);
      setProgress(0);
      setAnswerShown(false);
    }
  };

  // Function to end a study session
  const endStudySession = () => {
    setStudySession(null);
    setCurrentDeck(null);
    setAnswerShown(false);
  };

  // Function to reveal the answer
  const showAnswer = () => {
    setAnswerShown(true);
  };

  // Function to move to the next card
  const nextCard = () => {
    if (studySession) {
      const newIndex = studySession.currentCardIndex + 1;
      
      // If we've gone through all cards, end the session
      if (newIndex >= studySession.cardsToStudy.length) {
        endStudySession();
        return;
      }
      
      // Update progress
      const newProgress = (newIndex / studySession.cardsToStudy.length) * 100;
      setProgress(newProgress);
      
      // Move to next card
      setStudySession({
        ...studySession,
        currentCardIndex: newIndex
      });
      
      setAnswerShown(false);
    }
  };

  // Function to save the card review
  const saveCardReview = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    if (studySession && currentDeck) {
      const currentCard = studySession.cardsToStudy[studySession.currentCardIndex];
      
      // Update the card with the difficulty and last reviewed date
      setCards(cards.map(card => {
        if (card.id === currentCard.id) {
          return { ...card, difficulty, lastReviewed: new Date() };
        }
        return card;
      }));
      
      // Update deck stats
      setDecks(decks.map(deck => {
        if (deck.id === currentDeck.id) {
          return { 
            ...deck, 
            studiedToday: deck.studiedToday + 1
          };
        }
        return deck;
      }));
      
      // Add card to reviewed list
      setStudySession({
        ...studySession,
        reviewedCards: [...studySession.reviewedCards, currentCard.id]
      });
      
      // Move to next card
      nextCard();
    }
  };

  // Update deck.cardsForToday for each deck
  useEffect(() => {
    // This would normally be based on some spaced repetition algorithm
    setDecks(decks.map(deck => {
      const deckCards = getCardsForDeck(deck.id);
      return { 
        ...deck, 
        cardsForToday: deck.id === "1" ? 11 : deckCards.length,
        totalCards: deckCards.length
      };
    }));
  }, [cards]);

  const value = {
    decks,
    cards,
    studySession,
    currentDeck,
    addDeck,
    addCard,
    importCardsFromCSV,
    startStudySession,
    endStudySession,
    nextCard,
    showAnswer,
    answerShown,
    saveCardReview,
    getDeck,
    getCardsForDeck,
    progress
  };

  return <VocabContext.Provider value={value}>{children}</VocabContext.Provider>;
};

// Custom hook to use the context
export const useVocab = () => {
  const context = useContext(VocabContext);
  if (context === undefined) {
    throw new Error("useVocab must be used within a VocabProvider");
  }
  return context;
};
