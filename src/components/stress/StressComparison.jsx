import { INDICADOR_LABEL, INDICADOR_ICONO, TRAMO_LABEL, TRAMOS, INDICADORES } from '../../data/dimensions.js'
import ClassificationBadge from '../ui/ClassificationBadge.jsx'
import Icon from '../ui/Icon.jsx'

/**
 * Comparación ANTES vs DESPUÉS de aplicar un escenario de estrés.
 */
export default function StressComparison({ stressResult }) {
  if (!stressResult) return null
  const { antes, despues, delta, scenario } = stressResult
  return (
    <section aria-label={`Comparación antes y después: ${scenario.nombre}`} className="flex min-h-0 flex-col gap-2">
      <h3 className="shrink-0 text-base font-bold text-slate-800">Antes vs. después · {scenario.nombre}</h3>
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-tierra-200 bg-white">
        <table className="h-full w-full text-xs">
          <thead className="bg-tierra-50 text-left text-slate-600">
            <tr>
              <th className="px-2 py-1.5 font-semibold">Indicador</th>
              {TRAMOS.map((t) => (
                <th key={t} className="px-2 py-1.5 text-center font-semibold">
                  {TRAMO_LABEL[t]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDICADORES.map((ind) => (
              <tr key={ind} className="border-t border-tierra-100">
                <td className="px-2 py-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Icon name={INDICADOR_ICONO[ind]} className="h-3.5 w-3.5 text-agua-600" />
                    {INDICADOR_LABEL[ind]}
                  </span>
                </td>
                {TRAMOS.map((t) => {
                  const a = antes.clasificaciones[t][ind]
                  const d = despues.clasificaciones[t][ind]
                  const cambio = delta[t][ind]
                  return (
                    <td key={t} className="px-2 py-1.5">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <span>
                            {a.valor > 0 ? '+' : ''}
                            {a.valor}
                          </span>
                          <Icon name="flecha_der" className="h-3 w-3" />
                          <span className="font-bold text-slate-700">
                            {d.valor > 0 ? '+' : ''}
                            {d.valor}
                          </span>
                        </div>
                        <ClassificationBadge clasificacion={d} compacto />
                        <span
                          className={`text-[10px] font-bold ${cambio < 0 ? 'text-deterioro-600' : cambio > 0 ? 'text-bosque-600' : 'text-slate-400'}`}
                        >
                          {cambio > 0 ? '+' : ''}
                          {cambio}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
