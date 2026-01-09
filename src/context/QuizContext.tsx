import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { QuizState, QuizQuestion } from '../types'

interface QuizContextType {
  quizState: QuizState
  setEmail: (email: string) => void
  setQuestions: (questions: QuizQuestion[]) => void
  setUserAnswer: (questionIndex: number, answer: string) => void
  markQuestionVisited: (questionIndex: number) => void
  setStartTime: (time: number) => void
  setTimeRemaining: (time: number | ((prev: number) => number)) => void
  resetQuiz: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

const initialState: QuizState = {
  email: '',
  questions: [],
  userAnswers: new Map(),
  visitedQuestions: new Set(),
  startTime: null,
  timeRemaining: 30 * 60, // 30 minutes in seconds
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, setQuizState] = useState<QuizState>(initialState)

  const setEmail = (email: string) => {
    setQuizState(prev => ({ ...prev, email }))
  }

  const setQuestions = (questions: QuizQuestion[]) => {
    setQuizState(prev => ({ ...prev, questions }))
  }

  const setUserAnswer = (questionIndex: number, answer: string) => {
    setQuizState(prev => {
      const newAnswers = new Map(prev.userAnswers)
      newAnswers.set(questionIndex, answer)
      return { ...prev, userAnswers: newAnswers }
    })
  }

  const markQuestionVisited = useCallback((questionIndex: number) => {
    setQuizState(prev => {
      // Only update if not already visited to prevent unnecessary re-renders
      if (prev.visitedQuestions.has(questionIndex)) {
        return prev
      }
      const newVisited = new Set(prev.visitedQuestions)
      newVisited.add(questionIndex)
      return { ...prev, visitedQuestions: newVisited }
    })
  }, [])

  const setStartTime = (time: number) => {
    setQuizState(prev => ({ ...prev, startTime: time }))
  }

  const setTimeRemaining = (time: number | ((prev: number) => number)) => {
    setQuizState(prev => ({
      ...prev,
      timeRemaining: typeof time === 'function' ? time(prev.timeRemaining) : time,
    }))
  }

  const resetQuiz = () => {
    setQuizState(initialState)
  }

  return (
    <QuizContext.Provider
      value={{
        quizState,
        setEmail,
        setQuestions,
        setUserAnswer,
        markQuestionVisited,
        setStartTime,
        setTimeRemaining,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}

