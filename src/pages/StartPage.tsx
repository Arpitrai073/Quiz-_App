import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { fetchQuizQuestions } from '../utils/api'
import './StartPage.css'

function StartPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setEmail: setQuizEmail, setQuestions, setStartTime } = useQuiz()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const questions = await fetchQuizQuestions()
      if (questions.length === 0) {
        setError('Failed to fetch quiz questions. Please try again.')
        setLoading(false)
        return
      }

      setQuizEmail(email)
      setQuestions(questions)
      setStartTime(Date.now())
      navigate('/quiz')
    } catch (err) {
      let errorMessage = 'Failed to fetch quiz questions. '
      
      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.message.includes('timeout')) {
          errorMessage += 'Request timed out. Please check your internet connection and try again.'
        } else if (err.message.includes('Failed to fetch') || err.message.includes('network')) {
          errorMessage += 'Network error. Please check your internet connection and try again.'
        } else if (err.message.includes('CORS')) {
          errorMessage += 'CORS error. Please try again or contact support.'
        } else {
          errorMessage += err.message
        }
      } else {
        errorMessage += 'Please check your internet connection and try again.'
      }
      
      setError(errorMessage)
      console.error('Error fetching questions:', err)
      setLoading(false)
    }
  }

  return (
    <div className="start-page">
      <div className="start-container">
        <h1 className="start-title">Welcome to the Quiz</h1>
        <p className="start-subtitle">Test your knowledge with 15 challenging questions</p>

        <section className="rules-card">
          <h2 className="rules-title">Quiz Rules</h2>
          <ul className="rules-list">
            <li>You will get <strong>15 questions</strong> fetched from the Open Trivia Database.</li>
            <li>You have a total of <strong>30 minutes</strong> to complete the quiz.</li>
            <li>You can move between questions using the <strong>Previous</strong> and <strong>Next</strong> buttons.</li>
            <li>Use the <strong>overview panel</strong> on the right to jump to any question.</li>
            <li>The quiz will <strong>auto-submit</strong> when the timer reaches zero.</li>
            <li>You can also <strong>submit manually</strong> at any time using the Submit button.</li>
            <li>Your final report will show your answer vs the correct answer for each question.</li>
          </ul>
        </section>

        <form onSubmit={handleSubmit} className="start-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Enter your email address to begin
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="form-input"
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Fetching quiz questions from the server...</p>
              <p className="loading-subtext">This may take a few seconds</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="start-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StartPage

