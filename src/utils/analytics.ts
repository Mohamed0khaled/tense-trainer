import type { AnswerRecord, TenseStat } from '../types/quiz'

export const calculateAccuracy = (answers: AnswerRecord[]) => {
  if (answers.length === 0) return 0
  const correct = answers.filter((answer) => answer.correct).length
  return correct / answers.length
}

export const buildTenseStats = (answers: AnswerRecord[]) => {
  return answers.reduce<Record<string, TenseStat>>((acc, answer) => {
    const current = acc[answer.tense] ?? { correct: 0, total: 0 }
    acc[answer.tense] = {
      correct: current.correct + (answer.correct ? 1 : 0),
      total: current.total + 1,
    }
    return acc
  }, {})
}

export const getWeakTenses = (
  stats: Record<string, TenseStat>,
  limit = 3,
) => {
  const ranked = Object.entries(stats)
    .filter(([, value]) => value.total > 0)
    .map(([tense, value]) => ({
      tense,
      accuracy: value.correct / value.total,
      total: value.total,
    }))
    .sort((a, b) => {
      if (a.accuracy === b.accuracy) {
        return b.total - a.total
      }
      return a.accuracy - b.accuracy
    })
  return ranked.slice(0, limit)
}

export const getSkillLevel = (accuracyPercent: number) => {
  if (accuracyPercent >= 90) return 'Master'
  if (accuracyPercent >= 75) return 'Advanced'
  if (accuracyPercent >= 50) return 'Intermediate'
  return 'Beginner'
}
