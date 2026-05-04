interface MistakeItem {
  id: number
  tense: string
  prompt: string
  selected: string
  correct: string
  explanation?: string
}

interface MistakeListProps {
  items: MistakeItem[]
}

const MistakeList = ({ items }: MistakeListProps) => {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-panel p-6 text-center text-sm text-muted shadow-card">
        No mistakes to review. Nice work.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-3xl border border-black/10 bg-panel p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-brandSoft px-3 py-1 text-xs font-semibold text-brand">
              {item.tense}
            </span>
            <span className="text-xs text-muted">Question #{item.id}</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-ink">{item.prompt}</p>
          <div className="mt-4 grid gap-2 text-sm">
            <p>
              <span className="font-semibold text-danger">Your answer:</span> {item.selected || 'No answer'}
            </p>
            <p>
              <span className="font-semibold text-success">Correct answer:</span> {item.correct}
            </p>
            {item.explanation && (
              <p className="text-muted">{item.explanation}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MistakeList
