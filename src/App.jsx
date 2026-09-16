import { useCallback, useState } from 'react'
import useWatershedSimulator from './hooks/useWatershedSimulator.js'
import HomePage from './pages/HomePage.jsx'
import HowItWorksPage from './pages/HowItWorksPage.jsx'
import SciencePage from './pages/SciencePage.jsx'
import SimulationPage from './pages/SimulationPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import StressPage from './pages/StressPage.jsx'
import ReflectionPage from './pages/ReflectionPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import Button from './components/ui/Button.jsx'
import Icon from './components/ui/Icon.jsx'

const NAV = [
  { id: 'home', label: 'Inicio' },
  { id: 'how', label: '¿Cómo funciona?' },
  { id: 'science', label: 'Ciencia' },
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
  const { presentationMode, setPresentationMode } = sim

  const navigate = useCallback((destino) => {
    setPage(destino)
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      // scrollTo no disponible (p. ej. jsdom): se ignora
    }
  }, [])

  return (
    <div className={presentationMode ? 'min-h-svh text-lg' : 'min-h-svh'}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-agua-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>

      {!presentationMode ? (
        <header className="sticky top-0 z-40 border-b border-tierra-200 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-left"
              aria-label="Ir al inicio de Cuenca Viva"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-agua-600 text-white">
                <Icon name="agua" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-black leading-none text-agua-900">CUENCA VIVA</span>
                <span className="block text-xs text-slate-500">Cada decisión deja huella en el agua</span>
              </span>
            </button>

            <nav aria-label="Navegación principal" className="flex items-center gap-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => navigate(n.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    page === n.id ? 'bg-agua-100 text-agua-800' : 'text-slate-600 hover:bg-tierra-100'
                  }`}
                >
                  {n.label}
                </button>
              ))}
              <Button
                size="sm"
                variant="secundario"
                className="ml-1"
                onClick={() => setPresentationMode(true)}
                title="Modo presentación"
              >
                <Icon name="medir" className="h-4 w-4" />
                Presentación
              </Button>
            </nav>
          </div>
        </header>
      ) : (
        <button
          type="button"
          onClick={() => setPresentationMode(false)}
          className="fixed right-4 top-4 z-50 rounded-full bg-slate-800/80 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
        >
          Salir de presentación
        </button>
      )}

      <main
        id="contenido"
        className={`mx-auto w-full px-4 py-6 ${presentationMode ? 'max-w-6xl py-10 text-xl' : 'max-w-7xl'}`}
      >
        {renderPagina(page, sim, navigate)}
      </main>

      {!presentationMode ? (
        <footer className="border-t border-tierra-200 bg-white/70">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500">
            <p>
              Cuenca Viva · Simulador educativo de escenarios. Los resultados no son mediciones
              reales ni sustituyen evaluaciones ambientales oficiales.
            </p>
            <p className="mt-1">
              {sim.state.seleccionadas} de {sim.totalDecisiones} decisiones registradas.
            </p>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
