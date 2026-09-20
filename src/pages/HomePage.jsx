import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import WatershedLandscape from '../components/watershed/WatershedLandscape.jsx'
import LazyParticles from '../components/media/LazyParticles.jsx'

const TRAMOS_INFO = [
  { icono: 'montana', titulo: 'Cuenca Alta', texto: 'Nacimientos y bosques.' },
  { icono: 'cultivo', titulo: 'Cuenca Media', texto: 'Valles y comunidades.' },
  { icono: 'agua', titulo: 'Cuenca Baja', texto: 'Planicie y desembocadura.' },
]

const contenedor = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
}

/**
 * Página de inicio (layout fluido, se apila en pantallas angostas).
 */
export default function HomePage({ onNavigate, state, decisions }) {
  return (
    <div className="relative h-full w-full">
      <LazyParticles className="pointer-events-none absolute inset-0" />
      <div className="relative flex h-full min-h-0 flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-8">
        <motion.section
          className="flex shrink-0 flex-col justify-center gap-2 lg:min-h-0 lg:flex-1"
          variants={contenedor}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={item}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-agua-100 px-3 py-1 text-xs font-semibold text-agua-800 sm:text-sm"
          >
            <Icon name="agua" className="h-4 w-4" />
            Simulador educativo de cuencas hidrográficas
          </motion.p>
          <motion.h1
            variants={item}
            className="text-[clamp(2rem,7vw,4.5rem)] font-black leading-none tracking-tight text-agua-900"
          >
            CUENCA VIVA
          </motion.h1>
          <motion.p
            variants={item}
            className="text-[clamp(1rem,2.4vw,1.6rem)] font-semibold text-bosque-700"
          >
            Cada decisión deja huella en el agua.
          </motion.p>
          <motion.p variants={item} className="max-w-2xl text-sm text-slate-700 sm:text-base">
            Construye una cuenca, toma decisiones y descubre cómo nuestras acciones pueden transformar
            el agua, la biodiversidad y la capacidad del territorio para enfrentar eventos extremos.
          </motion.p>
          <motion.div variants={item} className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
            <Button size="md" onClick={() => onNavigate('simulation')}>
              <Icon name="jugar" className="h-5 w-5" />
              Comenzar simulación
            </Button>
            <Button size="md" variant="secundario" onClick={() => onNavigate('how')}>
              <Icon name="libro" className="h-5 w-5" />
              ¿Cómo funciona?
            </Button>
            <Button size="md" variant="fantasma" onClick={() => onNavigate('science')}>
              <Icon name="medir" className="h-5 w-5" />
              Ciencia
            </Button>
          </motion.div>
          <motion.div variants={item} className="mt-2 grid grid-cols-3 gap-2">
            {TRAMOS_INFO.map((c) => (
              <div key={c.titulo} className="rounded-2xl border border-tierra-200 bg-white/80 p-2 sm:p-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm">
                  <Icon name={c.icono} className="h-4 w-4 shrink-0 text-agua-700" />
                  <span className="truncate">{c.titulo}</span>
                </span>
                <p className="mt-0.5 hidden text-[11px] text-slate-600 sm:block">{c.texto}</p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="min-h-0 flex-1 lg:flex-1"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
          <div className="h-full min-h-[150px] w-full overflow-hidden rounded-3xl border border-tierra-200 bg-white/70 shadow-sm">
            <WatershedLandscape decisions={decisions} state={state} className="h-full w-full" />
          </div>
        </motion.section>
      </div>
    </div>
  )
}
