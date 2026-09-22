# Tarea actual

Última actualización: 2026-09-22

## Objetivo

**T-01 — Planificación y Diseño Arquitectónico de Buscador UDG**

Definir la arquitectura, modelo de datos en Supabase, pipeline de extracción/ingesta de datos de oferta académica de la UDG y diseño de funcionalidades clave (buscador de profesores, buscador de aulas libres, rastreador de grupos/generaciones).

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-01 |
| Tipo | ARQUITECTURA |
| Prioridad | 🔴 CRÍTICA |
| Complejidad | MEDIA |
| Estado | ✅ COMPLETADO |

## Alcance

### Completado
- [x] Definición técnica de arquitectura y stack (`docs/architecture/overview.md`)
- [x] Esquema SQL para Supabase con índices y función RPC `get_aulas_libres` (`supabase/migrations/20260922000000_initial_schema.sql`)
- [x] Registro de ADR-001 en `.project-memory/DECISIONS.md`
- [x] Documento de Visión de Producto (`docs/product/vision.md`)
- [x] Backlog y Roadmap detallado de tareas T-02 a T-09 (`docs/product/roadmap.md`)

## Verificación

- [x] Especificación técnica y esquema SQL diseñados → ✅ COMPLETADO
- [x] Plan de desarrollo y backlog aprobados → ✅ COMPLETADO
- [ ] Commit de arquitectura inicial → ⏳ AGUARDANDO APROBACIÓN DEL USUARIO
