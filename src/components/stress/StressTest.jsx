import { stressScenarios } from '../../data/stressScenarios.js'
import { sourceById } from '../../data/sources.js'
import { TRAMO_LABEL, TRAMOS } from '../../data/dimensions.js'
import Icon from '../ui/Icon.jsx'
import StressComparison from './StressComparison.jsx'

const ICONO = { sequia: 'sol', lluvias: 'lluvia', compuesto: 'alerta' }

/**
 * Prueba de estrés climático: selección de escenario y lectura ANTES/DESPUÉS.
 */
export default function StressTest({ stressId, setStressId, stressResult }) {
  const activo = stressScenarios.find((s) => s.id === stressId) ?? null

  return (
    <section aria-label="Prueba de estrés climático" className="space-y-5">
      <header>
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-800">
          <Icon name="lluvia" className="h-6 w-6 text-agua-700" />
          Prueba de estrés climático
        </h2>
        <p className="mt-1 text-slate-600">
          Estos eventos no son decisiones humanas. Ocurren después de tus decisiones y ponen a prueba
          la capacidad de tu cuenca para resistir.
        </p>
      </header>

      <div role="radiogroup" aria-label="Escenarios de estrés" className="grid gap-3 md:grid-cols-3">
        {stressScenarios.map((s) => {
          const seleccionado = stressId === s.id
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={seleccionado}
              onClick={() => setStressId(seleccionado ? null : s.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-600 ${
                seleccionado ? 'border-agua-500 bg-agua-50 shadow-md' : 'border-tierra-200 bg-white hover:bg-tierra-50'
              }`}
            >
              <span className="flex items-center gap-2 font-bold text-slate-800">
                <Icon name={ICONO[s.id] ?? 'alerta'} className="h-5 w-5 text-agua-700" />
                {s.nombre}
              </span>
              <span className="mt-1 block text-sm text-slate-600">{s.descripcion}</span>
            </button>
          )
        })}
      </div>

      {activo && stressResult ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {TRAMOS.map((t) => (
              <div key={t} className="rounded-2xl border border-tierra-200 bg-white p-4">
                <p className="font-bold text-tierra-800">{TRAMO_LABEL[t]}</p>
                <p className="mt-1 text-sm text-slate-600">{activo.interpretaciones[t]}</p>
              </div>
            ))}
          </div>
          <StressComparison stressResult={stressResult} />
          {activo.fuentesIds?.length ? (
            <p className="text-xs text-slate-500">
              Fuentes: {activo.fuentesIds.join(', ')} ·{' '}
              <a
                href={sourceById[activo.fuentesIds[0]]?.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted hover:text-agua-700"
              >
                {sourceById[activo.fuentesIds[0]]?.institucion}
              </a>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-tierra-300 bg-white/60 p-4 text-center text-slate-600">
          Selecciona un escenario para ver cómo reaccionaría tu cuenca.
        </p>
      )}
    </section>
  )
}
