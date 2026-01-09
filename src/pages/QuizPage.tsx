import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { shuffleArray, formatTime } from '../utils/utils'
import './QuizPage.css'

function QuizPage() {
  const navigate = useNavigate()
  const {
    quizState,
    setUserAnswer,
    markQuestionVisited,
    setTimeRemaining,
  } = useQuiz()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasSubmittedRef = useRef(false)

  const handleSubmit = useCallback(() => {
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    navigate('/report')
  }, [navigate])

  // Timer effect - start countdown when quiz begins
  useEffect(() => {
    if (quizState.questions.length === 0) {
      navigate('/')
      return
    }

    // Don't start timer if it's already at 0 or submitted
    if (quizState.timeRemaining <= 0 || hasSubmittedRef.current) {
      return
    }

    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
            timerIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState.questions.length])

  // Auto-submit when timer reaches zero
  useEffect(() => {
    if (quizState.timeRemaining === 0 && quizState.questions.length > 0 && !hasSubmittedRef.current) {
      handleSubmit()
    }
  }, [quizState.timeRemaining, quizState.questions.length, handleSubmit])

  // Mark current question as visited
  useEffect(() => {
    if (quizState.questions.length > 0 && !quizState.visitedQuestions.has(currentQuestionIndex)) {
      markQuestionVisited(currentQuestionIndex)
    }
  }, [currentQuestionIndex, quizState.questions.length, quizState.visitedQuestions, markQuestionVisited])

  const handleAnswerSelect = (answer: string) => {
    setUserAnswer(currentQuestionIndex, answer)
  }

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const currentQuestion = quizState.questions[currentQuestionIndex]
  const userAnswer = quizState.userAnswers.get(currentQuestionIndex)

  // Shuffle answers for current question
  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion) return []
    return shuffleArray([
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ])
  }, [currentQuestion])

  if (quizState.questions.length === 0) {
    return null
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="timer-container">
          <div className="timer-label">Time Remaining</div>
          <div className={`timer ${quizState.timeRemaining < 300 ? 'timer-warning' : ''}`}>
            {formatTime(quizState.timeRemaining)}
          </div>
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Submit Quiz
        </button>
      </div>

      <div className="quiz-content">
        <div className="question-panel">
          <div className="question-header">
            <span className="question-number">
              Question {currentQuestionIndex + 1} of {quizState.questions.length}
            </span>
            <span className="question-category">{currentQuestion.category}</span>
          </div>

          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="answers-container">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                className={`answer-button ${
                  userAnswer === answer ? 'answer-selected' : ''
                }`}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer}
              </button>
            ))}
          </div>

          <div className="navigation-buttons">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="nav-button"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(quizState.questions.length - 1, prev + 1)
                )
              }
              disabled={currentQuestionIndex === quizState.questions.length - 1}
              className="nav-button"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overview-panel">
          <h3 className="overview-title">Question Overview</h3>
          <div className="questions-grid">
            {quizState.questions.map((_, index) => {
              const isVisited = quizState.visitedQuestions.has(index)
              const isAnswered = quizState.userAnswers.has(index)
              const isCurrent = index === currentQuestionIndex

              return (
                <button
                  key={index}
                  className={`question-number-button ${
                    isCurrent ? 'current' : ''
                  } ${isAnswered ? 'answered' : ''} ${isVisited ? 'visited' : ''}`}
                  onClick={() => handleQuestionClick(index)}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color current"></span>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-color answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-color visited"></span>
              <span>Visited</span>
            </div>
            <div className="legend-item">
              <span className="legend-color"></span>
              <span>Not Visited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage

