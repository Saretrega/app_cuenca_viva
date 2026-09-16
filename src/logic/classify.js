import { thresholdBands } from '../data/thresholds.js'
import { INDICADORES, TRAMOS } from '../data/dimensions.js'

/**
 * Clasifica un puntaje acumulado según las bandas configuradas.
 * No limita el valor: acepta cualquier entero resultante de la suma.
 * @param {number} score
 * @returns {{key:string,label:string,tono:string,signo:number,min:number|null,max:number|null}}
 */
export function classifyScore(score) {
  const banda = thresholdBands.find(
    (b) => (b.min === null || score >= b.min) && (b.max === null || score <= b.max),
  )
  return banda ?? { key: 'desconocido', label: 'Sin clasificar', tono: 'neutro', signo: 0, min: null, max: null }
}

/**
 * Clasifica un objeto completo de totales por tramo/indicador.
 * @param {Object} totales
 * @returns {Object} mismas claves con { valor, ...banda }
 */
export function clasificarTotales(totales) {
  const out = {}
  for (const tramo of TRAMOS) {
    out[tramo] = {}
    for (const ind of INDICADORES) {
      const valor = totales[tramo][ind]
      out[tramo][ind] = { valor, ...classifyScore(valor) }
    }
  }
  return out
}
