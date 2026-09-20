import { useMemo, useState } from 'react'

function prefiereMenosMovimiento() {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  } catch {
    return false
  }
}

/**
 * Fondo de burbujas de agua en CSS puro (reemplaza a tsParticles, mucho más
 * liviano). Respeta `prefers-reduced-motion`.
 * @param {{className?:string, cantidad?:number}} props
 */
export default function BubblesBackground({ className = '', cantidad = 16 }) {
  const [reducido] = useState(() => prefiereMenosMovimiento())
  const burbujas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        left: (i * 61) % 100,
        size: 6 + ((i * 13) % 22),
        delay: (i * 0.9) % 12,
        duration: 10 + ((i * 7) % 9),
        tono: i % 3 === 0 ? 'rgba(134, 239, 172, 0.45)' : 'rgba(147, 197, 253, 0.5)',
      })),
    [cantidad],
  )

  if (reducido) return null

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {burbujas.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            background: b.tono,
            boxShadow: 'inset 0 0 4px rgba(255,255,255,0.8)',
            animation: `bubble ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
