import { useEffect, useMemo, useRef } from 'react'
import { TRAMO_CORTO, TRAMOS } from '../../data/dimensions.js'

// ---------------------------------------------------------------------------
// Geometría del río (curvas tipo S con ancho progresivo, generadas en código)
// ---------------------------------------------------------------------------

const RIO_CTRL = [
  [472, 200], [444, 256], [486, 312], [444, 370], [486, 428],
  [448, 486], [500, 544], [548, 596],
]
const RIO_HW = [7, 10, 14, 19, 25, 32, 41, 52]

function catmullPoint(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  const x =
    0.5 *
    (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
  const y =
    0.5 *
    (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
  return [x, y]
}

function muestrearSpline(ctrl, porTramo = 12) {
  const P = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]]
  const out = []
  for (let i = 0; i < ctrl.length - 1; i += 1) {
    for (let t = 0; t < porTramo; t += 1) out.push(catmullPoint(P[i], P[i + 1], P[i + 2], P[i + 3], t / porTramo))
  }
  out.push(ctrl[ctrl.length - 1])
  return out
}

const aPath = (pts, cerrar = false) => `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}${cerrar ? ' Z' : ''}`

function construirRio(samples, ctrlHw) {
  const n = samples.length
  const nSeg = ctrlHw.length - 1
  const hwAt = (u) => {
    const f = u * nSeg
    const i = Math.min(nSeg - 1, Math.floor(f))
    const s = f - i
    return ctrlHw[i] * (1 - s) + ctrlHw[i + 1] * s
  }
  const normales = samples.map((_, i) => {
    const a = samples[Math.max(0, i - 1)]
    const b = samples[Math.min(n - 1, i + 1)]
    const tx = b[0] - a[0]
    const ty = b[1] - a[1]
    const len = Math.hypot(tx, ty) || 1
    return [-ty / len, tx / len]
  })
  const poligono = (extra, mult = 1) => {
    const izq = []
    const der = []
    samples.forEach((p, i) => {
      const hw = hwAt(n > 1 ? i / (n - 1) : 0) * mult + extra
      izq.push([p[0] + normales[i][0] * hw, p[1] + normales[i][1] * hw])
      der.push([p[0] - normales[i][0] * hw, p[1] - normales[i][1] * hw])
    })
    return [...izq, ...der.reverse()]
  }
  const centro = aPath(samples)
  return {
    centro,
    arena: aPath(poligono(9), true),
    cauce: aPath(poligono(0), true),
    brillo: aPath(poligono(0, 0.36), true),
  }
}

function rangoPath(samples, y0, y1) {
  const pts = samples.filter((p) => p[1] >= y0 && p[1] <= y1)
  return pts.length >= 2 ? aPath(pts) : ''
}

// ---------------------------------------------------------------------------
// Bosque (posiciones orgánicas, no en fila)
// ---------------------------------------------------------------------------

const PINOS = [
  [36, 198, 0.7], [64, 186, 0.52], [92, 202, 0.86], [118, 180, 0.58], [146, 196, 0.76],
  [172, 174, 0.5], [198, 190, 0.68], [226, 202, 0.9], [252, 182, 0.6], [280, 196, 0.8],
  [308, 176, 0.54], [336, 190, 0.72], [364, 202, 0.88], [392, 184, 0.62], [418, 198, 0.78],
  [556, 190, 0.66], [584, 202, 0.9], [612, 180, 0.58], [640, 196, 0.8], [668, 174, 0.5],
  [696, 190, 0.72], [724, 202, 0.9], [752, 182, 0.62], [780, 196, 0.82], [808, 176, 0.54],
  [836, 190, 0.74], [864, 202, 0.86], [892, 184, 0.6], [920, 198, 0.8], [948, 178, 0.56], [974, 194, 0.76],
]
const ARBOLES = [
  [40, 402, 0.8], [74, 388, 0.6], [108, 404, 0.92], [142, 386, 0.68], [178, 400, 0.84],
  [212, 384, 0.6], [248, 402, 0.8], [284, 388, 0.66], [320, 404, 0.9], [356, 386, 0.7],
  [392, 400, 0.62], [430, 388, 0.76], [600, 400, 0.68], [636, 386, 0.88], [672, 402, 0.6],
  [708, 388, 0.8], [744, 404, 0.66], [780, 386, 0.84], [816, 400, 0.6], [852, 386, 0.8],
  [888, 402, 0.64], [924, 388, 0.82], [960, 400, 0.6], [984, 388, 0.72],
]
const VEG_BAJA = [
  [40, 604, 0.55], [78, 610, 0.92], [106, 600, 0.6], [150, 606, 0.78], [196, 612, 0.5],
  [238, 600, 0.88], [286, 608, 0.62], [330, 598, 0.96], [372, 610, 0.55], [404, 604, 0.72],
  [610, 606, 0.66], [648, 598, 0.92], [690, 610, 0.54], [736, 602, 0.8], [782, 608, 0.6],
  [828, 598, 0.86], [876, 610, 0.58], [918, 604, 0.74], [958, 600, 0.62],
]

