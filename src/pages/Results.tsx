import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePill from '../components/BadgePill'
import PageTransition from '../components/PageTransition'
import StatCard from '../components/StatCard'
import TenseChart from '../components/TenseChart'
import { useQuizStore, useSessionTenseStats } from '../store/useQuizStore'
import { calculateAccuracy, getSkillLevel, getWeakTenses } from '../utils/analytics'
import { formatDuration } from '../utils/time'

const Results = () => {
  const navigate = useNavigate()
  const quiz = useQuizStore((state) => state.quiz)
  const session = useQuizStore((state) => state.session)
  const player = useQuizStore((state) => state.player)
  const startQuiz = useQuizStore((state) => state.startQuiz)
  const sessionStats = useSessionTenseStats()

  const accuracy = calculateAccuracy(session.answers)
  const accuracyPercent = Math.round(accuracy * 100)
  const skillLevel = getSkillLevel(accuracyPercent)
  const duration = formatDuration(
    session.startedAt && session.endedAt ? session.endedAt - session.startedAt : 0,
  )

  const weakTenses = useMemo(() => getWeakTenses(sessionStats, 3), [sessionStats])

  if (!quiz || !session.isComplete) {
    return (
      <PageTransition>
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-ink">No results yet</h2>
          <p className="mt-2 text-sm text-muted">
            Finish a quiz to unlock analytics and feedback.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
          >
            Back to home
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <section className="grid gap-6">
        <div className="glass rounded-[32px] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink">Results</h1>
              <p className="text-sm text-muted">
                {quiz.title} • {quiz.total_questions} questions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.badges.map((badge) => (
                <BadgePill key={badge} label={badge} />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Score" value={session.score} accent />
            <StatCard label="Accuracy" value={`${accuracyPercent}%`} />
            <StatCard label="Time" value={duration} />
            <StatCard label="Level" value={skillLevel} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/review')}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-card"
            >
              Review mistakes
            </button>
            <button
              type="button"
              onClick={() => {
                startQuiz(session.mode)
                navigate('/game')
              }}
              className="rounded-full border border-black/10 bg-panel px-5 py-3 text-sm font-semibold text-ink shadow-card"
            >
              Retry this mode
            </button>
            <button
              type="button"
              onClick={() => {
                startQuiz('weak')
                navigate('/game')
              }}
              className="rounded-full border border-black/10 bg-panel px-5 py-3 text-sm font-semibold text-ink shadow-card"
            >
              Practice weak areas
            </button>
            <button
              type="button"
              onClick={() => {
                startQuiz('random')
                navigate('/game')
              }}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
            >
              Random quiz
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-ink">Accuracy per tense</h2>
            <p className="text-xs text-muted">Track what is sticking and what needs work.</p>
            <div className="mt-4">
              {Object.keys(sessionStats).length === 0 ? (
                <p className="text-sm text-muted">No data yet.</p>
              ) : (
                <TenseChart stats={sessionStats} />
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-ink">Weakest tenses</h2>
            <p className="text-xs text-muted">Focus on these to level up fast.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {weakTenses.length === 0 ? (
                <span className="text-sm text-muted">No weak tenses detected.</span>
              ) : (
                weakTenses.map((item) => (
                  <BadgePill
                    key={item.tense}
                    label={`${item.tense} ${Math.round(item.accuracy * 100)}%`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

export default Results
