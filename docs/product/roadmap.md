# Roadmap y Backlog Detallado — Buscador UDG

## Fase 1: MVP (Mínimo Producto Viable) — v0.1.0

### `T-01` — Planificación y Diseño Arquitectónico
- [x] Especificación técnica de arquitectura (`docs/architecture/overview.md`)
- [x] Esquema SQL relacional para Supabase (`supabase/migrations/20260922000000_initial_schema.sql`)
- [x] Definición de backlog y decisiones iniciales (`DECISIONS.md`, `roadmap.md`)

### `T-02` — Scaffolding del Proyecto Frontend (React + Vite + Tailwind CSS)
- **Tipo:** INFRA / SETUP
- **Prioridad:** 🔴 CRÍTICA
- **Objetivo:** Inicializar el proyecto con React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons y cliente `@supabase/supabase-js`.
- **Criterios de Aceptación:**
  - `npm run dev` y `npm run build` ejecutan sin errores.
  - Configuración de variables de entorno (`.env.example`) para Supabase URL y Anon Key.
  - Configuración de rutas y layout base responsivo (Navbar, pestañas de búsqueda, Footer).

### `T-03` — Pipeline de Ingesta y Scraping en Supabase Edge Functions
- **Tipo:** BACKEND / INGESTA
- **Prioridad:** 🔴 CRÍTICA
- **Objetivo:** Crear la Supabase Edge Function `sync-oferta-udg` (o script Deno/Node) que consulte la oferta académica UDG (basado en el extractor de `Horario-UDG`), parseé la tabla HTML y ejecute upserts por lotes en Supabase.
- **Criterios de Aceptación:**
  - Parseo correcto de NRC, materia, profesor, sección, días y horarios con módulos/aulas.
  - Normalización de nombres de profesores y materias.
  - Manejo de reintentos y timeouts.

### `T-04` — Módulo: Buscador de Profesores
- **Tipo:** FEATURE
- **Prioridad:** 🟠 ALTA
- **Objetivo:** Implementar la interfaz y consultas para buscar profesores por nombre (búsqueda difusa/trigrama), mostrando tarjeta con sus materias activas, horarios y aulas en tiempo real.
- **Criterios de Aceptación:**
  - Búsqueda con debounce para bajo consumo de consultas.
  - Vista detallada de agenda semanal por profesor.
  - Indicador de "En clase ahora" (aula actual según hora del sistema).

### `T-05` — Módulo: Buscador de Aulas Libres
- **Tipo:** FEATURE
- **Prioridad:** 🔴 CRÍTICA
- **Objetivo:** Interfaz para consultar aulas desocupadas filtrando por Centro Universitario, Módulo/Edificio, Día y Rango Horario (consumiendo la RPC `get_aulas_libres`).
- **Criterios de Aceptación:**
  - Filtro rápido "Libres ahora mismo".
  - Filtro personalizado por día y selector de horas $[H_{inicio}, H_{fin}]$.
  - Agrupación visual por módulos/pisos.

---

## Fase 2: Mapeo Avanzado e Inteligencia de Grupos — v0.2.0

### `T-06` — Spike de Investigación: Mallas Curriculares y Mapeo de Generaciones
- **Tipo:** INVESTIGACIÓN / SPIKE
- **Prioridad:** 🟡 MEDIA
- **Objetivo:** Investigar y prototipar la obtención de planes de estudio y materias por semestre sugerido para mapear ubicaciones de generaciones completas.
- **Criterios de Aceptación:**
  - Documento de propuesta técnica con fuentes de mallas de carreras principales (ej. CUCEI / CUCEA).
  - Estructura de datos para relacionar carrera + semestre con materias activas.

### `T-07` — Módulo: Localizador de Grupos y Generaciones
- **Tipo:** FEATURE
- **Prioridad:** 🟡 MEDIA
- **Objetivo:** Vista por carrera y semestre que mapee los salones donde se encuentran los grupos de una generación en determinado horario.

---

## Fase 3: Despliegue y Optimización — v1.0.0

### `T-08` — Configuración de CI/CD y Despliegue en Vercel / Cloudflare Pages
- **Tipo:** DEVOPS
- **Prioridad:** 🟠 ALTA
- **Objetivo:** Automatizar build y deploy con GitHub Actions o integración nativa de Vercel.

### `T-09` — Modo Offline / Caché PWA y Optimización Móvil
- **Tipo:** MEJORA
- **Prioridad:** 🟢 BAJA
- **Objetivo:** Caché de catálogo de aulas y profesores para consulta ultrarrápida sin latencia.
