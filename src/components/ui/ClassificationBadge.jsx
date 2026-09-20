import Icon from './Icon.jsx'
import { AnimatedNumber } from '../motion-primitives/animated-number.jsx'

const ESTILOS = {
  deterioro: {
    caja: 'bg-deterioro-50 text-deterioro-700 border-deterioro-200',
    icono: 'alerta',
  },
  alerta: {
    caja: 'bg-alerta-400/20 text-alerta-600 border-alerta-400/50',
    icono: 'alerta',
  },
  neutro: {
    caja: 'bg-slate-100 text-slate-600 border-slate-200',
    icono: 'medir',
  },
  agua: {
    caja: 'bg-agua-50 text-agua-700 border-agua-200',
    icono: 'agua',
  },
  bosque: {
    caja: 'bg-bosque-50 text-bosque-700 border-bosque-200',
    icono: 'hoja',
  },
}

/**
 * Muestra valor + clasificación + icono + color (no solo color).
 * @param {{clasificacion:{valor:number,label:string,tono:string,key:string}, compacto?:boolean}} props
 */
export default function ClassificationBadge({ clasificacion, compacto = false }) {
  const estilo = ESTILOS[clasificacion?.tono] ?? ESTILOS.neutro
  const valor = clasificacion?.valor ?? 0
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${estilo.caja} ${
        compacto ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      <Icon name={estilo.icono} className={compacto ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      <span className="inline-flex items-center tabular-nums">
        {valor > 0 ? '+' : valor < 0 ? '−' : ''}
        <AnimatedNumber value={Math.abs(valor)} />
      </span>
      {!compacto ? <span className="font-medium">{clasificacion?.label}</span> : null}
    </span>
  )
}
