// StackedBars: no requiere importar React explícitamente
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import useDashboardData from '../hooks/useDashboardData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StackedBars({ filters }: { filters: { period: number; area: string } }) {
  const { stackedByType } = useDashboardData()
  const stats = stackedByType(filters)

  const data = {
    labels: ['Tipos'],
    datasets: [
      { label: 'Dosis', data: [stats.dosis], backgroundColor: '#60A5FA' },
      { label: 'Fármaco', data: [stats.farmaco], backgroundColor: '#3B82F6' },
      { label: 'Vía', data: [stats.via], backgroundColor: '#2563EB' },
      { label: 'Velocidad', data: [stats.velocidad], backgroundColor: '#1E40AF' },
      { label: 'LASA', data: [stats.lasa], backgroundColor: '#0F172A' }
    ]
  }

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: { legend: { position: 'bottom' as const } },
    scales: { x: { stacked: true }, y: { stacked: true } }
  }

  return <Bar id="stacked-bars" key="stacked-bars" data={data} options={options} aria-label="Barras apiladas por tipo de error" />
}
