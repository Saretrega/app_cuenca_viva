import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import SlideDeck from '../components/ui/SlideDeck.jsx'
import { RANGOS_EFECTO } from '../data/thresholds.js'
import { sources } from '../data/sources.js'
import { INDICADOR_CORTO, INDICADOR_ICONO, INDICADORES, TRAMO_LABEL, TRAMOS } from '../data/dimensions.js'

const COLOR_ESCALA = (v) => {
  if (v >= 2) return 'bg-bosque-100 text-bosque-800'
  if (v === 1) return 'bg-bosque-50 text-bosque-700'
  if (v === 0) return 'bg-slate-100 text-slate-600'
  if (v === -1) return 'bg-alerta-400/20 text-alerta-600'
  return 'bg-deterioro-100 text-deterioro-700'
}

/**
 * Página metodológica "Ciencia detrás de Cuenca Viva" en diapositivas.
 */
export default function SciencePage({ onNavigate }) {
  const slides = [
    {
      id: 'escala',
      titulo: 'Escala ordinal',
      contenido: (
        <div className="flex h-full min-h-0 flex-col gap-3 short:gap-1.5!">
          <header className="shrink-0 text-center">
            <h2 className="text-[clamp(1.25rem,3vw,2rem)] font-black text-agua-900 short:text-[clamp(1rem,2.6vw,1.3rem)]!">
              Escala ordinal de efecto
            </h2>
            <p className="mx-auto mt-1 max-w-3xl text-sm text-slate-700 short:hidden!">
              Cada valor entre -3 y +3 expresa la dirección e intensidad esperada de un efecto, no una
              medición física.
            </p>
          </header>
          <div className="grid min-h-0 flex-1 grid-cols-1 content-center gap-2 short:grid-cols-2! short:gap-1.5! sm:grid-cols-2 xl:grid-cols-4">
            {RANGOS_EFECTO.map((r) => (
              <div
                key={r.valor}
                className="flex items-center gap-3 rounded-2xl border border-tierra-200 bg-white p-3 short:gap-2! short:p-1.5!"
              >
                <span
                  className={`flex h-10 w-12 shrink-0 items-center justify-center rounded-xl font-bold tabular-nums short:h-8! short:w-10! ${COLOR_ESCALA(r.valor)}`}
                >
                  {r.valor > 0 ? '+' : ''}
                  {r.valor}
                </span>
                <span className="text-sm text-slate-700">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'modelo',
      titulo: 'Cómo se combinan',
      contenido: (
        <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 short:gap-1.5!">
          <h2 className="text-center text-[clamp(1.25rem,3vw,2rem)] font-black text-agua-900 short:text-[clamp(1rem,2.6vw,1.3rem)]!">
            Doce efectos por decisión
          </h2>
          <p className="max-w-3xl text-center text-sm text-slate-700 short:hidden!">
            Cada decisión define cuatro indicadores en tres tramos. La propagación aguas abajo ya está
            incorporada en esos valores: el simulador solo los suma y clasifica con bandas
            configurables.
          </p>
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-tierra-200 bg-white">
            <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] bg-tierra-50 text-xs font-semibold text-slate-600">
              <span className="px-3 py-2 short:py-1!">Indicador</span>
              {TRAMOS.map((t) => (
                <span key={t} className="px-3 py-2 text-center short:py-1!">
                  {TRAMO_LABEL[t]}
                </span>
              ))}
            </div>
            {INDICADORES.map((ind) => (
              <div key={ind} className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-t border-tierra-100 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-2 text-slate-700 short:py-1!">
                  <Icon name={INDICADOR_ICONO[ind]} className="h-4 w-4 text-agua-600" />
                  {INDICADOR_CORTO[ind]}
                </span>
                {TRAMOS.map((t) => (
                  <span key={t} className="px-3 py-2 text-center font-mono text-slate-400 short:py-1!">
                    -3…+3
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'aviso',
      titulo: 'Aviso importante',
      contenido: (
        <div className="flex h-full min-h-0 items-center justify-center overflow-y-auto">
          <div className="max-w-3xl rounded-3xl border-2 border-alerta-400/60 bg-alerta-400/10 p-6 text-center short:p-3!">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-alerta-400/30 text-alerta-600 short:h-9! short:w-9!">
              <Icon name="alerta" className="h-7 w-7" />
            </span>
            <h2 className="mt-3 text-[clamp(1.25rem,3vw,1.75rem)] font-black text-alerta-600 short:mt-1.5! short:text-[clamp(1rem,2.6vw,1.3rem)]!">
              Aviso importante
            </h2>
            <p className="mt-2 text-sm text-slate-700 short:mt-1! sm:text-base">
              Cuenca Viva es un simulador educativo de escenarios. Sus resultados no constituyen
              mediciones reales de calidad del agua ni sustituyen estudios, monitoreos o evaluaciones
              ambientales oficiales.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'fuentes',
      titulo: 'Fuentes y referencias',
      contenido: (
        <div className="flex h-full min-h-0 flex-col gap-3 short:gap-1.5!">
          <header className="shrink-0 text-center">
            <h2 className="text-[clamp(1.25rem,3vw,2rem)] font-black text-agua-900 short:text-[clamp(1rem,2.6vw,1.3rem)]!">
              Fuentes y referencias
            </h2>
            <p className="mx-auto mt-1 max-w-3xl text-xs text-slate-600 short:hidden! sm:text-sm">
              IDEAM, Ministerio de Ambiente y Desarrollo Sostenible, Ministerio de Minas y Energía, US
              EPA, USGS y Comisión Europea, entre otras.
            </p>
          </header>
          <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-1.5 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
            {sources.map((s) => (
              <div key={s.id} className="rounded-xl border border-tierra-100 bg-white p-2">
                <span className="mr-1.5 rounded bg-agua-100 px-1.5 py-0.5 text-[10px] font-bold text-agua-800">
                  {s.id}
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-800 hover:text-agua-700"
                >
                  {s.institucion}
                </a>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.uso}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <SlideDeck
      slides={slides}
      accionFinal={
        <Button size="sm" onClick={() => onNavigate('simulation')}>
          <Icon name="jugar" className="h-4 w-4" />
          <span className="hidden sm:inline">Comenzar simulación</span>
        </Button>
      }
    />
  )
}
