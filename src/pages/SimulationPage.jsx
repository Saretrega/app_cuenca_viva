import { categories } from '../data/categories.js'
import DecisionStep from '../components/decisions/DecisionStep.jsx'
import DecisionProgress from '../components/decisions/DecisionProgress.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

/**
 * Flujo de las siete decisiones con paisaje reactivo y resumen lateral.
 */
export default function SimulationPage({ sim, onNavigate }) {
  const { decisions, state, currentStep, setCurrentStep, setDecision, totalDecisiones } = sim
  const indice = Math.min(currentStep, totalDecisiones - 1)
  const category = categories[indice]
  const decision = decisions[category.categoria] ?? null

  const irAtras = () => {
    if (indice > 0) setCurrentStep(indice - 1)
    else onNavigate('home')
  }

  const irAdelante = () => {
    if (indice < totalDecisiones - 1) setCurrentStep(indice + 1)
    else onNavigate('results')
  }

  return (
    <div className="space-y-5">
      <DecisionProgress paso={indice} decisions={decisions} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="space-y-5">
          <DecisionStep
            key={category.categoria}
            category={category}
            decision={decision}
            paso={indice}
            total={totalDecisiones}
            onConfirm={setDecision}
            onBack={irAtras}
            onNext={irAdelante}
          />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-tierra-200 bg-white/70">
            <WatershedLandscape decisions={decisions} state={state} compacto />
          </div>

          <div className="rounded-2xl border border-tierra-200 bg-white p-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              <Icon name="check" className="h-5 w-5 text-bosque-600" />
              Tus decisiones
            </h3>
            <ul className="mt-2 space-y-1.5">
              {categories.map((c, i) => {
                const d = decisions[c.categoria]
                return (
                  <li key={c.categoria}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(i)}
                      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        i === indice ? 'border-agua-400 bg-agua-50' : 'border-transparent hover:bg-tierra-50'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          d ? 'bg-bosque-500 text-white' : 'bg-tierra-200 text-tierra-700'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate text-slate-700">
                        {d ? d.alternativa : c.categoria.replace(/^\d+\.\s*/, '')}
                      </span>
                      {d ? (
                        <span className="rounded-full bg-tierra-100 px-2 py-0.5 text-xs font-semibold text-tierra-800">
                          {d.ubicacion === 'alta' ? 'Alta' : d.ubicacion === 'media' ? 'Media' : 'Baja'}
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
            {state.completa ? (
              <Button className="mt-3 w-full" variant="bosque" onClick={() => onNavigate('results')}>
                Ver estado de mi cuenca
                <Icon name="flecha_der" className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  )
}
