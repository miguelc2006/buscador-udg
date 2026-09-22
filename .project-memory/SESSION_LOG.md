# Registro de sesiones

## Formato

```markdown
## [FECHA] — [Título de la sesión]

### Objetivo
[Qué se intentaba lograr]

### Hallazgos
- Hallazgo 1
- Hallazgo 2

### Cambios
- Cambio 1
- Cambio 2

### Decisiones
- Decisión 1
- Decisión 2

### Validaciones
- Compilación: ✅/❌
- Tests: ✅/❌ (N/N pasaron)
```

## Sesiones

## 2026-09-22 — Scaffolding del Proyecto Frontend (T-02)

### Objetivo
Configurar la base del cliente frontend con React 18, Vite, TypeScript, Tailwind CSS, Lucide React y cliente Supabase.

### Hallazgos
- Se requiere `src/vite-env.d.ts` para el tipado correcto de `import.meta.env` con Vite en modo estricto.
- El bundle de producción genera 161 kB JS y 13.9 kB CSS, altamente optimizado para carga rápida.

### Cambios
- Creación de `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js` e `index.html`.
- Creación de `src/types/database.ts`, `src/lib/supabase.ts`.
- Creación de `Navbar`, `Footer`, `ProfessorsView`, `FreeRoomsView`, `GroupsView` y `App.tsx`.
- Commit en `feature/T-02-frontend-scaffolding` y merge a `develop`.

### Decisiones
- Paleta visual institucional UDG (Azul `#002B49`, Dorado `#C59B27`, Rojo `#9B111E`).

### Validaciones
- Compilación: `npm run build` → ✅ 0 errores.

## 2026-09-22 — Inicialización y Planificación Arquitectónica (T-01)

### Objetivo
Inicializar el repositorio y definir la arquitectura técnica, esquema de base de datos en Supabase y el plan de desarrollo para Buscador UDG.

### Hallazgos
- Repositorio previo `Horario-UDG` provee la lógica de extracción de tablas de oferta académica.
- Consultas de aulas libres requieren filtrado por conjuntos y operadores de intervalos de tiempo, resueltos mediante la función RPC `get_aulas_libres` en PostgreSQL.

### Cambios
- Inicialización de repositorio Git y rama `develop`.
- Creación de `docs/architecture/overview.md`, `docs/product/vision.md`, `docs/product/roadmap.md`.
- Creación de migración SQL para Supabase en `supabase/migrations/20260922000000_initial_schema.sql`.
- Commit raíz realizado con éxito: `feat(architecture): T-01 plan inicial, esquema supabase y backlog`.

### Decisiones
- ADR-001: React + Vite (SPA) para frontend, Supabase BaaS (PostgreSQL + Edge Functions), despliegue estático en Vercel/Cloudflare Pages.

### Validaciones
- Esquema SQL verificado sintácticamente.
- Repositorio git estructurado.
