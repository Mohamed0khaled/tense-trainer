interface ProgressBarProps {
  value: number
  total: number
}

const ProgressBar = ({ value, total }: ProgressBarProps) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <span>
          Question {value} / {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-black/10">
        <div
          className="h-2 rounded-full bg-brand"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
