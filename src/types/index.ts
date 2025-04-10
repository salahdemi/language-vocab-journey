
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  language: string;
  deckId: string;
  lastReviewed?: Date;
  nextReview?: Date;
  difficulty?: 'again' | 'hard' | 'good' | 'easy';
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cardsForToday: number;
  totalCards: number;
  language: string;
  studiedToday: number;
  toReview: number;
}

export interface StudySession {
  deckId: string;
  cardsToStudy: Flashcard[];
  currentCardIndex: number;
  reviewedCards: string[];
}
