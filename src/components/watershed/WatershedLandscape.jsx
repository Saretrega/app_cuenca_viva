// Dependencias de esta capa (instalar con):
//   npm install animejs motion motion-primitives lucide-react morphicons
// - animejs  → anima los paths del SVG (flujo del río, cascadas, vegetación, nubes, color del agua)
// - motion   → transiciones de pantalla y contenedores por tramo (motion/react)
// - motion-primitives → componentes animados reutilizables (ver src/components/motion-primitives)
// - lucide-react → íconos de apoyo (ver src/components/ui/Icon.jsx)
// - morphicons → ícono de estado que se transforma (src/components/ui/StateMorphIcon.jsx)
//
// Todo el dibujo es SVG nativo escrito a mano (sin imágenes rasterizadas).

import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { TRAMO_CORTO, TRAMOS } from '../../data/dimensions.js'
import StateMorphIcon from '../ui/StateMorphIcon.jsx'

// anime.js se importa dinámicamente (chunk aparte) para no cargarlo en el bundle inicial.
let animePromesa
function cargarAnime() {
  if (!animePromesa) animePromesa = import('animejs')
  return animePromesa
}

// ---------------------------------------------------------------------------
// Geometría del río (curvas S con ancho progresivo, generadas en código)
// ---------------------------------------------------------------------------

const RIO_CTRL = [
  [500, 430], [468, 505], [532, 585], [462, 665], [540, 745], [470, 825],
  [545, 905], [478, 985], [555, 1065], [495, 1145], [565, 1225], [505, 1305],
  [575, 1385], [560, 1460], [540, 1540],
]
const RIO_HW = [7, 10, 13, 17, 21, 26, 31, 37, 44, 52, 60, 68, 76, 84, 92]

// Desembocadura: cuerpo de agua ancho y curvo (nunca en punta)
const LAGUNA = 'M300 1600 C330 1520, 430 1492, 540 1494 C660 1496, 780 1524, 812 1600 Z'
const LAGUNA_ARENA = 'M270 1600 C300 1500, 420 1470, 540 1472 C670 1474, 800 1506, 840 1600 Z'

function catmullPoint(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
  const y = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
  return [x, y]
}

function muestrearSpline(ctrl, porTramo = 14) {
  const P = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]]
  const out = []
  for (let i = 0; i < ctrl.length - 1; i += 1) {
    for (let t = 0; t < porTramo; t += 1) out.push(catmullPoint(P[i], P[i + 1], P[i + 2], P[i + 3], t / porTramo))
  }
  out.push(ctrl[ctrl.length - 1])
  return out
}

const aPath = (pts, cerrar = false) => `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}${cerrar ? ' Z' : ''}`

function rangoPath(samples, y0, y1) {
  const pts = samples.filter((p) => p[1] >= y0 && p[1] <= y1)
  return pts.length >= 2 ? aPath(pts) : ''
}

function construirRio(samples, ctrlHw) {
  const n = samples.length
  const nSeg = ctrlHw.length - 1
  const anchos = samples.map((_, i) => {
    const u = n > 1 ? i / (n - 1) : 0
    const f = u * nSeg
    const k = Math.min(nSeg - 1, Math.floor(f))
    const s = f - k
    return ctrlHw[k] * (1 - s) + ctrlHw[k + 1] * s
  })
  const normales = samples.map((_, i) => {
    const a = samples[Math.max(0, i - 1)]
    const b = samples[Math.min(n - 1, i + 1)]
    const tx = b[0] - a[0]
    const ty = b[1] - a[1]
    const len = Math.hypot(tx, ty) || 1
    return [-ty / len, tx / len]
  })
  const poligono = (i0, i1, extra, mult = 1) => {
    const izq = []
    const der = []
    for (let i = i0; i <= i1; i += 1) {
      const hw = anchos[i] * mult + extra
      izq.push([samples[i][0] + normales[i][0] * hw, samples[i][1] + normales[i][1] * hw])
      der.push([samples[i][0] - normales[i][0] * hw, samples[i][1] - normales[i][1] * hw])
    }
    return [...izq, ...der.reverse()]
  }
  const indiceY = (y) => {
    let k = 0
    while (k < n - 1 && samples[k][1] < y) k += 1
    return k
  }
  const iMedia = indiceY(560)
  const iBaja = indiceY(1080)
  const bancoEn = (y) => {
    const k = indiceY(y)
    const p = samples[k]
    const hw = anchos[k]
    const nr = normales[k]
    return { xIzq: p[0] + nr[0] * hw, xDer: p[0] - nr[0] * hw, y: p[1] }
  }
  return {
    centro: aPath(samples),
    arena: aPath(poligono(0, n - 1, 10), true),
    cauceCompleto: aPath(poligono(0, n - 1, 0), true),
    tramos: {
      alta: { cauce: aPath(poligono(0, iMedia, 0), true), brillo: aPath(poligono(0, iMedia, 0, 0.34), true) },
      media: { cauce: aPath(poligono(Math.max(0, iMedia - 1), iBaja, 0), true), brillo: aPath(poligono(Math.max(0, iMedia - 1), iBaja, 0, 0.34), true) },
      baja: { cauce: aPath(poligono(Math.max(0, iBaja - 1), n - 1, 0), true), brillo: aPath(poligono(Math.max(0, iBaja - 1), n - 1, 0, 0.34), true) },
    },
    banco: { alta: bancoEn(520), media: bancoEn(1040), baja: bancoEn(1560) },
    alta: rangoPath(samples, 430, 560),
    media: rangoPath(samples, 560, 1080),
    baja: rangoPath(samples, 1080, 1600),
  }
}

