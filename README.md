# Cuenca Viva

Simulador educativo interactivo sobre el funcionamiento de una cuenca hidrográfica.
Permite tomar decisiones ambientales en **cuenca alta, media y baja** y observar cómo
transforman la calidad del agua, la disponibilidad hídrica, la biodiversidad y la
resiliencia del territorio.

> Cuenca Viva es un simulador educativo de escenarios. Sus resultados no constituyen
> mediciones reales de calidad del agua ni sustituyen estudios, monitoreos o
> evaluaciones ambientales oficiales.

## Stack

Vite · React 19 · JavaScript/JSX · Tailwind CSS v4. Sin TypeScript, sin backend.

## Comandos

```bash
npm install      # dependencias
npm run dev      # servidor de desarrollo (HMR)
npm run build    # build de producción en dist/
npm run preview  # sirve el build
npm run lint     # oxlint
npx vitest run   # pruebas
```

## Estructura

```
src/
  data/        datos puros generados desde Matriz_Cuenca_Viva.xlsx
  logic/       motor matemático y narrativa (probado con Vitest)
  components/  watershed · decisions · results · stress · ui
  pages/       pantallas (inicio, cómo funciona, ciencia, simulación, resultados…)
  hooks/       estado central y persistencia en localStorage
```

## Fuente de datos

`Matriz_Cuenca_Viva.xlsx` es la fuente de verdad (84 combinaciones `CV-001…CV-084`).
Los archivos de `src/data/` conservan exactamente sus valores; la propagación aguas
abajo ya está incorporada en los 12 efectos de cada registro. El motor solo los suma
y clasifica con bandas configurables (`src/data/thresholds.js`).
