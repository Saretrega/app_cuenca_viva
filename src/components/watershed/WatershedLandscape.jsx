import { useMemo } from 'react'
import { TRAMO_CORTO, TRAMOS } from '../../data/dimensions.js'

// --- Derivación de características visuales a partir de las decisiones ---

function derivarCaracteristicas(decisions, tramo) {
  const f = {
    arboles: 4,
    sueloExpuesto: 0,
    mineria: 'none', // none | formal | informal
    vertimiento: 'none', // none | completo | parcial | sin_tratamiento
    captacion: 'normal', // normal | eficiente | moderada | sobreextraccion | ninguna
    cultivos: 'none', // none | sostenible | moderado | intensivo
    riberas: 'normal', // normal | protegida | restaurada | descuidada
    gobernanza: false,
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
      else if (alt.startsWith('Intervención')) f.riberas = f.riberas === 'normal' ? 'normal' : f.riberas
      else if (alt.startsWith('Sin protección') && f.riberas === 'normal') f.riberas = 'descuidada'
    } else if (cat.startsWith('7.')) {
      f.gobernanza = alt.startsWith('Gobernanza activa') || alt.startsWith('Participación periódica')
    }
  }
  return f
}

function colorRio(valor) {
  if (valor >= 4) return '#0ea5e9'
  if (valor >= 1) return '#38bdf8'
  if (valor === 0) return '#7dd3fc'
  if (valor >= -3) return '#c0885a'
  if (valor >= -7) return '#9a6a3f'
  return '#6b4a2b'
}

const POSICIONES = {
  alta: {
    suelo: 200,
    arboles: [70, 130, 190, 250, 320, 650, 720, 790, 860],
    fauna: [300, 360, 700, 760, 820],
    sueloExpuesto: [180, 300, 700, 840],
  },
  media: {
    suelo: 400,
    arboles: [60, 120, 190, 260, 330, 660, 730, 800, 870],
    fauna: [280, 350, 690, 770, 840],
    sueloExpuesto: [170, 300, 710, 850],
  },
  baja: {
    suelo: 600,
    arboles: [60, 130, 200, 270, 340, 660, 730, 800, 870],
    fauna: [290, 360, 700, 780, 850],
    sueloExpuesto: [180, 310, 720, 860],
  },
}

function Arbol({ x, y, escala = 1, tono = '#15803d' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <rect x="-2" y="-8" width="4" height="10" rx="1" fill="#71482a" />
      <circle cx="0" cy="-16" r="10" fill={tono} />
      <circle cx="-6" cy="-10" r="7" fill="#166534" />
      <circle cx="6" cy="-10" r="7" fill="#166534" />
    </g>
  )
}

function Fauna({ x, y, tipo = 'pez' }) {
  if (tipo === 'ave') {
    return (
      <path
        d={`M${x - 8} ${y} q4 -6 8 0 q4 -6 8 0`}
        fill="none"
        stroke="#334155"
        strokeWidth="2"
        strokeLinecap="round"
      />
    )
  }
  return (
    <g transform={`translate(${x} ${y})`} opacity="0.9">
      <path d="M-9 0 q9 -6 18 0 q-9 6 -18 0Z" fill="#0e7490" />
      <path d="M9 0 l5 -3 v6 z" fill="#0e7490" />
    </g>
  )
}

/**
 * Paisaje interactivo de la cuenca. Reacciona a las decisiones y al estrés.
 * @param {{decisions:Object, state:Object, stressId?:string|null, className?:string, compacto?:boolean}} props
 */
