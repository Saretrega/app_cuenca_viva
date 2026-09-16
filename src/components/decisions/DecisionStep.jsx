import { useState } from 'react'
import { INDICADOR_LABEL, INDICADOR_ICONO, TRAMO_CORTO, TRAMOS, INDICADORES } from '../../data/dimensions.js'
import { buscarRegistro, justificacionDeAlternativa } from '../../utils/matrixHelpers.js'
import AlternativeCard from './AlternativeCard.jsx'
import LocationPicker from './LocationPicker.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'

const COLOR_EFECTO = (v) => {
  if (v >= 2) return 'bg-bosque-100 text-bosque-800'
  if (v === 1) return 'bg-bosque-50 text-bosque-700'
  if (v === 0) return 'bg-slate-100 text-slate-500'
  if (v === -1) return 'bg-alerta-400/20 text-alerta-600'
  return 'bg-deterioro-100 text-deterioro-700'
}

/**
 * Paso de una decisión: elegir alternativa → elegir ubicación → confirmar.
 * Al confirmar muestra los efectos reales tomados de la matriz.
 */
export default function DecisionStep({ category, decision, onConfirm, onBack, onNext, paso, total }) {
  const [alternativa, setAlternativa] = useState(decision?.alternativa ?? null)
  const [ubicacion, setUbicacion] = useState(decision?.ubicacion ?? null)
  const [confirmado, setConfirmado] = useState(Boolean(decision))

  const registro = alternativa && ubicacion ? buscarRegistro(category.categoria, alternativa, ubicacion) : null
  const listo = Boolean(alternativa && ubicacion)

  const confirmar = () => {
    if (!listo) return
    onConfirm(category.categoria, alternativa, ubicacion)
    setConfirmado(true)
  }

  const cambiar = () => {
    setConfirmado(false)
  }

  return (
    <section className="space-y-5" aria-labelledby={`decision-${paso}`}>
      <header className="rounded-2xl border border-tierra-200 bg-white/90 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-agua-700">
          Decisión {paso + 1} de {total}
        </p>
        <h2 id={`decision-${paso}`} className="mt-1 flex items-center gap-3 text-2xl font-extrabold text-slate-800">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-agua-100 text-agua-700">
            <Icon name={category.icono} className="h-6 w-6" />
          </span>
          {category.categoria.replace(/^\d+\.\s*/, '')}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{category.eje}</p>
      </header>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
          1. Elige una alternativa
        </h3>
        <div role="radiogroup" aria-label="Alternativas" className="grid gap-3">
          {category.alternativas.map((alt) => (
            <AlternativeCard
              key={alt}
              alternativa={alt}
              icono={category.icono}
              descripcion={justificacionDeAlternativa(category.categoria, alt)}
              seleccionada={alternativa === alt}
              onSelect={() => {
                setAlternativa(alt)
                setConfirmado(false)
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
          2. ¿Dónde ocurre esta decisión?
        </h3>
        <LocationPicker
          ubicacion={ubicacion}
          onSelect={(u) => {
            setUbicacion(u)
            setConfirmado(false)
          }}
        />
      </div>

      {confirmado && registro ? (
        <div className="rounded-2xl border-2 border-agua-300 bg-agua-50/60 p-4">
          <p className="flex items-center gap-2 font-bold text-agua-800">
            <Icon name="check" className="h-5 w-5" />
            Efecto registrado en la matriz ({registro.id})
          </p>
          <p className="mt-1 text-sm text-slate-700">{registro.justificacion}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <caption className="sr-only">Efectos por tramo e indicador</caption>
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-1 pr-3 font-medium">Indicador</th>
                  {TRAMOS.map((t) => (
                    <th key={t} className="px-2 py-1 text-center font-medium">
                      {TRAMO_CORTO[t]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INDICADORES.map((ind) => (
                  <tr key={ind} className="border-t border-agua-200/70">
                    <td className="flex items-center gap-2 py-1.5 pr-3 text-slate-700">
                      <Icon name={INDICADOR_ICONO[ind]} className="h-4 w-4 text-agua-600" />
                      {INDICADOR_LABEL[ind]}
                    </td>
                    {TRAMOS.map((t) => {
                      const v = registro.efectos[t][ind]
                      return (
                        <td key={t} className="px-2 py-1.5 text-center">
                          <span className={`inline-block min-w-9 rounded-lg px-2 py-0.5 font-bold tabular-nums ${COLOR_EFECTO(v)}`}>
                            {v > 0 ? '+' : ''}
                            {v}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 rounded-xl bg-white/70 p-3 text-xs text-slate-600">
            <strong>Regla de propagación:</strong> {registro.reglaPropagacion}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="fantasma" onClick={onBack} disabled={paso === 0}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          Anterior
        </Button>
        <div className="flex gap-3">
          {confirmado ? (
            <>
              <Button variant="secundario" onClick={cambiar}>
                Cambiar decisión
              </Button>
              <Button variant="bosque" onClick={onNext}>
                Continuar
                <Icon name="flecha_der" className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={confirmar} disabled={!listo}>
              Confirmar decisión
              <Icon name="check" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