const TONOS_PINO = ['#1b5e20', '#2e7d32', '#388e3c', '#43a047', '#255e2b', '#2f7d3a']
const TONOS_ARBOL = ['#3aa049', '#4caf50', '#2e7d32', '#57b85f', '#388e3c', '#43a047']

function derivarCaracteristicas(decisions, tramo) {
  const f = {
    arboles: 4, sueloExpuesto: 0, mineria: 'none', vertimiento: 'none',
    captacion: 'normal', cultivos: 'none', riberas: 'normal', gobernanza: false,
  }
  for (const d of Object.values(decisions ?? {})) {
    if (!d || d.ubicacion !== tramo) continue
    const alt = d.alternativa
    const cat = d.categoria
    if (cat.startsWith('1.')) {
      if (alt.startsWith('Conservar')) {
        f.arboles = 8
        f.riberas = 'protegida'
      } else if (alt.startsWith('Restaurar')) {
        f.arboles = 7
        f.riberas = 'restaurada'
      } else if (alt.startsWith('Pérdida')) {
        f.arboles = 3
        f.sueloExpuesto = 2
      } else {
        f.arboles = 1
        f.sueloExpuesto = 4
        f.riberas = 'descuidada'
      }
    } else if (cat.startsWith('2.')) {
      if (alt.startsWith('Uso eficiente')) f.captacion = 'eficiente'
      else if (alt.startsWith('Captación moderada')) f.captacion = 'moderada'
      else if (alt.startsWith('Sobreextracción')) f.captacion = 'sobreextraccion'
      else f.captacion = 'ninguna'
    } else if (cat.startsWith('3.')) {
      if (alt.startsWith('Ninguna')) f.mineria = 'none'
      else if (alt.startsWith('Minería informal')) f.mineria = 'informal'
      else f.mineria = 'formal'
    } else if (cat.startsWith('4.')) {
      if (alt.startsWith('Tratamiento completo')) f.vertimiento = 'completo'
      else if (alt.startsWith('Tratamiento parcial')) f.vertimiento = 'parcial'
      else if (alt.startsWith('Vertimiento sin tratamiento')) f.vertimiento = 'sin_tratamiento'
      else f.vertimiento = 'none'
    } else if (cat.startsWith('5.')) {
      if (alt.startsWith('Producción sostenible')) f.cultivos = 'sostenible'
      else if (alt.startsWith('Uso agropecuario')) f.cultivos = 'moderado'
      else if (alt.startsWith('Uso intensivo')) f.cultivos = 'intensivo'
      else f.cultivos = 'none'
    } else if (cat.startsWith('6.')) {
      if (alt.startsWith('Restauración integral')) f.riberas = 'restaurada'
      else if (alt.startsWith('Protección')) f.riberas = 'protegida'
      else if (alt.startsWith('Sin protección') && f.riberas === 'normal') f.riberas = 'descuidada'
    } else if (cat.startsWith('7.')) {
      f.gobernanza = alt.startsWith('Gobernanza activa') || alt.startsWith('Participación periódica')
    }
  }
  return f
}

function colorRio(valor) {
  if (valor >= 4) return '#2f9fe0'
  if (valor >= 1) return '#4bb2ea'
  if (valor === 0) return '#63bff0'
  if (valor >= -3) return '#b07a2e'
  if (valor >= -7) return '#96601f'
  return '#7c4a15'
}

const POSICIONES = {
  alta: { suelo: 206, sueloExpuesto: [180, 300, 700, 840] },
  media: { suelo: 404, sueloExpuesto: [170, 300, 710, 850] },
  baja: { suelo: 606, sueloExpuesto: [180, 310, 720, 860] },
}

const recortar = (n, arr) => arr.slice(0, Math.max(4, Math.min(arr.length, Math.round(n * 4.2))))

function Posicionado({ transform, children }) {
  return (
    <g transform={transform}>
      <g className="aparece">{children}</g>
    </g>
  )
}

function Pez({ tramo, i }) {
  return (
    <g className="pez" data-tramo={tramo} data-inicio={0.12 + i * 0.3} transform="translate(0 -999)">
      <ellipse cx="0" cy="0" rx="9" ry="5" fill="#e2f1f9" stroke="#1d6f96" strokeWidth="1.2" />
      <path d="M8 0 l8 -5 v10 z" fill="#e2f1f9" stroke="#1d6f96" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="-4" cy="-1.5" r="1.3" fill="#123a4d" />
      <title>Pez en {TRAMO_CORTO[tramo]}</title>
    </g>
  )
}

