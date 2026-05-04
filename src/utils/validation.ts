import type { Question, QuizFile } from '../types/quiz'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

const normalizeQuestion = (question: Question): Question => ({
  ...question,
  question_note: question.question_note ?? null,
})

export const validateQuizFile = (data: unknown) => {
  const errors: string[] = []

  if (!isRecord(data)) {
    return { valid: false, errors: ['Root JSON must be an object.'] }
  }

  const level = data.level
  const title = data.title
  const description = data.description
  const totalQuestions = data.total_questions
  const questions = data.questions

  if (typeof level !== 'number') errors.push('level must be a number.')
  if (typeof title !== 'string') errors.push('title must be a string.')
  if (typeof description !== 'string')
    errors.push('description must be a string.')
  if (typeof totalQuestions !== 'number')
    errors.push('total_questions must be a number.')

  if (!Array.isArray(questions)) {
    errors.push('questions must be an array.')
  }

  const sanitizedQuestions: Question[] = []

  if (Array.isArray(questions)) {
    questions.forEach((question, index) => {
      const questionErrors: string[] = []
      if (!isRecord(question)) {
        errors.push(`questions[${index}] must be an object.`)
        return
      }

      const {
        id,
        tense,
        question: prompt,
        choices,
        correct_answer,
        wrong_answer_notes,
        question_note,
      } = question

      if (typeof id !== 'number')
        questionErrors.push(`questions[${index}].id must be a number.`)
      if (typeof tense !== 'string')
        questionErrors.push(`questions[${index}].tense must be a string.`)
      if (typeof prompt !== 'string')
        questionErrors.push(`questions[${index}].question must be a string.`)
      if (!isStringArray(choices))
        questionErrors.push(`questions[${index}].choices must be string array.`)
      if (typeof correct_answer !== 'string')
        questionErrors.push(
          `questions[${index}].correct_answer must be a string.`,
        )
      if (!isRecord(wrong_answer_notes))
        questionErrors.push(
          `questions[${index}].wrong_answer_notes must be an object.`,
        )
      if (
        question_note !== null &&
        question_note !== undefined &&
        typeof question_note !== 'string'
      ) {
        questionErrors.push(
          `questions[${index}].question_note must be string or null.`,
        )
      }

      if (isStringArray(choices) && typeof correct_answer === 'string') {
        if (!choices.includes(correct_answer)) {
          questionErrors.push(
            `questions[${index}].correct_answer must be in choices array.`,
          )
        }
      }

      if (isRecord(wrong_answer_notes)) {
        Object.entries(wrong_answer_notes).forEach(([key, value]) => {
          if (typeof value !== 'string') {
            questionErrors.push(
              `questions[${index}].wrong_answer_notes.${key} must be a string.`,
            )
          }
        })
      }

      if (questionErrors.length === 0) {
        sanitizedQuestions.push(
          normalizeQuestion({
            id: id as number,
            tense: tense as string,
            question: prompt as string,
            choices: choices as string[],
            correct_answer: correct_answer as string,
            wrong_answer_notes: wrong_answer_notes as Record<string, string>,
            question_note: (question_note ?? null) as string | null,
          }),
        )
      }

      if (questionErrors.length > 0) {
        errors.push(...questionErrors)
      }
    })
  }

  if (
    Array.isArray(questions) &&
    typeof totalQuestions === 'number' &&
    questions.length !== totalQuestions
  ) {
    errors.push('total_questions must match questions length.')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  const quiz: QuizFile = {
    level: level as number,
    title: title as string,
    description: description as string,
    total_questions: totalQuestions as number,
    questions: sanitizedQuestions,
  }

  return { valid: true, errors: [], quiz }
}
