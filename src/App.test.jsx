// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App.jsx'
import { categories } from './data/categories.js'

// jsdom no implementa canvas ni el motor de animación: se mockean las capas pesadas.
vi.mock('framer-motion', async () => {
  const React = await import('react')
  const make = (tag) => (props) => {
    const {
      children,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      variants: _variants,
      whileHover: _whileHover,
      whileTap: _whileTap,
      layout: _layout,
      custom: _custom,
      ...rest
    } = props
    return React.createElement(tag, rest, children)
  }
  const cache = {}
  const motion = new Proxy(
    {},
    {
      get: (_t, tag) => {
        if (!cache[tag]) cache[tag] = make(tag)
        return cache[tag]
      },
    },
  )
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  }
})
vi.mock('./components/charts/LazyWatershedChart.jsx', () => ({ default: () => null }))
vi.mock('./components/media/LazyParticles.jsx', () => ({ default: () => null }))
vi.mock('./components/media/LottieIcon.jsx', () => ({ default: () => null }))

function decidir(alternativa) {
  fireEvent.click(screen.getByText(alternativa).closest('button'))
  fireEvent.click(screen.getByText('Cuenca Alta').closest('button'))
  fireEvent.click(screen.getByText('Continuar'))
  // La ilustración animada se salta tocando la pantalla.
  fireEvent.click(screen.getByLabelText('Saltar la animación y continuar'))
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

  it('recorre las 7 decisiones, el resumen final y el estrés', () => {
    render(<App />)

    expect(screen.getAllByText('CUENCA VIVA').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByText('Comenzar simulación'))

    for (let i = 0; i < categories.length; i += 1) {
      decidir(categories[i].alternativas[0])
    }

    // Resumen final en diapositivas
    expect(screen.getByText('Resumen de tu cuenca')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ir a Historia de tu cuenca'))
    expect(screen.getByText('Decisiones favorables')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ir a Causa-efecto'))
    expect(screen.getAllByText(/Efecto principal/).length).toBeGreaterThan(0)

    // Prueba de estrés
    fireEvent.click(screen.getByText('Probar estrés climático'))
    expect(screen.getByText('Prueba de estrés climático')).toBeTruthy()
    fireEvent.click(screen.getByText('Sequía prolongada').closest('button'))
    expect(screen.getAllByText(/Antes vs\. después/).length).toBeGreaterThan(0)

    // Reflexión final (acción final de la última diapositiva de estrés)
    fireEvent.click(screen.getByLabelText('Ir a Detalle por tramo'))
    fireEvent.click(screen.getByText('¿Para quién es el agua?'))
    expect(screen.getAllByText('¿Para quién es el agua?').length).toBeGreaterThan(0)

    // Comparación
    fireEvent.click(screen.getByText('Comparar escenarios'))
    const guardar = screen.getAllByText('Guardar')
    fireEvent.click(guardar[0])
    fireEvent.click(guardar[1])
    fireEvent.click(screen.getByLabelText('Ir a Comparación detallada'))
    expect(screen.getByText('Calidad · Cuenca Alta')).toBeTruthy()

    expect(errores).toEqual([])
  })

  it('permite iniciar el flujo desde la página Cómo funciona', () => {
    render(<App />)
    fireEvent.click(screen.getAllByText('¿Cómo funciona?')[0])
    expect(screen.getByText('Construye y transforma una cuenca')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ir a Las siete decisiones'))
    expect(screen.getByText('Las siete decisiones')).toBeTruthy()
    expect(errores).toEqual([])
  })
})