/**
 * Ilustración de la cuenca por capas, estilo vectorial editorial vibrante.
 */
export default function WatershedLandscape({
  decisions,
  state,
  stressId = null,
  className = 'h-full w-full',
  compacto = false,
  revision = 0,
}) {
  const svgRef = useRef(null)

  const caracteristicas = useMemo(
    () => Object.fromEntries(TRAMOS.map((t) => [t, derivarCaracteristicas(decisions, t)])),
    [decisions],
  )

  const rio = useMemo(() => {
    const samples = muestrearSpline(RIO_CTRL, 14)
    const geo = construirRio(samples, RIO_HW)
    return {
      ...geo,
      alta: rangoPath(samples, 140, 216),
      media: rangoPath(samples, 216, 426),
      baja: rangoPath(samples, 426, 640),
    }
  }, [])

  const lluvia = stressId === 'lluvias' || stressId === 'compuesto'
  const sequia = stressId === 'sequia' || stressId === 'compuesto'

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return undefined
    let reducido = false
    try {
      reducido = Boolean(
        typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )
    } catch {
      reducido = false
    }
    if (reducido) return undefined

    let ctx
    let cancelado = false

    Promise.all([import('gsap'), import('gsap/MotionPathPlugin')])
      .then(([{ default: gsap }, { MotionPathPlugin }]) => {
        if (cancelado) return
        gsap.registerPlugin(MotionPathPlugin)

        ctx = gsap.context(() => {
          const q = gsap.utils.selector(svg)

          gsap.to(q('.nube'), { x: 60, duration: 38, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 7 })
          gsap.to(q('.sol-halo'), { scale: 1.1, opacity: 0.5, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center' })
          gsap.to(q('.sol'), { scale: 1.03, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center' })

          gsap.to(q('.rio-flujo'), { strokeDashoffset: -240, duration: 9, repeat: -1, ease: 'none' })
          gsap.to(q('.cascada-flujo'), { strokeDashoffset: -90, duration: 1.8, repeat: -1, ease: 'none' })
          gsap.to(q('.espuma'), { opacity: 0.35, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.18 })

          q('.onda').forEach((el, i) => {
            gsap.fromTo(el, { scale: 0.4, opacity: 0.3 }, { scale: 1.5, opacity: 0, duration: 6, repeat: -1, delay: i * 1.8, ease: 'sine.out', transformOrigin: 'center' })
          })
          q('.brillo').forEach((el, i) => {
            gsap.to(el, { opacity: 0.12, duration: 2.6 + (i % 3) * 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4 })
          })

          gsap.to(q('.brisa'), {
            rotate: 1.4, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
            transformOrigin: 'bottom center', stagger: { each: 0.28, from: 'start' },
          })

          q('.pez').forEach((el, i) => {
            const tramo = el.getAttribute('data-tramo') || 'media'
            const inicio = Number(el.getAttribute('data-inicio') ?? 0.15)
            const path = `#rio-${tramo}`
            gsap.to(el, {
              motionPath: { path, start: inicio, end: Math.min(0.92, inicio + 0.42) },
              scale: 0.8, duration: 24 + i * 6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 2,
            })
          })

          q('.ave').forEach((el, i) => {
            gsap.to(el, { x: 70 + i * 20, duration: 24 + i * 6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
            gsap.to(el, { y: -8, duration: 4 + i, repeat: -1, yoyo: true, ease: 'sine.inOut' })
            gsap.to(el, { scaleY: 0.55, duration: 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center' })
          })

          if (revision > 0) {
            gsap.from(q('.capa'), { opacity: 0, y: 12, duration: 0.7, stagger: 0.08, ease: 'power2.out' })
            gsap.from(q('.aparece'), { scale: 0.85, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', transformOrigin: 'center bottom' })
            gsap.fromTo(q('.destello'), { opacity: 0.3 }, { opacity: 0, duration: 1.4, ease: 'power2.out' })
          }
        }, svg)
      })
      .catch(() => {})

    return () => {
      cancelado = true
      if (ctx) ctx.revert()
    }
  }, [revision])

  const nAlta = recortar(caracteristicas.alta.arboles, PINOS)
  const nMedia = recortar(caracteristicas.media.arboles, ARBOLES)
  const nBaja = recortar(caracteristicas.baja.arboles, VEG_BAJA)

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 640"
        className="h-full w-full"
        role="img"
        aria-label="Ilustración de una cuenca hidrográfica con montañas nevadas, cascada, bosque de pinos, río en curva, colinas, cultivos, un poblado y la desembocadura, dividida en cuenca alta, media y baja."
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5cb4ec" />
            <stop offset="55%" stopColor="#a9d8f6" />
            <stop offset="100%" stopColor="#dcefFC" />
          </linearGradient>
          <linearGradient id="montana" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d9cbb" />
            <stop offset="100%" stopColor="#4d6b8b" />
          </linearGradient>
          <linearGradient id="montanaLejos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bcd2e6" />
            <stop offset="100%" stopColor="#9fb9d2" />
          </linearGradient>
          <linearGradient id="colinaClara" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7d95e" />
            <stop offset="100%" stopColor="#7ec13f" />
          </linearGradient>
          <linearGradient id="colinaMedia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ccb4c" />
            <stop offset="100%" stopColor="#63a832" />
          </linearGradient>
          <linearGradient id="bajaVerde" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bcd86a" />
            <stop offset="100%" stopColor="#93b94c" />
          </linearGradient>
          <linearGradient id="arena" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5e2b0" />
            <stop offset="100%" stopColor="#e3c88c" />
          </linearGradient>
          <linearGradient id="aguaRio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ad3f5" />
            <stop offset="45%" stopColor="#47adea" />
            <stop offset="100%" stopColor="#2b8ccf" />
          </linearGradient>
          <linearGradient id="aguaBaja" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#47adea" />
            <stop offset="100%" stopColor="#2477b8" />
          </linearGradient>
          <linearGradient id="cascada" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#8ad3f5" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff3b0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vinetaBaja" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e7d32" stopOpacity="0" />
            <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.38" />
          </linearGradient>

          <symbol id="pino" overflow="visible">
            <rect x="-2.4" y="-9" width="4.8" height="11" rx="1.6" fill="#6b4423" />
            <path d="M0 -48 L-14 -24 L14 -24 Z" fill="var(--copa, #2e7d32)" />
            <path d="M0 -36 L-17 -9 L17 -9 Z" fill="var(--copa, #2e7d32)" />
            <path d="M0 -24 L-20 5 L20 5 Z" fill="var(--copa, #2e7d32)" />
            <path d="M0 -48 L0 5 L-20 5 Z" fill="#0d3d16" opacity="0.2" />
            <path d="M0 -48 L0 -24 L-14 -24 Z" fill="#ffffff" opacity="0.16" />
          </symbol>
          <symbol id="arbol" overflow="visible">
            <rect x="-2.4" y="-10" width="4.8" height="12" rx="1.6" fill="#6b4423" />
            <circle cx="0" cy="-22" r="16" fill="var(--copa, #4caf50)" />
            <circle cx="-10" cy="-14" r="11" fill="var(--copa2, #2e7d32)" />
            <circle cx="10" cy="-14" r="11" fill="var(--copa2, #2e7d32)" />
            <circle cx="-5" cy="-27" r="8" fill="#ffffff" opacity="0.18" />
          </symbol>
          <symbol id="arbusto" overflow="visible">
            <ellipse cx="0" cy="-6" rx="11" ry="8" fill="var(--copa, #4caf50)" />
            <ellipse cx="-4" cy="-9" rx="6.5" ry="4.5" fill="#ffffff" opacity="0.16" />
          </symbol>
          <symbol id="casa" overflow="visible">
            <rect x="-11" y="-13" width="22" height="13" fill="#fdf6e3" />
            <path d="M-14 -13 L0 -26 L14 -13 Z" fill="var(--techo, #e05a3a)" />
            <rect x="-4.5" y="-9" width="6" height="9" fill="#8a5a2b" />
            <rect x="3" y="-10" width="5" height="5" fill="#8ecae6" />
            <path d="M-14 -13 L14 -13" stroke="#d9c8a6" strokeWidth="1" />
          </symbol>
          <symbol id="roca" overflow="visible">
            <path d="M-11 0 L-6 -9 L3 -11 L11 -3 L7 0 Z" fill="#8b98a5" />
            <path d="M-6 -9 L3 -11 L1 -4 Z" fill="#c2ccd6" opacity="0.75" />
            <path d="M11 -3 L7 0 L1 -4 Z" fill="#5f6d7a" opacity="0.5" />
          </symbol>
          <symbol id="nube" overflow="visible">
            <path d="M-54 0 C-66 0 -72 -12 -63 -22 C-72 -34 -58 -48 -44 -44 C-40 -60 -15 -66 -3 -54 C9 -66 35 -64 43 -48 C62 -52 76 -38 69 -22 C82 -15 79 0 64 0 Z" fill="#ffffff" />
            <path d="M-54 0 C-66 0 -72 -12 -63 -22 C-72 -34 -58 -48 -44 -44 C-40 -60 -15 -66 -3 -54 C-24 -52 -40 -34 -40 -18 C-40 -10 -46 -2 -54 0 Z" fill="#e8f4fd" opacity="0.7" />
          </symbol>
          <symbol id="ave" overflow="visible">
            <path d="M-11 2 Q-5.5 -5 0 1 Q5.5 -5 11 2" fill="none" stroke="#3b4657" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </symbol>
        </defs>

        {/* CAPA 1: cielo */}
        <rect x="-800" y="-400" width="2600" height="1300" fill="url(#cielo)" />
        <g>
          <circle className="sol-halo" cx="878" cy="70" r={sequia ? 72 : 58} fill="url(#halo)" />
          <circle className="sol" cx="878" cy="70" r={sequia ? 40 : 31} fill="#ffe27a" />
        </g>
        <g>
          <use href="#nube" className="nube" transform="translate(160 60) scale(1)" />
          <use href="#nube" className="nube" transform="translate(360 44) scale(0.62)" />
          <use href="#nube" className="nube" transform="translate(720 96) scale(0.8)" />
        </g>
        <g>
          <use href="#ave" className="ave" transform="translate(430 70) scale(1)" />
          <use href="#ave" className="ave" transform="translate(556 52) scale(0.82)" />
          <use href="#ave" className="ave" transform="translate(300 96) scale(0.66)" />
        </g>

        {lluvia ? (
          <g stroke="#3aa6e6" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1={20 + i * 52} y1={90 + (i % 3) * 14} x2={12 + i * 52} y2={124 + (i % 3) * 14} className="animate-rain" style={{ animationDelay: `${(i % 5) * 0.15}s` }} />
            ))}
          </g>
        ) : null}

        {/* CAPA 2: montañas lejanas */}
        <g opacity="0.85">
          <path d="M-60 210 L110 92 L280 200 L360 150 L520 205 L640 120 L800 205 L900 150 L1060 210 Z" fill="url(#montanaLejos)" />
          <path d="M110 92 L146 126 L74 124 Z" fill="#ffffff" opacity="0.9" />
          <path d="M640 120 L672 150 L608 148 Z" fill="#ffffff" opacity="0.85" />
        </g>

        {/* CAPA 3: montañas con volumen, sombreado y nieve */}
        <g>
          <path d="M-80 214 L210 66 L470 214 Z" fill="url(#montana)" />
          <path d="M210 66 L470 214 L300 214 Z" fill="#3f5f7d" opacity="0.55" />
          <path d="M210 66 L300 160 L250 150 L210 168 L170 148 L120 158 L96 150 Z" fill="#ffffff" />
          <path d="M210 66 L300 160 L250 150 L210 168 Z" fill="#d5e6f4" opacity="0.7" />

          <path d="M300 214 L560 40 L820 214 Z" fill="#5f7fa0" />
          <path d="M560 40 L820 214 L640 214 Z" fill="#3a5878" opacity="0.55" />
          <path d="M560 40 L700 150 L660 138 L626 158 L592 138 L560 156 L528 136 L494 156 L462 146 L420 150 Z" fill="#ffffff" />
          <path d="M560 40 L700 150 L660 138 L626 158 L592 138 L560 156 Z" fill="#dbe9f5" opacity="0.65" />

          <path d="M680 214 L880 92 L1090 214 Z" fill="url(#montana)" />
          <path d="M880 92 L1090 214 L940 214 Z" fill="#3f5f7d" opacity="0.5" />
          <path d="M880 92 L960 150 L930 142 L900 158 L870 142 L840 152 L816 148 Z" fill="#ffffff" />
        </g>

        {/* CAPA 4: cascada con rocas y espuma */}
        <g>
          {/* poza en la base, conectada al río */}
          <ellipse cx="472" cy="202" rx="27" ry="8" fill="#8ad3f5" opacity="0.85" />
          {/* caída con ancho variable: más ancha al centro, más angosta al unirse al río */}
          <path d="M480 132 C472 154, 462 162, 466 200 L478 200 C482 162, 492 154, 494 132 Z" fill="url(#cascada)" />
          <path className="cascada-flujo" d="M487 136 C479 160, 473 176, 472 198" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="9 13" opacity="0.9" />
          {/* hendidura en la ladera donde nace el agua */}
          <path d="M474 126 C482 131, 492 131, 500 126 L494 139 C488 134, 482 134, 478 139 Z" fill="#4d6b8b" />
          {/* espuma difusa en la base */}
          <g className="espuma" fill="#ffffff">
            <ellipse cx="472" cy="200" rx="24" ry="8" opacity="0.5" />
            <ellipse cx="472" cy="203" rx="14" ry="5.5" opacity="0.8" />
          </g>
          {/* rocas grises alrededor */}
          <use href="#roca" transform="translate(446 202) scale(1.15)" />
          <use href="#roca" transform="translate(498 204) scale(0.95)" />
          <use href="#roca" transform="translate(470 210) scale(1.3)" />
        </g>

        {/* CAPA 5: terreno de la cuenca alta (colinas verdes) */}
        <path d="M-100 214 C120 178, 320 206, 520 186 C700 168, 820 200, 980 184 C1080 174, 1160 190, 1180 190 L1180 300 L-100 300 Z" fill="url(#colinaClara)" />
        <path d="M-100 240 C160 210, 360 236, 560 220 C760 204, 900 232, 1180 216 L1180 320 L-100 320 Z" fill="url(#colinaMedia)" opacity="0.85" />

        {/* CAPA 6: colinas onduladas de la cuenca media */}
        <path d="M-100 300 C60 268, 200 296, 360 280 C520 264, 660 300, 820 282 C960 266, 1100 296, 1180 286 L1180 430 L-100 430 Z" fill="url(#colinaClara)" />
        <path d="M-100 340 C120 310, 300 342, 480 326 C660 310, 820 344, 1000 328 C1100 320, 1160 332, 1180 330 L1180 440 L-100 440 Z" fill="url(#colinaMedia)" opacity="0.9" />
        <path d="M-100 384 C140 360, 320 388, 520 372 C720 356, 900 388, 1180 372 L1180 460 L-100 460 Z" fill="#5da22e" opacity="0.85" />

        {/* CAPA 7: cuenca baja (terreno cálido, extendido para llenar el marco) */}
        <path d="M-100 430 C120 414, 340 436, 560 424 C780 412, 980 436, 1180 424 L1180 900 L-100 900 Z" fill="url(#bajaVerde)" />
        <path d="M-100 500 C160 486, 380 508, 600 494 C820 480, 1020 504, 1180 492 L1180 900 L-100 900 Z" fill="url(#arena)" opacity="0.75" />

        {/* Bandas blancas onduladas que separan las tres zonas */}
        <path d="M-800 208 C-500 190, -200 224, 100 206 C400 188, 700 226, 1000 206 C1300 188, 1600 222, 1800 206 L1800 226 C1600 242, 1300 208, 1000 226 C700 244, 400 206, 100 224 C-200 242, -500 208, -800 226 Z" fill="#ffffff" />
        <path d="M-800 424 C-500 406, -200 440, 100 422 C400 404, 700 442, 1000 422 C1300 404, 1600 438, 1800 422 L1800 442 C1600 458, 1300 424, 1000 442 C700 460, 400 422, 100 440 C-200 458, -500 424, -800 442 Z" fill="#ffffff" />

        {/* CAPA 8: río (arena, cauce, brillo y corriente) */}
        <g>
          <path d={rio.arena} fill="url(#arena)" opacity="0.95" />
          <path d={rio.cauce} fill="url(#aguaRio)" />
          <path d={rio.brillo} fill="#bfe8fb" opacity="0.5" />
          <path d={rio.centro} fill="none" stroke="#ffffff" strokeWidth="2.4" strokeDasharray="7 16" opacity="0.55" className="rio-flujo" />
          {/* Trayectorias del cauce por tramo (referencia para los peces) */}
          <path id="rio-alta" d={rio.alta} fill="none" stroke="none" />
          <path id="rio-media" d={rio.media} fill="none" stroke="none" />
          <path id="rio-baja" d={rio.baja} fill="none" stroke="none" />
          {/* desembocadura: laguna ancha y curva, sin punta */}
          <path d="M236 640 C258 590, 398 570, 520 572 C646 574, 774 594, 802 640 Z" fill="url(#arena)" opacity="0.95" />
          <path d="M254 640 C274 598, 402 580, 520 582 C640 584, 760 602, 786 640 Z" fill="url(#aguaBaja)" />
          <path d="M300 634 C330 608, 430 596, 520 597 C614 598, 706 610, 736 634 Z" fill="#8ad3f5" opacity="0.5" />
          <ellipse className="onda" cx="470" cy="300" rx="16" ry="5" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.35" />
          <ellipse className="onda" cx="452" cy="430" rx="20" ry="6" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.3" />
          <circle className="brillo" cx="500" cy="250" r="2" fill="#ffffff" opacity="0.5" />
          <circle className="brillo" cx="486" cy="360" r="2" fill="#ffffff" opacity="0.5" />
          <circle className="brillo" cx="500" cy="470" r="2.2" fill="#ffffff" opacity="0.5" />
        </g>

        {/* CAPA 9: bosque, cultivos, poblado y elementos de decisión */}
        {TRAMOS.map((tramo) => {
          const f = caracteristicas[tramo]
          const p = POSICIONES[tramo]
          const valorBio = state?.clasificaciones?.[tramo]?.biodiversidad?.valor ?? 0
          const nPeces = Math.max(1, Math.min(3, Math.round(valorBio / 4)))
          const arboles = tramo === 'alta' ? nAlta : tramo === 'media' ? nMedia : nBaja
          const tonos = tramo === 'media' ? TONOS_ARBOL : TONOS_PINO
          const simbolo = tramo === 'alta' ? 'pino' : 'arbol'
          return (
            <g key={`capa-${tramo}-${revision}`} className="capa">
              {arboles.map(([x, y, s], i) => {
                const simboloArbol = tramo === 'baja' && i % 3 === 0 ? 'arbusto' : simbolo
                return (
                  <use
                    key={i}
                    href={`#${simboloArbol}`}
                    className={i % 5 === 0 ? 'brisa' : undefined}
                    transform={`translate(${x} ${y}) scale(${s})`}
                    style={{ '--copa': tonos[i % tonos.length], '--copa2': tonos[(i + 2) % tonos.length] }}
                  />
                )
              })}

              {p.sueloExpuesto.slice(0, f.sueloExpuesto).map((x, i) => (
                <ellipse key={i} className="aparece" cx={x} cy={p.suelo + 6} rx="34" ry="8" fill="#b98a52" opacity="0.75" />
              ))}

              {/* cultivos / parcelas */}
              {f.cultivos !== 'none' ? (
                <g className="aparece">
                  {[0, 1, 2].map((k) => (
                    <g key={k} transform={`translate(${624 + k * 66} ${p.suelo - 6})`}>
                      <rect x="0" y="-16" width="56" height="16" rx="2" fill={k % 2 === 0 ? '#cddc39' : '#9ccc65'} opacity="0.92" />
                      {[0, 1, 2, 3].map((r) => (
                        <path key={r} d={`M${7 + r * 13} -16 v16`} stroke="#7fa03a" strokeWidth="1.4" opacity="0.65" />
                      ))}
                    </g>
                  ))}
                  {f.cultivos === 'intensivo' ? (
                    <g transform={`translate(706 ${p.suelo - 22})`}>
                      <rect x="-8" y="-10" width="16" height="10" rx="2" fill="#78716c" />
                      <circle cx="-4" cy="-13" r="3" fill="#dc2626" />
                    </g>
                  ) : null}
                </g>
              ) : null}

              {/* poblado (cuenca media) integrado con camino y vegetación */}
              {tramo === 'media' ? (
                <g className="aparece">
                  <path d="M540 408 C610 400, 700 404, 812 396" fill="none" stroke="#c9a96a" strokeWidth="11" strokeLinecap="round" opacity="0.9" />
                  <path d="M540 408 C610 400, 700 404, 812 396" fill="none" stroke="#f0d9a6" strokeWidth="7" strokeLinecap="round" opacity="0.95" />
                  <use href="#casa" transform="translate(660 400) scale(0.95)" style={{ '--techo': '#e05a3a' }} />
                  <use href="#casa" transform="translate(700 402) scale(0.78)" style={{ '--techo': '#d98430' }} />
                  <use href="#casa" transform="translate(736 400) scale(0.9)" style={{ '--techo': '#c94f3d' }} />
                  <use href="#arbol" transform="translate(622 402) scale(0.62)" style={{ '--copa': '#4caf50', '--copa2': '#2e7d32' }} />
                  <use href="#arbol" transform="translate(776 400) scale(0.58)" style={{ '--copa': '#43a047', '--copa2': '#2e7d32' }} />
                  <use href="#arbusto" transform="translate(648 406) scale(0.62)" style={{ '--copa': '#4caf50' }} />
                  <use href="#arbusto" transform="translate(686 404) scale(0.7)" style={{ '--copa': '#43a047' }} />
                  <use href="#arbusto" transform="translate(718 406) scale(0.6)" style={{ '--copa': '#4caf50' }} />
                </g>
              ) : null}

              {/* ronda ribereña */}
              {f.riberas !== 'descuidada' ? (
                <g className="aparece" stroke={f.riberas === 'restaurada' ? '#2e7d32' : '#43a047'} strokeWidth="3" strokeLinecap="round" opacity="0.85">
                  <path d={`M${tramo === 'baja' ? 520 : 470} ${p.suelo - 6} q-10 -12 -20 -6`} fill="none" />
                  <path d={`M${tramo === 'baja' ? 600 : 560} ${p.suelo - 6} q10 -12 20 -6`} fill="none" />
                </g>
              ) : (
                <g className="aparece" stroke="#b98a52" strokeWidth="3" strokeLinecap="round" opacity="0.75">
                  <path d="M470 ${p.suelo - 4} h-30" />
                  <path d="M560 ${p.suelo - 4} h30" />
                </g>
              )}

              {f.mineria !== 'none' ? (
                <Posicionado transform={`translate(880 ${p.suelo - 8})`}>
                  {f.mineria === 'informal' ? (
                    <>
                      <path d="M-40 8 L-10 -26 L20 8 Z" fill="#6b7280" />
                      <rect x="-6" y="-6" width="16" height="14" fill="#4b5563" />
                      <path d="M-30 8 h60" stroke="#374151" strokeWidth="4" />
                      <g transform="translate(-42 -34)">
                        <path d="M0 8 L10 -8 L20 8 Z" fill="#facc15" />
                        <text x="10" y="6" textAnchor="middle" fontSize="10" fontWeight="700" fill="#78350f">!</text>
                      </g>
                    </>
                  ) : (
                    <>
                      <rect x="-30" y="-20" width="60" height="28" rx="4" fill="#a8a29e" />
                      <rect x="-24" y="-14" width="18" height="14" fill="#38bdf8" />
                      <rect x="0" y="-14" width="18" height="14" fill="#38bdf8" />
                      <path d="M-30 8 h60" stroke="#57534e" strokeWidth="4" />
                    </>
                  )}
                </Posicionado>
              ) : null}

              {f.vertimiento !== 'none' ? (
                <Posicionado transform={`translate(410 ${p.suelo - 4})`}>
                  <rect x="-26" y="-8" width="26" height="8" rx="2" fill="#57534e" />
                  <path d="M0 0 q10 8 22 10 q-12 6 -22 -2Z" fill={f.vertimiento === 'sin_tratamiento' ? '#7c4a15' : f.vertimiento === 'parcial' ? '#b07a2e' : '#4bb2ea'} opacity="0.9" />
                  {f.vertimiento === 'completo' ? (
                    <g transform="translate(-38 -18)">
                      <circle r="9" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                      <path d="M-4 0 l3 3 5 -6" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  ) : null}
                </Posicionado>
              ) : null}

              {f.captacion === 'sobreextraccion' ? (
                <Posicionado transform={`translate(560 ${p.suelo - 2})`}>
                  <path d="M0 0 v-22 h16" stroke="#475569" strokeWidth="5" fill="none" />
                  <circle cx="20" cy="-24" r="7" fill="#ef4444" />
                </Posicionado>
              ) : f.captacion === 'eficiente' ? (
                <Posicionado transform={`translate(560 ${p.suelo - 2})`}>
                  <path d="M0 0 v-18 h14" stroke="#0f68cd" strokeWidth="4" fill="none" />
                  <circle cx="18" cy="-20" r="6" fill="#22c55e" />
                </Posicionado>
              ) : null}

              {f.gobernanza ? (
                <Posicionado transform={`translate(70 ${p.suelo - 6})`}>
                  <path d="M0 0 v-26" stroke="#57534e" strokeWidth="3" />
                  <path d="M0 -26 l20 6 l-20 6 z" fill="#0f68cd" />
                </Posicionado>
              ) : null}

              {Array.from({ length: nPeces }).map((_, i) => (
                <Pez key={i} tramo={tramo} i={i} />
              ))}
            </g>
          )
        })}

        {/* CAPA 10: primer plano (viñeta suave, sin corte duro) */}
        <rect x="-800" y="470" width="2600" height="430" fill="url(#vinetaBaja)" />
        <use href="#arbusto" transform="translate(60 636) scale(1.4)" style={{ '--copa': '#2e7d32' }} />
        <use href="#arbusto" transform="translate(150 632) scale(1.1)" style={{ '--copa': '#43a047' }} />
        <use href="#arbusto" transform="translate(920 634) scale(1.3)" style={{ '--copa': '#2e7d32' }} />

        {/* Etiquetas de tramo e indicadores de estado */}
        {TRAMOS.map((tramo, i) => {
          const top = [0, 214, 430][i]
          const valorCalidad = state?.clasificaciones?.[tramo]?.calidadAgua?.valor ?? 0
          return (
            <g key={tramo}>
              <g>
                <rect x="14" y={top + 12} width={compacto ? 150 : 176} height="30" rx="15" fill="#ffffff" opacity="0.92" />
                <text x={compacto ? 89 : 102} y={top + 32} textAnchor="middle" fontSize="16" fontWeight="700" fill="#134e4a">
                  CUENCA {TRAMO_CORTO[tramo].toUpperCase()}
                </text>
              </g>
              <circle cx="202" cy={top + 27} r="8" fill={colorRio(valorCalidad)} stroke="#ffffff" strokeWidth="2" />
            </g>
          )
        })}

        {/* Indicador de estrés */}
        {stressId ? (
          <g className="aparece">
            <rect x="690" y="14" width="296" height="32" rx="16" fill="#7c2d12" opacity="0.92" />
            <text x="838" y="35" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff7ed">
              {stressId === 'sequia' ? 'ESTRÉS: SEQUÍA' : stressId === 'lluvias' ? 'ESTRÉS: LLUVIAS INTENSAS' : 'ESTRÉS: EVENTO COMPUESTO'}
            </text>
          </g>
        ) : null}

        {revision > 0 ? <rect className="destello" x="-800" y="0" width="2600" height="640" fill="#ffffff" opacity="0" pointerEvents="none" /> : null}
      </svg>
    </div>
  )
}
