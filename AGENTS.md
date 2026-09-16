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
- `src/hooks/useWatershedSimulator.js` es el estado central (decisiones, paso, estrés, escenarios A/B, modo presentación). Al cambiar una decisión el estado se recalcula con `useMemo`.
- Navegación por estado en `src/App.jsx` (`page`), **sin react-router**. Persistencia en `localStorage` (claves `cuencaViva.*`). Sin backend.

## Convenciones

- Linter **Oxlint** (no ESLint): `npx oxlint`, config `.oxlintrc.json`. Silenciar con `// oxlint-disable-next-line`.
- Tailwind v4 vía plugin `@tailwindcss/vite` (en `vite.config.js`); **no hay `tailwind.config.js`**. El tema (paleta `agua`, `bosque`, `tierra`, `alerta`, `deterioro` y animaciones) se define con `@theme` en `src/index.css`.
- Tests con Vitest; los de UI usan `// @vitest-environment jsdom` + `@testing-library/react`.
- Accesibilidad: combinar color + icono + texto + valor (no solo color).
