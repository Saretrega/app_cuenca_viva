import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { categories } from '../data/categories.js'
import DecisionStep from '../components/decisions/DecisionStep.jsx'
import DecisionProgress from '../components/decisions/DecisionProgress.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import Icon from '../components/ui/Icon.jsx'
import useAutoAdvance from '../hooks/useAutoAdvance.js'

const DURACION_AUTOAVANCE = 30000

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

  const { pausado, ciclo, reiniciar, alternarPausa } = useAutoAdvance(
    DURACION_AUTOAVANCE,
    avanzar,
    fase === 'efecto',
  )

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
            <div className="flex h-full min-h-0 flex-col gap-3 short:gap-1.5!">
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
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl border border-tierra-200 bg-white/70"
              onPointerDown={reiniciar}
            >
              <WatershedLandscape
                decisions={decisions}
                state={state}
                revision={revision}
                className="h-full w-full"
              />
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
                <button
                  type="button"
                  onClick={alternarPausa}
                  aria-label={pausado ? 'Reanudar avance automático' : 'Pausar avance automático'}
                  title={pausado ? 'Reanudar avance automático' : 'Pausar avance automático'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/85 text-slate-600 shadow-sm backdrop-blur hover:bg-white"
                >
                  <Icon name={pausado ? 'jugar' : 'pausa'} className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={avanzar}
                  className="flex items-center gap-1.5 rounded-full bg-white/85 py-1 pl-1 pr-3 text-xs font-medium text-slate-700 shadow-sm backdrop-blur hover:bg-white"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="#e2d9c6" strokeWidth="2.4" />
                    {pausado ? (
                      <circle cx="10" cy="10" r="8" fill="none" stroke="#94a3b8" strokeWidth="2.4" strokeDasharray="1.6 3" />
                    ) : (
                      <motion.circle
                        key={ciclo}
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke="#0f68cd"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: DURACION_AUTOAVANCE / 1000, ease: 'linear' }}
                      />
                    )}
                  </svg>
                  Continuar
                  <Icon name="flecha_der" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
