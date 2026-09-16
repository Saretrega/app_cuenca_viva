// Umbrales de clasificación acumulada. Configurables en un solo lugar.
// La suma de las siete decisiones NO se limita a -3/+3: cada indicador acumula
// el total de los efectos y se clasifica con estas bandas.

/**
 * @typedef {Object} ThresholdBand
 * @property {string} key identificador estable
 * @property {number|null} min límite inferior inclusive (null = sin límite)
 * @property {number|null} max límite superior inclusive (null = sin límite)
 * @property {string} label etiqueta legible
 * @property {string} tono familia de color de la interfaz
 * @property {number} signo -1 deterioro, 0 neutro, 1 mejora
 */

/** @type {ThresholdBand[]} ordenadas de menor a mayor. */
export const thresholdBands = [
  { key: 'deterioro_fuerte', min: null, max: -8, label: 'Deterioro fuerte', tono: 'deterioro', signo: -1 },
  { key: 'deterioro_moderado', min: -7, max: -3, label: 'Deterioro moderado', tono: 'deterioro', signo: -1 },
  { key: 'deterioro_leve', min: -2, max: -1, label: 'Deterioro leve', tono: 'alerta', signo: -1 },
  { key: 'neutro', min: 0, max: 0, label: 'Neutro', tono: 'neutro', signo: 0 },
  { key: 'mejora_leve', min: 1, max: 3, label: 'Mejora leve', tono: 'agua', signo: 1 },
  { key: 'mejora_moderada', min: 4, max: 8, label: 'Mejora moderada', tono: 'bosque', signo: 1 },
  { key: 'mejora_fuerte', min: 9, max: null, label: 'Mejora fuerte', tono: 'bosque', signo: 1 },
]

export const RANGOS_EFECTO = [
  { valor: -3, label: 'Impacto negativo fuerte' },
  { valor: -2, label: 'Impacto negativo moderado' },
  { valor: -1, label: 'Impacto negativo leve' },
  { valor: 0, label: 'Neutro / no significativo' },
  { valor: 1, label: 'Beneficio leve' },
  { valor: 2, label: 'Beneficio moderado' },
  { valor: 3, label: 'Beneficio fuerte' },
]
