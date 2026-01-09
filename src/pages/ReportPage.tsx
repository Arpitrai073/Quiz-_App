import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { shuffleArray } from '../utils/utils'
import './ReportPage.css'

function ReportPage() {
  const navigate = useNavigate()
  const { quizState, resetQuiz } = useQuiz()

  const handleRestart = () => {
    resetQuiz()
    navigate('/')
  }

  if (quizState.questions.length === 0) {
    navigate('/')
    return null
  }

  // Calculate score
  const correctAnswers = quizState.questions.filter(
    (question, index) =>
      quizState.userAnswers.get(index) === question.correct_answer
  ).length

  const totalQuestions = quizState.questions.length
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <h1 className="report-title">Quiz Results</h1>
          <div className="score-summary">
            <div className="score-circle">
              <div className="score-number">{correctAnswers}</div>
              <div className="score-total">/{totalQuestions}</div>
            </div>
            <div className="score-percentage">{percentage}%</div>
          </div>
          <p className="report-email">Email: {quizState.email}</p>
        </div>

        <div className="results-list">
          {quizState.questions.map((question, index) => {
            const userAnswer = quizState.userAnswers.get(index)
            const isCorrect = userAnswer === question.correct_answer
            const shuffledAnswers = shuffleArray([
              question.correct_answer,
              ...question.incorrect_answers,
            ])

            return (
              <div
                key={index}
                className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="result-question-header">
                  <span className="result-question-number">
                    Question {index + 1}
                  </span>
                  <span className={`result-status ${isCorrect ? 'status-correct' : 'status-incorrect'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                <h3 className="result-question-text">{question.question}</h3>

                <div className="result-answers">
                  <div className="answer-comparison">
                    <div className="answer-box">
                      <div className="answer-label">Your Answer:</div>
                      <div
                        className={`answer-value ${
                          userAnswer ? '' : 'no-answer'
                        }`}
                      >
                        {userAnswer || 'Not answered'}
                      </div>
                    </div>
                    <div className="answer-box">
                      <div className="answer-label">Correct Answer:</div>
                      <div className="answer-value correct-answer">
                        {question.correct_answer}
                      </div>
                    </div>
                  </div>

                  {!isCorrect && userAnswer && (
                    <div className="all-options">
                      <div className="options-label">All Options:</div>
                      <div className="options-list">
                        {shuffledAnswers.map((answer, ansIndex) => (
                          <div
                            key={ansIndex}
                            className={`option-item ${
                              answer === question.correct_answer
                                ? 'option-correct'
                                : answer === userAnswer
                                ? 'option-incorrect'
                                : ''
                            }`}
                          >
                            {answer}
                            {answer === question.correct_answer && (
                              <span className="option-badge">Correct</span>
                            )}
                            {answer === userAnswer && answer !== question.correct_answer && (
                              <span className="option-badge">Your Answer</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="report-actions">
          <button onClick={handleRestart} className="restart-button">
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportPage

