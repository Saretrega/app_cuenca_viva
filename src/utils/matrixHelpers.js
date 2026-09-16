import { watershedMatrix } from '../data/watershedMatrix.js'

/** Busca un registro exacto de la matriz. */
export function buscarRegistro(categoria, alternativa, ubicacion) {
  const ubi = String(ubicacion || '').toLowerCase()
  return (
    watershedMatrix.find(
      (r) => r.categoria === categoria && r.alternativa === alternativa && r.ubicacion === ubi,
    ) ?? null
  )
}

/** Devuelve la justificación técnica de una alternativa (igual en sus tres tramos). */
export function justificacionDeAlternativa(categoria, alternativa) {
  return (
    watershedMatrix.find((r) => r.categoria === categoria && r.alternativa === alternativa)
      ?.justificacion ?? ''
  )
}

/** Lista los registros de una categoría. */
export function registrosDeCategoria(categoria) {
  return watershedMatrix.filter((r) => r.categoria === categoria)
}
