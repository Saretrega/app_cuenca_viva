import Icon from '../ui/Icon.jsx'

/**
 * Historia generada automáticamente a partir del estado de la cuenca.
 */
export default function WatershedStory({ narrative, titulo = true }) {
  if (!narrative) return null
  return (
    <section
      aria-label="Historia de la cuenca"
      className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto rounded-2xl border border-agua-200 bg-agua-50/50 p-3 short:gap-1! short:p-2!"
    >
      {titulo ? (
        <h2 className="flex shrink-0 items-center gap-2 text-xl font-extrabold text-agua-900">
          <Icon name="libro" className="h-5 w-5" />
          {narrative.titulo}
        </h2>
      ) : null}
      <p className="shrink-0 text-sm text-slate-700 short:hidden!">{narrative.resumen}</p>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 short:gap-1.5! vertical:grid-cols-1!">
        <div className="min-h-0 overflow-y-auto rounded-xl bg-white/70 p-2.5 short:p-1.5!">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-bosque-800">
            <Icon name="hoja" className="h-4 w-4" /> Decisiones favorables
          </h3>
          {narrative.decisionesFavorables.length ? (
            <ul className="mt-1.5 space-y-1 text-[11px] leading-tight text-slate-700">
              {narrative.decisionesFavorables.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[11px] text-slate-600">No se identificaron decisiones claramente favorables.</p>
          )}
        </div>
        <div className="min-h-0 overflow-y-auto rounded-xl bg-white/70 p-2.5 short:p-1.5!">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-deterioro-700">
            <Icon name="alerta" className="h-4 w-4" /> Principales presiones
          </h3>
          {narrative.presiones.length ? (
            <ul className="mt-1.5 space-y-1 text-[11px] leading-tight text-slate-700">
              {narrative.presiones.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[11px] text-slate-600">No se identificaron presiones fuertes.</p>
          )}
        </div>
      </div>

      <div className="shrink-0 rounded-xl bg-white/70 p-2.5 short:p-1.5!">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-agua-800">
          <Icon name="flecha_der" className="h-4 w-4" /> Efectos aguas abajo
        </h3>
        <ul className="mt-1 space-y-0.5 text-[11px] leading-tight text-slate-700">
          {narrative.efectosAguasAbajo.map((t, i) => (
            <li key={i}>• {t}</li>
          ))}
        </ul>
      </div>

      <p className="shrink-0 rounded-xl bg-white/80 p-2 text-center text-xs font-semibold italic text-agua-900 short:hidden!">
        {narrative.mensaje}
      </p>
    </section>
  )
}
