import useDashboardData from '../hooks/useDashboardData'

export default function TrafficLight({ filters }: { filters: { period: number; area: string } }) {
  const { computeKPIs } = useDashboardData()
  const k = computeKPIs(filters)
  const rate = k.erroresPor1000
  // determinar estado
  let label = 'Bajo'
  let pct = Math.min(1, Math.max(0, rate / 6))
  let ringColor = 'linear-gradient(90deg,#10B981,#059669)'
  if (rate >= 4) {
    label = 'Alto'
    ringColor = 'linear-gradient(90deg,#FF3B30,#C8231F)'
  } else if (rate >= 2) {
    label = 'Moderado'
    ringColor = 'linear-gradient(90deg,#F59E0B,#D97706)'
  }

  const conic = `conic-gradient(${ringColor} ${pct * 360}deg, rgba(255,255,255,0.03) ${pct * 360}deg)`

  return (
    <div className="card flex flex-col items-center justify-center text-center py-6 glow-border">
      <div className="ring" style={{ background: conic }} aria-hidden>
        <div className="inner">
          <div className="text-xl font-bold neon-text">{rate.toFixed(1)}</div>
        </div>
      </div>
      <div className="text-sm small-muted mt-3">Tasa global (por 1.000)</div>
      <div className="font-semibold mt-2">{label}</div>
      <div className="small-muted mt-2">Periodo seleccionado</div>
    </div>
  )
}
