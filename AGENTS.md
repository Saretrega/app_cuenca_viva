# AGENTS.md

Proyecto recién creado desde el template `create-vite` (React + Vite). Aún no hay código propio: `src/App.jsx` es la pantalla de bienvenida del template.

## Comandos

```bash
npm install      # dependencias
npm run dev      # servidor Vite con HMR
npm run build    # build de producción a dist/
npm run preview  # sirve el build
npm run lint     # oxlint
```

No hay tests ni typecheck configurados.

## Stack y convenciones

- React 19 + Vite 8, JavaScript puro (no TypeScript). `"type": "module"` en package.json: usar `import`/`export`.
- Linter: **Oxlint**, no ESLint. Config en `.oxlintrc.json` (plugins `react` y `oxc`). Para ignorar reglas por línea usa comentarios `// oxlint-disable-next-line`.
- Entrypoint: `index.html` → `src/main.jsx` → `src/App.jsx`. Estilos globales en `src/index.css`, locales en `src/App.css`.
- Assets estáticos van en `public/` (referenciados con `/...`); assets importados por JSX en `src/assets/`.

## Notas

- El directorio no es un repositorio git todavía (`git init` pendiente si se publica).
