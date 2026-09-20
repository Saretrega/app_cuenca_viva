import { Suspense, lazy } from 'react'

const WatershedBarChart = lazy(() => import('./WatershedBarChart.jsx'))

/**
 * Carga diferida del gráfico (chart.js viaja en su propio chunk).
 */
export default function LazyWatershedChart({ altura = 230, ...props }) {
  return (
    <Suspense
      fallback={
        <div
          className="animate-pulse rounded-xl bg-tierra-100"
          style={{ height: altura }}
          aria-hidden="true"
        />
      }
    >
      <WatershedBarChart altura={altura} {...props} />
    </Suspense>
  )
}
