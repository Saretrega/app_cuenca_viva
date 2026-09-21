// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App.jsx'
import { categories } from './data/categories.js'

// jsdom no implementa canvas ni el motor de animación: se mockean las capas pesadas.
vi.mock('motion/react', async () => {
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
        if (tag === 'create') {
          return (as) => {
            const key = `c:${as}`
            if (!cache[key]) cache[key] = make(as)
            return cache[key]
          }
        }
        if (!cache[tag]) cache[tag] = make(tag)
        return cache[tag]
      },
    },
  )
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    MotionConfig: ({ children }) => children,
    useReducedMotion: () => false,
    useSpring: (value) => ({ get: () => value, set: () => {}, on: () => () => {} }),
    useTransform: (source, fn) => fn(source && typeof source.get === 'function' ? source.get() : source),
  }
})
vi.mock('morphicons/react', async () => {
  const React = await import('react')
  return {
    MorphIcon: ({ label }) => React.createElement('span', { 'data-morph': label ?? '' }),
  }
})
vi.mock('./components/charts/LazyWatershedChart.jsx', () => ({ default: () => null }))

function decidir(alternativa) {
  fireEvent.click(screen.getByText(alternativa).closest('button'))
  fireEvent.click(screen.getByText('Cuenca Alta').closest('button'))
  fireEvent.click(screen.getByText('Continuar')) // decisión → efecto
  fireEvent.click(screen.getByText('Continuar')) // efecto → siguiente decisión (o resultados)
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

  it('recorre las 7 decisiones, el resumen final y el estrés', async () => {
    render(<App />)

    expect(screen.getAllByText('CUENCA VIVA').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByText('Comenzar simulación'))

    // SimulationPage se carga de forma diferida (React.lazy).
    await screen.findByText('Continuar')

    for (let i = 0; i < categories.length; i += 1) {
      decidir(categories[i].alternativas[0])
    }

    // Resumen final en diapositivas
    expect(await screen.findByText('Resumen de tu cuenca')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ir a Historia de tu cuenca'))
    expect(screen.getByText('Decisiones favorables')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ir a Causa-efecto'))
    expect(screen.getAllByText(/Efecto principal/).length).toBeGreaterThan(0)

    // Prueba de estrés
    fireEvent.click(screen.getByText('Probar estrés climático'))
    expect(await screen.findByText('Prueba de estrés climático')).toBeTruthy()
    fireEvent.click(screen.getByText('Sequía prolongada').closest('button'))
    expect(screen.getAllByText(/Antes vs\. después/).length).toBeGreaterThan(0)

    // Reflexión final (acción final de la última diapositiva de estrés)
    fireEvent.click(screen.getByLabelText('Ir a Detalle por tramo'))
    fireEvent.click(screen.getByText('¿Para quién es el agua?'))
    expect(await screen.findAllByText('¿Para quién es el agua?')).toBeTruthy()

    // Comparación
    fireEvent.click(screen.getByText('Comparar escenarios'))
    const guardar = await screen.findAllByText('Guardar')
    fireEvent.click(guardar[0])
    fireEvent.click(guardar[1])
    fireEvent.click(screen.getByLabelText('Ir a Comparación detallada'))
    expect(screen.getByText('Calidad · Cuenca Alta')).toBeTruthy()

    expect(errores).toEqual([])
  })

  it('permite iniciar el flujo desde la página Cómo funciona', async () => {
    render(<App />)
    fireEvent.click(screen.getAllByText('¿Cómo funciona?')[0])
    expect(await screen.findByText('Construye y transforma una cuenca')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Ir a Las siete decisiones'))
    expect(screen.getByText('Las siete decisiones')).toBeTruthy()
    expect(errores).toEqual([])
  })
})
