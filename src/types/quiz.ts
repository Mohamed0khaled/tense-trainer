export type QuizMode = 'all' | 'random' | 'weak' | 'daily'

export interface Question {
  id: number
  tense: string
  question: string
  choices: string[]
  correct_answer: string
  wrong_answer_notes: Record<string, string>
  question_note: string | null
}

export interface QuizFile {
  level: number
  title: string
  description: string
  total_questions: number
  questions: Question[]
}

export interface AnswerRecord {
  questionId: number
  selected: string
  correct: boolean
  timeSpent: number
  tense: string
  correctAnswer: string
  explanation?: string
}

export interface TenseStat {
  correct: number
  total: number
}
