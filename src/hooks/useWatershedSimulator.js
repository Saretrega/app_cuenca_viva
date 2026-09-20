import { useCallback, useMemo } from 'react'
import { watershedMatrix } from '../data/watershedMatrix.js'
import { stressById } from '../data/stressScenarios.js'
import { TOTAL_DECISIONES } from '../data/categories.js'
import { calculateWatershedState } from '../logic/calculateWatershedState.js'
import { applyStressScenario } from '../logic/applyStressScenario.js'
import { generateNarrative } from '../logic/generateNarrative.js'
import { useLocalStorage } from './useLocalStorage.js'

/**
 * Estado central del simulador Cuenca Viva.
 * Recalcula el estado de la cuenca automáticamente al cambiar cualquier decisión.
 */
export function useWatershedSimulator() {
  const [decisions, setDecisions] = useLocalStorage('cuencaViva.decisions', {})
  const [currentStep, setCurrentStep] = useLocalStorage('cuencaViva.step', 0)
  const [stressId, setStressId] = useLocalStorage('cuencaViva.stress', null)
  const [savedScenarios, setSavedScenarios] = useLocalStorage('cuencaViva.scenarios', { A: null, B: null })

  const selecciones = useMemo(() => Object.values(decisions).filter(Boolean), [decisions])

  const state = useMemo(() => calculateWatershedState(selecciones, watershedMatrix), [selecciones])

  const stressResult = useMemo(() => {
    if (!stressId || !stressById[stressId]) return null
    return applyStressScenario(state, stressById[stressId])
  }, [state, stressId])

  const narrative = useMemo(() => generateNarrative(state), [state])

  const setDecision = useCallback(
    (categoria, alternativa, ubicacion) => {
      setDecisions((prev) => ({
        ...prev,
        [categoria]: { categoria, alternativa, ubicacion: String(ubicacion).toLowerCase() },
      }))
    },
    [setDecisions],
  )

  const removeDecision = useCallback(
    (categoria) => {
      setDecisions((prev) => {
        const copia = { ...prev }
        delete copia[categoria]
        return copia
      })
    },
    [setDecisions],
  )

  const reiniciar = useCallback(() => {
    setDecisions({})
    setCurrentStep(0)
    setStressId(null)
  }, [setDecisions, setCurrentStep, setStressId])

  const guardarEscenario = useCallback(
    (slot) => {
      setSavedScenarios((prev) => ({
        ...prev,
        [slot]: {
          slot,
          decisions: { ...decisions },
          stressId,
          fecha: new Date().toISOString(),
          resumen: state.totales,
        },
      }))
    },
    [decisions, stressId, state.totales, setSavedScenarios],
  )

  const cargarEscenario = useCallback(
    (slot) => {
      const guardado = savedScenarios[slot]
      if (!guardado) return false
      setDecisions(guardado.decisions ?? {})
      setStressId(guardado.stressId ?? null)
      setCurrentStep(TOTAL_DECISIONES)
      return true
    },
    [savedScenarios, setDecisions, setStressId, setCurrentStep],
  )

  const borrarEscenario = useCallback(
    (slot) => {
      setSavedScenarios((prev) => ({ ...prev, [slot]: null }))
    },
    [setSavedScenarios],
  )

  /** Carga un escenario compartido (desde la URL) como escenario resuelto. */
  const aplicarEscenario = useCallback(
    ({ decisions: dec, stressId: estr } = {}) => {
      setDecisions(dec ?? {})
      setStressId(estr ?? null)
      setCurrentStep(TOTAL_DECISIONES)
    },
    [setDecisions, setStressId, setCurrentStep],
  )

  return {
    decisions,
    selecciones,
    state,
    narrative,
    currentStep,
    setCurrentStep,
    stressId,
    setStressId,
    stressResult,
    savedScenarios,
    guardarEscenario,
    cargarEscenario,
    borrarEscenario,
    aplicarEscenario,
    setDecision,
    removeDecision,
    reiniciar,
    totalDecisiones: TOTAL_DECISIONES,
  }
}

export default useWatershedSimulator
