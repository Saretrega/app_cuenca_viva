// Compartir escenarios por URL (sin backend): las decisiones y el escenario de
// estrés se codifican en el hash `#cuenca=<base64url(json)>`.

const PREFIJO = '#cuenca='

function aBase64Url(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function desdeBase64Url(b64) {
  const normal = b64.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(normal)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Codifica las decisiones y el estrés en un hash compartible.
 * @param {Object} decisions
 * @param {string|null} stressId
 * @returns {string} hash que empieza por `#cuenca=`
 */
export function codificarEscenario(decisions, stressId) {
  const d = Object.values(decisions ?? {}).map((x) => [x.categoria, x.alternativa, x.ubicacion])
  return PREFIJO + aBase64Url(JSON.stringify({ d, s: stressId ?? null }))
}

/**
 * Decodifica un hash `#cuenca=...` a `{ decisions, stressId }`, o null si no es válido.
 */
export function decodificarEscenario(hash) {
  try {
    if (!hash || !hash.startsWith(PREFIJO)) return null
    const { d, s } = JSON.parse(desdeBase64Url(hash.slice(PREFIJO.length)))
    if (!Array.isArray(d)) return null
    const decisions = {}
    for (const [categoria, alternativa, ubicacion] of d) {
      decisions[categoria] = { categoria, alternativa, ubicacion }
    }
    return { decisions, stressId: s ?? null }
  } catch {
    return null
  }
}

/** URL absoluta compartible del escenario actual. */
export function urlCompartible(decisions, stressId) {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}${codificarEscenario(decisions, stressId)}`
}

/** Copia al portapapeles; devuelve true si lo logró. */
export async function copiarAlPortapapeles(texto) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto)
      return true
    }
  } catch {
    // sin permiso de portapapeles
  }
  return false
}
