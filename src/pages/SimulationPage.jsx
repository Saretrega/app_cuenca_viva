import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { categories } from '../data/categories.js'
import DecisionStep from '../components/decisions/DecisionStep.jsx'
import DecisionProgress from '../components/decisions/DecisionProgress.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import Icon from '../components/ui/Icon.jsx'

const DURACION_EFECTO = 3400

/**
 * Flujo por fases: decisión (pantalla completa) → efecto animado sobre la cuenca
 * (sin datos) → siguiente decisión. Al terminar, resumen final.
 */
export default function SimulationPage({ sim, onNavigate }) {
  const { decisions, state, currentStep, setCurrentStep, setDecision, totalDecisiones } = sim
  const indice = Math.min(currentStep, totalDecisiones - 1)
  const category = categories[indice]

  const [fase, setFase] = useState('decision') // 'decision' | 'efecto'
  const [revision, setRevision] = useState(0)

  const avanzar = useCallback(() => {
    if (indice < totalDecisiones - 1) {
      setCurrentStep(indice + 1)
      setFase('decision')
    } else {
      onNavigate('results')
    }
  }, [indice, totalDecisiones, setCurrentStep, onNavigate])

  const confirmar = (alternativa, ubicacion) => {
    setDecision(category.categoria, alternativa, ubicacion)
    setRevision((r) => r + 1)
    setFase('efecto')
  }

  useEffect(() => {
    if (fase !== 'efecto') return undefined
    const t = setTimeout(avanzar, DURACION_EFECTO)
    return () => clearTimeout(t)
  }, [fase, avanzar])

  const irAtras = () => {
    if (indice > 0) {
      setCurrentStep(indice - 1)
      setFase('decision')
    } else {
      onNavigate('home')
    }
  }

  return (
    <div className="relative h-full min-h-0">
      <AnimatePresence mode="wait" initial={false}>
        {fase === 'decision' ? (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            <div className="flex h-full min-h-0 flex-col gap-3">
              <DecisionProgress paso={indice} decisions={decisions} />
              <div className="min-h-0 flex-1">
                <DecisionStep
                  key={category.categoria}
                  category={category}
                  decision={decisions[category.categoria] ?? null}
                  paso={indice}
                  total={totalDecisiones}
                  onContinue={confirmar}
                  onBack={irAtras}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="efecto"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full"
          >
            <button
              type="button"
              onClick={avanzar}
              aria-label="Saltar la animación y continuar"
              className="relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-tierra-200 bg-white/70"
            >
              <WatershedLandscape
                decisions={decisions}
                state={state}
                revision={revision}
                className="h-full w-full"
              />
              <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
                <Icon name="flecha_der" className="h-3.5 w-3.5" />
                Toca para continuar
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
