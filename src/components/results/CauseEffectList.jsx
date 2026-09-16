import { INDICADOR_LABEL, INDICADOR_ICONO, TRAMO_LABEL, TRAMOS, INDICADORES } from '../../data/dimensions.js'
import { sourceById } from '../../data/sources.js'
import Icon from '../ui/Icon.jsx'

/** Encuentra el tramo/indicador con mayor magnitud de efecto en una decisión. */
function efectoPrincipal(efectos) {
  let mejor = { tramo: 'alta', ind: 'calidadAgua', valor: 0 }
  for (const tramo of TRAMOS) {
    for (const ind of INDICADORES) {
      const v = efectos[tramo][ind]
      if (Math.abs(v) > Math.abs(mejor.valor)) mejor = { tramo, ind, valor: v }
    }
  }
  return mejor
}

/**
 * Explicación causa-efecto por decisión, con justificación, propagación y fuentes.
 * @param {{detalles:Array<Object>}} props
 */
export default function CauseEffectList({ detalles }) {
  if (!detalles?.length) {
    return <p className="text-slate-600">Aún no hay decisiones registradas.</p>
  }
  return (
    <section aria-label="Explicación causa-efecto" className="space-y-4">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-800">
        <Icon name="libro" className="h-6 w-6 text-agua-700" />
        ¿Por qué cambió tu cuenca?
      </h2>
      <ul className="space-y-3">
        {detalles.map((det) => {
          const principal = efectoPrincipal(det.efectos)
          const signo = principal.valor >= 0 ? 'beneficio' : 'presión'
          return (
            <li key={det.id} className="rounded-2xl border border-tierra-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-slate-800">
                  <span className="mr-2 rounded-lg bg-agua-100 px-2 py-0.5 text-xs font-bold text-agua-800">{det.id}</span>
                  {det.alternativa}
                </p>
                <span className="rounded-full bg-tierra-100 px-2.5 py-0.5 text-xs font-semibold text-tierra-800">
                  en {TRAMO_LABEL[det.ubicacion]}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{det.justificacion}</p>
              <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                <Icon name={INDICADOR_ICONO[principal.ind]} className="mt-0.5 h-4 w-4 shrink-0 text-agua-600" />
                <span>
                  Efecto principal ({signo}): <strong>{INDICADOR_LABEL[principal.ind]}</strong> en{' '}
                  {TRAMO_LABEL[principal.tramo]} ({principal.valor > 0 ? '+' : ''}
                  {principal.valor}).
                </span>
              </p>
              <p className="mt-2 rounded-xl bg-tierra-50 p-3 text-xs text-slate-600">
                <strong>Regla de propagación:</strong> {det.reglaPropagacion}
              </p>
              {det.fuentesIds?.length ? (
                <p className="mt-2 text-xs text-slate-500">
                  Fuentes:{' '}
                  {det.fuentesIds.map((fid, i) => (
                    <span key={fid}>
                      {i > 0 ? ', ' : ''}
                      <a
                        href={sourceById[fid]?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted hover:text-agua-700"
                      >
                        {fid}
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
