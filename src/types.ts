// Types for the quiz application

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizResponse {
  response_code: number;
  results: QuizQuestion[];
}

export interface UserAnswer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
}

export interface QuizState {
  email: string;
  questions: QuizQuestion[];
  userAnswers: Map<number, string>;
  visitedQuestions: Set<number>;
  startTime: number | null;
  timeRemaining: number;
}

