// oxlint-disable react/static-components
// Adaptado del componente generado por `npx motion-primitives add animated-group`
// (el proyecto usa JavaScript/JSX, sin TypeScript ni alias `@/`).
import React, { useMemo } from 'react'
import { motion } from 'motion/react'

const defaultContainerVariants = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const defaultItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const presetVariants = {
  fade: {},
  slide: { hidden: { y: 20 }, visible: { y: 0 } },
  scale: { hidden: { scale: 0.8 }, visible: { scale: 1 } },
  blur: { hidden: { filter: 'blur(4px)' }, visible: { filter: 'blur(0px)' } },
  'blur-slide': { hidden: { filter: 'blur(4px)', y: 20 }, visible: { filter: 'blur(0px)', y: 0 } },
  zoom: { hidden: { scale: 0.5 }, visible: { scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } } },
  bounce: { hidden: { y: -50 }, visible: { y: 0, transition: { type: 'spring', stiffness: 400, damping: 10 } } },
  swing: { hidden: { rotate: -10 }, visible: { rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 8 } } },
}

const addDefaultVariants = (variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
})

/**
 * Aplica animaciones coordinadas (stagger) a un grupo de hijos (motion-primitives).
 * @param {{children:React.ReactNode, className?:string, variants?:object,
 *   preset?:string, as?:string, asChild?:string}} props
 */
export function AnimatedGroup({
  children,
  className,
  variants,
  preset,
  as = 'div',
  asChild = 'div',
}) {
  const selected = {
    item: addDefaultVariants(preset ? (presetVariants[preset] ?? {}) : {}),
    container: addDefaultVariants(defaultContainerVariants),
  }
  const containerVariants = variants?.container || selected.container
  const itemVariants = variants?.item || selected.item

  // oxlint-disable-next-line react/static-components
  const MotionComponent = useMemo(() => motion.create(as), [as])
  // oxlint-disable-next-line react/static-components
  const MotionChild = useMemo(() => motion.create(asChild), [asChild])

  return (
    <MotionComponent initial="hidden" animate="visible" variants={containerVariants} className={className}>
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  )
}

export default AnimatedGroup
