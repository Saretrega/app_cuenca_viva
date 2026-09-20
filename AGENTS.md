# AGENTS.md

Simulador educativo **Cuenca Viva** sobre Vite + React 19 + Tailwind CSS v4. JavaScript/JSX puro (sin TypeScript, sin Next/Angular/Vue).

## Comandos

```bash
npm install                      # dependencias
npm run dev                      # servidor Vite con HMR
npm run build                    # build de producción a dist/ (sitio estático)
npm run preview                  # sirve el build
npm run lint                     # oxlint
npx vitest run                   # todas las pruebas
npx vitest run src/logic/calculateWatershedState.test.js   # una sola suite
npx vitest                       # modo watch
```

## Fuente de verdad (no inventar datos)

- `Matriz_Cuenca_Viva.xlsx` es la fuente de verdad (84 combinaciones `CV-001…CV-084`).
- `src/data/watershedMatrix.js`, `categories.js`, `sources.js` y `stressScenarios.js` están **generados desde ese Excel**: conservan los valores originales. Si hay que corregir datos, regenerar, no editar números a mano.
- La propagación espacial **ya está incorporada** en los 12 efectos de cada registro (4 indicadores × 3 tramos). El motor solo suma; no añadir una segunda fórmula de propagación.
- La suma acumulada NO se limita a −3/+3; se clasifica con `src/data/thresholds.js` (bandas configurables).

## Arquitectura

- `src/data/` datos puros (`watershedMatrix`, `categories`, `stressScenarios`, `thresholds`, `sources`, `dimensions`).
- `src/logic/` lógica pura y testeada: `calculateWatershedState`, `applyStressScenario`, `generateNarrative`, `classify`.
- `src/components/{watershed,decisions,results,stress,ui}/` UI; `src/pages/` pantallas; `src/hooks/` estado.
- `src/hooks/useWatershedSimulator.js` es el estado central (decisiones, paso, estrés, escenarios A/B). Al cambiar una decisión el estado se recalcula con `useMemo`.
- Flujo de simulación (`SimulationPage`): fase `decision` a pantalla completa → fase `efecto` (ilustración animada sin datos, autoavanza) → siguiente decisión → al terminar, `results` es el resumen final.
- Navegación por estado en `src/App.jsx` (`page`), **sin react-router**. Persistencia en `localStorage` (claves `cuencaViva.*`). Sin backend.
- **Layout fluido, sin scroll**: la app ocupa `100vw`×`100dvh` (`App.jsx`), `body { overflow: hidden }`. Cada página usa `h-full`/`min-h-0`, flex/grid y `clamp()` para reacomodarse (fila→columna) sin proporción fija ni recortes. No usar alturas fijas en píxeles ni scroll.
- **Pantallas saturadas → diapositivas**: usar `src/components/ui/SlideDeck.jsx` (un bloque a la vez, transición animada, progreso y navegación con botones/teclado). Aplicado en Cómo funciona, Ciencia, Resultados, Estrés y Comparar. Cada diapositiva debe caber sin scroll.
- **Paisaje**: ilustración SVG vertical (`viewBox="0 0 1000 1600"`, tres franjas Alta/Media/Baja) en `WatershedLandscape.jsx`, dividida en subcomponentes (`MountainRange`, `Cascadas`, `River`, `Vegetation`, `Fields`, `Village`, `Humedales`). Los árboles/casas/rocas/aves son `<symbol>` + `<use>`; los tonos se pasan con variables CSS (`style={{ '--copa': ... }}`). El bosque se genera con un PRNG sembrado (determinista) y se extiende más allá del viewBox para llenar contenedores anchos. Los peces usan `anime.svg.createMotionPath` sobre los paths `#rio-{tramo}` y van dentro de `clipPath="url(#clip-rio)"`. Las etiquetas "CUENCA ALTA/MEDIA/BAJA", los puntos de estado y el ícono morph se renderizan **fuera del SVG** (overlay HTML). En SVG, rotar/escalar con anime.js requiere `transform-box: fill-box` (ver `.brisa`/`.aparece`/`.pez`/`.capa` en `index.css`). Mantener amplitudes sutiles (brisa ≤ 2°).
- **Métricas → ilustración** (no romper): color del agua ← `calidadAgua` por tramo (`colorRio`, animado con anime.js sobre `[data-cauce]`), densidad/verdor de vegetación ← `biodiversidad` (`densidadVegetacion`), peces ← `biodiversidad`, alerta ← `disponibilidad`/`resiliencia` ≤ −6 (ícono morph). La vegetación va dentro de `mask="url(#mask-tierra)"` para que nunca quede sobre el agua. Cubierto por `WatershedLandscape.test.jsx`.
- **Pantalla de decisión**: `DecisionStep` usa flex con `gap` explícito; la lista de alternativas es `overflow-y-auto` (scroll interno permitido) para no superponerse con la ubicación ni los botones.

## Convenciones

- Linter **Oxlint** (no ESLint): `npx oxlint`, config `.oxlintrc.json`. Silenciar con `// oxlint-disable-next-line`.
- Tailwind v4 vía plugin `@tailwindcss/vite` (en `vite.config.js`); **no hay `tailwind.config.js`**. El tema (paleta `agua`, `bosque`, `tierra`, `alerta`, `deterioro` y animaciones) se define con `@theme` en `src/index.css`.
- Tests con Vitest; los de UI usan `// @vitest-environment jsdom` + `@testing-library/react`.
- Accesibilidad: combinar color + icono + texto + valor (no solo color).

## Capa visual (librerías)

- **Motion** (paquete `motion`, importar de `motion/react`) para transiciones de pantalla (`App.jsx` con `AnimatePresence`), fases de la simulación (`SimulationPage`), microinteracciones (`Button`) y contenedores por tramo (`motion.g`). Es el sucesor de `framer-motion` (ya no se usa).
- **anime.js** (`animejs`) para la animación continua del paisaje (`WatershedLandscape.jsx`: río, cascadas, espuma, nubes, vegetación, aves, peces con `svg.createMotionPath` y transición de color del agua). Se importa dinámicamente (`cargarAnime()`) para no cargarlo en el bundle inicial.
- **motion-primitives** (CLI, `npx motion-primitives add <componente>`) → componentes en `src/components/motion-primitives/` (adaptados a JSX, sin TS ni alias `@/`): `AnimatedNumber` (badges) y `AnimatedGroup` (tarjetas de opciones).
- **lucide-react** para los íconos de apoyo en `src/components/ui/Icon.jsx` (el set propio solo queda para `vertimiento`).
- **morphicons** (`morphicons/react`) en `src/components/ui/StateMorphIcon.jsx`: ícono de estado que se transforma (escudo "estable" ↔ triángulo "alerta").
- **Chart.js + react-chartjs-2** en `src/components/charts/WatershedBarChart.jsx`; usar siempre el wrapper `LazyWatershedChart` (registra solo lo necesario y separa el chunk).
- **tsParticles** (`@tsparticles/react` + `slim`) en `src/components/media/ParticlesBackground.jsx`; usar vía `LazyParticles` y solo en Inicio. Respeta `prefers-reduced-motion`.
- **lottie-web** disponible en `src/components/media/LottieIcon.jsx` (JSON en `src/assets/lottie/`); ahora mismo no está en uso.
- Las librerías pesadas (anime, lottie, chart, tsparticles) van **en chunks separados** con import dinámico. Los tests mockean `motion/react`, `morphicons/react`, `LazyWatershedChart`, `LazyParticles` y `LottieIcon` (jsdom no tiene canvas ni geometría SVG).
