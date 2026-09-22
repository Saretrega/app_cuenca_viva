import { useState } from 'react'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import LazyWatershedChart from '../components/charts/LazyWatershedChart.jsx'
import SlideDeck from '../components/ui/SlideDeck.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { stressScenarios } from '../data/stressScenarios.js'
import { sourceById } from '../data/sources.js'
import { INDICADOR_CORTO, INDICADORES, TRAMO_CORTO, TRAMO_LABEL, TRAMOS } from '../data/dimensions.js'

const ICONO = { sequia: 'sol', lluvias: 'lluvia', compuesto: 'alerta' }

/**
 * Prueba de estrés climático en formato diapositivas, con la cuenca visible.
 */
export default function StressPage({ sim, onNavigate }) {
  const { state, decisions, stressId, setStressId, stressResult } = sim
  const [tramo, setTramo] = useState('baja')
  const activo = stressScenarios.find((s) => s.id === stressId) ?? null

  const slides = activo && stressResult
    ? [
        {
          id: 'antes-despues',
          titulo: 'Antes vs. después',
          contenido: (
            <div className="flex h-full min-h-0 flex-col gap-2">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-700">Antes vs. después por tramo</p>
                <div className="flex gap-1" role="group" aria-label="Tramo a visualizar">
                  {TRAMOS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={tramo === t}
                      onClick={() => setTramo(t)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        tramo === t ? 'bg-agua-600 text-white' : 'bg-tierra-100 text-tierra-800 hover:bg-tierra-200'
                      }`}
                    >
                      {TRAMO_CORTO[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-h-0 flex-1 rounded-2xl border border-tierra-200 bg-white p-2 vertical:h-[28vh]! vertical:flex-none!">
                <LazyWatershedChart
                  altura="100%"
                  etiquetas={INDICADORES.map((i) => INDICADOR_CORTO[i])}
                  series={[
                    {
                      label: 'Antes',
                      valores: INDICADORES.map((i) => stressResult.antes.totales[tramo][i]),
                      color: '#94a3b8',
                    },
                    {
                      label: 'Después',
                      valores: INDICADORES.map((i) => stressResult.despues.totales[tramo][i]),
                      color: '#ef4444',
                    },
                  ]}
                  ariaLabel={`Puntajes antes y después del estrés en ${TRAMO_LABEL[tramo]}`}
                />
              </div>
              <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3">
                {TRAMOS.map((t) => (
                  <div key={t} className="rounded-xl border border-tierra-200 bg-white p-2">
                    <p className="text-xs font-bold text-tierra-800">{TRAMO_LABEL[t]}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-600">{activo.interpretaciones[t]}</p>
                  </div>
                ))}
              </div>
              {activo.fuentesIds?.length ? (
                <p className="shrink-0 text-[10px] text-slate-500">
                  Fuentes:{' '}
                  <a
                    href={sourceById[activo.fuentesIds[0]]?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted hover:text-agua-700"
                  >
                    {activo.fuentesIds.join(', ')}
                  </a>
                </p>
              ) : null}
            </div>
          ),
        },
      ]
    : []

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-black text-agua-900 sm:text-2xl">
            <Icon name="lluvia" className="h-6 w-6" />
            Prueba de estrés climático
          </h1>
          <p className="text-xs text-slate-600 sm:text-sm">
            Eventos que ocurren después de tus decisiones y ponen a prueba tu cuenca.
          </p>
        </div>
        <Button size="sm" variant="secundario" onClick={() => onNavigate('results')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          <span className="hidden sm:inline">Volver a resultados</span>
        </Button>
      </header>

      <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3">
        {stressScenarios.map((s) => {
          const seleccionado = stressId === s.id
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={seleccionado}
              onClick={() => setStressId(seleccionado ? null : s.id)}
              className={`rounded-xl border-2 p-2 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-600 ${
                seleccionado ? 'border-agua-500 bg-agua-50 shadow-md' : 'border-tierra-200 bg-white hover:bg-tierra-50'
              }`}
            >
              <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Icon name={ICONO[s.id] ?? 'alerta'} className="h-4 w-4 text-agua-700" />
                {s.nombre}
              </span>
              <span className="mt-0.5 block text-[11px] leading-tight text-slate-600">{s.descripcion}</span>
            </button>
          )
        })}
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-h-0 overflow-hidden rounded-2xl border border-tierra-200 bg-white/70 shadow-sm vertical:h-[32vh]!">
          <WatershedLandscape decisions={decisions} state={state} stressId={stressId} className="h-full w-full" />
        </div>
        <div className="min-h-0">
          {activo && stressResult ? (
            <SlideDeck
              slides={slides}
              accionFinal={
                <Button size="sm" variant="bosque" onClick={() => onNavigate('reflection')}>
                  <Icon name="gente" className="h-4 w-4" />
                  <span className="hidden sm:inline">¿Para quién es el agua?</span>
                </Button>
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-tierra-300 bg-white/60 p-4 text-center text-sm text-slate-600">
              Selecciona un escenario para ver cómo reaccionaría tu cuenca.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