export default function WatershedLandscape({
  decisions,
  state,
  stressId = null,
  className = '',
  compacto = false,
}) {
  const caracteristicas = useMemo(
    () => Object.fromEntries(TRAMOS.map((t) => [t, derivarCaracteristicas(decisions, t)])),
    [decisions],
  )

  const lluvia = stressId === 'lluvias' || stressId === 'compuesto'
  const sequia = stressId === 'sequia' || stressId === 'compuesto'

  return (
    <svg
      viewBox="0 0 1000 640"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Paisaje de la cuenca hidrográfica dividida en cuenca alta, media y baja, que refleja las decisiones tomadas."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>
        <linearGradient id="sueloAlta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="sueloMedia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <linearGradient id="sueloBaja" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d4b083" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="640" fill="url(#cielo)" />

      {/* Sol (más intenso con sequía) */}
      <circle cx="880" cy="70" r={sequia ? 46 : 34} fill={sequia ? '#f59e0b' : '#fcd34d'} opacity="0.9" />
      {sequia ? (
        <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <path d="M880 8v-6M880 138v6M818 70h-6M942 70h6M836 26l-4-4M924 114l4 4M924 26l4-4M836 114l-4 4" />
        </g>
      ) : null}

      {/* Nubes */}
      <g fill="#ffffff" opacity="0.85">
        <ellipse cx="180" cy="60" rx="55" ry="22" />
        <ellipse cx="230" cy="52" rx="40" ry="18" />
      </g>
      {lluvia ? (
        <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={40 + i * 54}
              y1={90 + (i % 3) * 14}
              x2={32 + i * 54}
              y2={120 + (i % 3) * 14}
              className="animate-rain"
              style={{ animationDelay: `${(i % 5) * 0.15}s` }}
            />
          ))}
        </g>
      ) : null}

      {/* Montañas (nacimiento en alta) */}
      <g>
        <path d="M0 213 L120 90 L230 213 Z" fill="#a7b5c4" />
        <path d="M120 90 L175 150 L65 150 Z" fill="#e2e8f0" />
        <path d="M200 213 L330 70 L470 213 Z" fill="#94a3b8" />
        <path d="M330 70 L390 140 L270 140 Z" fill="#f1f5f9" />
        <path d="M700 213 L820 100 L940 213 Z" fill="#a7b5c4" />
        <path d="M820 100 L870 155 L770 155 Z" fill="#e2e8f0" />
      </g>

      {/* Suelos por tramo */}
      <rect x="0" y="200" width="1000" height="13" fill="url(#sueloAlta)" />
      <rect x="0" y="400" width="1000" height="13" fill="url(#sueloMedia)" />
      <rect x="0" y="600" width="1000" height="40" fill="url(#sueloBaja)" />

      {/* Separadores y etiquetas de tramo */}
      {TRAMOS.map((tramo, i) => {
        const top = i * 213
        const valorCalidad = state?.clasificaciones?.[tramo]?.calidadAgua?.valor ?? 0
        return (
          <g key={tramo}>
            {i > 0 ? (
              <line x1="0" y1={top} x2="1000" y2={top} stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 8" opacity="0.7" />
            ) : null}
            <g>
              <rect x="14" y={top + 14} width={compacto ? 150 : 180} height="34" rx="17" fill="#ffffff" opacity="0.9" />
              <text x={compacto ? 89 : 104} y={top + 37} textAnchor="middle" fontSize="17" fontWeight="700" fill="#134e4a">
                CUENCA {TRAMO_CORTO[tramo].toUpperCase()}
              </text>
            </g>
            <circle cx="210" cy={top + 31} r="9" fill={colorRio(valorCalidad)} stroke="#ffffff" strokeWidth="2" />
          </g>
        )
      })}

      {/* Flechas de flujo aguas abajo */}
      <g fill="#0f68cd" opacity="0.75">
        <path d="M600 40 l0 0 M596 30 l16 16 l-16 16" stroke="#0f68cd" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Río por tramo (ancho creciente y color según calidad) */}
      {TRAMOS.map((tramo) => {
        const valor = state?.clasificaciones?.[tramo]?.calidadAgua?.valor ?? 0
        const color = colorRio(valor)
        const esBaja = tramo === 'baja'
        return (
          <path
            key={tramo}
            d={
              tramo === 'alta'
                ? 'M480 90 C455 130, 520 165, 500 213'
                : tramo === 'media'
                  ? 'M500 213 C485 255, 545 300, 520 360 C512 380, 522 395, 528 426'
                  : 'M528 426 C534 465, 570 500, 548 550 C538 578, 560 605, 552 640'
            }
            fill="none"
            stroke={color}
            strokeWidth={esBaja ? 26 : tramo === 'media' ? 18 : 12}
            strokeLinecap="round"
            opacity={sequia ? 0.75 : 1}
          />
        )
      })}
      {!sequia ? (
        <path
          d="M480 90 C455 130, 520 165, 500 213 C485 255, 545 300, 520 360 C512 380, 522 395, 528 426 C534 465, 570 500, 548 550 C538 578, 560 605, 552 640"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="6 14"
          opacity="0.8"
          className="animate-flow"
        />
      ) : null}

      {/* Elementos por tramo */}
      {TRAMOS.map((tramo) => {
        const f = caracteristicas[tramo]
        const p = POSICIONES[tramo]
        const valorBio = state?.clasificaciones?.[tramo]?.biodiversidad?.valor ?? 0
        const faunaExtra = Math.max(0, Math.min(3, Math.round(valorBio / 3)))
        return (
          <g key={`elem-${tramo}`}>
            {/* árboles */}
            {p.arboles.slice(0, f.arboles).map((x, i) => (
              <Arbol key={i} x={x} y={p.suelo} escala={0.9 + (i % 3) * 0.12} />
            ))}

            {/* suelo expuesto */}
            {p.sueloExpuesto.slice(0, f.sueloExpuesto).map((x, i) => (
              <ellipse key={i} cx={x} cy={p.suelo + 6} rx="34" ry="9" fill="#a9743c" opacity="0.85" />
            ))}

            {/* ronda ribereña */}
            {f.riberas !== 'descuidada' ? (
              <g stroke={f.riberas === 'restaurada' ? '#16a34a' : '#22c55e'} strokeWidth="3" strokeLinecap="round" opacity="0.9">
                <path d={`M${470} ${p.suelo - 6} q-10 -12 -20 -6`} fill="none" />
                <path d={`M${560} ${p.suelo - 6} q10 -12 20 -6`} fill="none" />
              </g>
            ) : (
              <g stroke="#a9743c" strokeWidth="3" strokeLinecap="round" opacity="0.8">
                <path d={`M470 ${p.suelo - 4} h-30`} />
                <path d={`M560 ${p.suelo - 4} h30`} />
              </g>
            )}

            {/* cultivos */}
            {f.cultivos !== 'none' ? (
              <g opacity={f.cultivos === 'intensivo' ? 0.95 : 0.8}>
                {[0, 1, 2].map((r) => (
                  <path
                    key={r}
                    d={`M${360 + r * 16} ${p.suelo - 2} v-22`}
                    stroke={f.cultivos === 'intensivo' ? '#ca8a04' : '#65a30d'}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                ))}
                {f.cultivos === 'intensivo' ? (
                  <g>
                    <rect x="410" y={p.suelo - 16} width="26" height="16" rx="3" fill="#78716c" />
                    <circle cx="416" cy={p.suelo - 20} r="4" fill="#dc2626" />
                  </g>
                ) : null}
              </g>
            ) : null}

            {/* minería */}
            {f.mineria !== 'none' ? (
              <g transform={`translate(760 ${p.suelo - 8})`}>
                {f.mineria === 'informal' ? (
                  <>
                    <path d="M-40 8 L-10 -26 L20 8 Z" fill="#57534e" />
                    <rect x="-6" y="-6" width="16" height="14" fill="#44403c" />
                    <path d="M-30 8 h60" stroke="#3f3f46" strokeWidth="4" />
                    <g transform="translate(-42 -34)">
                      <path d="M0 8 L10 -8 L20 8 Z" fill="#facc15" />
                      <text x="10" y="6" textAnchor="middle" fontSize="10" fontWeight="700" fill="#78350f">!</text>
                    </g>
                  </>
                ) : (
                  <>
                    <rect x="-30" y="-20" width="60" height="28" rx="4" fill="#a8a29e" />
                    <rect x="-24" y="-14" width="18" height="14" fill="#0ea5e9" />
                    <rect x="0" y="-14" width="18" height="14" fill="#0ea5e9" />
                    <path d="M-30 8 h60" stroke="#57534e" strokeWidth="4" />
                  </>
                )}
              </g>
            ) : null}

            {/* vertimiento */}
            {f.vertimiento !== 'none' ? (
              <g transform={`translate(430 ${p.suelo - 4})`}>
                <rect x="-26" y="-8" width="26" height="8" rx="2" fill="#57534e" />
                <path
                  d="M0 0 q10 8 22 10 q-12 6 -22 -2Z"
                  fill={f.vertimiento === 'sin_tratamiento' ? '#78350f' : f.vertimiento === 'parcial' ? '#c0885a' : '#38bdf8'}
                  opacity="0.9"
                />
                {f.vertimiento === 'completo' ? (
                  <g transform="translate(-38 -18)">
                    <circle r="9" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                    <path d="M-4 0 l3 3 5 -6" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                  </g>
                ) : null}
              </g>
            ) : null}

            {/* captación de agua */}
            {f.captacion === 'sobreextraccion' ? (
              <g transform={`translate(540 ${p.suelo - 2})`}>
                <path d="M0 0 v-22 h16" stroke="#475569" strokeWidth="5" fill="none" />
                <circle cx="20" cy="-24" r="7" fill="#ef4444" />
              </g>
            ) : f.captacion === 'eficiente' ? (
              <g transform={`translate(540 ${p.suelo - 2})`}>
                <path d="M0 0 v-18 h14" stroke="#0f68cd" strokeWidth="4" fill="none" />
                <circle cx="18" cy="-20" r="6" fill="#22c55e" />
              </g>
            ) : null}

            {/* gobernanza */}
            {f.gobernanza ? (
              <g transform={`translate(90 ${p.suelo - 6})`}>
                <path d="M0 0 v-26" stroke="#57534e" strokeWidth="3" />
                <path d="M0 -26 l20 6 l-20 6 z" fill="#0f68cd" />
              </g>
            ) : null}

            {/* fauna (según biodiversidad) */}
            {p.fauna.slice(0, 2 + faunaExtra).map((x, i) => (
              <Fauna key={i} x={x} y={p.suelo - 30 - (i % 2) * 12} tipo={i % 3 === 0 ? 'ave' : 'pez'} />
            ))}
          </g>
        )
      })}

      {/* Indicador de estrés */}
      {stressId ? (
        <g>
          <rect x="700" y="592" width="286" height="34" rx="17" fill="#7c2d12" opacity="0.9" />
          <text x="843" y="614" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff7ed">
            {stressId === 'sequia' ? 'ESTRÉS: SEQUÍA' : stressId === 'lluvias' ? 'ESTRÉS: LLUVIAS INTENSAS' : 'ESTRÉS: EVENTO COMPUESTO'}
          </text>
        </g>
      ) : null}
    </svg>
  )
}
