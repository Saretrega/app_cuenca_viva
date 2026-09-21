import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Avanza automáticamente pasados `duracionMs` si no hay interacción del usuario.
 *
 * - `activo` (por defecto `true`) permite atar el conteo a una fase/pantalla concreta:
 *   mientras sea `false` no corre ningún temporizador, y al volver a `true` empieza
 *   siempre un ciclo nuevo (la pausa no queda "pegada" de una pantalla a la siguiente).
 * - `reiniciar()` reinicia el conteo desde cero sin avanzar (para no interrumpir a
 *   quien sigue mirando/interactuando).
 * - `alternarPausa()` detiene o reanuda el avance automático por completo; al
 *   reanudar, el conteo vuelve a empezar desde `duracionMs` (no recuerda el resto
 *   exacto que faltaba, para mantener la lógica simple).
 * - El cleanup del `useEffect` cancela el `setTimeout` pendiente en cada reinicio,
 *   pausa, cambio de `activo` o desmontaje, así una navegación manual nunca deja un
 *   avance automático corriendo en segundo plano ni produce doble navegación.
 *
 * @param {number} duracionMs
 * @param {() => void} onAvanzar
 * @param {boolean} [activo]
 * @returns {{pausado:boolean, ciclo:number, reiniciar:() => void, alternarPausa:() => void}}
 */
export function useAutoAdvance(duracionMs, onAvanzar, activo = true) {
  const [pausado, setPausado] = useState(false)
  const [ciclo, setCiclo] = useState(0)

  // Ref para no reiniciar el temporizador cada vez que `onAvanzar` cambia de identidad.
  const onAvanzarRef = useRef(onAvanzar)
  useEffect(() => {
    onAvanzarRef.current = onAvanzar
  })

  useEffect(() => {
    if (!activo) {
      // Listo para un ciclo nuevo la próxima vez que se active.
      // oxlint-disable-next-line react/set-state-in-effect
      setPausado(false)
      return undefined
    }
    if (pausado) return undefined
    const id = setTimeout(() => onAvanzarRef.current(), duracionMs)
    return () => clearTimeout(id)
  }, [activo, duracionMs, pausado, ciclo])

  const reiniciar = useCallback(() => setCiclo((c) => c + 1), [])
  const alternarPausa = useCallback(() => setPausado((p) => !p), [])

  return { pausado, ciclo, reiniciar, alternarPausa }
}

export default useAutoAdvance
