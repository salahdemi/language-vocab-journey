import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Deck, Flashcard, StudySession } from "@/types";
import { addMinutes, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  importCardsFromCSV: (deckId: string, csvData: string) => number;
  startStudySession: (deckId: string) => void;
  endStudySession: () => void;
  nextCard: () => void;
  showAnswer: () => void;
  answerShown: boolean;
  saveCardReview: (difficulty: 'again' | 'hard' | 'good' | 'easy') => void;
  getDeck: (deckId: string) => Deck | undefined;
  getCardsForDeck: (deckId: string) => Flashcard[];
  progress: number;
  getNextDueCard: (deckId: string) => void;
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
  const { toast } = useToast();

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
  const importCardsFromCSV = (deckId: string, csvData: string): number => {
    try {
      // Parse CSV data
      const lines = csvData.split('\n');
      const newCards: Flashcard[] = [];
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          const [front, back] = line.split(',').map(item => item.trim());
          if (front && back) {
            // Create a new card with a unique ID
            const newCard: Flashcard = {
              front,
              back,
              deckId,
              language: getDeck(deckId)?.language || "Default",
              id: `${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`
            };
            newCards.push(newCard);
          }
        }
      });
      
      // Add all cards at once
      if (newCards.length > 0) {
        // Update cards state with all new cards
        setCards(prevCards => [...prevCards, ...newCards]);
        
        // Update deck total cards
        setDecks(decks.map(deck => {
          if (deck.id === deckId) {
            return { ...deck, totalCards: deck.totalCards + newCards.length };
          }
          return deck;
        }));
      }
      
      return newCards.length;
    } catch (error) {
      console.error("Error importing CSV:", error);
      return 0;
    }
  };

  // Function to calculate the next review time based on difficulty
  const calculateNextReview = (difficulty: 'again' | 'hard' | 'good' | 'easy'): Date => {
    const now = new Date();
    
    switch (difficulty) {
      case 'again':
        return addMinutes(now, 1); // 1 minute
      case 'hard':
        return addMinutes(now, 8); // 8 minutes
      case 'good':
        return addMinutes(now, 15); // 15 minutes
      case 'easy':
        return addDays(now, 4); // 4 days
      default:
        return addMinutes(now, 10); // Default fallback
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

  // Function to get cards due for review
  const getCardsForReview = (deckId: string): Flashcard[] => {
    const now = new Date();
    return cards.filter(card => 
      card.deckId === deckId && 
      (!card.nextReview || new Date(card.nextReview) <= now)
    );
  };

  // Function to check for any newly due cards and add them to the study session
  const getNextDueCard = useCallback((deckId: string) => {
    if (!studySession) return;
    
    const now = new Date();
    const dueCards = cards.filter(card => 
      card.deckId === deckId && 
      card.nextReview && 
      new Date(card.nextReview) <= now &&
      !studySession.cardsToStudy.some(c => c.id === card.id)
    );
    
    if (dueCards.length > 0) {
      // Add newly due cards to the study session
      setStudySession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          cardsToStudy: [...prev.cardsToStudy, ...dueCards]
        };
      });
      
      // Show a notification that a card is ready for review
      toast({
        title: "Card Ready for Review",
        description: "A previously studied card is now ready for review",
      });
    }
  }, [cards, studySession, toast]);

  // Function to start a study session
  const startStudySession = (deckId: string) => {
    const deckCards = getCardsForReview(deckId);
    const deck = getDeck(deckId);
    
    if (deck) {
      setCurrentDeck(deck);
      
      // Set up the study session
      const session: StudySession = {
        deckId,
        cardsToStudy: [...deckCards].sort(() => Math.random() - 0.5).slice(0, 20),
        currentCardIndex: 0,
        reviewedCards: []
      };
      
      // Show toast if there are cards to study
      if (session.cardsToStudy.length > 0) {
        toast({
          title: "Study Session Started",
          description: `${session.cardsToStudy.length} cards ready for review`,
        });
      } else {
        toast({
          title: "No Cards Due",
          description: "No cards are due for review at this time",
          variant: "destructive",
        });
      }
      
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
      
      if (!currentCard) {
        console.error("Current card is undefined");
        return;
      }
      
      const nextReview = calculateNextReview(difficulty);
      
      // Update the card with the difficulty and review schedule
      setCards(cards.map(card => {
        if (card.id === currentCard.id) {
          return { 
            ...card, 
            difficulty, 
            lastReviewed: new Date(),
            nextReview: nextReview
          };
        }
        return card;
      }));
      
      // Show toast with next review time
      const reviewMessage = difficulty === 'easy' ? 
        '4 days' : 
        `${difficulty === 'again' ? '1' : difficulty === 'hard' ? '8' : '15'} minutes`;
      
      toast({
        title: `Card Scheduled: ${difficulty}`,
        description: `Next review in ${reviewMessage}`,
      });
      
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
      
      // For "again" cards, we'll keep them in the session but move them to the end
      if (difficulty === 'again') {
        const updatedSession = {...studySession};
        
        // Remove the current card from its position
        const currentCardObj = {...currentCard, nextReview};
        updatedSession.cardsToStudy.splice(studySession.currentCardIndex, 1);
        
        // Add it to a position that will show up after approximately 1 minute
        // (assuming average 10 seconds per card review)
        const positionsToSkip = 6; // ~1 minute if reviewing every 10 seconds
        const newPosition = Math.min(
          studySession.currentCardIndex + positionsToSkip, 
          updatedSession.cardsToStudy.length
        );
        
        updatedSession.cardsToStudy.splice(newPosition, 0, currentCardObj);
        
        // If we're removing the current card, we don't want to increment the index
        setStudySession(updatedSession);
        
        // Add card to reviewed list
        setStudySession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            reviewedCards: [...prev.reviewedCards, currentCard.id]
          };
        });
      } else {
        // Add card to reviewed list for non-"again" cards
        setStudySession({
          ...studySession,
          reviewedCards: [...studySession.reviewedCards, currentCard.id]
        });
        
        // Move to next card for non-"again" cards
        nextCard();
      }
    }
  };

  // Update deck.cardsForToday for each deck
  useEffect(() => {
    // Calculate cards due for review
    setDecks(decks.map(deck => {
      const deckCards = getCardsForDeck(deck.id);
      const cardsForReview = getCardsForReview(deck.id);
      
      return { 
        ...deck, 
        cardsForToday: cardsForReview.length,
        totalCards: deckCards.length,
        toReview: cardsForReview.length
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
    progress,
    getNextDueCard
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
