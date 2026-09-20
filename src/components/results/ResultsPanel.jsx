import { INDICADORES, TRAMO_LABEL, TRAMOS } from '../../data/dimensions.js'
import IndicatorCard from './IndicatorCard.jsx'
import Icon from '../ui/Icon.jsx'

const ICONO_TRAMO = { alta: 'montana', media: 'cultivo', baja: 'agua' }

/**
 * Estado de la cuenca por tramo e indicador (rejilla fluida).
 * @param {{state:Object, titulo?:string|null}} props
 */
export default function ResultsPanel({ state, titulo = 'Estado de tu cuenca' }) {
  return (
    <section aria-label={titulo ?? 'Estado de tu cuenca'} className="flex h-full min-h-0 flex-col gap-2">
      {titulo ? (
        <h2 className="flex shrink-0 items-center gap-2 text-lg font-extrabold text-slate-800 sm:text-xl">
          <Icon name="medir" className="h-5 w-5 text-agua-700" />
          {titulo}
        </h2>
      ) : null}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-cols-3">
        {TRAMOS.map((tramo) => (
          <div key={tramo} className="flex min-h-0 flex-col rounded-2xl border border-tierra-200 bg-tierra-50/50 p-2.5">
            <h3 className="flex shrink-0 items-center gap-2 text-sm font-bold text-tierra-800">
              <Icon name={ICONO_TRAMO[tramo]} className="h-4 w-4" />
              {TRAMO_LABEL[tramo]}
            </h3>
            <div className="mt-2 grid min-h-0 flex-1 content-start gap-1.5">
              {INDICADORES.map((ind) => (
                <IndicatorCard key={ind} indicador={ind} clasificacion={state.clasificaciones[tramo][ind]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
