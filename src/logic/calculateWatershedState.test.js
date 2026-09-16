import { describe, expect, it } from 'vitest'
import { watershedMatrix } from '../data/watershedMatrix.js'
import { stressScenarios } from '../data/stressScenarios.js'
import { categories } from '../data/categories.js'
import { calculateWatershedState, claveMatriz } from './calculateWatershedState.js'
import { applyStressScenario } from './applyStressScenario.js'
import { classifyScore } from './classify.js'
import { generateNarrative } from './generateNarrative.js'

// Selección de referencia tomada de la hoja Simulador del Excel (7 decisiones en Alta).
const seleccionSimulador = [
  { categoria: '1. Cobertura vegetal / reforestación', alternativa: 'Conservar bosque y ronda ribereña', ubicacion: 'alta' },
  { categoria: '2. Uso y aprovechamiento del agua', alternativa: 'Uso eficiente con ahorro y control de captación', ubicacion: 'alta' },
  { categoria: '3. Minería', alternativa: 'Ninguna actividad minera', ubicacion: 'alta' },
  { categoria: '4. Manejo de vertimientos', alternativa: 'Tratamiento completo + control y monitoreo', ubicacion: 'alta' },
  { categoria: '5. Actividades productivas y uso del suelo', alternativa: 'Producción sostenible con protección de rondas y suelo', ubicacion: 'alta' },
  { categoria: '6. Protección y restauración de la cuenca', alternativa: 'Restauración integral de rondas, nacimientos y áreas degradadas', ubicacion: 'alta' },
  { categoria: '7. Gobernanza y participación comunitaria', alternativa: 'Gobernanza activa + monitoreo participativo + acuerdos', ubicacion: 'alta' },
]

describe('integridad de la matriz', () => {
  it('contiene 84 registros con IDs CV-001 … CV-084', () => {
    expect(watershedMatrix).toHaveLength(84)
    expect(watershedMatrix[0].id).toBe('CV-001')
    expect(watershedMatrix[83].id).toBe('CV-084')
    const ids = new Set(watershedMatrix.map((r) => r.id))
    expect(ids.size).toBe(84)
  })

  it('cada registro tiene los 12 efectos y 3 tramos', () => {
    for (const rec of watershedMatrix) {
      for (const tramo of ['alta', 'media', 'baja']) {
        for (const ind of ['calidadAgua', 'disponibilidad', 'biodiversidad', 'resiliencia']) {
          expect(Number.isInteger(rec.efectos[tramo][ind])).toBe(true)
          expect(rec.efectos[tramo][ind]).toBeGreaterThanOrEqual(-3)
          expect(rec.efectos[tramo][ind]).toBeLessThanOrEqual(3)
        }
      }
      expect(rec.fuentesIds.length).toBeGreaterThan(0)
    }
  })

  it('la clave de búsqueda es única por categoría+alternativa+ubicación', () => {
    const claves = new Set(watershedMatrix.map((r) => claveMatriz(r.categoria, r.alternativa, r.ubicacion)))
    expect(claves.size).toBe(84)
  })

  it('las 7 categorías tienen exactamente 4 alternativas', () => {
    expect(categories).toHaveLength(7)
    for (const cat of categories) expect(cat.alternativas).toHaveLength(4)
  })
})

