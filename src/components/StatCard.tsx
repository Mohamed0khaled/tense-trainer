import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  accent?: boolean
}

const StatCard = ({ label, value, accent }: StatCardProps) => {
  return (
    <div
      className={`rounded-3xl border border-black/10 p-5 shadow-card ${
        accent ? 'bg-brand text-white' : 'bg-panel'
      }`}
    >
      <p className={`text-xs font-semibold ${accent ? 'text-white/70' : 'text-muted'}`}>
        {label}
      </p>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}

export default StatCard
