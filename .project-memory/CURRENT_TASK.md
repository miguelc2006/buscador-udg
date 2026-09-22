# Tarea actual

Última actualización: 2026-09-22

## Objetivo

**T-03 — Pipeline de Ingesta y Scraping en Supabase Edge Functions**

Desarrollar la lógica de extracción, parseo y sincronización por lotes de la oferta académica de la UDG (basada en el extractor de `Horario-UDG`) hacia la base de datos Supabase, soportando filtrado por Centro Universitario y Ciclo escolar.

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-03 |
| Tipo | BACKEND / INGESTA |
| Prioridad | 🔴 CRÍTICA |
| Complejidad | MEDIA |
| Estado | 📋 BACKLOG |

## Alcance

### Pendiente
- [ ] Analizar el scraper/parser de `Horario-UDG` para reutilizar y adaptar la lógica de tablas HTML
- [ ] Crear la Edge Function / Script Deno & TypeScript (`supabase/functions/sync-oferta-udg/index.ts`)
- [ ] Implementar normalización de nombres de profesores, asignación de materias y módulos/aulas
- [ ] Implementar inserción transaccional / upsert por lotes en `oferta_academica`, `profesores`, `materias`, `modulos`, `aulas` y `sesiones_horario`
- [ ] Crear script local de sincronización CLI (`scripts/sync-oferta.ts`) para pruebas y cargas masivas sin límites de timeout

## Verificación

- [ ] Script de ingesta probado y validado con datos reales/mock de UDG → ⏳ PENDIENTE
- [ ] Pre-revisión de cambios → ⏳ PENDIENTE
- [ ] Commit semántico en rama `feature/T-03-pipeline-ingesta` → ⏳ PENDIENTE

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-02 |
| Tipo | INFRA / SETUP |
| Prioridad | 🔴 CRÍTICA |
| Complejidad | BAJA |
| Estado | � EN PROGRESO |

## Alcance

### Pendiente
- [ ] Inicializar proyecto Vite (React + TypeScript)
- [ ] Instalar y configurar Tailwind CSS, Lucide React y `@supabase/supabase-js`
- [ ] Configurar `.env.example` y cliente centralizado de Supabase (`src/lib/supabase.ts`)
- [ ] Crear Layout base (Navbar con selector de Centro Universitario, Tabs de navegación: Profesores, Aulas Libres, Grupos)
- [ ] Verificar `npm run build` y `npm run dev`

## Verificación

- [ ] Compilación frontend limpia (`npm run build`) → ⏳ PENDIENTE
- [ ] Pre-revisión de cambios → ⏳ PENDIENTE
- [ ] Commit semántico en rama `feature/T-02-frontend-scaffolding` → ⏳ PENDIENTE
