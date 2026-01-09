import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import StartPage from './pages/StartPage'
import QuizPage from './pages/QuizPage'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </QuizProvider>
  )
}

export default App

