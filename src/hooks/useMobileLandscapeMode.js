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
 * Modo inmersivo horizontal, siempre opt-in: solo se activa cuando el usuario presiona
 * el botón correspondiente (los navegadores exigen un gesto directo para fullscreen/lock).
 * Intenta pantalla completa + orientación horizontal nativas, con una rotación visual
 * por CSS como respaldo donde no existan o fallen (p. ej. iOS Safari), y un aviso
 * descartable sugiriendo "Agregar a inicio" en iOS cuando corresponde.
 * En vertical (sin activar), la app funciona como una página normal, sin nada forzado.
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
  // El aviso de "Agregar a inicio" solo tiene sentido una vez que el usuario pidió
  // el modo inmersivo y iOS no puede dárselo (no antes: sería un aviso no solicitado).
  const mostrarAvisoInicio = esMovil && esIOS && activo && !esStandalone() && !avisoDescartado
  const descartarAviso = useCallback(() => setAvisoDescartado(true), [setAvisoDescartado])

  // "Vertical normal": el dispositivo está en portrait y el usuario NO activó el modo
  // inmersivo horizontal (ni con lock nativo ni con el respaldo de rotación CSS).
  // App.jsx usa esto para marcar el layout normal de página con scroll, distinto del
  // modo de rotación forzada (que necesita alturas fijas, no un layout que crece con el contenido).
  const modoVerticalNormal = portrait && !rotacionForzada

  return {
    esMovil,
    esIOS,
    activo,
    portrait,
    rotacionForzada,
    modoVerticalNormal,
    activarModoInmersivo,
    mostrarAvisoInicio,
    descartarAviso,
  }
}

export default useMobileLandscapeMode
