import ResultsPanel from '../components/results/ResultsPanel.jsx'
import WatershedStory from '../components/results/WatershedStory.jsx'
import CauseEffectList from '../components/results/CauseEffectList.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

/**
 * Página de resultados: estado, historia y causa-efecto.
 */
export default function ResultsPage({ sim, onNavigate }) {
  const { state, narrative, decisions } = sim

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-tierra-200 bg-white/70">
        <WatershedLandscape decisions={decisions} state={state} />
      </div>

      <ResultsPanel state={state} />
      <WatershedStory narrative={narrative} />
      <CauseEffectList detalles={state.detalles} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secundario" onClick={() => onNavigate('simulation')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          Revisar decisiones
        </Button>
        <Button onClick={() => onNavigate('stress')}>
          <Icon name="lluvia" className="h-4 w-4" />
          Probar estrés climático
        </Button>
        <Button variant="bosque" onClick={() => onNavigate('reflection')}>
          <Icon name="gente" className="h-4 w-4" />
          ¿Para quién es el agua?
        </Button>
      </div>
    </div>
  )
}
