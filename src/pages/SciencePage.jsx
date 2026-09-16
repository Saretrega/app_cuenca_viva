import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import { RANGOS_EFECTO } from '../data/thresholds.js'
import { sources } from '../data/sources.js'

const COLOR_ESCALA = (v) => {
  if (v >= 2) return 'bg-bosque-100 text-bosque-800'
  if (v === 1) return 'bg-bosque-50 text-bosque-700'
  if (v === 0) return 'bg-slate-100 text-slate-600'
  if (v === -1) return 'bg-alerta-400/20 text-alerta-600'
  return 'bg-deterioro-100 text-deterioro-700'
}

/**
 * Página metodológica "Ciencia detrás de Cuenca Viva".
 */
export default function SciencePage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-agua-900">Ciencia detrás de Cuenca Viva</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Cuenca Viva usa un <strong>índice ordinal de efecto ambiental</strong>. Cada valor entre
          -3 y +3 expresa la dirección e intensidad esperada de un efecto, no una medición física.
        </p>
      </header>

      <section className="rounded-2xl border border-tierra-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <Icon name="medir" className="h-5 w-5 text-agua-700" />
          Escala ordinal de efecto
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RANGOS_EFECTO.map((r) => (
            <li key={r.valor} className="flex items-center gap-3 rounded-xl border border-tierra-100 p-3">
              <span className={`flex h-10 w-12 items-center justify-center rounded-xl font-bold tabular-nums ${COLOR_ESCALA(r.valor)}`}>
                {r.valor > 0 ? '+' : ''}
                {r.valor}
              </span>
              <span className="text-sm text-slate-700">{r.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-600">
          Cada decisión define 12 efectos: cuatro indicadores (calidad del agua, disponibilidad y
          regulación, biodiversidad y hábitat, resiliencia y estabilidad) en tres tramos (alta, media
          y baja). La propagación aguas abajo ya está incorporada en esos valores: el simulador solo
          los suma.
        </p>
      </section>

      <section className="rounded-2xl border border-alerta-400/50 bg-alerta-400/10 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-alerta-600">
          <Icon name="alerta" className="h-5 w-5" />
          Aviso importante
        </h2>
        <p className="mt-2 text-slate-700">
          Cuenca Viva es un simulador educativo de escenarios. Sus resultados no constituyen
          mediciones reales de calidad del agua ni sustituyen estudios, monitoreos o evaluaciones
          ambientales oficiales.
        </p>
      </section>

      <section className="rounded-2xl border border-tierra-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <Icon name="libro" className="h-5 w-5 text-agua-700" />
          Fuentes y referencias
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          La matriz se apoya en referencias de IDEAM, Ministerio de Ambiente y Desarrollo Sostenible,
          Ministerio de Minas y Energía, US EPA, USGS y la Comisión Europea, entre otras.
        </p>
        <ul className="mt-3 space-y-2">
          {sources.map((s) => (
            <li key={s.id} className="rounded-xl border border-tierra-100 p-3 text-sm">
              <span className="mr-2 rounded-md bg-agua-100 px-2 py-0.5 text-xs font-bold text-agua-800">{s.id}</span>
              <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold text-slate-800 hover:text-agua-700">
                {s.institucion}
              </a>
              <p className="mt-1 text-slate-600">{s.uso}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <Button size="lg" onClick={() => onNavigate('simulation')}>
          <Icon name="jugar" className="h-5 w-5" />
          Comenzar simulación
        </Button>
      </div>
    </div>
  )
}
