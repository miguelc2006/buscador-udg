# Estado del proyecto

Última actualización: 2026-09-23

## Identidad

- Nombre: Buscador UDG
- Versión: v0.1.0
- Rama principal: main (desarrollo en `develop`)
- Etapa actual: Módulos Core Completados (v0.1.0 lista para Release) / Planificación Fase 2
- Descripción: Plataforma web para la consulta y búsqueda inteligente de profesores, aulas libres, ubicación de grupos y seguimiento de generaciones a partir de la oferta académica de la Universidad de Guadalajara.

## Tecnologías

| Capa | Tecnología | Versión / Detalle |
|------|-----------|-------------------|
| Frontend | React + Vite | React 18.3, Vite 6.1, TypeScript 5.7, Tailwind CSS 3.4 |
| Backend & DB | Supabase (PostgreSQL + PostgREST) | Proyecto en la nube configurado, RPC `get_aulas_libres` |
| Sincronización / Ingesta | Supabase Edge Functions (Deno / TS) | Serverless Scraping SIIAU (Desplegado) |
| Testing | Vitest | 29 tests unitarios pasando (4 suites) |
| Hosting | Vercel | Despliegue continuo desde GitHub |
| Mapeo Generacional | Mallas curriculares / JSON | Agrupación de cohortes por sección y carrera (Mock) |

## Arquitectura vigente

Arquitectura serverless desacoplada:
1. **Frontend (React + Vite + Tailwind):** Cliente SPA que consume directamente la API de Supabase (PostgREST + RPCs) con fallback offline/mock garantizado.
2. **Supabase Edge Functions:** Funciones serverless para consultar SIIAU/Oferta UDG, parsear el HTML/JSON y realizar `upsert` por lotes en las tablas relacionales.
3. **Base de Datos PostgreSQL:** Tablas estructuradas con índices en (centro, ciclo, profesor, aula, dia, hora_inicio, hora_fin, materia, nrc) y procedimiento almacenado `get_aulas_libres`.

## Módulos principales

1. **Extractor / Sincronizador de Datos (T-03):** Ingesta de tablas de oferta académica UDG a Supabase con parser robusto. (✅ Completado)
2. **Buscador de Profesores (T-04):** Ubicación actual, materias impartidas, horarios, aulas y estado en tiempo real (En clase / Disponible / Libre). (✅ Completado)
3. **Buscador de Aulas Libres (T-05):** Consulta interactiva de espacios disponibles por centro universitario, módulo, día y rango horario, cálculo de colisiones e inspector semanal por aula. (✅ Completado)
4. **Localizador de Grupos y Generaciones (T-06):** Mapeo de avance reticular, visualización de horario semanal consolidado por sección, cálculo de cohorte/generación y live status del grupo. (✅ Base Conceptual Implementada / Ingeniería Inversa Pendiente)
