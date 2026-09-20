import { useState } from 'react'
import { justificacionDeAlternativa } from '../../utils/matrixHelpers.js'
import AlternativeCard from './AlternativeCard.jsx'
import LocationPicker from './LocationPicker.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'

/**
 * Paso de una decisión a pantalla completa. Layout con gaps explícitos:
 * la lista de alternativas puede desplazarse internamente si no cabe,
 * de modo que nunca se superpone con la ubicación ni con los botones.
 */
export default function DecisionStep({ category, decision, paso, total, onContinue, onBack }) {
  const [alternativa, setAlternativa] = useState(decision?.alternativa ?? null)
  const [ubicacion, setUbicacion] = useState(decision?.ubicacion ?? null)

  const listo = Boolean(alternativa && ubicacion)

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-3xl border border-tierra-200 bg-white p-3 shadow-lg sm:gap-4 sm:p-5 lg:p-6">
      <header className="shrink-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-agua-700 sm:text-xs">
          Decisión {paso + 1} de {total}
        </p>
        <h2
          id={`decision-${paso}`}
          className="mt-1 flex items-center gap-2 text-[clamp(1.05rem,2.6vw,1.75rem)] font-extrabold leading-tight text-slate-800 sm:gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-agua-100 text-agua-700 sm:h-11 sm:w-11">
            <Icon name={category.icono} className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          {category.categoria.replace(/^\d+\.\s*/, '')}
        </h2>
        <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{category.eje}</p>
      </header>

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <h3 className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
          Elige una alternativa
        </h3>
        <div
          role="radiogroup"
          aria-label="Alternativas"
          className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2 overflow-y-auto pr-1 sm:grid-cols-2 sm:gap-3"
        >
          {category.alternativas.map((alt) => (
            <AlternativeCard
              key={alt}
              alternativa={alt}
              icono={category.icono}
              descripcion={justificacionDeAlternativa(category.categoria, alt)}
              seleccionada={alternativa === alt}
              onSelect={() => setAlternativa(alt)}
            />
          ))}
        </div>
      </section>

      <section className="flex shrink-0 flex-col gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
          ¿Dónde ocurre esta decisión?
        </h3>
        <LocationPicker ubicacion={ubicacion} onSelect={setUbicacion} />
      </section>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-tierra-100 pt-3">
        <Button variant="fantasma" size="sm" onClick={onBack}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          {paso === 0 ? 'Inicio' : 'Anterior'}
        </Button>
        <Button size="sm" onClick={() => onContinue(alternativa, ubicacion)} disabled={!listo}>
          Continuar
          <Icon name="flecha_der" className="h-4 w-4" />
        </Button>
      </footer>
    </div>
  )
}
