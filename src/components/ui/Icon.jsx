// Set de iconos SVG (trazo, hereda currentColor). Sin dependencias externas.

const PATHS = {
  agua: <path d="M12 3c3.5 4.2 6 7.4 6 10.5A6 6 0 0 1 6 13.5C6 10.4 8.5 7.2 12 3Z" />,
  gota: <path d="M12 4c2.6 3.2 4.5 5.6 4.5 8a4.5 4.5 0 0 1-9 0c0-2.4 1.9-4.8 4.5-8Z" />,
  hoja: (
    <>
      <path d="M5 19c0-8 5-13 14-13 0 9-5 14-13 14" />
      <path d="M5 19c3-3 6-5 9-6" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  bosque: (
    <>
      <path d="M8 4 4 11h3l-3 5h8l-3-5h3L8 4Z" />
      <path d="M8 16v4" />
      <path d="M17 8l-3 5h2l-2 4h6l-2-4h2l-3-5Z" />
      <path d="M17 17v3" />
    </>
  ),
  mineria: (
    <>
      <path d="M4 20h16" />
      <path d="m5 20 4-9 4 9" />
      <path d="M13 11l6-6" />
      <path d="M16 4c2 0 4 1 4 4" />
    </>
  ),
  vertimiento: (
    <>
      <path d="M3 10h11a4 4 0 0 1 4 4v1" />
      <path d="M18 15v2" />
      <path d="M5 14v2M8 14v3M11 14v2" />
      <path d="M3 10V7h4v3" />
    </>
  ),
  cultivo: (
    <>
      <path d="M12 21V9" />
      <path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
      <path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5Z" />
      <path d="M12 16c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
      <path d="M12 16c3 0 5-2 5-5-3 0-5 2-5 5Z" />
    </>
  ),
  proteccion: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="M12 8c-1.5 1.7-2.5 2.9-2.5 4.2a2.5 2.5 0 0 0 5 0C14.5 10.9 13.5 9.7 12 8Z" />
    </>
  ),
  gobernanza: (
    <>
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <path d="M3 19c0-3 2.5-4.5 5-4.5s5 1.5 5 4.5" />
      <path d="M13 19c0-3 2.5-4.5 5-4.5s3 1 3 3" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  flecha_izq: <path d="M15 5 8 12l7 7" />,
  flecha_der: <path d="m9 5 7 7-7 7" />,
  reiniciar: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </>
  ),
  comparar: (
    <>
      <path d="M4 5h6v14H4zM14 5h6v14h-6z" />
      <path d="M12 3v18" />
    </>
  ),
  jugar: <path d="M7 4l12 8-12 8V4Z" />,
  libro: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2V5Z" />
      <path d="M8 3v18" />
    </>
  ),
  montana: <path d="m3 20 7-12 4 6 2-3 5 9H3Z" />,
  casa: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </>
  ),
  nube: <path d="M6 18h11a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 6 18Z" />,
  lluvia: (
    <>
      <path d="M6 15h11a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 6 15Z" />
      <path d="M8 18v3M12 18v3M16 18v3" />
    </>
  ),
  planta: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4 3-7 7-7 0 4-3 7-7 7Z" />
      <path d="M12 13c0-3-2.5-5-5.5-5 0 3 2.5 5 5.5 5Z" />
    </>
  ),
  pez: (
    <>
      <path d="M3 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" />
      <path d="M19 12l3-3v6l-3-3Z" />
      <circle cx="8" cy="11" r=".8" />
    </>
  ),
  gente: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
    </>
  ),
  corazon: <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20Z" />,
  fabrica: (
    <>
      <path d="M3 20V10l5 3V10l5 3V7h4v13H3Z" />
      <path d="M17 7V4h4v16" />
    </>
  ),
  medir: (
    <>
      <path d="M4 20V4h12l4 4v12H4Z" />
      <path d="M8 20v-5h6v5" />
      <path d="M8 8h6" />
    </>
  ),
}

/**
 * Icono SVG accesible. Por defecto decorativo (aria-hidden).
 * @param {{name:string,className?:string,title?:string}} props
 */
export default function Icon({ name, className = 'h-5 w-5', title }) {
  const contenido = PATHS[name] ?? PATHS.agua
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {contenido}
    </svg>
  )
}
