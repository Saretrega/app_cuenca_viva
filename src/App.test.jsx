// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App.jsx'
import { categories } from './data/categories.js'

function elegirAlternativaYUbicacion(alternativa) {
  fireEvent.click(screen.getByText(alternativa).closest('button'))
  fireEvent.click(screen.getByText('Cuenca Alta').closest('button'))
  fireEvent.click(screen.getByText('Confirmar decisión'))
  fireEvent.click(screen.getByText('Continuar'))
}

describe('App · flujo completo del simulador', () => {
  let errores

  beforeEach(() => {
    window.scrollTo = () => {}
    errores = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      errores.push(args.join(' '))
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('recorre las 7 decisiones, resultados y estrés sin errores de consola', () => {
    render(<App />)

    expect(screen.getAllByText('CUENCA VIVA').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByText('Comenzar simulación'))

    for (let i = 0; i < categories.length - 1; i += 1) {
      elegirAlternativaYUbicacion(categories[i].alternativas[0])
    }
    elegirAlternativaYUbicacion(categories[categories.length - 1].alternativas[0])

    // Navegó a resultados
    expect(screen.getByText('Estado de tu cuenca')).toBeTruthy()
    expect(screen.getByText('La historia de tu cuenca')).toBeTruthy()
    expect(screen.getByText('¿Por qué cambió tu cuenca?')).toBeTruthy()

    // Prueba de estrés
    fireEvent.click(screen.getByText('Probar estrés climático'))
    expect(screen.getByText('Prueba de estrés climático')).toBeTruthy()
    fireEvent.click(screen.getByText('Sequía prolongada').closest('button'))
    expect(screen.getByText(/Antes vs\. después/)).toBeTruthy()

    // Reflexión final
    fireEvent.click(screen.getByText('Continuar: ¿Para quién es el agua?'))
    expect(screen.getByText('¿Para quién es el agua?')).toBeTruthy()

    // Comparación
    fireEvent.click(screen.getByText('Comparar escenarios'))
    expect(screen.getByText('Comparar escenarios')).toBeTruthy()

    // Guardar escenarios A y B y comparar
    const guardar = screen.getAllByText('Guardar')
    fireEvent.click(guardar[0])
    fireEvent.click(guardar[1])
    expect(screen.getByText('Calidad del agua · Cuenca Alta')).toBeTruthy()

    // Modo presentación
    fireEvent.click(screen.getByText('Presentación'))
    expect(screen.getByText('Salir de presentación')).toBeTruthy()
    fireEvent.click(screen.getByText('Salir de presentación'))
    expect(screen.queryByText('Salir de presentación')).toBeNull()

    expect(errores).toEqual([])
  })

  it('permite iniciar el flujo desde la página Cómo funciona', () => {
    render(<App />)
    fireEvent.click(screen.getAllByText('¿Cómo funciona?')[0])
    expect(screen.getByText('Las siete decisiones')).toBeTruthy()
    expect(errores).toEqual([])
  })
})
