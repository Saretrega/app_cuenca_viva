import Icon from '../ui/Icon.jsx'

/**
 * Historia generada automáticamente a partir del estado de la cuenca.
 */
export default function WatershedStory({ narrative }) {
  if (!narrative) return null
  return (
    <section aria-label="Historia de la cuenca" className="rounded-2xl border border-agua-200 bg-agua-50/50 p-5">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-agua-900">
        <Icon name="libro" className="h-6 w-6" />
        {narrative.titulo}
      </h2>
      <p className="mt-2 text-slate-700">{narrative.resumen}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-bosque-800">
            <Icon name="hoja" className="h-4 w-4" /> Decisiones favorables
          </h3>
          {narrative.decisionesFavorables.length ? (
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {narrative.decisionesFavorables.map((t, i) => (
                <li key={i} className="rounded-lg bg-white/70 p-2">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No se identificaron decisiones claramente favorables.</p>
          )}
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-bold text-deterioro-700">
            <Icon name="alerta" className="h-4 w-4" /> Principales presiones
          </h3>
          {narrative.presiones.length ? (
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {narrative.presiones.map((t, i) => (
                <li key={i} className="rounded-lg bg-white/70 p-2">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No se identificaron presiones fuertes.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="flex items-center gap-2 font-bold text-agua-800">
          <Icon name="flecha_der" className="h-4 w-4" /> Efectos aguas abajo
        </h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          {narrative.efectosAguasAbajo.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 rounded-xl bg-white/80 p-3 text-center font-semibold italic text-agua-900">
        {narrative.mensaje}
      </p>
    </section>
  )
}
