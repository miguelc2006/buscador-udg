# Tarea actual

Última actualización: 2026-09-22

## Objetivo

**T-06 — Localizador de Grupos y Seguimiento de Generaciones**

Implementar el módulo de localización y rastreo de grupos académicos por carrera/sección y seguimiento de cohortes generacionales (avance por semestre estimado, materias y salones compartidos).

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-06 |
| Tipo | FRONTEND / FEATURE |
| Prioridad | 🟠 ALTA |
| Complejidad | MEDIA |
| Estado | 📋 BACKLOG |
| Rama | develop |

## Alcance

### Pendiente
- [ ] Implementar servicio `src/services/groups.ts` para agrupar ofertas por carrera, sección/turno y cohorte estimada
- [ ] Conectar `src/components/views/GroupsView.tsx` con buscador interactivo por carrera, código de materia o sección
- [ ] Añadir visualizador de horario consolidado de grupo (vista semanal de todas las materias de una misma sección)
- [ ] Implementar estimador de generación/cohorte según semestre y avance reticular
- [ ] Pruebas unitarias de agrupación y cálculo de horarios de grupo en Vitest

## Tareas anteriores

- `T-05` — Buscador de Aulas Libres por Módulo, Día y Rango Horario (✅ COMPLETADO)
- `T-04` — Buscador de Profesores con Filtros y Estado en Tiempo Real (✅ COMPLETADO)
- `T-03` — Pipeline de Ingesta y Scraping en Supabase Edge Functions / CLI (✅ COMPLETADO)
- `T-02` — Scaffolding del Proyecto Frontend (React + Vite + Tailwind CSS) (✅ COMPLETADO)
- `T-01` — Planificación y Diseño Arquitectónico (✅ COMPLETADO)
