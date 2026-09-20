import { INDICADOR_CORTO, INDICADOR_ICONO, TRAMO_LABEL, TRAMOS, INDICADORES } from '../../data/dimensions.js'
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
 * Explicación causa-efecto por decisión (rejilla fluida y compacta).
 */
export default function CauseEffectList({ detalles, titulo = '¿Por qué cambió tu cuenca?' }) {
  if (!detalles?.length) {
    return <p className="text-slate-600">Aún no hay decisiones registradas.</p>
  }
  return (
    <section aria-label="Explicación causa-efecto" className="flex h-full min-h-0 flex-col gap-2">
      {titulo ? (
        <h2 className="flex shrink-0 items-center gap-2 text-lg font-extrabold text-slate-800 sm:text-xl">
          <Icon name="libro" className="h-5 w-5 text-agua-700" />
          {titulo}
        </h2>
      ) : null}
      <ul className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2 overflow-hidden sm:grid-cols-2 xl:grid-cols-3">
        {detalles.map((det, i) => {
          const principal = efectoPrincipal(det.efectos)
          const signo = principal.valor >= 0 ? 'beneficio' : 'presión'
          return (
            <li
              key={det.id}
              className="rounded-xl border border-tierra-200 bg-white p-2.5 animate-fade-up"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold leading-tight text-slate-800">
                  <span className="mr-1.5 rounded bg-agua-100 px-1.5 py-0.5 text-[10px] font-bold text-agua-800">
                    {det.id}
                  </span>
                  {det.alternativa}
                </p>
                <span className="shrink-0 rounded-full bg-tierra-100 px-2 py-0.5 text-[10px] font-semibold text-tierra-800">
                  {TRAMO_LABEL[det.ubicacion]}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-tight text-slate-600">{det.justificacion}</p>
              <p className="mt-1 flex items-start gap-1 text-[11px] leading-tight text-slate-600">
                <Icon name={INDICADOR_ICONO[principal.ind]} className="mt-0.5 h-3 w-3 shrink-0 text-agua-600" />
                <span>
                  Efecto principal ({signo}): <strong>{INDICADOR_CORTO[principal.ind]}</strong> en{' '}
                  {TRAMO_LABEL[principal.tramo]} ({principal.valor > 0 ? '+' : ''}
                  {principal.valor}).
                </span>
              </p>
              <p className="mt-1 hidden text-[10px] leading-tight text-slate-500 sm:block">
                <strong>Propagación:</strong> {det.reglaPropagacion}
              </p>
              {det.fuentesIds?.length ? (
                <p className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                  {det.fuentesIds.map((fid, k) => (
                    <span key={fid}>
                      {k > 0 ? ' · ' : ''}
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
