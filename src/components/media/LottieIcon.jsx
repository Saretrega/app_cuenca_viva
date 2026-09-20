import { useEffect, useRef, useState } from 'react'

/**
 * Reproduce una animación Lottie (lottie-web) de forma diferida:
 * lottie-web se descarga en su propio chunk solo cuando este componente se monta.
 * Si la librería o el JSON fallan, no rompe la interfaz.
 *
 * @param {{animationData:Object, className?:string, loop?:boolean, autoplay?:boolean}} props
 */
export default function LottieIcon({
  animationData,
  className = 'h-16 w-16',
  loop = false,
  autoplay = true,
}) {
  const contenedor = useRef(null)
  const [fallo, setFallo] = useState(false)

  useEffect(() => {
    let animacion
    let cancelado = false

    import('lottie-web/build/player/lottie_light')
      .then(({ default: lottie }) => {
        if (cancelado || !contenedor.current) return
        try {
          animacion = lottie.loadAnimation({
            container: contenedor.current,
            renderer: 'svg',
            loop,
            autoplay,
            animationData,
            rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
          })
        } catch {
          setFallo(true)
        }
      })
      .catch(() => setFallo(true))

    return () => {
      cancelado = true
      if (animacion) animacion.destroy()
    }
  }, [animationData, loop, autoplay])

  if (fallo) return null
  return <div ref={contenedor} className={className} aria-hidden="true" />
}
