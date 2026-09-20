import { useState } from 'react'
import Particles, { ParticlesProvider, useParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

// Debe ser estable durante toda la vida de la app (requisito de ParticlesProvider).
const iniciarMotor = async (engine) => {
  await loadSlim(engine)
}

function prefiereMenosMovimiento() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function Capa({ className }) {
  const { loaded } = useParticlesProvider()
  if (!loaded) return null
  return (
    <Particles
      id="cuenca-particulas"
      className={className}
      options={{
        fpsLimit: 30,
        detectRetina: true,
        fullScreen: { enable: false },
        particles: {
          number: { value: 22, density: { enable: false } },
          color: { value: ['#7dd3fc', '#86efac', '#b6ddff'] },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.12, max: 0.38 } },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.5,
            direction: 'top',
            random: true,
            outModes: { default: 'out' },
          },
          links: { enable: false },
        },
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
      }}
    />
  )
}

/**
 * Fondo sutil de partículas (tsParticles, build slim). Ligero y opcional:
 * se desactiva con "prefers-reduced-motion" y usa pocas partículas sin enlaces.
 * @param {{className?:string}} props
 */
export default function ParticlesBackground({ className = '' }) {
  const [reducido] = useState(() => prefiereMenosMovimiento())
  if (reducido) return null
  return (
    <ParticlesProvider init={iniciarMotor}>
      <Capa className={className} />
    </ParticlesProvider>
  )
}
