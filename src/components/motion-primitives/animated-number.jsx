// oxlint-disable react/static-components
// Adaptado del componente generado por `npx motion-primitives add animated-number`
// (el proyecto usa JavaScript/JSX, sin TypeScript ni alias `@/`).
import { useEffect, useMemo } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'

/**
 * Número animado con física de resorte (motion-primitives).
 * @param {{value:number, className?:string, as?:string, springOptions?:object}} props
 */
export function AnimatedNumber({ value, className = '', as = 'span', springOptions }) {
  // oxlint-disable-next-line react/static-components
  const MotionComponent = useMemo(() => motion.create(as), [as])
  const spring = useSpring(value, springOptions)
  const display = useTransform(spring, (actual) => Math.round(actual).toLocaleString())

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <MotionComponent className={`tabular-nums ${className}`}>{display}</MotionComponent>
}

export default AnimatedNumber
