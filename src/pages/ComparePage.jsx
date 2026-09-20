import { useMemo } from 'react'
import { calculateWatershedState } from '../logic/calculateWatershedState.js'
import { watershedMatrix } from '../data/watershedMatrix.js'
import { INDICADOR_CORTO, INDICADOR_ICONO, TRAMO_LABEL, TRAMOS, INDICADORES } from '../data/dimensions.js'
import ClassificationBadge from '../components/ui/ClassificationBadge.jsx'
import SlideDeck from '../components/ui/SlideDeck.jsx'
import ShareButton from '../components/ui/ShareButton.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

function estadoDe(guardado) {
  if (!guardado?.decisions) return null
  return calculateWatershedState(Object.values(guardado.decisions), watershedMatrix)
}

function TarjetaEscenario({ slot, guardado, estado, onGuardar, onCargar, onBorrar }) {
  return (
    <div className="flex min-h-0 flex-col rounded-2xl border border-tierra-200 bg-white p-3">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-slate-800">Escenario {slot}</h3>
        <div className="flex gap-1.5">
          <Button size="sm" variant="secundario" onClick={() => onCargar(slot)} disabled={!guardado}>
            Cargar
          </Button>
          <Button size="sm" onClick={() => onGuardar(slot)}>
            Guardar
          </Button>
          <Button size="sm" variant="fantasma" onClick={() => onBorrar(slot)} disabled={!guardado}>
            <Icon name="close" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-1 shrink-0 text-[11px] text-slate-500">
        {guardado
          ? `Guardado el ${new Date(guardado.fecha).toLocaleString('es-CO')}`
          : 'Aún no has guardado este escenario.'}
      </p>

      {estado ? (
        <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
          {TRAMOS.map((t) => (
            <div key={t} className="rounded-xl bg-tierra-50 p-2">
              <p className="text-[11px] font-bold text-tierra-800">{TRAMO_LABEL[t]}</p>
              <ul className="mt-1 space-y-1">
                {INDICADORES.map((ind) => (
                  <li key={ind} className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1 text-[10px] text-slate-600">
                      <Icon name={INDICADOR_ICONO[ind]} className="h-3 w-3 text-agua-600" />
                      {INDICADOR_CORTO[ind]}
                    </span>
                    <ClassificationBadge clasificacion={estado.clasificaciones[t][ind]} compacto />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Comparación de escenarios A y B en formato diapositivas.
 */
export default function ComparePage({ sim, onNavigate }) {
  const { savedScenarios, guardarEscenario, cargarEscenario, borrarEscenario, reiniciar, decisions, stressId } = sim

  const estadoA = useMemo(() => estadoDe(savedScenarios.A), [savedScenarios.A])
  const estadoB = useMemo(() => estadoDe(savedScenarios.B), [savedScenarios.B])
  const comparables = estadoA && estadoB

  const slides = [
    {
      id: 'escenarios',
      titulo: 'Escenarios A y B',
      contenido: (
        <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-2">
          <TarjetaEscenario
            slot="A"
            guardado={savedScenarios.A}
            estado={estadoA}
            onGuardar={guardarEscenario}
            onCargar={cargarEscenario}
            onBorrar={borrarEscenario}
          />
          <TarjetaEscenario
            slot="B"
            guardado={savedScenarios.B}
            estado={estadoB}
            onGuardar={guardarEscenario}
            onCargar={cargarEscenario}
            onBorrar={borrarEscenario}
          />
        </div>
      ),
    },
    {
      id: 'comparacion',
      titulo: 'Comparación detallada',
      contenido: comparables ? (
        <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-tierra-200 bg-white">
          <table className="h-full w-full text-[11px]">
            <caption className="sr-only">Comparación de escenarios A y B</caption>
            <thead className="bg-tierra-50 text-left text-slate-600">
              <tr>
                <th className="px-2 py-1.5 font-semibold">Indicador / tramo</th>
                <th className="px-2 py-1.5 text-center font-semibold">Escenario A</th>
                <th className="px-2 py-1.5 text-center font-semibold">Escenario B</th>
              </tr>
            </thead>
            <tbody>
              {TRAMOS.map((t) =>
                INDICADORES.map((ind) => (
                  <tr key={`${t}-${ind}`} className="border-t border-tierra-100">
                    <td className="px-2 py-1 text-slate-700">
                      {INDICADOR_CORTO[ind]} · {TRAMO_LABEL[t]}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <ClassificationBadge clasificacion={estadoA.clasificaciones[t][ind]} compacto />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <ClassificationBadge clasificacion={estadoB.clasificaciones[t][ind]} compacto />
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-tierra-300 bg-white/60 p-4 text-center text-sm text-slate-600">
          Guarda los dos escenarios para ver la comparación detallada.
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-black text-agua-900 sm:text-2xl">
            <Icon name="comparar" className="h-6 w-6" />
            Comparar escenarios
          </h1>
          <p className="text-xs text-slate-600 sm:text-sm">
            Guarda tu cuenca actual como Escenario A o B y compáralas. Se almacenan en este navegador.
          </p>
        </div>
        <Button size="sm" variant="secundario" onClick={() => onNavigate('reflection')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <ShareButton decisions={decisions} stressId={stressId} />
      </header>

      <div className="min-h-0 flex-1">
        <SlideDeck
          slides={slides}
          accionFinal={
            <Button
              size="sm"
              variant="bosque"
              onClick={() => {
                reiniciar()
                onNavigate('simulation')
              }}
            >
              <Icon name="planta" className="h-4 w-4" />
              <span className="hidden sm:inline">Probar otra cuenca</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}
