import { useMemo } from 'react'
import { calculateWatershedState } from '../logic/calculateWatershedState.js'
import { watershedMatrix } from '../data/watershedMatrix.js'
import { INDICADOR_LABEL, INDICADOR_ICONO, TRAMO_LABEL, TRAMOS, INDICADORES } from '../data/dimensions.js'
import ClassificationBadge from '../components/ui/ClassificationBadge.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

function estadoDe(guardado) {
  if (!guardado?.decisions) return null
  return calculateWatershedState(Object.values(guardado.decisions), watershedMatrix)
}

function TarjetaEscenario({ slot, guardado, estado, onGuardar, onCargar, onBorrar }) {
  return (
    <div className="rounded-2xl border border-tierra-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Escenario {slot}</h3>
        <div className="flex gap-2">
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
      {guardado ? (
        <p className="mt-2 text-xs text-slate-500">
          Guardado el {new Date(guardado.fecha).toLocaleString('es-CO')}
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Aún no has guardado este escenario.</p>
      )}

      {estado ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {TRAMOS.map((t) => (
            <div key={t} className="rounded-xl bg-tierra-50 p-3">
              <p className="text-sm font-bold text-tierra-800">{TRAMO_LABEL[t]}</p>
              <ul className="mt-2 space-y-1.5">
                {INDICADORES.map((ind) => (
                  <li key={ind} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Icon name={INDICADOR_ICONO[ind]} className="h-3.5 w-3.5 text-agua-600" />
                      {INDICADOR_LABEL[ind].split(' ')[0]}
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
 * Comparación de escenarios A y B guardados en localStorage.
 */
export default function ComparePage({ sim, onNavigate }) {
  const { savedScenarios, guardarEscenario, cargarEscenario, borrarEscenario, reiniciar } = sim

  const estadoA = useMemo(() => estadoDe(savedScenarios.A), [savedScenarios.A])
  const estadoB = useMemo(() => estadoDe(savedScenarios.B), [savedScenarios.B])

  const comparables = estadoA && estadoB

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-black text-agua-900">
          <Icon name="comparar" className="h-7 w-7" />
          Comparar escenarios
        </h1>
        <p className="mt-2 text-slate-700">
          Guarda tu cuenca actual como Escenario A o B y compáralas lado a lado. Se almacenan
          temporalmente en este navegador.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
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

      {comparables ? (
        <section className="overflow-x-auto rounded-2xl border border-tierra-200 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Comparación de escenarios A y B</caption>
            <thead className="bg-tierra-50 text-left text-slate-600">
              <tr>
                <th className="px-3 py-2 font-semibold">Indicador / tramo</th>
                <th className="px-3 py-2 text-center font-semibold">Escenario A</th>
                <th className="px-3 py-2 text-center font-semibold">Escenario B</th>
              </tr>
            </thead>
            <tbody>
              {TRAMOS.map((t) =>
                INDICADORES.map((ind) => (
                  <tr key={`${t}-${ind}`} className="border-t border-tierra-100">
                    <td className="px-3 py-2 text-slate-700">
                      {INDICADOR_LABEL[ind]} · {TRAMO_LABEL[t]}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <ClassificationBadge clasificacion={estadoA.clasificaciones[t][ind]} compacto />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <ClassificationBadge clasificacion={estadoB.clasificaciones[t][ind]} compacto />
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </section>
      ) : (
        <p className="rounded-2xl border border-dashed border-tierra-300 bg-white/60 p-4 text-center text-slate-600">
          Guarda los dos escenarios para ver la comparación detallada.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secundario" onClick={() => onNavigate('reflection')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          Volver
        </Button>
        <Button
          variant="bosque"
          onClick={() => {
            reiniciar()
            onNavigate('simulation')
          }}
        >
          <Icon name="planta" className="h-4 w-4" />
          Probar otra cuenca
        </Button>
      </div>
    </div>
  )
}
