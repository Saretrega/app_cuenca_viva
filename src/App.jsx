import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import useWatershedSimulator from './hooks/useWatershedSimulator.js'
import HomePage from './pages/HomePage.jsx'
import HowItWorksPage from './pages/HowItWorksPage.jsx'
import SciencePage from './pages/SciencePage.jsx'
import SimulationPage from './pages/SimulationPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import StressPage from './pages/StressPage.jsx'
import ReflectionPage from './pages/ReflectionPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import Icon from './components/ui/Icon.jsx'

const NAV = [
  { id: 'home', label: 'Inicio', icono: 'casa' },
  { id: 'how', label: '¿Cómo funciona?', icono: 'libro' },
  { id: 'science', label: 'Ciencia', icono: 'medir' },
]

function renderPagina(page, sim, navigate) {
  switch (page) {
    case 'how':
      return <HowItWorksPage onNavigate={navigate} />
    case 'science':
      return <SciencePage onNavigate={navigate} />
    case 'simulation':
      return <SimulationPage sim={sim} onNavigate={navigate} />
    case 'results':
      return <ResultsPage sim={sim} onNavigate={navigate} />
    case 'stress':
      return <StressPage sim={sim} onNavigate={navigate} />
    case 'reflection':
      return <ReflectionPage sim={sim} onNavigate={navigate} />
    case 'compare':
      return <ComparePage sim={sim} onNavigate={navigate} />
    default:
      return <HomePage onNavigate={navigate} state={sim.state} decisions={sim.decisions} />
  }
}

export default function App() {
  const sim = useWatershedSimulator()
  const [page, setPage] = useState('home')

  const navigate = useCallback((destino) => {
    setPage(destino)
  }, [])

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-agua-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>

      <nav
        aria-label="Navegación principal"
        className="absolute left-1/2 top-2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-tierra-200 bg-white/80 p-1 shadow-sm backdrop-blur sm:top-3"
      >
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => navigate(n.id)}
            aria-label={n.label}
            aria-current={page === n.id ? 'page' : undefined}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-95 sm:px-3 ${
              page === n.id ? 'bg-agua-600 text-white' : 'text-slate-600 hover:bg-tierra-100'
            }`}
          >
            <Icon name={n.icono} className="h-4 w-4" />
            <span className="hidden md:inline">{n.label}</span>
          </button>
        ))}
      </nav>

      <main id="contenido" className="relative min-h-0 flex-1 overflow-hidden px-2 pb-2 pt-12 sm:px-3 sm:pb-3 sm:pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            {renderPagina(page, sim, navigate)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
