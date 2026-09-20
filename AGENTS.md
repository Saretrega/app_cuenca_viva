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
- **Paisaje**: ilustración SVG por capas (cielo, montañas nevadas, cascada, bosque, río, colinas, pueblo, primer plano) en `WatershedLandscape.jsx`. Los árboles/casas/rocas son `<symbol>` + `<use>` reutilizables (rendimiento); los tonos se pasan con variables CSS (`style={{ '--copa': ... }}`). Los peces se mueven con `MotionPathPlugin` a lo largo de los paths `#rio-{tramo}` (nunca salen del cauce). En SVG, las rotaciones/scale con GSAP requieren `transform-box: fill-box` (ver `.vegetacion`/`.brisa`/`.aparece`/`.pez`/`.capa` en `index.css`) y separar la posición (atributo `transform` externo) de la animación (grupo interno), o GSAP pisa el translate. Mantener amplitudes sutiles (brisa ≤ 2°).
- **Métricas → ilustración** (no romper): color del agua ← `calidadAgua` por tramo (`colorRio`, con transición `.rio-animado`), densidad/verdor de vegetación ← `biodiversidad` (`densidadVegetacion`), peces ← `biodiversidad`, alerta ← `disponibilidad`/`resiliencia` ≤ −6. La vegetación va dentro de `mask="url(#mask-tierra)"` para que nunca quede sobre el agua. Cubierto por `WatershedLandscape.test.jsx`.
- **Pantalla de decisión**: `DecisionStep` usa flex con `gap` explícito; la lista de alternativas es `overflow-y-auto` (scroll interno permitido) para no superponerse con la ubicación ni los botones.

## Convenciones

- Linter **Oxlint** (no ESLint): `npx oxlint`, config `.oxlintrc.json`. Silenciar con `// oxlint-disable-next-line`.
- Tailwind v4 vía plugin `@tailwindcss/vite` (en `vite.config.js`); **no hay `tailwind.config.js`**. El tema (paleta `agua`, `bosque`, `tierra`, `alerta`, `deterioro` y animaciones) se define con `@theme` en `src/index.css`.
- Tests con Vitest; los de UI usan `// @vitest-environment jsdom` + `@testing-library/react`.
- Accesibilidad: combinar color + icono + texto + valor (no solo color).

## Capa visual (librerías)

- **Framer Motion** (`framer-motion`) para transiciones de pantalla (`App.jsx` con `AnimatePresence`), fases de la simulación (`SimulationPage`) y microinteracciones (`Button`). Preferir `motion.*` antes que CSS transitions para animaciones nuevas.
- **GSAP** (`gsap`) para la animación continua del paisaje (`WatershedLandscape.jsx`: río, nubes, sol, peces, ondas, brillos, vegetación, aves). Se importa dinámicamente dentro del efecto para no cargarlo en el bundle inicial.
- **lottie-web** disponible en `src/components/media/LottieIcon.jsx` (animaciones propias en `src/assets/lottie/*.json`); ahora mismo el paisaje usa aves SVG simples en vez de Lottie, así que LottieIcon no está en uso.
- **Chart.js + react-chartjs-2** en `src/components/charts/WatershedBarChart.jsx`; usar siempre el wrapper `LazyWatershedChart` (registra solo lo necesario y separa el chunk).
- **tsParticles** (`@tsparticles/react` + `slim`) en `src/components/media/ParticlesBackground.jsx`; usar vía `LazyParticles` y solo en Inicio. Respeta `prefers-reduced-motion`.
- Las librerías pesadas (lottie, chart, tsparticles) deben ir **en chunks separados** con `React.lazy`/import dinámico. Los tests mockean `framer-motion`, `LazyWatershedChart`, `LazyParticles` y `LottieIcon` (jsdom no tiene canvas ni motor de animación).
