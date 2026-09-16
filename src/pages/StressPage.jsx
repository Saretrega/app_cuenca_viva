import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import StressTest from '../components/stress/StressTest.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

/**
 * Página de prueba de estrés climático con paisaje reactivo.
 */
export default function StressPage({ sim, onNavigate }) {
  const { state, decisions, stressId, setStressId, stressResult } = sim

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-tierra-200 bg-white/70">
        <WatershedLandscape decisions={decisions} state={state} stressId={stressId} />
      </div>

      <StressTest stressId={stressId} setStressId={setStressId} stressResult={stressResult} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secundario" onClick={() => onNavigate('results')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          Volver a resultados
        </Button>
        <Button variant="bosque" onClick={() => onNavigate('reflection')}>
          <Icon name="gente" className="h-4 w-4" />
          Continuar: ¿Para quién es el agua?
        </Button>
      </div>
    </div>
  )
}
