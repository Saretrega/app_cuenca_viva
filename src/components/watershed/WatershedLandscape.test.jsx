// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import WatershedLandscape from './WatershedLandscape.jsx'

const clasif = (valor) => ({ valor, label: `v${valor}`, tono: 'neutro', signo: 0, key: 'k' })

/** Estado mínimo con las métricas por tramo que consume la ilustración. */
function estado({ alta, media, baja }) {
  const tramo = (m) => ({
    calidadAgua: clasif(m.calidadAgua ?? 0),
    disponibilidad: clasif(m.disponibilidad ?? 0),
    biodiversidad: clasif(m.biodiversidad ?? 0),
    resiliencia: clasif(m.resiliencia ?? 0),
  })
  return {
    clasificaciones: { alta: tramo(alta), media: tramo(media), baja: tramo(baja) },
    totales: { alta: {}, media: {}, baja: {} },
  }
}

const pines = () => Array.from(document.querySelectorAll('use')).filter((u) => u.getAttribute('href') === '#pino').length
const arboles = () => Array.from(document.querySelectorAll('use')).filter((u) => u.getAttribute('href') === '#arbol').length
const coloresRio = () => Array.from(document.querySelectorAll('.rio-animado')).map((p) => p.getAttribute('fill'))

afterEach(cleanup)

describe('WatershedLandscape · conexión métricas → visual', () => {
  it('el color del agua cambia según la calidad de cada tramo', () => {
    render(
      <WatershedLandscape
        decisions={{}}
        state={estado({ alta: { calidadAgua: 8 }, media: { calidadAgua: 0 }, baja: { calidadAgua: -8 } })}
      />,
    )
    const colores = coloresRio()
    // alta, media, baja (cauce) + laguna
    expect(colores).toHaveLength(4)
    expect(colores[0]).toBe('#2f9fe0') // calidad alta → azul claro
    expect(colores[1]).toBe('#63bff0') // neutro
    expect(colores[2]).toBe('#7c4a15') // calidad muy baja → turbio
    expect(colores[3]).toBe('#7c4a15') // la laguna usa la calidad de la cuenca baja
  })

  it('la densidad de vegetación responde a la biodiversidad', () => {
    const { unmount } = render(
      <WatershedLandscape decisions={{}} state={estado({ alta: { biodiversidad: 8 }, media: {}, baja: {} })} />,
    )
    const pinosAlto = pines()
    unmount()

    const { unmount: u2 } = render(
      <WatershedLandscape decisions={{}} state={estado({ alta: { biodiversidad: 0 }, media: {}, baja: {} })} />,
    )
    const pinoNeutro = pines()
    u2()

    const { unmount: u3 } = render(
      <WatershedLandscape decisions={{}} state={estado({ alta: { biodiversidad: -8 }, media: {}, baja: {} })} />,
    )
    const pinosBajo = pines()
    u3()

    expect(pinosAlto).toBeGreaterThan(pinoNeutro)
    expect(pinoNeutro).toBeGreaterThan(pinosBajo)
    expect(pinosBajo).toBeGreaterThanOrEqual(3)
  })

  it('cada tramo refleja su propia biodiversidad de forma independiente', () => {
    const { unmount } = render(
      <WatershedLandscape
        decisions={{}}
        state={estado({ alta: { biodiversidad: 9 }, media: { biodiversidad: -8 }, baja: {} })}
      />,
    )
    const arbolesMediaBaja = arboles()
    unmount()

    render(
      <WatershedLandscape
        decisions={{}}
        state={estado({ alta: { biodiversidad: 9 }, media: { biodiversidad: 9 }, baja: {} })}
      />,
    )
    // Alta con biodiversidad alta → muchos pinos, aunque Media varíe aparte
    expect(pines()).toBeGreaterThan(20)
    // Media con biodiversidad alta tiene más árboles que con biodiversidad baja
    expect(arboles()).toBeGreaterThan(arbolesMediaBaja)
  })

  it('muestra alerta cuando disponibilidad o resiliencia están en deterioro fuerte', () => {
    const { unmount } = render(
      <WatershedLandscape decisions={{}} state={estado({ alta: {}, media: {}, baja: {} })} />,
    )
    expect(document.querySelectorAll('g[mask="url(#mask-tierra)"]')).toHaveLength(1)
    expect(document.querySelectorAll('path[fill="#dc2626"]')).toHaveLength(0)
    unmount()

    render(
      <WatershedLandscape
        decisions={{}}
        state={estado({ alta: { resiliencia: -8 }, media: {}, baja: { disponibilidad: -9 } })}
      />,
    )
    expect(document.querySelectorAll('path[fill="#dc2626"]').length).toBe(2)
  })
})
