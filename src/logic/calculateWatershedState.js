import { clasificarTotales } from './classify.js'
import { crearTotalesVacios, INDICADORES, TRAMOS } from '../data/dimensions.js'

/** Clave única para localizar un registro de la matriz. */
export function claveMatriz(categoria, alternativa, ubicacion) {
  return `${categoria}||${alternativa}||${String(ubicacion).toLowerCase()}`
}

/** Índice id -> registro y clave -> registro (se construye una sola vez). */
let _indice = null
let _matrizRef = null
function getIndice(matrix) {
  if (_indice && _matrizRef === matrix) return _indice
  const idx = { byKey: new Map(), byId: new Map() }
  for (const rec of matrix) {
    idx.byId.set(rec.id, rec)
    idx.byKey.set(claveMatriz(rec.categoria, rec.alternativa, rec.ubicacion), rec)
  }
  _indice = idx
  _matrizRef = matrix
  return idx
}

/** Acepta un array de decisiones o un objeto indexado por categoría. */
export function normalizarSelecciones(selections) {
  if (!selections) return []
  if (Array.isArray(selections)) {
    return selections.filter(Boolean).map((s) => ({
      categoria: s.categoria,
      alternativa: s.alternativa,
      ubicacion: String(s.ubicacion || '').toLowerCase(),
    }))
  }
  return Object.values(selections)
    .filter((s) => s && s.categoria && s.alternativa && s.ubicacion)
    .map((s) => ({
      categoria: s.categoria,
      alternativa: s.alternativa,
      ubicacion: String(s.ubicacion).toLowerCase(),
    }))
}

/**
 * Calcula el estado de la cuenca a partir de las siete decisiones.
 *
 * La propagación espacial ya está incorporada en los 12 valores de cada registro
 * del Excel: aquí solo se suma, manteniendo separados Alta/Media/Baja y los
 * cuatro indicadores. No se aplica una segunda fórmula de propagación.
 *
 * @param {Array<{categoria:string,alternativa:string,ubicacion:string}>|Object} selections
 * @param {Array<Object>} matrix
 * @returns {{
 *   totales: Object,
 *   clasificaciones: Object,
 *   detalles: Array<Object>,
 *   faltantes: Array<Object>,
 *   seleccionadas: number,
 *   total: number,
 *   completa: boolean
 * }}
 */
export function calculateWatershedState(selections, matrix) {
  if (!Array.isArray(matrix)) {
    throw new TypeError('calculateWatershedState: la matriz debe ser un arreglo de registros')
  }
  const idx = getIndice(matrix)
  const decisiones = normalizarSelecciones(selections)

  const totales = crearTotalesVacios()
  const detalles = []
  const faltantes = []

  for (const decision of decisiones) {
    const rec = idx.byKey.get(claveMatriz(decision.categoria, decision.alternativa, decision.ubicacion))
    if (!rec) {
      faltantes.push(decision)
      continue
    }
    for (const tramo of TRAMOS) {
      for (const ind of INDICADORES) {
        totales[tramo][ind] += rec.efectos[tramo][ind]
      }
    }
    detalles.push({
      id: rec.id,
      categoria: rec.categoria,
      alternativa: rec.alternativa,
      ubicacion: rec.ubicacion,
      efectos: rec.efectos,
      justificacion: rec.justificacion,
      reglaPropagacion: rec.reglaPropagacion,
      fuentesIds: rec.fuentesIds,
      fuentePrincipal: rec.fuentePrincipal,
    })
  }

  const clasificaciones = clasificarTotales(totales)

  return {
    totales,
    clasificaciones,
    detalles,
    faltantes,
    seleccionadas: detalles.length,
    total: decisiones.length,
    completa: faltantes.length === 0 && detalles.length > 0,
  }
}

export default calculateWatershedState
