import ClassificationBadge from '../ui/ClassificationBadge.jsx'
import Icon from '../ui/Icon.jsx'
import { INDICADOR_ICONO, INDICADOR_LABEL } from '../../data/dimensions.js'

/**
 * Tarjeta de un indicador con valor + clasificación + icono + color.
 */
export default function IndicatorCard({ indicador, clasificacion }) {
  return (
    <div className="rounded-2xl border border-tierra-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-700">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-agua-50 text-agua-700">
          <Icon name={INDICADOR_ICONO[indicador]} className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold">{INDICADOR_LABEL[indicador]}</p>
      </div>
      <div className="mt-3">
        <ClassificationBadge clasificacion={clasificacion} />
      </div>
    </div>
  )
}
