// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { codificarEscenario, decodificarEscenario, urlCompartible } from './share.js'

const decisions = {
  '1. Cobertura vegetal / reforestación': {
    categoria: '1. Cobertura vegetal / reforestación',
    alternativa: 'Conservar bosque y ronda ribereña',
    ubicacion: 'alta',
  },
  '3. Minería': {
    categoria: '3. Minería',
    alternativa: 'Minería informal/no formalizada o beneficio sin controles',
    ubicacion: 'baja',
  },
}

describe('share · escenario en la URL', () => {
  it('codifica y decodifica el mismo escenario', () => {
    const hash = codificarEscenario(decisions, 'sequia')
    expect(hash.startsWith('#cuenca=')).toBe(true)
    const r = decodificarEscenario(hash)
    expect(r.stressId).toBe('sequia')
    expect(Object.keys(r.decisions)).toHaveLength(2)
    expect(r.decisions['3. Minería'].alternativa).toContain('informal')
    expect(r.decisions['1. Cobertura vegetal / reforestación'].ubicacion).toBe('alta')
  })

  it('acepta escenario sin estrés', () => {
    const r = decodificarEscenario(codificarEscenario(decisions, null))
    expect(r.stressId).toBeNull()
  })

  it('devuelve null ante un hash inválido o ausente', () => {
    expect(decodificarEscenario('')).toBeNull()
    expect(decodificarEscenario('#otra=cosa')).toBeNull()
    expect(decodificarEscenario('#cuenca=@@@no-base64@@@')).toBeNull()
  })

  it('genera una URL absoluta con el hash', () => {
    const url = urlCompartible(decisions, null)
    expect(url).toContain('#cuenca=')
    expect(url.startsWith('http')).toBe(true)
  })
})
