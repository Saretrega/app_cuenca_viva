import { MorphIcon } from 'morphicons/react'

// Iconos de un solo trazo que se transforman con física de resorte.
const ESTABLE = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
const ALERTA = 'M12 2 2 20h20L12 2z'

/**
 * Icono de estado que se transforma (Morphicons): escudo "estable" ↔ triángulo
 * "alerta". Cambia de forma con una transición de resorte al variar la métrica.
 * @param {{alerta?:boolean, className?:string, title?:string, size?:number|string}} props
 */
export default function StateMorphIcon({ alerta = false, className = '', title, size = 18 }) {
  return (
    <MorphIcon
      icon={alerta ? ALERTA : ESTABLE}
      size={size}
      strokeWidth={1.9}
      color="currentColor"
      className={className}
      label={title}
      reducedMotion="user"
    />
  )
}
