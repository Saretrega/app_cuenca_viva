import Icon from '../ui/Icon.jsx'

/**
 * Tarjeta seleccionable de alternativa.
 * @param {{alternativa:string, descripcion:string, seleccionada:boolean, onSelect:Function, icono:string}} props
 */
export default function AlternativeCard({ alternativa, descripcion, seleccionada, onSelect, icono = 'hoja' }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={seleccionada}
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-600 ${
        seleccionada
          ? 'border-agua-500 bg-agua-50 shadow-md ring-2 ring-agua-300'
          : 'border-tierra-200 bg-white hover:border-agua-300 hover:bg-agua-50/40'
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          seleccionada ? 'bg-agua-600 text-white' : 'bg-bosque-100 text-bosque-700'
        }`}
      >
        <Icon name={icono} className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-slate-800">{alternativa}</span>
        {descripcion ? <span className="mt-1 block text-sm text-slate-600">{descripcion}</span> : null}
      </span>
      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          seleccionada ? 'border-agua-600 bg-agua-600 text-white' : 'border-slate-300'
        }`}
        aria-hidden="true"
      >
        {seleccionada ? <Icon name="check" className="h-3 w-3" /> : null}
      </span>
    </button>
  )
}
