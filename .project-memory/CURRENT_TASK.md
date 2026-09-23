# Tarea actual

Última actualización: 2026-09-23

## Objetivo

**T-08 — Conexión con Scraping Real de Oferta Académica (SIIAU)**

Conectar el proyecto con un scraping real de los datos de SIIAU sobre la tabla de oferta académica, basándose en la extracción de datos ya utilizada en el proyecto `C:\Users\amaca\Github\Horario-UDG`.

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-08 |
| Tipo | BACKEND / INGESTA |
| Prioridad | 🟠 ALTA |
| Complejidad | MEDIA |
| Estado | ✅ COMPLETADO |
| Rama | feature/T-08-scraping-siiau |

## Alcance

### Pendiente
- (Ninguno)

### Completado
- [x] Adaptar la lógica de scraping de `Horario-UDG` (`api/_helpers/siiau.js` y `api/consultar-oferta.js`).
- [x] Integrar el scraper en Supabase Edge Functions o como un worker de ingesta.
- [x] Poblar la base de datos de Supabase con datos reales de la oferta académica (CUCEI INCO e INNI).
- [x] Validar que el frontend consuma correctamente los datos reales (Profesores, Aulas Libres, Grupos).
- [x] Corregir RPC `get_aulas_libres` para aceptar `p_codigo_modulo` como VARCHAR en lugar de UUID.

## Tareas anteriores

- `T-09` — Conexión del Proyecto con GitHub, Supabase y Vercel (✅ COMPLETADO)
- `T-07` — Planificación de Nueva Ruta (Roadmap Phase 2) (✅ COMPLETADO)
- `T-06` — Localizador de Grupos y Seguimiento de Generaciones (✅ Base Conceptual Implementada)
- `T-05` — Buscador de Aulas Libres por Módulo, Día y Rango Horario (✅ COMPLETADO)
- `T-04` — Buscador de Profesores con Filtros y Estado en Tiempo Real (✅ COMPLETADO)
- `T-03` — Pipeline de Ingesta y Scraping en Supabase Edge Functions / CLI (✅ COMPLETADO)
- `T-02` — Scaffolding del Proyecto Frontend (React + Vite + Tailwind CSS) (✅ COMPLETADO)
- `T-01` — Planificación y Diseño Arquitectónico (✅ COMPLETADO)