describe('calculateWatershedState', () => {
  it('recupera exactamente los 12 valores del registro CV-001', () => {
    const rec = watershedMatrix.find((r) => r.id === 'CV-001')
    const state = calculateWatershedState(
      [{ categoria: rec.categoria, alternativa: rec.alternativa, ubicacion: 'alta' }],
      watershedMatrix,
    )
    expect(state.totales.alta).toEqual({ calidadAgua: 2, disponibilidad: 2, biodiversidad: 3, resiliencia: 2 })
    expect(state.totales.media).toEqual({ calidadAgua: 1, disponibilidad: 1, biodiversidad: 2, resiliencia: 1 })
    expect(state.totales.baja).toEqual({ calidadAgua: 0, disponibilidad: 0, biodiversidad: 1, resiliencia: 0 })
  })

  it('reproduce el resultado acumulado de la hoja Simulador', () => {
    const state = calculateWatershedState(seleccionSimulador, watershedMatrix)
    expect(state.totales).toEqual({
      alta: { calidadAgua: 8, disponibilidad: 8, biodiversidad: 10, resiliencia: 13 },
      media: { calidadAgua: 2, disponibilidad: 3, biodiversidad: 4, resiliencia: 7 },
      baja: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 2, resiliencia: 2 },
    })
    expect(state.clasificaciones.alta.biodiversidad.label).toBe('Mejora fuerte')
    expect(state.clasificaciones.media.biodiversidad.label).toBe('Mejora moderada')
    expect(state.clasificaciones.baja.calidadAgua.label).toBe('Neutro')
    expect(state.completa).toBe(true)
  })

  it('mantiene separados Alta, Media y Baja', () => {
    const soloMedia = [
      { categoria: '1. Cobertura vegetal / reforestación', alternativa: 'Conservar bosque y ronda ribereña', ubicacion: 'media' },
    ]
    const state = calculateWatershedState(soloMedia, watershedMatrix)
    expect(state.totales.alta).toEqual({ calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 })
    expect(state.totales.media.calidadAgua).toBe(2)
    expect(state.totales.baja.calidadAgua).toBe(1)
  })

  it('no limita el acumulado a -3/+3', () => {
    const state = calculateWatershedState(seleccionSimulador, watershedMatrix)
    expect(state.totales.alta.resiliencia).toBe(13)
    expect(state.totales.alta.resiliencia).toBeGreaterThan(3)
  })

  it('cambiar una decisión recalcula automáticamente', () => {
    const stateA = calculateWatershedState(seleccionSimulador, watershedMatrix)
    const cambiada = seleccionSimulador.map((s) =>
      s.categoria.startsWith('1.')
        ? { ...s, alternativa: 'Deforestación intensa / eliminación de ronda' }
        : s,
    )
    const stateB = calculateWatershedState(cambiada, watershedMatrix)
    expect(stateB.totales.alta.calidadAgua).toBe(stateA.totales.alta.calidadAgua - 4)
    expect(stateB.totales.alta.calidadAgua).toBe(4)
  })

  it('reporta selecciones sin coincidencia en la matriz', () => {
    const state = calculateWatershedState(
      [{ categoria: 'X', alternativa: 'Y', ubicacion: 'alta' }],
      watershedMatrix,
    )
    expect(state.faltantes).toHaveLength(1)
    expect(state.completa).toBe(false)
  })

  it('acepta selecciones como objeto indexado por categoría', () => {
    const state = calculateWatershedState(
      { '1. Cobertura vegetal / reforestación': { categoria: '1. Cobertura vegetal / reforestación', alternativa: 'Conservar bosque y ronda ribereña', ubicacion: 'alta' } },
      watershedMatrix,
    )
    expect(state.totales.alta.biodiversidad).toBe(3)
  })
})

describe('classifyScore', () => {
  it('aplica los umbrales configurados', () => {
    expect(classifyScore(-9).label).toBe('Deterioro fuerte')
    expect(classifyScore(-8).label).toBe('Deterioro fuerte')
    expect(classifyScore(-7).label).toBe('Deterioro moderado')
    expect(classifyScore(-1).label).toBe('Deterioro leve')
    expect(classifyScore(0).label).toBe('Neutro')
    expect(classifyScore(3).label).toBe('Mejora leve')
    expect(classifyScore(4).label).toBe('Mejora moderada')
    expect(classifyScore(8).label).toBe('Mejora moderada')
    expect(classifyScore(9).label).toBe('Mejora fuerte')
  })
})

describe('applyStressScenario', () => {
  const base = calculateWatershedState(seleccionSimulador, watershedMatrix)
  const sequia = stressScenarios.find((s) => s.id === 'sequia')

  it('suma los deltas y conserva el ANTES', () => {
    const res = applyStressScenario(base, sequia)
    expect(res.antes.totales.alta.disponibilidad).toBe(8)
    expect(res.despues.totales.alta.disponibilidad).toBe(5)
    expect(res.despues.totales.baja.disponibilidad).toBe(-3)
    expect(res.delta.alta.disponibilidad).toBe(-3)
  })

  it('reclasifica el estado posterior', () => {
    const res = applyStressScenario(base, sequia)
    expect(res.despues.clasificaciones.alta.disponibilidad.label).toBe('Mejora moderada')
    expect(res.antes.clasificaciones.alta.disponibilidad.label).toBe('Mejora moderada')
  })

  it('los tres escenarios tienen efectos en los tres tramos', () => {
    for (const s of stressScenarios) {
      for (const t of ['alta', 'media', 'baja']) {
        expect(s.efectos[t]).toBeDefined()
      }
    }
  })
})

describe('generateNarrative', () => {
  it('produce una historia con favorables y presiones', () => {
    const state = calculateWatershedState(seleccionSimulador, watershedMatrix)
    const narrativa = generateNarrative(state)
    expect(narrativa.decisionesFavorables.length).toBeGreaterThan(0)
    expect(narrativa.estadoTramos).toHaveLength(3)
    expect(narrativa.mensaje).toContain('cuenca')
  })

  it('detecta presiones cuando hay deterioro', () => {
    const mala = seleccionSimulador.map((s) =>
      s.categoria.startsWith('1.')
        ? { ...s, alternativa: 'Deforestación intensa / eliminación de ronda' }
        : s.categoria.startsWith('3.')
          ? { ...s, alternativa: 'Minería informal/no formalizada o beneficio sin controles' }
          : s,
    )
    const narrativa = generateNarrative(calculateWatershedState(mala, watershedMatrix))
    expect(narrativa.presiones.length).toBeGreaterThan(0)
  })
})
