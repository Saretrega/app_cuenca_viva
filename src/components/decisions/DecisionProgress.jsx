import { categories } from '../../data/categories.js'

/**
 * Indicador de avance del flujo de decisiones.
 * @param {{paso:number, decisions:Object}} props
 */
export default function DecisionProgress({ paso, decisions }) {
  const total = categories.length
  const completadas = categories.filter((c) => decisions?.[c.categoria]).length
  const porcentaje = Math.round((completadas / total) * 100)

  return (
    <div className="rounded-2xl border border-tierra-200 bg-white/90 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold uppercase tracking-wide text-agua-800">
          Decisión {Math.min(paso + 1, total)} de {total}
        </p>
        <p className="text-sm text-slate-600">{completadas} completadas</p>
      </div>
      <div
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-tierra-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        aria-label="Progreso de decisiones"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-agua-500 to-bosque-500 transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <ol className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
        {categories.map((c, i) => {
          const hecha = Boolean(decisions?.[c.categoria])
          const actual = i === paso
          return (
            <li key={c.categoria} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${hecha ? 'bg-bosque-500' : actual ? 'bg-agua-500' : 'bg-tierra-200'}`}
                title={c.categoria}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
