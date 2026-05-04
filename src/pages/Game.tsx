import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'
import ToggleSwitch from '../components/ToggleSwitch'
import { useQuizStore } from '../store/useQuizStore'
import { playCorrectSound, playWrongSound } from '../utils/sound'

const Game = () => {
  const navigate = useNavigate()
  const quiz = useQuizStore((state) => state.quiz)
  const settings = useQuizStore((state) => state.settings)
  const session = useQuizStore((state) => state.session)
  const submitAnswer = useQuizStore((state) => state.submitAnswer)
  const nextQuestion = useQuizStore((state) => state.nextQuestion)
  const startQuiz = useQuizStore((state) => state.startQuiz)
  const updateSettings = useQuizStore((state) => state.updateSettings)

  const [selected, setSelected] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion)
  const questionStartRef = useRef(Date.now())

  const questionId = session.questionIds[session.currentIndex]
  const question = quiz?.questions.find((item) => item.id === questionId)
  const choices = useMemo(() => {
    if (!questionId) return []
    return session.choiceMap[questionId] ?? question?.choices ?? []
  }, [questionId, question?.choices, session.choiceMap])

  useEffect(() => {
    if (!questionId) return
    setSelected(null)
    setShowAnswer(false)
    questionStartRef.current = Date.now()
    setTimeLeft(settings.timePerQuestion)
  }, [questionId, settings.timePerQuestion])

  useEffect(() => {
    if (!settings.timerEnabled || showAnswer || !questionId) return
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [settings.timerEnabled, showAnswer, questionId])

  useEffect(() => {
    if (!settings.timerEnabled || showAnswer) return
    if (timeLeft === 0 && questionId) {
      handleAnswer('')
    }
  }, [timeLeft, settings.timerEnabled, showAnswer, questionId])

  useEffect(() => {
    if (session.isComplete) {
      navigate('/results')
    }
  }, [session.isComplete, navigate])

  const handleAnswer = (choice: string) => {
    if (!question || showAnswer) return
    const elapsedSeconds = Math.round(
      (Date.now() - questionStartRef.current) / 1000,
    )
    submitAnswer(question.id, choice, elapsedSeconds)
    setSelected(choice)
    setShowAnswer(true)
    if (settings.soundEnabled) {
      if (choice === question.correct_answer) {
        playCorrectSound()
      } else {
        playWrongSound()
      }
    }
  }

  if (!quiz) {
    return (
      <PageTransition>
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-ink">No quiz loaded yet</h2>
          <p className="mt-2 text-sm text-muted">Upload a JSON file to begin playing.</p>
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
          >
            Upload JSON
          </button>
        </div>
      </PageTransition>
    )
  }

  if (!questionId || !question) {
    return (
      <PageTransition>
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-ink">Ready to start?</h2>
          <p className="mt-2 text-sm text-muted">Pick a mode and launch the quiz.</p>
          <button
            type="button"
            onClick={() => startQuiz(settings.mode)}
            className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
          >
            Start quiz
          </button>
        </div>
      </PageTransition>
    )
  }

  const isLast = session.currentIndex === session.questionIds.length - 1
  const explanation = selected
    ? question.wrong_answer_notes[selected]
    : undefined

  return (
    <PageTransition>
      <section className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accentStrong">
              Streak {session.streak}
            </span>
            <span className="text-xs font-semibold text-muted">
              Score {session.score}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ToggleSwitch
              label="Timer"
              enabled={settings.timerEnabled}
              onChange={(value) => updateSettings({ timerEnabled: value })}
            />
            {settings.timerEnabled && (
              <div className="rounded-2xl border border-black/10 bg-panel px-4 py-2 text-sm font-semibold text-ink shadow-card">
                {timeLeft}s
              </div>
            )}
          </div>
        </div>

        <ProgressBar
          value={session.currentIndex + 1}
          total={session.questionIds.length}
        />

        <QuestionCard
          question={question}
          choices={choices}
          selected={selected}
          showAnswer={showAnswer}
          onSelect={handleAnswer}
        />

        {showAnswer && (
          <div className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-panel p-4 shadow-card">
              <p className="text-sm font-semibold text-ink">
                {selected === question.correct_answer
                  ? 'Correct! Keep the streak alive.'
                  : 'Not quite. Review the explanation below.'}
              </p>
              <div className="mt-2 text-sm text-muted">
                <p>
                  <span className="font-semibold text-ink">Your answer:</span>{' '}
                  {selected || 'No answer'}
                </p>
                <p>
                  <span className="font-semibold text-ink">Correct answer:</span>{' '}
                  {question.correct_answer}
                </p>
                {selected !== question.correct_answer && (
                  <p className="mt-2 text-xs text-muted">
                    {explanation ?? question.question_note ?? 'No explanation provided.'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {isLast ? 'Finish strong and review your results.' : 'Ready for the next one?'}
              </p>
              <button
                type="button"
                onClick={() => nextQuestion()}
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
              >
                {isLast ? 'Finish quiz' : 'Next question'}
              </button>
            </div>
          </div>
        )}
      </section>
    </PageTransition>
  )
}

export default Game
