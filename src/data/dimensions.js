// Dimensiones del modelo: tramos de la cuenca e indicadores evaluados.

/** Tramos en orden hidrológico aguas abajo. @type {string[]} */
export const TRAMOS = ['alta', 'media', 'baja']

/** Claves de los cuatro indicadores. @type {string[]} */
export const INDICADORES = ['calidadAgua', 'disponibilidad', 'biodiversidad', 'resiliencia']

export const TRAMO_LABEL = {
  alta: 'Cuenca Alta',
  media: 'Cuenca Media',
  baja: 'Cuenca Baja',
}

export const TRAMO_CORTO = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export const INDICADOR_LABEL = {
  calidadAgua: 'Calidad del agua',
  disponibilidad: 'Disponibilidad y regulación',
  biodiversidad: 'Biodiversidad y hábitat',
  resiliencia: 'Resiliencia y estabilidad',
}

export const INDICADOR_ICONO = {
  calidadAgua: 'agua',
  disponibilidad: 'gota',
  biodiversidad: 'hoja',
  resiliencia: 'escudo',
}

/** Crea un objeto de totales en cero por tramo/indicador. */
export function crearTotalesVacios() {
  const base = () => ({ calidadAgua: 0, disponibilidad: 0, biodiversidad: 0, resiliencia: 0 })
  return { alta: base(), media: base(), baja: base() }
}