// ---------------------------------------------------------------------------
// Vegetación: distribución orgánica con PRNG sembrado (determinista)
// ---------------------------------------------------------------------------

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generarBosque({ x0, x1, y0, y1, cantidad, sMin, sMax, seed }) {
  const rnd = mulberry32(seed)
  const out = []
  for (let i = 0; i < cantidad; i += 1) {
    out.push([
      Math.round(x0 + rnd() * (x1 - x0)),
      Math.round(y0 + rnd() * (y1 - y0)),
      +(sMin + rnd() * (sMax - sMin)).toFixed(2),
    ])
  }
  return out
}

// Bosque extendido más allá del viewBox (llena contenedores anchos) y con
// tamaños mayores, manteniendo variación entre árboles.
const BOSQUE_ALTA = generarBosque({ x0: -1700, x1: 2700, y0: 392, y1: 552, cantidad: 74, sMin: 0.75, sMax: 1.95, seed: 11 })
const BOSQUE_MEDIA = generarBosque({ x0: -1700, x1: 2700, y0: 640, y1: 1044, cantidad: 60, sMin: 0.95, sMax: 2.25, seed: 22 })
const BOSQUE_BAJA = generarBosque({ x0: -1700, x1: 2700, y0: 1146, y1: 1564, cantidad: 40, sMin: 0.85, sMax: 1.95, seed: 33 })

const TONOS_PINO = ['#1b5e20', '#2e7d32', '#388e3c', '#43a047', '#255e2b', '#2f7d3a']
const TONOS_ARBOL = ['#3aa049', '#4caf50', '#2e7d32', '#57b85f', '#388e3c', '#43a047']
const TONOS_PINO_SECO = ['#6b7d2e', '#7d8a34', '#5f7029', '#8a943f', '#77862f']
const TONOS_ARBOL_SECO = ['#7d8a3a', '#8f9a45', '#6f7d33', '#9aa64e', '#879436']

function densidadVegetacion(valorBio) {
  return Math.max(0.12, Math.min(1, (valorBio + 7) / 15))
}

// ---------------------------------------------------------------------------
// Métricas → color del agua
// ---------------------------------------------------------------------------

function colorRio(valor) {
  if (valor >= 4) return '#2f9fe0'
  if (valor >= 1) return '#4bb2ea'
  if (valor === 0) return '#63bff0'
  if (valor >= -3) return '#b07a2e'
  if (valor >= -7) return '#96601f'
  return '#7c4a15'
}

