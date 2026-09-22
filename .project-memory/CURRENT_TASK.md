# Tarea actual

Última actualización: 2026-09-22

## Objetivo

**T-04 — Buscador de Profesores con Filtros y Estado en Tiempo Real**

Conectar la vista de búsqueda de profesores (`src/components/views/ProfessorsView.tsx`) con Supabase, implementando búsqueda difusa (trigram / `pg_trgm`), debounce, detalles de materias impartidas y tarjeta de estado en vivo ("En clase ahora" indicando aula, módulo y horario actual).

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-04 |
| Tipo | FRONTEND / FEATURE |
| Prioridad | 🔴 CRÍTICA |
| Complejidad | MEDIA |
| Estado | 📋 BACKLOG |
| Rama | develop |

## Alcance

### Pendiente
- [ ] Implementar hook o servicio de consulta a Supabase con búsqueda difusa en `profesores` y `sesiones_horario`
- [ ] Conectar `ProfessorsView.tsx` con estado global (centro universitario y ciclo seleccionados)
- [ ] Implementar cálculo de estado actual en tiempo real ("En clase ahora" vs "Sin clase en este momento")
- [ ] Añadir modal o desplegable con la carga académica completa del profesor (todas sus materias, grupos y horarios)
- [ ] Pruebas unitarias de cálculo de horario y renderizado

## Tarea anterior

- `T-03` — Pipeline de Ingesta y Scraping en Supabase Edge Functions / CLI (✅ COMPLETADO)
