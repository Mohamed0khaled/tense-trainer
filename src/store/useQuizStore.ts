import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AnswerRecord,
  QuizFile,
  QuizMode,
  TenseStat,
} from '../types/quiz'
import { buildTenseStats, calculateAccuracy } from '../utils/analytics'
import { hashStringToSeed, seededShuffle, shuffleArray } from '../utils/shuffle'
import { getTodayKey } from '../utils/time'
import { getInitialTheme, type ThemeMode } from '../utils/theme'

const XP_PER_LEVEL = 120

interface Settings {
  timerEnabled: boolean
  timePerQuestion: number
  soundEnabled: boolean
  theme: ThemeMode
  mode: QuizMode
  questionCount: number
}

interface Session {
  mode: QuizMode
  questionIds: number[]
  choiceMap: Record<number, string[]>
  currentIndex: number
  answers: AnswerRecord[]
  score: number
  streak: number
  bestStreak: number
  startedAt: number | null
  endedAt: number | null
  isComplete: boolean
}

interface PlayerState {
  xp: number
  level: number
  badges: string[]
  lastDailyCompleted: string | null
}

interface QuizState {
  quiz: QuizFile | null
  quizSource: string | null
  settings: Settings
  session: Session
  stats: Record<string, TenseStat>
  player: PlayerState
  loadQuiz: (quiz: QuizFile, source?: string) => void
  startQuiz: (mode?: QuizMode) => void
  submitAnswer: (questionId: number, selected: string, timeSpent: number) => void
  nextQuestion: () => void
  finishQuiz: () => void
  resetSession: () => void
  updateSettings: (patch: Partial<Settings>) => void
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const initialSettings: Settings = {
  timerEnabled: true,
  timePerQuestion: 20,
  soundEnabled: true,
  theme: getInitialTheme(),
  mode: 'all',
  questionCount: 10,
}

const initialSession: Session = {
  mode: 'all',
  questionIds: [],
  choiceMap: {},
  currentIndex: 0,
  answers: [],
  score: 0,
  streak: 0,
  bestStreak: 0,
  startedAt: null,
  endedAt: null,
  isComplete: false,
}

const initialPlayer: PlayerState = {
  xp: 0,
  level: 1,
  badges: [],
  lastDailyCompleted: null,
}

const calculateScoreDelta = (isCorrect: boolean, streak: number) => {
  if (!isCorrect) return -3
  const bonus = streak >= 3 ? 2 * (streak - 2) : 0
  return 10 + bonus
}

const calculateXpDelta = (isCorrect: boolean, streak: number) => {
  if (!isCorrect) return 4
  const bonus = streak >= 4 ? 2 * (streak - 3) : 0
  return 12 + bonus
}

const levelFromXp = (xp: number) => Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1)

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quiz: null,
      quizSource: null,
      settings: initialSettings,
      session: initialSession,
      stats: {},
      player: initialPlayer,
      loadQuiz: (quiz, source) => {
        set({ quiz, quizSource: source ?? null })
      },
      startQuiz: (modeOverride) => {
        const state = get()
        if (!state.quiz) return

        const mode = modeOverride ?? state.settings.mode
        const todayKey = getTodayKey()

        let questions = [...state.quiz.questions]

        if (mode === 'weak') {
          const weakTenses = Object.entries(state.stats)
            .filter(([, stat]) => stat.total > 0)
            .sort((a, b) =>
              a[1].correct / a[1].total - b[1].correct / b[1].total,
            )
            .slice(0, 4)
            .map(([tense]) => tense)

          const filtered = questions.filter((question) =>
            weakTenses.includes(question.tense),
          )
          questions = filtered.length > 0 ? filtered : questions
        }

        if (mode === 'random') {
          questions = shuffleArray(questions).slice(
            0,
            Math.min(state.settings.questionCount, questions.length),
          )
        }

        if (mode === 'daily') {
          const seed = hashStringToSeed(`${todayKey}-${state.quiz.title}`)
          questions = seededShuffle(questions, seed).slice(
            0,
            Math.min(state.settings.questionCount, questions.length),
          )
        }

        const questionIds =
          mode === 'daily'
            ? questions.map((question) => question.id)
            : shuffleArray(questions.map((question) => question.id))

        const choiceMap = questions.reduce<Record<number, string[]>>(
          (acc, question) => {
            const choiceSeed = hashStringToSeed(
              `${todayKey}-${question.id}-${question.tense}`,
            )
            acc[question.id] =
              mode === 'daily'
                ? seededShuffle(question.choices, choiceSeed)
                : shuffleArray(question.choices)
            return acc
          },
          {},
        )

        set({
          session: {
            ...initialSession,
            mode,
            questionIds,
            choiceMap,
            startedAt: Date.now(),
          },
        })
      },
      submitAnswer: (questionId, selected, timeSpent) => {
        const state = get()
        if (!state.quiz) return

        const session = state.session
        if (session.isComplete) return

        if (session.answers.some((answer) => answer.questionId === questionId)) {
          return
        }

        const question = state.quiz.questions.find(
          (item) => item.id === questionId,
        )
        if (!question) return

        const isCorrect = selected === question.correct_answer
        const nextStreak = isCorrect ? session.streak + 1 : 0
        const scoreDelta = calculateScoreDelta(isCorrect, nextStreak)
        const xpDelta = calculateXpDelta(isCorrect, nextStreak)
        const bestStreak = Math.max(session.bestStreak, nextStreak)

        const nextAnswer: AnswerRecord = {
          questionId,
          selected,
          correct: isCorrect,
          timeSpent,
          tense: question.tense,
          correctAnswer: question.correct_answer,
          explanation: question.wrong_answer_notes[selected],
        }

        const nextAnswers = [...session.answers, nextAnswer]
        const updatedStats = { ...state.stats }
        const stat = updatedStats[question.tense] ?? { correct: 0, total: 0 }
        updatedStats[question.tense] = {
          correct: stat.correct + (isCorrect ? 1 : 0),
          total: stat.total + 1,
        }

        const nextXp = state.player.xp + xpDelta

        set({
          session: {
            ...session,
            answers: nextAnswers,
            score: session.score + scoreDelta,
            streak: nextStreak,
            bestStreak,
          },
          stats: updatedStats,
          player: {
            ...state.player,
            xp: nextXp,
            level: levelFromXp(nextXp),
          },
        })
      },
      nextQuestion: () => {
        const state = get()
        const session = state.session
        const nextIndex = session.currentIndex + 1
        if (nextIndex >= session.questionIds.length) {
          state.finishQuiz()
          return
        }
        set({
          session: {
            ...session,
            currentIndex: nextIndex,
          },
        })
      },
      finishQuiz: () => {
        const state = get()
        if (state.session.isComplete) return

        const accuracy = calculateAccuracy(state.session.answers)
        const accuracyPercent = Math.round(accuracy * 100)
        const nextBadges = new Set(state.player.badges)

        if (accuracyPercent >= 90) nextBadges.add('Tense Master')
        if (state.session.bestStreak >= 10) nextBadges.add('Perfect Streak')

        let nextXp = state.player.xp
        let lastDailyCompleted = state.player.lastDailyCompleted

        if (state.session.mode === 'daily') {
          const todayKey = getTodayKey()
          if (lastDailyCompleted !== todayKey) {
            nextXp += 30
            lastDailyCompleted = todayKey
            nextBadges.add('Daily Challenger')
          }
        }

        set({
          session: {
            ...state.session,
            isComplete: true,
            endedAt: Date.now(),
          },
          player: {
            ...state.player,
            xp: nextXp,
            level: levelFromXp(nextXp),
            badges: Array.from(nextBadges),
            lastDailyCompleted,
          },
        })
      },
      resetSession: () => {
        set({ session: initialSession })
      },
      updateSettings: (patch) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...patch,
          },
        }))
      },
      toggleTheme: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === 'dark' ? 'light' : 'dark',
          },
        }))
      },
      setTheme: (theme) => {
        set((state) => ({
          settings: {
            ...state.settings,
            theme,
          },
        }))
      },
    }),
    {
      name: 'tenses-training-store',
      partialize: (state) => ({
        quiz: state.quiz,
        quizSource: state.quizSource,
        settings: state.settings,
        session: state.session,
        stats: state.stats,
        player: state.player,
      }),
    },
  ),
)

export const useSessionTenseStats = () => {
  const answers = useQuizStore((state) => state.session.answers)
  return buildTenseStats(answers)
}
