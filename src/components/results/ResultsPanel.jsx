import { INDICADORES, TRAMO_LABEL, TRAMOS } from '../../data/dimensions.js'
import IndicatorCard from './IndicatorCard.jsx'
import Icon from '../ui/Icon.jsx'

const ICONO_TRAMO = { alta: 'montana', media: 'cultivo', baja: 'agua' }

/**
 * Estado de la cuenca por tramo e indicador.
 * @param {{state:Object, titulo?:string}} props
 */
export default function ResultsPanel({ state, titulo = 'Estado de tu cuenca' }) {
  return (
    <section aria-label={titulo} className="space-y-5">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-800">
        <Icon name="medir" className="h-6 w-6 text-agua-700" />
        {titulo}
      </h2>
      <div className="grid gap-5 lg:grid-cols-3">
        {TRAMOS.map((tramo) => (
          <div key={tramo} className="rounded-2xl border border-tierra-200 bg-tierra-50/50 p-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-tierra-800">
              <Icon name={ICONO_TRAMO[tramo]} className="h-5 w-5" />
              {TRAMO_LABEL[tramo]}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
