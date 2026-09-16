import Icon from '../ui/Icon.jsx'

const OPCIONES = [
  {
    id: 'alta',
    label: 'Cuenca Alta',
    desc: 'Nacimientos, montañas y bosque. Lo que pasa aquí viaja aguas abajo.',
    icono: 'montana',
    color: 'bosque',
  },
  {
    id: 'media',
    label: 'Cuenca Media',
    desc: 'Valles, cultivos y comunidades. Zona de tránsito y transformación.',
    icono: 'cultivo',
    color: 'tierra',
  },
  {
    id: 'baja',
    label: 'Cuenca Baja',
    desc: 'Planicie y desembocadura. Recibe todo lo acumulado aguas arriba.',
    icono: 'agua',
    color: 'agua',
  },
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
    <div role="radiogroup" aria-label="Tramo donde ocurre la decisión" className="grid gap-3 sm:grid-cols-3">
      {OPCIONES.map((op) => {
        const activa = ubicacion === op.id
        return (
          <button
            key={op.id}
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={() => onSelect(op.id)}
            className={`rounded-2xl border-2 p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-600 ${
              activa ? `${COLORES[op.color]} shadow-md ring-2 ring-offset-1` : 'border-tierra-200 bg-white hover:bg-tierra-50'
            }`}
          >
            <span className="flex items-center gap-2 font-bold">
              <Icon name={op.icono} className="h-5 w-5" />
              {op.label}
            </span>
            <span className="mt-1 block text-sm text-slate-600">{op.desc}</span>
          </button>
        )
      })}
    </div>
  )
}
