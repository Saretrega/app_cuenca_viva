// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useAutoAdvance from './useAutoAdvance.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useAutoAdvance', () => {
  it('avanza automáticamente a los 30 segundos si no hay interacción', () => {
    const onAvanzar = vi.fn()
    renderHook(() => useAutoAdvance(30000, onAvanzar))

    act(() => {
      vi.advanceTimersByTime(29999)
    })
    expect(onAvanzar).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onAvanzar).toHaveBeenCalledTimes(1)
  })

  it('no avanza si el usuario ya navegó antes (se desactiva con `activo`)', () => {
    const onAvanzar = vi.fn()
    const { rerender } = renderHook(({ activo }) => useAutoAdvance(30000, onAvanzar, activo), {
      initialProps: { activo: true },
    })

    // Equivalente a presionar "Continuar" antes de tiempo: la pantalla cambia y
    // el hook se desactiva, cancelando el temporizador pendiente (cleanup del efecto).
    act(() => {
      vi.advanceTimersByTime(15000)
    })
    rerender({ activo: false })

    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(onAvanzar).not.toHaveBeenCalled()
  })

  it('reiniciar() reinicia el conteo desde cero sin avanzar', () => {
    const onAvanzar = vi.fn()
    const { result } = renderHook(() => useAutoAdvance(30000, onAvanzar))

    act(() => {
      vi.advanceTimersByTime(29000)
    })
    act(() => {
      result.current.reiniciar()
    })
    // Si no se hubiera reiniciado, ya habría avanzado en este punto (29000 + 2000 > 30000).
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onAvanzar).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(28000)
    })
    expect(onAvanzar).toHaveBeenCalledTimes(1)
  })

  it('alternarPausa() detiene el avance hasta que se reanuda', () => {
    const onAvanzar = vi.fn()
    const { result } = renderHook(() => useAutoAdvance(30000, onAvanzar))

    act(() => {
      result.current.alternarPausa()
    })
    expect(result.current.pausado).toBe(true)

    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(onAvanzar).not.toHaveBeenCalled()

    act(() => {
      result.current.alternarPausa()
    })
    expect(result.current.pausado).toBe(false)

    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(onAvanzar).toHaveBeenCalledTimes(1)
  })
})
