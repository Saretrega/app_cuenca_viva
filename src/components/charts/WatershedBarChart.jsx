import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

/**
 * Gráfico de barras agrupadas con animación progresiva (Chart.js).
 * @param {{etiquetas:string[], series:Array<{label:string, valores:number[], color:string}>, altura?:number, ariaLabel?:string}} props
 */
export default function WatershedBarChart({ etiquetas, series, altura = 230, ariaLabel }) {
  const data = {
    labels: etiquetas,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.valores,
      backgroundColor: s.color,
      hoverBackgroundColor: s.color,
      borderRadius: 6,
      maxBarThickness: 34,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 850, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(15, 23, 42, 0.07)' },
        ticks: { font: { size: 11 }, precision: 0 },
      },
    },
  }

  return (
    <div style={{ height: altura }} role="img" aria-label={ariaLabel}>
      <Bar data={data} options={options} />
    </div>
  )
}
