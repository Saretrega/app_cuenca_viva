import ResultsPanel from '../components/results/ResultsPanel.jsx'
import WatershedStory from '../components/results/WatershedStory.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import LazyWatershedChart from '../components/charts/LazyWatershedChart.jsx'
import SlideDeck from '../components/ui/SlideDeck.jsx'
import ShareButton from '../components/ui/ShareButton.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { COLOR_TRAMO, INDICADOR_CORTO, INDICADORES, TRAMOS } from '../data/dimensions.js'

/**
 * Página de resultados en formato diapositivas (cuenca/gráfico, estado por tramo e historia).
 */
export default function ResultsPage({ sim, onNavigate }) {
  const { state, narrative, decisions, stressId } = sim

  const slides = [
    {
      id: 'cuenca',
      titulo: 'Tu cuenca',
      contenido: (
        <div className="flex h-full min-h-0 flex-col gap-3 lg:flex-row">
          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-tierra-200 bg-white/70 shadow-sm vertical:h-[32vh]! vertical:flex-none!">
            <WatershedLandscape decisions={decisions} state={state} className="h-full w-full" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-2xl border border-tierra-200 bg-white p-2">
            <h3 className="shrink-0 text-sm font-bold text-slate-700">
              Puntajes acumulados por indicador y tramo
            </h3>
            <div className="min-h-0 flex-1 vertical:h-[28vh]! vertical:flex-none!">
              <LazyWatershedChart
                altura="100%"
                etiquetas={INDICADORES.map((i) => INDICADOR_CORTO[i])}
                series={TRAMOS.map((t) => ({
                  label: `Cuenca ${t[0].toUpperCase()}${t.slice(1)}`,
                  valores: INDICADORES.map((i) => state.totales[t][i]),
                  color: COLOR_TRAMO[t],
                }))}
                ariaLabel="Puntajes acumulados por indicador y tramo"
              />
            </div>
          </div>
        </div>
      ),
    },
    { id: 'estado', titulo: 'Estado por tramo', contenido: <ResultsPanel state={state} titulo={null} /> },
    { id: 'historia', titulo: 'Historia de tu cuenca', contenido: <WatershedStory narrative={narrative} titulo={false} /> },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 short:gap-1!">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-lg font-black text-agua-900 short:text-base! sm:text-2xl">
          <Icon name="medir" className="h-6 w-6" />
          Resumen de tu cuenca
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secundario" onClick={() => onNavigate('simulation')}>
            <Icon name="flecha_izq" className="h-4 w-4" />
            <span className="hidden sm:inline">Revisar decisiones</span>
          </Button>
          <ShareButton decisions={decisions} stressId={stressId} />
          <Button size="sm" variant="bosque" onClick={() => onNavigate('reflection')}>
            <Icon name="gente" className="h-4 w-4" />
            <span className="hidden sm:inline">¿Para quién es el agua?</span>
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <SlideDeck
          slides={slides}
          accionFinal={
            <Button size="sm" onClick={() => onNavigate('stress')}>
              <Icon name="lluvia" className="h-4 w-4" />
              <span className="hidden sm:inline">Probar estrés climático</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}
