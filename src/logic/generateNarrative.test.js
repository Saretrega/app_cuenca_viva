import { describe, expect, it } from 'vitest'
import { generateNarrative } from './generateNarrative.js'

/** Construye una decisión cuyo balance total (suma de los 12 efectos) es `balance`. */
function detalle(balance, id = 'CV-000', ubicacion = 'alta') {
  return {
    id,
    categoria: 'X',
    alternativa: `Alternativa ${id}`,
    ubicacion,
    efectos: {
      alta: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
      media: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
      baja: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
    },
  }
}

function conBalance(balance, extra = {}) {
  const d = detalle(balance)
  d.efectos.alta.calidadAgua = balance
  Object.assign(d, extra)
  d.alternativa = `Alternativa ${d.id}`
  return d
}

const totales = {
  alta: { calidadAgua: 10, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
  media: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
  baja: { calidadAgua: -10, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
}

describe('generateNarrative', () => {
  it('separa decisiones favorables (balance >= 2) y presiones (<= -2)', () => {
    const state = { totales, detalles: [conBalance(5, { id: 'A' }), conBalance(-5, { id: 'B' }), conBalance(0, { id: 'C' })] }
    const n = generateNarrative(state)
    expect(n.decisionesFavorables).toHaveLength(1)
    expect(n.decisionesFavorables[0]).toContain('Alternativa A')
    expect(n.presiones).toHaveLength(1)
    expect(n.presiones[0]).toContain('Alternativa B')
  })

  it('respeta los umbrales exactos (2 y -2)', () => {
    const state = {
      totales,
      detalles: [conBalance(2, { id: 'F' }), conBalance(1, { id: 'N1' }), conBalance(-1, { id: 'N2' }), conBalance(-2, { id: 'P' })],
    }
    const n = generateNarrative(state)
    expect(n.decisionesFavorables.map((t) => t.includes('Alternativa F'))).toContain(true)
    expect(n.decisionesFavorables).toHaveLength(1)
    expect(n.presiones).toHaveLength(1)
    expect(n.presiones[0]).toContain('Alternativa P')
  })

  it('devuelve el estado de los tres tramos con su balance', () => {
    const n = generateNarrative({ totales, detalles: [] })
    expect(n.estadoTramos).toHaveLength(3)
    expect(n.estadoTramos.find((t) => t.tramo === 'alta').balance).toBe(10)
    expect(n.estadoTramos.find((t) => t.tramo === 'baja').balance).toBe(-10)
    expect(n.estadoTramos.every((t) => typeof t.texto === 'string' && t.texto.length > 0)).toBe(true)
  })

  it('detecta efectos aguas abajo', () => {
    const n = generateNarrative({ totales, detalles: [] })
    expect(n.efectosAguasAbajo.length).toBeGreaterThan(0)
    expect(n.efectosAguasAbajo.join(' ')).toMatch(/Alta|Media|Baja/)
  })

  it('describe un estado neutro cuando no hay decisiones', () => {
    const neutro = {
      alta: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
      media: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
      baja: { calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 },
    }
    const n = generateNarrative({ totales: neutro, detalles: [] })
    expect(n.decisionesFavorables).toHaveLength(0)
    expect(n.presiones).toHaveLength(0)
    expect(n.resumen.toLowerCase()).toContain('neutro')
    expect(n.efectosAguasAbajo[0]).toMatch(/equilibrad/i)
  })

  it('prioriza el mensaje de presión cuando predominan las presiones', () => {
    const state = { totales, detalles: [conBalance(-5, { id: 'A' }), conBalance(-4, { id: 'B' }), conBalance(3, { id: 'C' })] }
    const n = generateNarrative(state)
    expect(n.resumen.toLowerCase()).toContain('presión')
  })

  it('incluye el mensaje conceptual final', () => {
    const n = generateNarrative({ totales, detalles: [] })
    expect(n.mensaje).toMatch(/cuenca/i)
  })

  it('lanza error si no hay estado calculado', () => {
    expect(() => generateNarrative(null)).toThrow(TypeError)
    expect(() => generateNarrative({})).toThrow(TypeError)
  })
})
