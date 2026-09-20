import { describe, expect, it } from 'vitest'
import { clasificarTotales, classifyScore } from './classify.js'

describe('classifyScore · bandas de clasificación', () => {
  it('clasifica deterioro fuerte (<= -8)', () => {
    expect(classifyScore(-20).key).toBe('deterioro_fuerte')
    expect(classifyScore(-8).key).toBe('deterioro_fuerte')
    expect(classifyScore(-8).label).toBe('Deterioro fuerte')
    expect(classifyScore(-8).signo).toBe(-1)
  })

  it('clasifica deterioro moderado (-7 a -3)', () => {
    expect(classifyScore(-7).key).toBe('deterioro_moderado')
    expect(classifyScore(-5).key).toBe('deterioro_moderado')
    expect(classifyScore(-3).key).toBe('deterioro_moderado')
  })

  it('clasifica deterioro leve (-2 a -1)', () => {
    expect(classifyScore(-2).key).toBe('deterioro_leve')
    expect(classifyScore(-1).key).toBe('deterioro_leve')
  })

  it('clasifica neutro (0)', () => {
    expect(classifyScore(0).key).toBe('neutro')
    expect(classifyScore(0).label).toBe('Neutro')
    expect(classifyScore(0).signo).toBe(0)
  })

  it('clasifica mejora leve (1 a 3)', () => {
    expect(classifyScore(1).key).toBe('mejora_leve')
    expect(classifyScore(3).key).toBe('mejora_leve')
  })

  it('clasifica mejora moderada (4 a 8)', () => {
    expect(classifyScore(4).key).toBe('mejora_moderada')
    expect(classifyScore(8).key).toBe('mejora_moderada')
  })

  it('clasifica mejora fuerte (>= 9)', () => {
    expect(classifyScore(9).key).toBe('mejora_fuerte')
    expect(classifyScore(30).key).toBe('mejora_fuerte')
    expect(classifyScore(9).signo).toBe(1)
  })

  it('respeta los límites exactos entre bandas', () => {
    expect(classifyScore(-9).key).toBe('deterioro_fuerte')
    expect(classifyScore(-8).key).toBe('deterioro_fuerte')
    expect(classifyScore(-3).key).toBe('deterioro_moderado')
    expect(classifyScore(-2).key).toBe('deterioro_leve')
    expect(classifyScore(3).key).toBe('mejora_leve')
    expect(classifyScore(4).key).toBe('mejora_moderada')
    expect(classifyScore(8).key).toBe('mejora_moderada')
    expect(classifyScore(9).key).toBe('mejora_fuerte')
  })
})

describe('clasificarTotales', () => {
  it('clasifica los 12 valores por tramo e indicador', () => {
    const totales = {
      alta: { calidadAgua: 10, disponibilidad: 0, biodiversidad: -4, resiliencia: 2 },
      media: { calidadAgua: -9, disponibilidad: 5, biodiversidad: 1, resiliencia: 0 },
      baja: { calidadAgua: 0, disponibilidad: -1, biodiversidad: 3, resiliencia: 9 },
    }
    const r = clasificarTotales(totales)
    expect(r.alta.calidadAgua).toMatchObject({ valor: 10, key: 'mejora_fuerte' })
    expect(r.alta.biodiversidad).toMatchObject({ valor: -4, key: 'deterioro_moderado' })
    expect(r.media.calidadAgua).toMatchObject({ valor: -9, key: 'deterioro_fuerte' })
    expect(r.baja.resiliencia).toMatchObject({ valor: 9, key: 'mejora_fuerte' })
    expect(r.baja.disponibilidad).toMatchObject({ valor: -1, key: 'deterioro_leve' })
  })
})
