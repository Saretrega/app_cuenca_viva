import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'

/**
 * Página de inicio.
 */
export default function HomePage({ onNavigate, state, decisions }) {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-agua-100 px-4 py-1.5 text-sm font-semibold text-agua-800">
          <Icon name="agua" className="h-4 w-4" />
          Simulador educativo de cuencas hidrográficas
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-agua-900 sm:text-6xl">
          CUENCA VIVA
        </h1>
        <p className="mt-2 text-xl font-semibold text-bosque-700">
          Cada decisión deja huella en el agua.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-slate-700">
          Construye una cuenca, toma decisiones y descubre cómo nuestras acciones pueden transformar
          el agua, la biodiversidad y la capacidad del territorio para enfrentar eventos extremos.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={() => onNavigate('simulation')}>
            <Icon name="jugar" className="h-5 w-5" />
            Comenzar simulación
          </Button>
          <Button size="lg" variant="secundario" onClick={() => onNavigate('how')}>
            <Icon name="libro" className="h-5 w-5" />
            ¿Cómo funciona?
          </Button>
          <Button size="lg" variant="fantasma" onClick={() => onNavigate('science')}>
            <Icon name="medir" className="h-5 w-5" />
            Ciencia detrás de Cuenca Viva
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-tierra-200 bg-white/70 shadow-sm">
        <WatershedLandscape decisions={decisions} state={state} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icono: 'montana', titulo: 'Cuenca Alta', texto: 'Nacimientos y bosques. Lo que ocurre aquí viaja aguas abajo.' },
          { icono: 'cultivo', titulo: 'Cuenca Media', texto: 'Valles y comunidades. Zona de tránsito y transformación.' },
          { icono: 'agua', titulo: 'Cuenca Baja', texto: 'Planicie y desembocadura. Recibe todo lo acumulado.' },
        ].map((c) => (
          <div key={c.titulo} className="rounded-2xl border border-tierra-200 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-agua-50 text-agua-700">
              <Icon name={c.icono} className="h-6 w-6" />
            </span>
            <h2 className="mt-3 text-lg font-bold text-slate-800">{c.titulo}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.texto}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
