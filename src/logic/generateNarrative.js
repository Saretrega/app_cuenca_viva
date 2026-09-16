import { INDICADORES, TRAMOS, TRAMO_LABEL, INDICADOR_LABEL } from '../data/dimensions.js'

const UMBRAL_FAVORABLE = 2
const UMBRAL_PRESION = -2

/** Suma los 12 efectos de una decisión. */
function balanceDecision(detalle) {
  let total = 0
  for (const tramo of TRAMOS) {
    for (const ind of INDICADORES) total += detalle.efectos[tramo][ind]
  }
  return total
}

/** Suma los 4 indicadores de un tramo. */
function balanceTramo(totales, tramo) {
  return INDICADORES.reduce((acc, ind) => acc + totales[tramo][ind], 0)
}

/**
 * Genera la historia de la cuenca a partir del estado calculado.
 * Usa únicamente datos y textos almacenados (sin IA externa en tiempo de ejecución).
 *
 * @param {Object} state resultado de calculateWatershedState
 * @returns {{
 *   titulo:string,
 *   resumen:string,
 *   decisionesFavorables:string[],
 *   presiones:string[],
 *   efectosAguasAbajo:string[],
 *   estadoTramos:Array<{tramo:string,label:string,balance:number,texto:string}>,
 *   mensaje:string
 * }}
 */
export function generateNarrative(state) {
  const totales = state?.totales
  if (!totales) {
    throw new TypeError('generateNarrative: se requiere un estado calculado')
  }

  const detalles = state.detalles ?? []
  const favorables = []
  const presiones = []

  for (const det of detalles) {
    const balance = balanceDecision(det)
    if (balance >= UMBRAL_FAVORABLE) {
      favorables.push(
        `«${det.alternativa}» en ${TRAMO_LABEL[det.ubicacion]}: ${det.justificacion}`,
      )
    } else if (balance <= UMBRAL_PRESION) {
      presiones.push(
        `«${det.alternativa}» en ${TRAMO_LABEL[det.ubicacion]}: ${det.justificacion}`,
      )
    }
  }

  const estadoTramos = TRAMOS.map((tramo) => {
    const balance = balanceTramo(totales, tramo)
    let texto
    if (balance >= 6) texto = 'El tramo muestra un estado favorable y relativamente estable.'
    else if (balance >= 1) texto = 'El tramo presenta una mejora leve, con margen de consolidación.'
    else if (balance === 0) texto = 'El tramo se mantiene neutro, sin cambios relevantes acumulados.'
    else if (balance >= -5) texto = 'El tramo acumula presiones que reducen su capacidad de respuesta.'
    else texto = 'El tramo concentra un deterioro severo y es el más vulnerable de la cuenca.'
    return { tramo, label: TRAMO_LABEL[tramo], balance, texto }
  })

  const efectosAguasAbajo = []
  for (let i = 0; i < TRAMOS.length - 1; i += 1) {
    const origen = TRAMOS[i]
    const destino = TRAMOS[i + 1]
    for (const ind of INDICADORES) {
      const delta = totales[destino][ind] - totales[origen][ind]
      if (Math.abs(delta) >= 3) {
        const direccion = delta < 0 ? 'disminuye' : 'mejora'
        efectosAguasAbajo.push(
          `De ${TRAMO_LABEL[origen]} hacia ${TRAMO_LABEL[destino]}, ${INDICADOR_LABEL[ind]} ${direccion} (${delta > 0 ? '+' : ''}${delta}).`,
        )
      }
    }
  }
  if (efectosAguasAbajo.length === 0) {
    efectosAguasAbajo.push(
      'Los efectos se mantienen relativamente equilibrados entre los tres tramos.',
    )
  }

  const ordenados = [...estadoTramos].sort((a, b) => a.balance - b.balance)
  const peor = ordenados[0]
  const mejor = ordenados[ordenados.length - 1]

  let resumen
  if (presiones.length > favorables.length) {
    resumen = `Tu cuenca queda bajo presión: predominan las decisiones de impacto negativo. El tramo más afectado es ${peor.label} (${peor.balance}).`
  } else if (favorables.length > presiones.length) {
    resumen = `Tu cuenca tiende a recuperarse: predominan las decisiones favorables. El tramo en mejor estado es ${mejor.label} (${mejor.balance >= 0 ? '+' : ''}${mejor.balance}).`
  } else if (favorables.length === 0 && presiones.length === 0) {
    resumen = 'Tu cuenca queda en un estado mayormente neutro: las decisiones elegidas no generan cambios fuertes.'
  } else {
    resumen = `Tu cuenca combina aciertos y presiones. El tramo más afectado es ${peor.label} (${peor.balance}) y el mejor es ${mejor.label} (${mejor.balance >= 0 ? '+' : ''}${mejor.balance}).`
  }

  return {
    titulo: 'La historia de tu cuenca',
    resumen,
    decisionesFavorables: favorables,
    presiones,
    efectosAguasAbajo,
    estadoTramos,
    mensaje:
      'Una cuenca está conectada. Lo que ocurre aguas arriba puede transformar lo que sucede aguas abajo.',
  }
}

export default generateNarrative
