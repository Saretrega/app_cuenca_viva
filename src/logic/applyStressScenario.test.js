import { describe, expect, it } from 'vitest'
import { applyStressScenario } from './applyStressScenario.js'
import { stressScenarios } from '../data/stressScenarios.js'

const base = {
  totales: {
    alta: { calidadAgua: 6, disponibilidad: 6, biodiversidad: 6, resiliencia: 6 },
    media: { calidadAgua: 2, disponibilidad: 2, biodiversidad: 2, resiliencia: 2 },
    baja: { calidadAgua: -2, disponibilidad: -2, biodiversidad: -2, resiliencia: -2 },
  },
}

const sequia = stressScenarios.find((s) => s.id === 'sequia')
const lluvias = stressScenarios.find((s) => s.id === 'lluvias')

describe('applyStressScenario', () => {
  it('suma los deltas del escenario y conserva el estado ANTES', () => {
    const r = applyStressScenario(base, sequia)
    expect(r.antes.totales).toEqual(base.totales)
    expect(r.antes.totales).not.toBe(base.totales) // clonado
    expect(r.despues.totales.alta.disponibilidad).toBe(6 + sequia.efectos.alta.disponibilidad)
    expect(r.despues.totales.baja.calidadAgua).toBe(-2 + sequia.efectos.baja.calidadAgua)
  })

  it('no muta el estado de entrada', () => {
    const copia = JSON.parse(JSON.stringify(base))
    applyStressScenario(base, lluvias)
    expect(base).toEqual(copia)
  })

  it('expone el delta aplicado', () => {
    const r = applyStressScenario(base, sequia)
    expect(r.delta).toEqual(sequia.efectos)
    expect(r.scenario).toBe(sequia)
  })

  it('reclasifica el estado posterior', () => {
    const r = applyStressScenario(base, sequia)
    for (const tramo of ['alta', 'media', 'baja']) {
      for (const ind of ['calidadAgua', 'disponibilidad', 'biodiversidad', 'resiliencia']) {
        expect(r.despues.clasificaciones[tramo][ind].valor).toBe(r.despues.totales[tramo][ind])
        expect(r.despues.clasificaciones[tramo][ind].key).toBeTruthy()
      }
    }
  })

  it('usa las clasificaciones provistas si existen', () => {
    const conClasif = { ...base, clasificaciones: { marcador: true } }
    const r = applyStressScenario(conClasif, sequia)
    expect(r.antes.clasificaciones).toEqual({ marcador: true })
  })

  it('lanza error si falta el estado o el escenario', () => {
    expect(() => applyStressScenario(null, sequia)).toThrow(TypeError)
    expect(() => applyStressScenario({}, sequia)).toThrow(TypeError)
    expect(() => applyStressScenario(base, null)).toThrow(TypeError)
    expect(() => applyStressScenario(base, {})).toThrow(TypeError)
  })

  it('los tres escenarios tienen efectos en los tres tramos', () => {
    for (const s of stressScenarios) {
      const r = applyStressScenario(base, s)
      expect(r.despues.totales.alta).toBeDefined()
      expect(r.despues.totales.media).toBeDefined()
      expect(r.despues.totales.baja).toBeDefined()
    }
  })
})
