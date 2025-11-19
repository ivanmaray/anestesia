// KPIs: componente funcional — no es necesario importar React explícitamente
import useDashboardData from '../hooks/useDashboardData'

type Filters = { period: number; area: string }

function formatNumber(v: number) {
  return v.toFixed(2)
}

function Delta({ value }: { value: number | null }) {
  if (value === null || isNaN(value)) return <span className="text-sm text-slate-500">—</span>
  const up = value > 0
  const cls = up ? 'text-red-600' : 'text-emerald-600'
  const arrow = up ? '↑' : '↓'
  return (
    <span className={`font-semibold ${cls}`} aria-hidden>
      {arrow} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export default function KPIs({ filters }: { filters: Filters }) {
  const { computeKPIs } = useDashboardData()
  const k = computeKPIs(filters)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card kpi-card glow-border">
        <div className="kpi-accent" style={{ width: `${Math.min(100, Math.max(6, k.erroresPor1000 * 10))}%` }} />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm small-muted">Errores por 1.000 administraciones</div>
            <div className="text-4xl font-mono font-bold kpi-value neon-text">{formatNumber(k.erroresPor1000)}</div>
            <div className="small-muted">últimos {filters.period} meses</div>
          </div>
          <div className="text-right">
            <Delta value={k.delta.erroresPor1000} />
            <div className="small-muted mt-1">vs 12 meses previos</div>
            <div className="mt-2 sparkline" aria-hidden />
          </div>
        </div>
      </div>

      <div className="card kpi-card glow-border">
        <div className="kpi-accent" style={{ background: 'linear-gradient(90deg, rgba(255,59,48,0.2), rgba(255,59,48,0.65))' }} />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm small-muted">Errores severos (NCC-MERP G–I) por 1.000</div>
            <div className="text-4xl font-mono font-bold kpi-value neon-text">{formatNumber(k.severosPor1000)}</div>
            <div className="small-muted">últimos {filters.period} meses</div>
          </div>
          <div className="text-right">
            <Delta value={k.delta.severosPor1000} />
            <div className="small-muted mt-1">vs 12 meses previos</div>
            <div className="mt-2 sparkline" aria-hidden />
          </div>
        </div>
      </div>

      <div className="card kpi-card glow-border">
        <div className="kpi-accent" style={{ background: 'linear-gradient(90deg, rgba(79, 70, 229,0.25), rgba(99,102,241,0.55))' }} />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm small-muted">Near-miss por 1.000</div>
            <div className="text-4xl font-mono font-bold kpi-value neon-text">{formatNumber(k.nearMissPor1000)}</div>
            <div className="small-muted">últimos {filters.period} meses</div>
          </div>
          <div className="text-right">
            <Delta value={k.delta.nearMissPor1000} />
            <div className="small-muted mt-1">vs 12 meses previos</div>
            <div className="mt-2 sparkline" aria-hidden />
          </div>
        </div>
      </div>

      <div className="card kpi-card glow-border">
        <div className="kpi-accent" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.2), rgba(99,102,241,0.4))' }} />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm small-muted">% de alertas aceptadas</div>
            <div className="text-4xl font-mono font-bold kpi-value neon-text">{k.pctAlertasAceptadas?.toFixed(1) ?? '—'}%</div>
            <div className="small-muted">últimos {filters.period} meses</div>
          </div>
          <div className="text-right">
            <Delta value={k.delta.pctAlertasAceptadas ? -k.delta.pctAlertasAceptadas : null} />
            <div className="small-muted mt-1">vs 12 meses previos</div>
            <div className="mt-2 sparkline" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
