import { motion } from 'motion/react'
import ClassificationBadge from '../ui/ClassificationBadge.jsx'
import Icon from '../ui/Icon.jsx'
import { INDICADOR_CORTO, INDICADOR_ICONO, INDICADOR_LABEL } from '../../data/dimensions.js'

/**
 * Fila compacta de un indicador: icono + etiqueta + valor + clasificación.
 */
export default function IndicatorCard({ indicador, clasificacion }) {
  return (
    <motion.div
      className="flex items-center justify-between gap-2 rounded-xl border border-tierra-200 bg-white px-2.5 py-1.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <span className="flex min-w-0 items-center gap-1.5 text-slate-700" title={INDICADOR_LABEL[indicador]}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-agua-50 text-agua-700">
          <Icon name={INDICADOR_ICONO[indicador]} className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-xs font-semibold">{INDICADOR_CORTO[indicador]}</span>
      </span>
      <ClassificationBadge clasificacion={clasificacion} />
    </motion.div>
  )
}
