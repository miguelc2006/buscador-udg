# Tarea actual

Última actualización: 2026-09-24

## Objetivo

**T-11 — Rediseño Institucional y Formularios Dinámicos (SIIAU)**

Rediseñar el formulario de selección de Centro Universitario, Carrera y Ciclo utilizando el manual de identidad institucional UDG 2025. Conectar estos selectores con el sistema de consulta y scraping de `Horario-UDG` para obtener los catálogos reales dinámicamente.

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-11 |
| Tipo | FUNCIÓN / MEJORA |
| Prioridad | 🟠 ALTA |
| Complejidad | MEDIA |
| Estado | ✅ COMPLETADO |
| Rama | feature/T-11-rediseño-formularios |

## Alcance

### Pendiente
- (Ninguno)

### Completado
- [x] Extraer paleta de colores y tipografías del manual de identidad UDG 2025.
- [x] Aplicar el rediseño institucional a la interfaz principal (Header, Formularios, Botones).
- [x] Implementar endpoint/RPC o Edge Function para obtener la lista real de Centros, Carreras y Ciclos desde SIIAU.
- [x] Hacer que los selectores del frontend sean dinámicos y dependientes (ej. seleccionar Centro carga sus Carreras).
- [x] Eliminar datos de prueba (mocks) y conectar las vistas a la base de datos real.
- [x] Implementar sincronización automática con SIIAU cuando la base de datos local no tiene datos.

## Tareas anteriores

- `T-08` — Conexión con Scraping Real de Oferta Académica (SIIAU) (✅ COMPLETADO)
- `T-07` — Planificación de Nueva Ruta (Roadmap Phase 2) (✅ COMPLETADO)
- `T-06` — Localizador de Grupos y Seguimiento de Generaciones (✅ Base Conceptual Implementada)
- `T-05` — Buscador de Aulas Libres por Módulo, Día y Rango Horario (✅ COMPLETADO)
- `T-04` — Buscador de Profesores con Filtros y Estado en Tiempo Real (✅ COMPLETADO)
- `T-03` — Pipeline de Ingesta y Scraping en Supabase Edge Functions / CLI (✅ COMPLETADO)
- `T-02` — Scaffolding del Proyecto Frontend (React + Vite + Tailwind CSS) (✅ COMPLETADO)
- `T-01` — Planificación y Diseño Arquitectónico (✅ COMPLETADO)
