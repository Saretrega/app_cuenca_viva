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
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-black text-agua-900 sm:text-5xl">¿Para quién es el agua?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-700">
          El agua conecta todo el territorio. Cada decisión tomada en una parte de la cuenca puede
          afectar a quienes se encuentran aguas abajo.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATARIOS.map((d) => (
          <div key={d.titulo} className="rounded-2xl border border-tierra-200 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-agua-50 text-agua-700">
              <Icon name={d.icono} className="h-6 w-6" />
            </span>
            <h2 className="mt-3 font-bold text-slate-800">{d.titulo}</h2>
            <p className="mt-1 text-sm text-slate-600">{d.texto}</p>
          </div>
        ))}
      </section>

      <blockquote className="rounded-3xl border border-agua-200 bg-agua-50 p-6 text-center text-lg font-semibold italic text-agua-900">
        Una cuenca está conectada.
        <br />
        Lo que ocurre aguas arriba puede transformar lo que sucede aguas abajo.
        <br />
        Cuidar el agua significa comprender esas conexiones.
      </blockquote>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secundario" onClick={() => onNavigate('stress')}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          Volver a la prueba de estrés
        </Button>
        <Button onClick={() => onNavigate('compare')}>
          <Icon name="comparar" className="h-4 w-4" />
          Comparar escenarios
        </Button>
        <Button
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
          variant="peligro"
          onClick={() => {
            reiniciar()
            onNavigate('home')
          }}
        >
          <Icon name="reiniciar" className="h-4 w-4" />
          Reiniciar cuenca
        </Button>
      </div>
    </div>
  )
}
