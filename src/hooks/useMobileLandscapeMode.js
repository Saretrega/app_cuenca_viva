import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

function detectarMovil() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

function detectarIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function esStandalone() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false
  return navigator.standalone === true || window.matchMedia?.('(display-mode: standalone)')?.matches === true
}

function esPortrait() {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia === 'function') return window.matchMedia('(orientation: portrait)').matches
  return window.innerWidth < window.innerHeight
}

/**
 * Mejora progresiva para móviles: intenta pantalla completa + orientación horizontal
 * nativas en el primer toque del usuario (requisito de los navegadores para estas APIs),
 * con una rotación visual por CSS como respaldo donde no existan o fallen (p. ej. iOS Safari),
 * y un aviso descartable para sugerir "Agregar a inicio" en iOS cuando aplica.
 * Nunca bloquea el uso de la app si algo no está soportado o el usuario lo rechaza.
 */
export function useMobileLandscapeMode() {
  const esMovil = useMemo(() => detectarMovil(), [])
  const esIOS = useMemo(() => detectarIOS(), [])
  const [activo, setActivo] = useState(false)
  const [portrait, setPortrait] = useState(() => esPortrait())
  const [avisoDescartado, setAvisoDescartado] = useLocalStorage('cuencaViva.avisoInicioDescartado', false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const mq = window.matchMedia('(orientation: portrait)')
    const actualizar = () => setPortrait(mq.matches)
    mq.addEventListener?.('change', actualizar)
    window.addEventListener('orientationchange', actualizar)
    return () => {
      mq.removeEventListener?.('change', actualizar)
      window.removeEventListener('orientationchange', actualizar)
    }
  }, [])

  const activarModoInmersivo = useCallback(async () => {
    if (!esMovil || activo) return
    setActivo(true)
    try {
      await document.documentElement.requestFullscreen?.()
    } catch {
      // pantalla completa no soportada o rechazada: se sigue sin ella (progressive enhancement)
    }
    try {
      await window.screen?.orientation?.lock?.('landscape')
    } catch {
      // lock no soportado (iOS Safari) o rechazado: queda el respaldo de rotación CSS
    }
  }, [esMovil, activo])

  const rotacionForzada = activo && esMovil && portrait
  const mostrarAvisoInicio = esMovil && esIOS && !esStandalone() && !avisoDescartado
  const descartarAviso = useCallback(() => setAvisoDescartado(true), [setAvisoDescartado])

  return { esMovil, esIOS, rotacionForzada, activarModoInmersivo, mostrarAvisoInicio, descartarAviso }
}

export default useMobileLandscapeMode
