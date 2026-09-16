// GENERADO AUTOMÁTICAMENTE desde la hoja Pruebas_Estres de Matriz_Cuenca_Viva.xlsx.
// Los eventos de estrés NO son decisiones humanas: se aplican después de las decisiones.

/** Escenarios de estrés climático con sus deltas por tramo. */
export const stressScenarios = [
  {
    id: "sequia",
    nombre: "Sequía prolongada",
    descripcion: "Menor caudal y capacidad de dilución durante un periodo prolongado de escasez de lluvias.",
    fuentesIds: ["COL-01", "EU-02"],
    efectos: {
      alta: { calidadAgua: -1, disponibilidad: -3, biodiversidad: -1, resiliencia: -2 },
      media: { calidadAgua: -1, disponibilidad: -3, biodiversidad: -2, resiliencia: -2 },
      baja: { calidadAgua: -2, disponibilidad: -3, biodiversidad: -2, resiliencia: -3 },
    },
    interpretaciones: {
      alta: "Menor caudal y capacidad de dilución; estrés hídrico y ecológico.",
      media: "Acumulación de presión por menor caudal y demanda aguas arriba.",
      baja: "Mayor exposición a presiones acumuladas y menor disponibilidad.",
    },
  },
  {
    id: "lluvias",
    nombre: "Lluvias intensas",
    descripcion: "Mayor escorrentía, erosión y movilización de sedimentos por lluvias extremas.",
    fuentesIds: ["COL-01", "EU-02", "USGS-01"],
    efectos: {
      alta: { calidadAgua: -2, disponibilidad: 1, biodiversidad: -1, resiliencia: -2 },
      media: { calidadAgua: -2, disponibilidad: 1, biodiversidad: -2, resiliencia: -2 },
      baja: { calidadAgua: -3, disponibilidad: 1, biodiversidad: -2, resiliencia: -3 },
    },
    interpretaciones: {
      alta: "Mayor escorrentía, erosión y movilización de sedimentos; aumenta agua temporalmente.",
      media: "Recibe aporte local y aguas arriba; mayor transporte de sedimentos/contaminantes.",
      baja: "Convergencia de cargas y caudales; mayor exposición a inundación/turbidez.",
    },
  },
  {
    id: "compuesto",
    nombre: "Evento extremo compuesto",
    descripcion: "Combinación severa de perturbaciones que pone a prueba la robustez del sistema.",
    fuentesIds: ["EU-02", "COL-02"],
    efectos: {
      alta: { calidadAgua: -2, disponibilidad: -2, biodiversidad: -2, resiliencia: -3 },
      media: { calidadAgua: -2, disponibilidad: -2, biodiversidad: -2, resiliencia: -3 },
      baja: { calidadAgua: -3, disponibilidad: -2, biodiversidad: -3, resiliencia: -3 },
    },
    interpretaciones: {
      alta: "Representa combinación severa de perturbaciones; prueba pedagógica de robustez.",
      media: "Representa combinación severa de perturbaciones; prueba pedagógica de robustez.",
      baja: "Mayor acumulación de presiones aguas abajo.",
    },
  },
]

export const stressById = stressScenarios.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {})