function derivarCaracteristicas(decisions, tramo) {
  const f = { sueloExpuesto: 0, mineria: 'none', vertimiento: 'none', captacion: 'normal', cultivos: 'none', riberas: 'normal', gobernanza: false }
  for (const d of Object.values(decisions ?? {})) {
    if (!d || d.ubicacion !== tramo) continue
    const alt = d.alternativa
    const cat = d.categoria
    if (cat.startsWith('1.')) {
      if (alt.startsWith('Conservar')) f.riberas = 'protegida'
      else if (alt.startsWith('Restaurar')) f.riberas = 'restaurada'
      else if (alt.startsWith('Pérdida')) f.sueloExpuesto = 2
      else {
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

// ---------------------------------------------------------------------------
// Subcomponentes de la escena (SVG nativo)
// ---------------------------------------------------------------------------

/** Franja montañosa de la Cuenca Alta (anime.js: la nieve no se anima; fondo estático). */
function MountainRange() {
  return (
    <g>
      {/* Cordillera lejana */}
      <g opacity="0.85">
        <path d="M-3200 520 L-2800 300 L-2400 470 L-2000 260 L-1600 460 L-1200 280 L-800 480 L-420 250 L-160 430 L60 200 L320 440 L520 210 L760 440 L980 220 L1240 450 L1500 250 L1800 480 L2200 260 L2600 470 L3000 290 L3400 480 L3800 300 L4200 520 Z" fill="url(#montanaLejos)" />
        <path d="M-420 250 L-360 320 L-480 316 Z" fill="#ffffff" opacity="0.9" />
        <path d="M60 200 L120 280 L0 276 Z" fill="#ffffff" opacity="0.88" />
        <path d="M520 210 L580 286 L462 282 Z" fill="#ffffff" opacity="0.88" />
        <path d="M980 220 L1038 292 L922 288 Z" fill="#ffffff" opacity="0.85" />
        <path d="M-2000 260 L-1940 330 L-2060 326 Z" fill="#ffffff" opacity="0.85" />
        <path d="M2200 260 L2260 330 L2140 326 Z" fill="#ffffff" opacity="0.85" />
      </g>
      {/* Cordillera cercana con sombreado y nieve */}
      <g>
        <path d="M-2400 520 L-1850 220 L-1250 520 Z" fill="#6b8cae" />
        <path d="M-1850 220 L-1250 520 L-1560 520 Z" fill="#3f5f7d" opacity="0.5" />
        <path d="M-1850 220 L-1740 330 L-1780 316 L-1820 344 L-1860 318 L-1900 340 L-1930 330 Z" fill="#ffffff" opacity="0.95" />

        <path d="M-520 520 L60 150 L560 520 Z" fill="url(#montana)" />
        <path d="M60 150 L560 520 L300 520 Z" fill="#3f5f7d" opacity="0.55" />
        <path d="M60 150 L230 330 L170 316 L120 344 L60 318 L10 340 L-40 314 L-90 330 Z" fill="#ffffff" />
        <path d="M60 150 L230 330 L170 316 L120 344 L60 318 Z" fill="#d5e6f4" opacity="0.7" />

        <path d="M360 520 L760 96 L1200 520 Z" fill="#5f7fa0" />
        <path d="M760 96 L1200 520 L960 520 Z" fill="#3a5878" opacity="0.55" />
        <path d="M760 96 L940 320 L890 302 L846 332 L800 302 L756 334 L710 300 L664 326 L620 306 L580 316 Z" fill="#ffffff" />
        <path d="M760 96 L940 320 L890 302 L846 332 L800 302 L756 334 Z" fill="#dbe9f5" opacity="0.65" />

        <path d="M1000 520 L1300 250 L1640 520 Z" fill="url(#montana)" />
        <path d="M1300 250 L1640 520 L1420 520 Z" fill="#3f5f7d" opacity="0.5" />
        <path d="M1300 250 L1410 350 L1370 338 L1330 362 L1290 338 L1250 356 L1220 348 Z" fill="#ffffff" />

        <path d="M1900 520 L2450 210 L3050 520 Z" fill="#6b8cae" />
        <path d="M2450 210 L3050 520 L2760 520 Z" fill="#3f5f7d" opacity="0.5" />
        <path d="M2450 210 L2560 322 L2520 308 L2480 336 L2440 310 L2400 332 L2370 322 Z" fill="#ffffff" opacity="0.95" />
      </g>
    </g>
  )
}

/** Nacimiento y cascadas de la Cuenca Alta (anime.js: `.cascada-flujo`, `.espuma`). */
function Cascadas() {
  return (
    <g>
      <ellipse cx="500" cy="424" rx="42" ry="12" fill="#8ad3f5" opacity="0.85" />
      {/* Tres cascadas pequeñas que nacen de la ladera y convergen */}
      <path d="M470 286 C462 322, 452 344, 462 424 L486 424 C476 350, 486 322, 492 286 Z" fill="url(#cascada)" />
      <path d="M512 300 C508 338, 500 360, 508 424 L530 424 C522 362, 530 338, 534 300 Z" fill="url(#cascada)" opacity="0.95" />
      <path d="M486 250 C478 296, 470 330, 478 424 L498 424 C492 340, 500 300, 508 250 Z" fill="url(#cascada)" opacity="0.9" />
      <path className="cascada-flujo" d="M489 256 C482 300, 476 360, 482 424" fill="none" stroke="#ffffff" strokeWidth="3.4" strokeDasharray="9 13" opacity="0.9" />
      <path className="cascada-flujo" d="M520 306 C516 350, 510 386, 514 424" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeDasharray="8 12" opacity="0.85" />
      <g className="espuma" fill="#ffffff">
        <ellipse cx="500" cy="420" rx="38" ry="11" opacity="0.5" />
        <ellipse cx="500" cy="425" rx="22" ry="7" opacity="0.8" />
      </g>
      <use href="#roca" transform="translate(456 424) scale(1.3)" />
      <use href="#roca" transform="translate(548 428) scale(1.05)" />
      <use href="#roca" transform="translate(500 438) scale(1.5)" />
      <use href="#roca" transform="translate(430 470) scale(0.9)" />
      <use href="#roca" transform="translate(576 480) scale(0.85)" />
    </g>
  )
}

/** Río: cauce por tramo (color ← calidad del agua), reflejo y corriente. */
function River({ rio, state }) {
  return (
    <g>
      <path d={rio.arena} fill="url(#arena)" opacity="0.95" />
      {TRAMOS.map((tramo) => {
        const valor = state?.clasificaciones?.[tramo]?.calidadAgua?.valor ?? 0
        return (
          <g key={tramo}>
            <path data-cauce={tramo} className="rio-animado" d={rio.tramos[tramo].cauce} fill={colorRio(valor)} />
            <path d={rio.tramos[tramo].brillo} fill="#bfe8fb" opacity="0.42" />
          </g>
        )
      })}
      <path d={rio.centro} fill="none" stroke="#ffffff" strokeWidth="2.6" strokeDasharray="8 18" opacity="0.5" className="rio-flujo" />
      {/* Trayectorias por tramo (referencia para los peces) */}
      <path id="rio-alta" d={rio.alta} fill="none" stroke="none" />
      <path id="rio-media" d={rio.media} fill="none" stroke="none" />
      <path id="rio-baja" d={rio.baja} fill="none" stroke="none" />
      {/* Desembocadura */}
      <path d={LAGUNA_ARENA} fill="url(#arena)" opacity="0.95" />
      <path data-cauce="laguna" className="rio-animado" d={LAGUNA} fill={colorRio(state?.clasificaciones?.baja?.calidadAgua?.valor ?? 0)} />
      <path d="M340 1568 C400 1532, 520 1522, 620 1540 C700 1554, 760 1578, 786 1596 L360 1596 C338 1588, 330 1578, 340 1568 Z" fill="#8ad3f5" opacity="0.4" />
    </g>
  )
}

/** Humedales y canales secundarios de la Cuenca Baja. */
function Humedales() {
  return (
    <g className="aparece" opacity="0.9">
      <path d="M300 1180 C360 1160, 420 1196, 470 1188" fill="none" stroke="#7cc9f0" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
      <path d="M700 1260 C760 1242, 820 1276, 872 1266" fill="none" stroke="#7cc9f0" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="352" cy="1300" rx="46" ry="16" fill="#8ad3f5" opacity="0.5" />
      <ellipse cx="820" cy="1380" rx="52" ry="18" fill="#8ad3f5" opacity="0.45" />
      <path d="M760 1150 C820 1132, 880 1160, 930 1152" fill="none" stroke="#7cc9f0" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
    </g>
  )
}

/** Cultivos: parcelas geométricas amarillo-verde (Cuenca Media). */
function Fields({ y = 1010 }) {
  return (
    <g className="aparece">
      {[0, 1, 2, 3].map((k) => (
        <g key={k} transform={`translate(${596 + k * 96} ${y + (k % 2) * 26})`}>
          <rect x="0" y="-22" width="86" height="22" rx="2" fill={k % 2 === 0 ? '#cddc39' : '#9ccc65'} opacity="0.92" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <path key={r} d={`M${9 + r * 14} -22 v22`} stroke="#7fa03a" strokeWidth="1.6" opacity="0.6" />
          ))}
        </g>
      ))}
    </g>
  )
}

/** Poblado rural: casas con techos rojizos + camino de tierra + árboles (Cuenca Media). */
function Village({ y = 1046 }) {
  return (
    <g className="aparece">
      <path d={`M520 ${y + 10} C620 ${y - 2}, 740 ${y + 4}, 880 ${y - 10}`} fill="none" stroke="#c9a96a" strokeWidth="22" strokeLinecap="round" opacity="0.9" />
      <path d={`M520 ${y + 10} C620 ${y - 2}, 740 ${y + 4}, 880 ${y - 10}`} fill="none" stroke="#f0d9a6" strokeWidth="14" strokeLinecap="round" opacity="0.95" />
      <use href="#casa" transform={`translate(636 ${y}) scale(2.1)`} style={{ '--techo': '#e05a3a' }} />
      <use href="#casa" transform={`translate(706 ${y + 8}) scale(1.7)`} style={{ '--techo': '#d98430' }} />
      <use href="#casa" transform={`translate(772 ${y}) scale(1.95)`} style={{ '--techo': '#c94f3d' }} />
      <use href="#arbol" transform={`translate(578 ${y + 4}) scale(1.35)`} style={{ '--copa': '#4caf50', '--copa2': '#2e7d32' }} />
      <use href="#arbol" transform={`translate(836 ${y}) scale(1.25)`} style={{ '--copa': '#43a047', '--copa2': '#2e7d32' }} />
      <use href="#arbusto" transform={`translate(602 ${y + 14}) scale(1.2)`} style={{ '--copa': '#4caf50' }} />
      <use href="#arbusto" transform={`translate(676 ${y + 18}) scale(1.1)`} style={{ '--copa': '#43a047' }} />
      <use href="#arbusto" transform={`translate(806 ${y + 14}) scale(1.15)`} style={{ '--copa': '#4caf50' }} />
    </g>
  )
}

/** Vegetación de un tramo: pinos (Alta), caducifolios (Media/Baja) con tonos y densidad por biodiversidad. */
function Vegetation({ tramo, valorBio, seco, simboloBase }) {
  const base = tramo === 'alta' ? BOSQUE_ALTA : tramo === 'media' ? BOSQUE_MEDIA : BOSQUE_BAJA
  const tonos = tramo === 'media' ? (seco ? TONOS_ARBOL_SECO : TONOS_ARBOL) : (seco ? TONOS_PINO_SECO : TONOS_PINO)
  const n = Math.max(4, Math.round(base.length * densidadVegetacion(valorBio)))
  return (
    <g>
      {base.slice(0, n).map(([x, y, s], i) => {
        const simbolo = tramo === 'baja' && i % 3 === 0 ? 'arbusto' : simboloBase
        return (
          <use
            key={i}
            href={`#${simbolo}`}
            className={i % 6 === 0 ? 'brisa' : undefined}
            transform={`translate(${x} ${y}) scale(${s})`}
            style={{ '--copa': tonos[i % tonos.length], '--copa2': tonos[(i + 2) % tonos.length] }}
          />
        )
      })}
    </g>
  )
}

function Pez({ tramo, i }) {
  return (
    <g className="pez" data-tramo={tramo} data-inicio={0.1 + i * 0.3} transform="translate(0 -999)">
      <ellipse cx="0" cy="0" rx="10" ry="5.5" fill="#e2f1f9" stroke="#1d6f96" strokeWidth="1.2" />
      <path d="M9 0 l9 -5.5 v11 z" fill="#e2f1f9" stroke="#1d6f96" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="-4.5" cy="-1.6" r="1.4" fill="#123a4d" />
      <title>Pez en {TRAMO_CORTO[tramo]}</title>
    </g>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function WatershedLandscape({
  decisions,
  state,
  stressId = null,
  className = 'h-full w-full',
  revision = 0,
}) {
  const svgRef = useRef(null)

  const caracteristicas = useMemo(
    () => Object.fromEntries(TRAMOS.map((t) => [t, derivarCaracteristicas(decisions, t)])),
    [decisions],
  )
  const rio = useMemo(() => construirRio(muestrearSpline(RIO_CTRL, 14), RIO_HW), [])

  const lluvia = stressId === 'lluvias' || stressId === 'compuesto'
  const sequia = stressId === 'sequia' || stressId === 'compuesto'

  // Animación continua del paisaje (anime.js)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return undefined
    let reducido = false
    try {
      reducido = Boolean(typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    } catch {
      reducido = false
    }
    if (reducido) return undefined

    let anims = []
    let cancelado = false

    cargarAnime().then(({ animate, stagger, svg: animeSvg }) => {
      if (cancelado) return
      const q = (sel) => Array.from(svg.querySelectorAll(sel))
      const correr = (targets, opciones) => {
        const lista = Array.isArray(targets) ? targets : [targets]
        if (!lista.length || !lista[0]) return
        try {
          anims.push(animate(lista, opciones))
        } catch {
          // algunas APIs SVG no existen en entornos de prueba: se ignora
        }
      }

      correr(q('.nube'), { translateX: [0, 70], duration: 42000, loop: true, alternate: true, ease: 'inOutSine', delay: stagger(7000) })
      correr(q('.rio-flujo'), { strokeDashoffset: [0, -260], duration: 9000, loop: true, ease: 'linear' })
      correr(q('.cascada-flujo'), { strokeDashoffset: [0, -120], duration: 1600, loop: true, ease: 'linear' })
      correr(q('.espuma'), { opacity: [0.85, 0.32], duration: 1500, loop: true, alternate: true, ease: 'inOutSine' })
      correr(q('.brisa'), { rotate: [-1.4, 1.4], duration: 3400, loop: true, alternate: true, ease: 'inOutSine', delay: stagger(140) })
      correr(q('.ave'), { translateX: [0, 80], duration: 26000, loop: true, alternate: true, ease: 'inOutSine', delay: stagger(3000) })
      correr(q('.ave'), { scaleY: [1, 0.55], duration: 520, loop: true, alternate: true, ease: 'inOutSine' })

      // Peces confinados al cauce (anime.js SVG motion path)
      q('.pez').forEach((el, i) => {
        const tramo = el.getAttribute('data-tramo') || 'media'
        const pathEl = svg.querySelector(`#rio-${tramo}`)
        if (!pathEl) return
        try {
          const mp = animeSvg.createMotionPath(pathEl)
          anims.push(
            animate(el, {
              translateX: mp.translateX,
              translateY: mp.translateY,
              duration: 16000 + i * 4000,
              loop: true,
              alternate: true,
              ease: 'inOutSine',
              delay: i * 1500,
            }),
          )
        } catch {
          // getTotalLength no existe en jsdom: se ignora
        }
      })
    })

    return () => {
      cancelado = true
      anims.forEach((a) => a?.pause?.())
      anims = []
    }
  }, [revision])

  // Transición animada del color del agua cuando cambian las métricas (anime.js)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return undefined
    let anims = []
    let cancelado = false
    const aplicar = (animate) => {
      const animarColor = (el, valor) => {
        if (!el) return
        try {
          anims.push(animate(el, { fill: colorRio(valor), duration: 900, ease: 'inOutQuad' }))
        } catch {
          el.setAttribute('fill', colorRio(valor))
        }
      }
      TRAMOS.forEach((tramo) => {
        animarColor(svg.querySelector(`[data-cauce="${tramo}"]`), state?.clasificaciones?.[tramo]?.calidadAgua?.valor ?? 0)
      })
      animarColor(svg.querySelector('[data-cauce="laguna"]'), state?.clasificaciones?.baja?.calidadAgua?.valor ?? 0)
    }
    cargarAnime()
      .then(({ animate }) => {
        if (!cancelado) aplicar(animate)
      })
      .catch(() => {
        if (!cancelado) {
          TRAMOS.forEach((tramo) => {
            const el = svg.querySelector(`[data-cauce="${tramo}"]`)
            if (el) el.setAttribute('fill', colorRio(state?.clasificaciones?.[tramo]?.calidadAgua?.valor ?? 0))
          })
        }
      })
    return () => {
      cancelado = true
      anims.forEach((a) => a?.pause?.())
      anims = []
    }
  }, [state])

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1600"
        className="h-full w-full"
        role="img"
        aria-label="Ilustración vertical de una cuenca hidrográfica con montañas nevadas, cascadas, bosque de pinos, río sinuoso, valle con cultivos y poblado, y una desembocadura ancha."
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5cb4ec" />
            <stop offset="45%" stopColor="#a9d8f6" />
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
          <linearGradient id="colinaAlta" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fd35f" />
            <stop offset="100%" stopColor="#5fae35" />
          </linearGradient>
          <linearGradient id="valle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7d95e" />
            <stop offset="100%" stopColor="#7ec13f" />
          </linearGradient>
          <linearGradient id="llanura" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c6d86a" />
            <stop offset="55%" stopColor="#d8c98a" />
            <stop offset="100%" stopColor="#c9ab72" />
          </linearGradient>
          <linearGradient id="arena" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5e2b0" />
            <stop offset="100%" stopColor="#e3c88c" />
          </linearGradient>
          <linearGradient id="cascada" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#8ad3f5" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff3b0" stopOpacity="0" />
          </radialGradient>

          {/* Oculta la vegetación que caiga sobre el agua */}
          <mask id="mask-tierra" maskUnits="userSpaceOnUse" x="-3200" y="-600" width="7400" height="3000">
            <rect x="-3200" y="-600" width="7400" height="3000" fill="#ffffff" />
            <path d={rio.cauceCompleto} fill="#000000" />
            <path d={LAGUNA} fill="#000000" />
          </mask>
          {/* Mantiene a los peces dentro del cauce */}
          <clipPath id="clip-rio">
            <path d={rio.cauceCompleto} />
            <path d={LAGUNA} />
          </clipPath>

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

        {/* CAPA: cielo (estático + nubes animadas con anime.js) */}
        <rect x="-3200" y="-600" width="7400" height="3000" fill="url(#cielo)" />
        <g>
          <circle className="sol-halo" cx="820" cy="120" r={sequia ? 96 : 76} fill="url(#halo)" />
          <circle className="sol" cx="820" cy="120" r={sequia ? 52 : 40} fill="#ffe27a" />
        </g>
        <g>
          <use href="#nube" className="nube" transform="translate(200 110) scale(1.3)" />
          <use href="#nube" className="nube" transform="translate(620 70) scale(0.9)" />
          <use href="#nube" className="nube" transform="translate(1000 150) scale(1.1)" />
          <use href="#nube" className="nube" transform="translate(-200 160) scale(0.8)" />
        </g>
        <g>
          <use href="#ave" className="ave" transform="translate(360 150) scale(1.1)" />
          <use href="#ave" className="ave" transform="translate(560 120) scale(0.9)" />
          <use href="#ave" className="ave" transform="translate(720 190) scale(0.8)" />
        </g>

        {lluvia ? (
          <g stroke="#3aa6e6" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
            {Array.from({ length: 26 }).map((_, i) => (
              <line key={i} x1={-40 + i * 52} y1={140 + (i % 4) * 20} x2={-48 + i * 52} y2={190 + (i % 4) * 20} className="animate-rain" style={{ animationDelay: `${(i % 5) * 0.15}s` }} />
            ))}
          </g>
        ) : null}

        {/* ZONA 1: CUENCA ALTA */}
        <MountainRange />
        <path d="M-3200 540 C-2400 500, -1600 532, -800 512 C-300 496, 200 528, 700 496 C1100 470, 1500 512, 2000 494 C2600 476, 3200 508, 4200 490 L4200 760 L-3200 760 Z" fill="url(#colinaAlta)" />
        <Cascadas />
        <g mask="url(#mask-tierra)">
          <motion.g key={`alta-${revision}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Vegetation tramo="alta" valorBio={state?.clasificaciones?.alta?.biodiversidad?.valor ?? 0} seco={(state?.clasificaciones?.alta?.biodiversidad?.valor ?? 0) < 0} simboloBase="pino" />
            <use href="#roca" transform="translate(240 500) scale(1.1)" />
            <use href="#roca" transform="translate(760 470) scale(0.95)" />
            <use href="#roca" transform="translate(60 540) scale(0.85)" />
          </motion.g>
        </g>

        {/* ZONA 2: CUENCA MEDIA */}
        <path d="M-3200 660 C-2400 612, -1600 652, -800 626 C-200 604, 300 648, 800 614 C1200 586, 1600 632, 2200 606 C2800 582, 3400 626, 4200 600 L4200 1180 L-3200 1180 Z" fill="url(#valle)" />
        <path d="M-3200 800 C-2400 748, -1600 792, -800 762 C-200 736, 300 796, 800 748 C1200 706, 1600 780, 2200 742 C2800 708, 3400 776, 4200 738 L4200 1220 L-3200 1220 Z" fill="#63a832" opacity="0.55" />
        <Fields y={1010} />
        <Village y={1046} />
        <g mask="url(#mask-tierra)">
          <motion.g key={`media-${revision}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Vegetation tramo="media" valorBio={state?.clasificaciones?.media?.biodiversidad?.valor ?? 0} seco={(state?.clasificaciones?.media?.biodiversidad?.valor ?? 0) < 0} simboloBase="arbol" />
            <use href="#roca" transform="translate(200 900) scale(1)" />
            <use href="#roca" transform="translate(880 860) scale(0.9)" />
          </motion.g>
        </g>

        {/* ZONA 3: CUENCA BAJA */}
        <path d="M-3200 1140 C-2400 1090, -1600 1130, -800 1104 C-200 1080, 300 1124, 800 1092 C1200 1064, 1600 1108, 2200 1082 C2800 1058, 3400 1100, 4200 1076 L4200 2600 L-3200 2600 Z" fill="url(#llanura)" />
        <Humedales />
        <g mask="url(#mask-tierra)">
          <motion.g key={`baja-${revision}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Vegetation tramo="baja" valorBio={state?.clasificaciones?.baja?.biodiversidad?.valor ?? 0} seco={(state?.clasificaciones?.baja?.biodiversidad?.valor ?? 0) < 0} simboloBase="arbol" />
          </motion.g>
        </g>

        {/* CAPA: río (por encima del terreno, debajo de la vegetación baja de orilla) */}
        <River rio={rio} state={state} />

        {/* CAPA: peces (confinados al cauce con clipPath) */}
        <g clipPath="url(#clip-rio)">
          {TRAMOS.map((tramo) => {
            const valorBio = state?.clasificaciones?.[tramo]?.biodiversidad?.valor ?? 0
            const nPeces = valorBio <= -4 ? 0 : Math.max(1, Math.min(3, Math.round(valorBio / 4) + 1))
            return Array.from({ length: nPeces }).map((_, i) => <Pez key={`${tramo}-${i}`} tramo={tramo} i={i} />)
          })}
        </g>

        {/* CAPA: elementos de decisión (minería, vertimiento, captación, gobernanza) */}
        <g mask="url(#mask-tierra)">
          {TRAMOS.map((tramo) => {
            const f = caracteristicas[tramo]
            const banco = rio.banco[tramo]
            const y = tramo === 'alta' ? 500 : tramo === 'media' ? 980 : 1400
            return (
              <g key={`feat-${tramo}`}>
                {f.sueloExpuesto ? (
                  <g className="aparece">
                    {Array.from({ length: f.sueloExpuesto }).map((_, i) => (
                      <ellipse key={i} cx={150 + i * 190} cy={y + 20} rx="40" ry="12" fill="#b98a52" opacity="0.75" />
                    ))}
                  </g>
                ) : null}
                {f.riberas !== 'descuidada' ? (
                  <g className="aparece">
                    <use href="#arbusto" transform={`translate(${banco.xIzq - 30} ${banco.y}) scale(0.8)`} style={{ '--copa': f.riberas === 'restaurada' ? '#2e7d32' : '#43a047' }} />
                    <use href="#arbusto" transform={`translate(${banco.xDer + 30} ${banco.y}) scale(0.8)`} style={{ '--copa': f.riberas === 'restaurada' ? '#2e7d32' : '#43a047' }} />
                  </g>
                ) : null}
                {f.mineria !== 'none' ? (
                  <g className="aparece" transform={`translate(1200 ${y})`}>
                    {f.mineria === 'informal' ? (
                      <>
                        <path d="M-46 10 L-12 -30 L22 10 Z" fill="#6b7280" />
                        <rect x="-7" y="-7" width="18" height="16" fill="#4b5563" />
                        <path d="M-34 10 h68" stroke="#374151" strokeWidth="4" />
                        <g transform="translate(-48 -38)">
                          <path d="M0 9 L11 -9 L22 9 Z" fill="#facc15" />
                          <text x="11" y="7" textAnchor="middle" fontSize="11" fontWeight="700" fill="#78350f">!</text>
                        </g>
                      </>
                    ) : (
                      <>
                        <rect x="-34" y="-22" width="68" height="30" rx="4" fill="#a8a29e" />
                        <rect x="-27" y="-15" width="20" height="15" fill="#38bdf8" />
                        <rect x="2" y="-15" width="20" height="15" fill="#38bdf8" />
                        <path d="M-34 8 h68" stroke="#57534e" strokeWidth="4" />
                      </>
                    )}
                  </g>
                ) : null}
                {f.vertimiento !== 'none' ? (
                  <g className="aparece" transform={`translate(${banco.xIzq - 70} ${banco.y})`}>
                    <rect x="-30" y="-9" width="30" height="9" rx="2" fill="#57534e" />
                    <path d="M0 0 q12 9 26 11 q-14 7 -26 -2Z" fill={f.vertimiento === 'sin_tratamiento' ? '#7c4a15' : f.vertimiento === 'parcial' ? '#b07a2e' : '#4bb2ea'} opacity="0.9" />
                  </g>
                ) : null}
                {f.captacion === 'sobreextraccion' ? (
                  <g className="aparece" transform={`translate(${banco.xDer + 70} ${banco.y})`}>
                    <path d="M0 0 v-24 h18" stroke="#475569" strokeWidth="5" fill="none" />
                    <circle cx="22" cy="-26" r="8" fill="#ef4444" />
                  </g>
                ) : f.captacion === 'eficiente' ? (
                  <g className="aparece" transform={`translate(${banco.xDer + 70} ${banco.y})`}>
                    <path d="M0 0 v-20 h16" stroke="#0f68cd" strokeWidth="4" fill="none" />
                    <circle cx="20" cy="-22" r="7" fill="#22c55e" />
                  </g>
                ) : null}
                {f.gobernanza ? (
                  <g className="aparece" transform={`translate(90 ${y})`}>
                    <path d="M0 0 v-28" stroke="#57534e" strokeWidth="3" />
                    <path d="M0 -28 l22 7 l-22 7 z" fill="#0f68cd" />
                  </g>
                ) : null}
              </g>
            )
          })}
        </g>

        {revision > 0 ? <rect className="destello" x="-800" y="0" width="2600" height="1600" fill="#ffffff" opacity="0" pointerEvents="none" /> : null}
      </svg>

      {/* Etiquetas y estado por tramo FUERA del SVG (interfaz) */}
      <div className="pointer-events-none absolute inset-0">
        {TRAMOS.map((tramo, i) => {
          const cl = state?.clasificaciones?.[tramo]
          const valorCalidad = cl?.calidadAgua?.valor ?? 0
          const alerta = (cl?.resiliencia?.valor ?? 0) <= -6 || (cl?.disponibilidad?.valor ?? 0) <= -6
          return (
            <div
              key={tramo}
              className="absolute left-2 flex items-center gap-1.5 sm:left-3"
              style={{ top: `${[1.5, 36, 68.5][i]}%` }}
            >
              <span className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold tracking-wide text-teal-900 shadow-sm sm:text-xs">
                CUENCA {TRAMO_CORTO[tramo].toUpperCase()}
              </span>
              <span
                className="h-3 w-3 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: colorRio(valorCalidad) }}
                title={`Calidad del agua: ${valorCalidad}`}
              />
              <StateMorphIcon alerta={alerta} size={16} className={alerta ? 'text-deterioro-600' : 'text-bosque-600'} title={alerta ? 'Alerta' : 'Estable'} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
