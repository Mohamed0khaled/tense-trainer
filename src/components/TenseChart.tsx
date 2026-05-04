import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TenseStat } from '../types/quiz'

interface TenseChartProps {
  stats: Record<string, TenseStat>
}

const TenseChart = ({ stats }: TenseChartProps) => {
  const data = Object.entries(stats).map(([tense, value]) => ({
    tense,
    accuracy: value.total === 0 ? 0 : Math.round((value.correct / value.total) * 100),
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="tense" tick={{ fontSize: 12 }} interval={0} angle={-10} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
          <Bar dataKey="accuracy" fill="var(--brand)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TenseChart
