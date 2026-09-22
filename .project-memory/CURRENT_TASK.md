# Tarea actual

Última actualización: 2026-09-22

## Objetivo

**T-05 — Buscador de Aulas Libres por Módulo, Día y Rango Horario**

Conectar la vista `src/components/views/FreeRoomsView.tsx` con la función RPC `get_aulas_libres` de Supabase, implementando selectores interactivos de día de la semana, rango de horario (inicio y fin), filtro por módulo de aulas, vista en cuadrícula y estado de ocupación.

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-05 |
| Tipo | FRONTEND / FEATURE |
| Prioridad | 🔴 CRÍTICA |
| Complejidad | MEDIA |
| Estado | 📋 BACKLOG |
| Rama | develop |

## Alcance

### Pendiente
- [ ] Implementar servicio `src/services/rooms.ts` para invocar la función RPC `get_aulas_libres` o calcular disponibilidad en memoria con fallback
- [ ] Conectar `src/components/views/FreeRoomsView.tsx` con selectores de Centro, Módulo, Día y Rango Horario
- [ ] Añadir selector rápido "Aulas libres AHORA" usando la hora y día actuales
- [ ] Agrupar aulas libres por módulo con indicador de capacidad y tipo (Aula, Laboratorio, Taller)
- [ ] Pruebas unitarias de disponibilidad de aulas en Vitest

## Tareas anteriores

- `T-04` — Buscador de Profesores con Filtros y Estado en Tiempo Real (✅ COMPLETADO)
- `T-03` — Pipeline de Ingesta y Scraping en Supabase Edge Functions / CLI (✅ COMPLETADO)
- `T-02` — Scaffolding del Proyecto Frontend (React + Vite + Tailwind CSS) (✅ COMPLETADO)
- `T-01` — Planificación y Diseño Arquitectónico (✅ COMPLETADO)
