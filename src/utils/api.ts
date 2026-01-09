import type { QuizQuestion, QuizResponse } from '../types'
import { decodeHtml } from './utils'

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function fetchQuizQuestions(retries = 3): Promise<QuizQuestion[]> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout('https://opentdb.com/api.php?amount=15', 10000)
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`)
      }

      const data: QuizResponse = await response.json()

      if (data.response_code !== 0) {
        throw new Error(`API returned error code: ${data.response_code}`)
      }

      if (!data.results || data.results.length === 0) {
        throw new Error('No questions returned from API')
      }

      // Decode HTML entities in questions and answers
      return data.results.map(question => ({
        ...question,
        question: decodeHtml(question.question),
        correct_answer: decodeHtml(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(answer => decodeHtml(answer)),
      }))
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        console.error(`Failed to fetch quiz questions after ${retries} attempts:`, lastError)
        throw lastError
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw lastError || new Error('Failed to fetch quiz questions')
}

