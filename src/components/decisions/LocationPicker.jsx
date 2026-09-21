import Icon from '../ui/Icon.jsx'

const OPCIONES = [
  { id: 'alta', label: 'Cuenca Alta', desc: 'Nacimientos, montañas y bosque.', icono: 'montana', color: 'bosque' },
  { id: 'media', label: 'Cuenca Media', desc: 'Valles, cultivos y comunidades.', icono: 'cultivo', color: 'tierra' },
  { id: 'baja', label: 'Cuenca Baja', desc: 'Planicie y desembocadura.', icono: 'agua', color: 'agua' },
]

const COLORES = {
  bosque: 'border-bosque-500 bg-bosque-50 text-bosque-800',
  tierra: 'border-tierra-400 bg-tierra-50 text-tierra-800',
  agua: 'border-agua-500 bg-agua-50 text-agua-800',
}

/**
 * Selector del tramo donde ocurre la decisión.
 */
export default function LocationPicker({ ubicacion, onSelect }) {
  return (
    <div
      role="radiogroup"
      aria-label="Tramo donde ocurre la decisión"
      className="grid grid-cols-3 gap-2 short:gap-1.5! vertical:grid-cols-1! sm:gap-3"
    >
      {OPCIONES.map((op) => {
        const activa = ubicacion === op.id
        return (
          <button
            key={op.id}
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={() => onSelect(op.id)}
            className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-2.5 text-left transition-all duration-200 short:gap-1! short:p-1.5! vertical:flex-row! vertical:items-center! hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-600 sm:p-3 ${
              activa ? `${COLORES[op.color]} shadow-md` : 'border-tierra-200 bg-white hover:bg-tierra-50'
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 short:h-7! short:w-7!">
              <Icon name={op.icono} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold sm:text-base">{op.label}</span>
              <span className="mt-0.5 hidden text-[11px] leading-tight text-slate-600 vertical:block! sm:block">
                {op.desc}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
