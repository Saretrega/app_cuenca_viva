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
    <section aria-label={`Comparación antes y después: ${scenario.nombre}`} className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">
        Antes vs. después · {scenario.nombre}
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-tierra-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-tierra-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2 font-semibold">Indicador</th>
              {TRAMOS.map((t) => (
                <th key={t} className="px-3 py-2 text-center font-semibold">
                  {TRAMO_LABEL[t]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDICADORES.map((ind) => (
              <tr key={ind} className="border-t border-tierra-100">
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <Icon name={INDICADOR_ICONO[ind]} className="h-4 w-4 text-agua-600" />
                    {INDICADOR_LABEL[ind]}
                  </span>
                </td>
                {TRAMOS.map((t) => {
                  const a = antes.clasificaciones[t][ind]
                  const d = despues.clasificaciones[t][ind]
                  const cambio = delta[t][ind]
                  return (
                    <td key={t} className="px-3 py-3">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>
                            {a.valor > 0 ? '+' : ''}
                            {a.valor}
                          </span>
                          <Icon name="flecha_der" className="h-3.5 w-3.5" />
                          <span className="font-bold text-slate-700">
                            {d.valor > 0 ? '+' : ''}
                            {d.valor}
                          </span>
                        </div>
                        <ClassificationBadge clasificacion={d} compacto />
                        <span
                          className={`text-xs font-bold ${cambio < 0 ? 'text-deterioro-600' : cambio > 0 ? 'text-bosque-600' : 'text-slate-400'}`}
                        >
                          {cambio > 0 ? '+' : ''}
                          {cambio} por el evento
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
