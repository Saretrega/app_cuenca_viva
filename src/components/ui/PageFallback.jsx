/**
 * Fallback liviano mientras carga una página diferida (React.lazy).
 */
export default function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center" role="status" aria-label="Cargando página">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-agua-200 border-t-agua-600" />
    </div>
  )
}
