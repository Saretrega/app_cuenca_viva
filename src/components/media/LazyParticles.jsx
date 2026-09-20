import { Suspense, lazy } from 'react'

const ParticlesBackground = lazy(() => import('./ParticlesBackground.jsx'))

/**
 * Carga diferida del fondo de partículas (tsParticles en su propio chunk).
 */
export default function LazyParticles(props) {
  return (
    <Suspense fallback={null}>
      <ParticlesBackground {...props} />
    </Suspense>
  )
}
