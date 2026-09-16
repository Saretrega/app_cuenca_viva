import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { categories } from '../data/categories.js'

const PASOS = [
  { icono: 'agua', titulo: 'Elige una alternativa', texto: 'Para cada una de las siete decisiones ambientales.' },
  { icono: 'montana', titulo: 'Elige dónde ocurre', texto: 'En cuenca alta, media o baja. La ubicación cambia el efecto.' },
  { icono: 'medir', titulo: 'Observa el efecto', texto: 'La matriz muestra los 12 efectos reales de esa combinación.' },
  { icono: 'comparar', titulo: 'Compara y reflexiona', texto: 'Prueba estrés climático y compara escenarios.' },
]

/**
 * Página "¿Cómo funciona?".
 */
export default function HowItWorksPage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-black text-agua-900">¿Cómo funciona Cuenca Viva?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-700">
          No es un cuestionario: estás construyendo y transformando una cuenca. Toma siete decisiones
          ambientales y observa cómo se conectan aguas abajo.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((p, i) => (
          <div key={p.titulo} className="rounded-2xl border border-tierra-200 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bosque-100 text-bosque-700">
              <Icon name={p.icono} className="h-6 w-6" />
            </span>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-agua-700">Paso {i + 1}</p>
            <h2 className="text-lg font-bold text-slate-800">{p.titulo}</h2>
            <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-tierra-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <Icon name="montana" className="h-5 w-5 text-agua-700" />
          Las siete decisiones
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c.categoria} className="flex items-start gap-3 rounded-xl bg-tierra-50 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-agua-100 text-agua-700">
                <Icon name={c.icono} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-slate-800">{c.categoria.replace(/^\d+\.\s*/, '')}</span>
                <span className="block text-sm text-slate-600">{c.eje}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <Button size="lg" onClick={() => onNavigate('simulation')}>
          <Icon name="jugar" className="h-5 w-5" />
          Comenzar simulación
        </Button>
      </div>
    </div>
  )
}
