import Icon from './Icon.jsx'

/**
 * Aviso discreto y descartable: en iOS Safari (fuera de "modo standalone")
 * la única forma real de lograr pantalla completa es agregar la página a Inicio.
 * @param {{onDescartar:() => void}} props
 */
export default function AvisoAgregarInicio({ onDescartar }) {
  return (
    <div
      role="status"
      className="absolute left-1/2 top-[calc(0.5rem+env(safe-area-inset-top,0px))] z-50 flex w-[min(92vw,26rem)] -translate-x-1/2 items-center gap-2 rounded-2xl border border-agua-200 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-md backdrop-blur sm:text-sm"
    >
      <Icon name="compartir" className="h-4 w-4 shrink-0 text-agua-700" />
      <p className="min-w-0 flex-1">
        Agrega esta página a tu pantalla de inicio (botón Compartir de Safari) para verla en pantalla completa.
      </p>
      <button
        type="button"
        onClick={onDescartar}
        aria-label="Descartar aviso"
        className="shrink-0 rounded-full p-1 text-slate-500 hover:bg-tierra-100 hover:text-slate-700"
      >
        <Icon name="close" className="h-4 w-4" />
      </button>
    </div>
  )
}
