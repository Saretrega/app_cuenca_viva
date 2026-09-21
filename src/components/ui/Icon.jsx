import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudRain,
  Columns3,
  Droplet,
  Droplets,
  Factory,
  Fish,
  Gauge,
  Handshake,
  Heart,
  House,
  Leaf,
  Maximize,
  Mountain,
  Pause,
  Pickaxe,
  Play,
  RotateCcw,
  Share2,
  Shield,
  ShieldCheck,
  Sprout,
  Sun,
  Trees,
  TriangleAlert,
  Users,
  Wheat,
  X,
} from 'lucide-react'

// Íconos de apoyo tomados de Lucide (lucide-react).
const LUCIDE = {
  agua: Droplet,
  gota: Droplets,
  hoja: Leaf,
  escudo: Shield,
  proteccion: ShieldCheck,
  bosque: Trees,
  mineria: Pickaxe,
  cultivo: Wheat,
  gobernanza: Handshake,
  alerta: TriangleAlert,
  check: Check,
  close: X,
  flecha_izq: ChevronLeft,
  flecha_der: ChevronRight,
  reiniciar: RotateCcw,
  comparar: Columns3,
  compartir: Share2,
  jugar: Play,
  libro: BookOpen,
  montana: Mountain,
  casa: House,
  sol: Sun,
  nube: Cloud,
  lluvia: CloudRain,
  planta: Sprout,
  pez: Fish,
  gente: Users,
  corazon: Heart,
  fabrica: Factory,
  medir: Gauge,
  expandir: Maximize,
  pausa: Pause,
}

// Íconos propios que Lucide no cubre.
const PROPIOS = {
  vertimiento: (
    <>
      <path d="M3 10h11a4 4 0 0 1 4 4v1" />
      <path d="M18 15v2" />
      <path d="M5 14v2M8 14v3M11 14v2" />
      <path d="M3 10V7h4v3" />
    </>
  ),
}

/**
 * Ícono SVG accesible. Usa Lucide para los íconos de apoyo y un set propio
 * para los que no existen en Lucide.
 */
export default function Icon({ name, className = 'h-5 w-5', title }) {
  const Lucide = LUCIDE[name]
  if (Lucide) {
    return (
      <Lucide
        className={className}
        strokeWidth={1.9}
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
        aria-label={title}
      >
        {title ? <title>{title}</title> : null}
      </Lucide>
    )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {PROPIOS[name] ?? PROPIOS.vertimiento}
    </svg>
  )
}
