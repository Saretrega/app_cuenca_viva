import { motion } from 'motion/react'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

const DESTINATARIOS = [
  { icono: 'gente', titulo: 'Personas y comunidades', texto: 'El agua de consumo, la salud y la vida cotidiana de quienes habitan la cuenca.' },
  { icono: 'pez', titulo: 'Ecosistemas y fauna', texto: 'Ríos, humedales y especies que dependen del caudal y la calidad del agua.' },
  { icono: 'cultivo', titulo: 'Agricultura', texto: 'Los cultivos y la seguridad alimentaria que necesitan agua y suelo sanos.' },
  { icono: 'fabrica', titulo: 'Actividades productivas', texto: 'Industria, minería y servicios que usan y transforman el territorio.' },
  { icono: 'corazon', titulo: 'Generaciones futuras', texto: 'Quienes heredarán la cuenca que decidimos hoy.' },
  { icono: 'agua', titulo: 'El propio río', texto: 'El ecosistema acuático como sujeto, no solo como recurso.' },
]

/**
 * Reflexión final "¿Para quién es el agua?".
 */
export default function ReflectionPage({ sim, onNavigate }) {
  const { reiniciar } = sim

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto short:gap-1.5!">
      <header className="shrink-0 text-center">
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black text-agua-900 short:text-[clamp(1.1rem,3.5vw,1.5rem)]!">
          ¿Para quién es el agua?
        </h1>
        <p className="mx-auto mt-1 max-w-2xl text-xs text-slate-700 short:hidden! sm:text-sm">
          El agua conecta todo el territorio. Cada decisión tomada en una parte de la cuenca puede
          afectar a quienes se encuentran aguas abajo.
        </p>
      </header>

      <section className="grid min-h-0 flex-1 grid-cols-1 content-center gap-2 short:grid-cols-3! short:gap-1.5! sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATARIOS.map((d, i) => (
          <motion.div
            key={d.titulo}
            className="flex items-start gap-3 rounded-2xl border border-tierra-200 bg-white p-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 28 }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-agua-50 text-agua-700">
              <Icon name={d.icono} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight text-slate-800">{d.titulo}</span>
              <span className="mt-0.5 block text-xs leading-tight text-slate-600">{d.texto}</span>
            </span>
          </motion.div>
        ))}
      </section>

      <blockquote className="shrink-0 rounded-2xl border border-agua-200 bg-agua-50 p-3 text-center text-xs font-semibold italic text-agua-900 short:hidden! sm:text-sm">
        Una cuenca está conectada. Lo que ocurre aguas arriba puede transformar lo que sucede aguas
        abajo. Cuidar el agua significa comprender esas conexiones.
      </blockquote>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="secundario" onClick={() => onNavigate('stress')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          Estrés
        </Button>
        <Button size="sm" onClick={() => onNavigate('compare')}>
          <Icon name="comparar" className="h-4 w-4" />
          Comparar escenarios
        </Button>
        <Button
          size="sm"
          variant="bosque"
          onClick={() => {
            reiniciar()
            onNavigate('simulation')
          }}
        >
          <Icon name="planta" className="h-4 w-4" />
          Probar otra cuenca
        </Button>
        <Button
          size="sm"
          variant="peligro"
          onClick={() => {
            reiniciar()
            onNavigate('home')
          }}
        >
          <Icon name="reiniciar" className="h-4 w-4" />
          Reiniciar
        </Button>
      </div>
    </div>
  )
}
