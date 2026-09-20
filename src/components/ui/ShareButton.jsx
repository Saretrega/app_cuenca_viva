import { useState } from 'react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'
import { copiarAlPortapapeles, urlCompartible } from '../../utils/share.js'

/**
 * Copia al portapapeles un enlace con el escenario actual codificado en la URL.
 * @param {{decisions:Object, stressId?:string|null, className?:string}} props
 */
export default function ShareButton({ decisions, stressId = null, className = '' }) {
  const [copiado, setCopiado] = useState(false)

  const compartir = async () => {
    const url = urlCompartible(decisions, stressId)
    const ok = await copiarAlPortapapeles(url)
    if (ok) {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2200)
    } else if (typeof window !== 'undefined') {
      window.prompt('Copia este enlace para compartir tu cuenca:', url)
    }
  }

  return (
    <Button
      size="sm"
      variant="secundario"
      className={className}
      onClick={compartir}
      title="Copiar enlace del escenario"
    >
      <Icon name={copiado ? 'check' : 'compartir'} className="h-4 w-4" />
      <span aria-live="polite" className={copiado ? 'inline' : 'hidden sm:inline'}>
        {copiado ? 'Enlace copiado' : 'Compartir enlace'}
      </span>
    </Button>
  )
}
