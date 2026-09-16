import { clasificarTotales } from './classify.js'
import { INDICADORES, TRAMOS } from '../data/dimensions.js'

function clonarTotales(totales) {
  const out = {}
  for (const tramo of TRAMOS) {
    out[tramo] = {}
    for (const ind of INDICADORES) out[tramo][ind] = totales[tramo][ind]
  }
  return out
}

/**
 * Aplica un escenario de estrés climático sobre el estado actual.
 * Los eventos de estrés no son decisiones humanas: solo suman sus deltas.
 *
 * @param {{totales:Object,clasificaciones?:Object}} currentState estado tras las decisiones
 * @param {{id:string,nombre:string,efectos:Object}} scenario
 * @returns {{
 *   scenario:Object,
 *   antes:{totales:Object,clasificaciones:Object},
 *   despues:{totales:Object,clasificaciones:Object},
 *   delta:Object
 * }}
 */
export function applyStressScenario(currentState, scenario) {
  if (!currentState || !currentState.totales) {
    throw new TypeError('applyStressScenario: se requiere un estado con totales')
  }
  if (!scenario || !scenario.efectos) {
    throw new TypeError('applyStressScenario: se requiere un escenario con efectos')
  }

  const antesTotales = clonarTotales(currentState.totales)
  const antesClasif = currentState.clasificaciones ?? clasificarTotales(antesTotales)

  const despuesTotales = clonarTotales(currentState.totales)
  for (const tramo of TRAMOS) {
    for (const ind of INDICADORES) {
      despuesTotales[tramo][ind] += scenario.efectos[tramo][ind]
    }
  }

  return {
    scenario,
    antes: { totales: antesTotales, clasificaciones: antesClasif },
    despues: { totales: despuesTotales, clasificaciones: clasificarTotales(despuesTotales) },
    delta: scenario.efectos,
  }
}

export default applyStressScenario
