// Gráfica de línea: no requiere importar React explícitamente
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import useDashboardData from '../hooks/useDashboardData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function LineChart({ filters }: { filters: { period: number; area: string } }) {
  const { monthlySeries } = useDashboardData()
  const data = monthlySeries(filters)

  const labels = data.map((d) => d.mes)
  const dataset = {
    labels,
    datasets: [
      {
        label: 'Errores por 1.000',
        data: data.map((d) => d.rate),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const }
    }
  }

  return <Line id="line-errors" key="line-errors" data={dataset} options={options} aria-label="Gráfica de línea: tasa mensual de errores" />
}
