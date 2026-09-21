import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import SlideDeck from '../components/ui/SlideDeck.jsx'
import { categories } from '../data/categories.js'

const PASOS = [
  { icono: 'agua', titulo: 'Elige una alternativa', texto: 'Para cada una de las siete decisiones ambientales.' },
  { icono: 'montana', titulo: 'Elige dónde ocurre', texto: 'En cuenca alta, media o baja: la ubicación cambia el efecto.' },
  { icono: 'medir', titulo: 'Observa los cambios', texto: 'La cuenca reacciona y verás el efecto de esa combinación.' },
  { icono: 'comparar', titulo: 'Compara y reflexiona', texto: 'Prueba estrés climático y compara escenarios.' },
]

const IDEAS = [
  { icono: 'montana', titulo: 'Aguas arriba → aguas abajo', texto: 'Lo que pasa en la cuenca alta viaja hacia la media y la baja.' },
  { icono: 'gente', titulo: 'Decisiones, no datos', texto: 'Tú construyes la cuenca eligiendo alternativas y ubicaciones.' },
  { icono: 'medir', titulo: '12 efectos por decisión', texto: 'Cuatro indicadores en tres tramos, según la matriz.' },
]

function Tarjeta({ icono, titulo, texto }) {
  return (
    <div className="flex min-h-0 flex-col gap-1.5 rounded-2xl border border-tierra-200 bg-white p-3 short:gap-0.5! short:p-2!">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bosque-100 text-bosque-700 short:h-7! short:w-7!">
        <Icon name={icono} className="h-5 w-5" />
      </span>
      <h3 className="text-sm font-bold leading-tight text-slate-800">{titulo}</h3>
      <p className="text-xs leading-tight text-slate-600 short:hidden!">{texto}</p>
    </div>
  )
}

/**
 * Página "¿Cómo funciona?" en formato diapositivas.
 */
export default function HowItWorksPage({ onNavigate }) {
  const slides = [
    {
      id: 'intro',
      titulo: '¿Qué es Cuenca Viva?',
      contenido: (
        <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 text-center short:gap-1.5!">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-agua-100 text-agua-700 short:hidden!">
            <Icon name="agua" className="h-8 w-8" />
          </span>
          <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black text-agua-900 short:text-[clamp(1.1rem,3.5vw,1.5rem)]!">
            Construye y transforma una cuenca
          </h2>
          <p className="max-w-2xl text-sm text-slate-700 short:hidden! sm:text-base">
            No es un cuestionario: tomas siete decisiones ambientales y observas cómo se conectan
            aguas abajo, transformando el agua, la biodiversidad y el territorio.
          </p>
          <div className="grid w-full max-w-4xl grid-cols-1 gap-2 short:gap-1! sm:grid-cols-3">
            {IDEAS.map((c) => (
              <Tarjeta key={c.titulo} {...c} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'pasos',
      titulo: 'Así se juega',
      contenido: (
        <div className="flex h-full min-h-0 flex-col gap-3 short:gap-1.5!">
          <h2 className="shrink-0 text-center text-[clamp(1.25rem,3vw,2rem)] font-black text-agua-900 short:text-[clamp(1rem,2.6vw,1.3rem)]!">
            Cuatro pasos por cada decisión
          </h2>
          <div className="grid min-h-0 flex-1 grid-cols-1 content-center gap-2 short:grid-cols-2! short:gap-1.5! sm:grid-cols-2 xl:grid-cols-4">
            {PASOS.map((p, i) => (
              <div key={p.titulo} className="flex min-h-0 flex-col gap-1.5 rounded-2xl border border-tierra-200 bg-white p-3 short:gap-0.5! short:p-2!">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-agua-100 text-agua-700 short:h-7! short:w-7!">
                    <Icon name={p.icono} className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-agua-700">
                    Paso {i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold leading-tight text-slate-800">{p.titulo}</h3>
                <p className="text-xs leading-tight text-slate-600 short:hidden!">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'decisiones',
      titulo: 'Las siete decisiones',
      contenido: (
        <div className="flex h-full min-h-0 flex-col gap-3 short:gap-1.5!">
          <h2 className="shrink-0 text-center text-[clamp(1.25rem,3vw,2rem)] font-black text-agua-900 short:text-[clamp(1rem,2.6vw,1.3rem)]!">
            Las siete decisiones
          </h2>
          <div className="grid min-h-0 flex-1 grid-cols-1 content-center gap-2 short:grid-cols-2! short:gap-1! sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((c) => (
              <div key={c.categoria} className="flex min-h-0 items-start gap-2 rounded-2xl bg-tierra-50 p-2.5 short:p-1.5!">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-agua-100 text-agua-700">
                  <Icon name={c.icono} className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight text-slate-800">
                    {c.categoria.replace(/^\d+\.\s*/, '')}
                  </span>
                  <span className="block text-[11px] leading-tight text-slate-600">{c.eje}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <SlideDeck
      slides={slides}
      accionFinal={
        <Button size="sm" onClick={() => onNavigate('simulation')}>
          <Icon name="jugar" className="h-4 w-4" />
          <span className="hidden sm:inline">Comenzar simulación</span>
        </Button>
      }
    />
  )
}
