import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'

const VARIANTES = {
  enter: (dir) => ({ x: dir > 0 ? '5%' : '-5%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-5%' : '5%', opacity: 0 }),
}

/**
 * Presentación por diapositivas: un bloque a la vez, transición animada,
 * indicador de progreso y navegación (botones + teclado ←/→).
 *
 * @param {{slides:Array<{id:string,titulo:string,contenido:import('react').ReactNode}>,
 *   accionFinal?:import('react').ReactNode, className?:string, onIndexChange?:(i:number)=>void}} props
 */
export default function SlideDeck({ slides, accionFinal = null, className = '', onIndexChange }) {
  const [indice, setIndice] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const total = slides.length

  const ir = useCallback(
    (destino) => {
      setIndice((prev) => {
        const siguiente = Math.max(0, Math.min(total - 1, destino))
        if (siguiente !== prev) setDireccion(siguiente > prev ? 1 : -1)
        return siguiente
      })
    },
    [total],
  )

  const anterior = useCallback(() => ir(indice - 1), [ir, indice])
  const siguiente = useCallback(() => ir(indice + 1), [ir, indice])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') siguiente()
      if (e.key === 'ArrowLeft') anterior()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [siguiente, anterior])

  useEffect(() => {
    onIndexChange?.(indice)
  }, [indice, onIndexChange])

  const slide = slides[indice]

  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direccion} initial={false}>
          <motion.div
            key={slide.id}
            custom={direccion}
            variants={VARIANTES}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="h-full"
          >
            {slide.contenido}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav
        aria-label="Navegación de diapositivas"
        className="mt-2 flex shrink-0 items-center justify-between gap-2"
      >
        <Button variant="secundario" size="sm" onClick={anterior} disabled={indice === 0}>
          <Icon name="flecha_izq" className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        <div className="flex min-w-0 flex-col items-center gap-1">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ir a ${s.titulo}`}
                aria-current={i === indice ? 'true' : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === indice ? 'w-6 bg-agua-600' : 'w-2.5 bg-tierra-300 hover:bg-tierra-400'
                }`}
              />
            ))}
          </div>
          <p className="truncate text-[11px] text-slate-500">
            {slide.titulo} · {indice + 1} de {total}
          </p>
        </div>

        {indice === total - 1 && accionFinal ? (
          accionFinal
        ) : (
          <Button size="sm" onClick={siguiente} disabled={indice === total - 1}>
            <span className="hidden sm:inline">Siguiente</span>
            <Icon name="flecha_der" className="h-4 w-4" />
          </Button>
        )}
      </nav>
    </div>
  )
}
