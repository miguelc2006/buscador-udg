# Roadmap y Backlog Detallado — Buscador UDG

## Fase 1: MVP (Mínimo Producto Viable) — v0.1.0-alpha.1

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

## Fase 2: Mapeo Avanzado e Inteligencia de Grupos — v0.1.0-alpha.2

### `T-06` — Módulo: Localizador de Grupos y Generaciones (Base Conceptual)
- **Tipo:** FEATURE / INVESTIGACIÓN
- **Prioridad:** 🟡 MEDIA
- **Estado:** ✅ Base conceptual implementada | 🚧 Ingeniería inversa pendiente
- **Objetivo:** Vista por carrera y semestre que mapee los salones donde se encuentran los grupos de una generación en determinado horario.
- **Criterios de Aceptación:**
  - [x] Interfaz de búsqueda y filtrado por carrera, semestre y turno.
  - [x] Modal de horario consolidado por grupo.
  - [x] Estimador de cohorte generacional.
  - [ ] **Pendiente:** Ingeniería inversa y scraping de mallas curriculares reales de UDG para reemplazar el catálogo mock (ej. `MALLA_INCO`).

### `T-07` — Spike de Investigación: Extracción de Mallas Curriculares
- **Tipo:** INVESTIGACIÓN / SPIKE
- **Prioridad:** 🟠 ALTA
- **Objetivo:** Investigar y prototipar la obtención automatizada de planes de estudio y materias por semestre sugerido desde SIIAU o portales de Centros Universitarios.
- **Criterios de Aceptación:**
  - Documento de propuesta técnica con fuentes de mallas de carreras principales (ej. CUCEI / CUCEA).
  - Script o Edge Function para ingestar mallas curriculares a Supabase.

### `T-08` — Conexión con Scraping Real de Oferta Académica (SIIAU)
- **Tipo:** BACKEND / INGESTA
- **Prioridad:** 🟠 ALTA
- **Estado:** ✅ COMPLETADO
- **Objetivo:** Conectar el proyecto con un scraping real de los datos de SIIAU sobre la tabla de oferta académica, basándose en la extracción de datos ya utilizada en el proyecto `C:\Users\amaca\Github\Horario-UDG`.
- **Criterios de Aceptación:**
  - [x] Adaptar la lógica de scraping de `Horario-UDG` (`api/_helpers/siiau.js` y `api/consultar-oferta.js`).
  - [x] Integrar el scraper en Supabase Edge Functions o como un worker de ingesta.
  - [x] Poblar la base de datos de Supabase con datos reales de la oferta académica.
  - [x] Validar que el frontend consuma correctamente los datos reales.

---

## Fase 3: Despliegue y Optimización — v0.1.0-alpha.3

### `T-09` — Conexión del Proyecto con GitHub, Supabase y Vercel
- **Tipo:** DEVOPS / INFRA
- **Prioridad:** 🔴 CRÍTICA
- **Estado:** ✅ COMPLETADO
- **Objetivo:** Conectar el proyecto con GitHub (control de versiones), Supabase (backend/DB real) y Vercel (hosting/despliegue) para establecer el entorno de producción.
- **Criterios de Aceptación:**
  - [x] Repositorio inicializado y subido a GitHub.
  - [x] Proyecto creado en Supabase y variables de entorno configuradas.
  - [x] Proyecto desplegado en Vercel con integración continua desde GitHub.
  - [x] Migraciones de base de datos aplicadas en el entorno de Supabase.

### `T-10` — Modo Offline / Caché PWA y Optimización Móvil
- **Tipo:** MEJORA
- **Prioridad:** 🟢 BAJA
- **Objetivo:** Caché de catálogo de aulas y profesores para consulta ultrarrápida sin latencia.

### `T-11` — Rediseño Institucional y Formularios Dinámicos (SIIAU)
- **Tipo:** FEATURE / MEJORA
- **Prioridad:** 🟠 ALTA
- **Estado:** ✅ COMPLETADO
- **Objetivo:** Rediseñar el formulario de selección de Centro Universitario, Carrera y Ciclo utilizando el manual de identidad institucional UDG 2025. Conectar estos selectores con el sistema de consulta y scraping de `Horario-UDG` para obtener los catálogos reales dinámicamente.
- **Criterios de Aceptación:**
  - [x] Extraer paleta de colores y tipografías del manual de identidad UDG 2025.
  - [x] Aplicar el rediseño institucional a la interfaz principal (Header, Formularios, Botones).
  - [x] Implementar endpoint/RPC o Edge Function para obtener la lista real de Centros, Carreras y Ciclos desde SIIAU.
  - [x] Hacer que los selectores del frontend sean dinámicos y dependientes (ej. seleccionar Centro carga sus Carreras).
  - [x] Eliminar datos de prueba (mocks) y conectar las vistas a la base de datos real.
  - [x] Implementar sincronización automática con SIIAU cuando la base de datos local no tiene datos.

---

## Fase 4: Precisión de Datos y Nuevas Vistas — v0.1.0-beta (Planificación)

### `T-12` — Sincronización Global de Centro y Precisión de Aulas Libres
- **Tipo:** ARQUITECTURA / MEJORA
- **Prioridad:** 🔴 CRÍTICA
- **Estado:** 📐 DISEÑO
- **Objetivo:** Garantizar que el cálculo de aulas libres sea 100% preciso. Actualmente, si solo se sincroniza una carrera, las aulas pueden aparecer libres cuando en realidad están ocupadas por otra carrera del mismo centro.
- **Criterios de Aceptación:**
  - [ ] Implementar un mecanismo de sincronización global por Centro Universitario (scraping en background o por lotes) para evitar timeouts en las Edge Functions.
  - [ ] Asegurar que la base de datos contenga la oferta completa del centro antes de calcular aulas libres.
  - [ ] Mostrar un indicador de "Precisión de datos" (ej. "Datos sincronizados al 100% para CUCEI").

### `T-13` — Carga Horaria Global de Profesores
- **Tipo:** MEJORA
- **Prioridad:** 🟠 ALTA
- **Estado:** 📐 DISEÑO
- **Objetivo:** Mostrar la carga horaria real y completa de un profesor, independientemente de la carrera seleccionada, ya que un profesor puede impartir clases en múltiples carreras dentro del mismo centro.
- **Criterios de Aceptación:**
  - [ ] Modificar la consulta de profesores para que agrupe todas las materias impartidas por el profesor en el centro.
  - [ ] Si la base de datos local está incompleta, permitir una sincronización específica por nombre de profesor consultando directamente a SIIAU.
  - [ ] Mostrar en la tarjeta del profesor las distintas carreras/departamentos en los que imparte clases.

### `T-14` — Explorador de Grupos y Materias
- **Tipo:** FUNCIÓN
- **Prioridad:** 🟠 ALTA
- **Estado:** 📐 DISEÑO
- **Objetivo:** Crear una nueva vista (o modificar la de Grupos) para organizar y agrupar la oferta académica por **Clave de Materia** (ej. I6168), integrando la exploración por grupos.
- **Criterios de Aceptación:**
  - [ ] Interfaz donde el usuario busca una materia por clave o nombre.
  - [ ] Al seleccionar la materia, se despliegan todas sus secciones/grupos disponibles (D01, D02, etc.) agrupados por clave de materia.
  - [ ] Mostrar para cada sección: profesor, horario, aula, cupo total y cupo disponible.
  - [ ] Facilitar a los estudiantes la comparación de horarios para una misma materia al armar su agenda.
