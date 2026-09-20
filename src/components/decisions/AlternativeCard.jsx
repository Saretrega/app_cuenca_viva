import Icon from '../ui/Icon.jsx'

/**
 * Tarjeta seleccionable de alternativa (espaciosa, a pantalla completa).
 */
export default function AlternativeCard({ alternativa, descripcion, seleccionada, onSelect, icono = 'hoja' }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={seleccionada}
      onClick={onSelect}
      className={`flex w-full transform-gpu items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-600 sm:p-4 ${
        seleccionada
          ? 'border-agua-500 bg-agua-50 shadow-md ring-2 ring-agua-300'
          : 'border-tierra-200 bg-white hover:border-agua-300 hover:bg-agua-50/40'
      }`}
    >
      <span
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          seleccionada ? 'bg-agua-600 text-white' : 'bg-bosque-100 text-bosque-700'
        }`}
      >
        <Icon name={icono} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight text-slate-800 sm:text-base">{alternativa}</span>
        {descripcion ? (
          <span className="mt-1 block text-[11px] leading-tight text-slate-600 sm:text-xs">{descripcion}</span>
        ) : null}
      </span>
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          seleccionada ? 'border-agua-600 bg-agua-600 text-white' : 'border-slate-300'
        }`}
        aria-hidden="true"
      >
        {seleccionada ? <Icon name="check" className="h-3.5 w-3.5" /> : null}
      </span>
    </button>
  )
}
