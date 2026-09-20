import { motion } from 'framer-motion'

const VARIANTES = {
  primario:
    'bg-agua-600 text-white hover:bg-agua-700 focus-visible:outline-agua-700 shadow-sm hover:shadow-md',
  bosque:
    'bg-bosque-600 text-white hover:bg-bosque-700 focus-visible:outline-bosque-700 shadow-sm hover:shadow-md',
  secundario:
    'bg-white text-agua-800 border border-agua-300 hover:bg-agua-50 hover:border-agua-400 focus-visible:outline-agua-600',
  fantasma:
    'bg-transparent text-tierra-800 hover:bg-tierra-100 focus-visible:outline-tierra-600',
  peligro:
    'bg-deterioro-600 text-white hover:bg-deterioro-700 focus-visible:outline-deterioro-700 shadow-sm hover:shadow-md',
}

const TAMANOS = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
}

/**
 * Botón accesible con variantes y microinteracciones (Framer Motion):
 * se eleva al pasar el cursor y se comprime al hacer clic.
 */
export default function Button({
  children,
  variant = 'primario',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANTES[variant] ?? VARIANTES.primario} ${TAMANOS[size] ?? TAMANOS.md} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
