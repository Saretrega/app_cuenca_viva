import { categories } from '../../data/categories.js'

/**
 * Indicador de avance compacto del flujo de decisiones.
 */
export default function DecisionProgress({ paso, decisions }) {
  const total = categories.length
  const completadas = categories.filter((c) => decisions?.[c.categoria]).length
  const porcentaje = Math.round((completadas / total) * 100)

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-tierra-200 bg-white/90 px-4 py-2 short:px-2! short:py-1!">
      <p className="whitespace-nowrap text-sm font-bold uppercase tracking-wide text-agua-800">
        Decisión {Math.min(paso + 1, total)} de {total}
      </p>
      <div
        className="h-2.5 flex-1 overflow-hidden rounded-full bg-tierra-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        aria-label="Progreso de decisiones"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-agua-500 to-bosque-500 transition-all duration-700 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="whitespace-nowrap text-xs text-slate-600">{completadas} completadas</p>
    </div>
  )
}
