interface XPBadgeProps {
  xp: number
  level: number
}

const XPBadge = ({ xp, level }: XPBadgeProps) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-panel px-4 py-3 shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
        XP
      </div>
      <div>
        <p className="text-xs font-semibold text-muted">Level {level}</p>
        <p className="text-lg font-semibold text-ink">{xp} XP</p>
      </div>
    </div>
  )
}

export default XPBadge
