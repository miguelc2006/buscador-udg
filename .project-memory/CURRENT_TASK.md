# Tarea actual

Última actualización: 2026-09-22

## Objetivo

**T-02 — Scaffolding del Proyecto Frontend (React + Vite + Tailwind CSS)**

Configurar la estructura base del cliente frontend con React 18, Vite, TypeScript, Tailwind CSS, Lucide React y cliente `@supabase/supabase-js`, estableciendo el layout base, tema visual y soporte de variables de entorno.

## Identificación

| Campo | Valor |
|-------|-------|
| ID | T-02 |
| Tipo | INFRA / SETUP |
| Prioridad | 🔴 CRÍTICA |
| Complejidad | BAJA |
| Estado | 🚧 PRE-REVISIÓN |

## Alcance

### Completado
- [x] Inicializar proyecto Vite con React 18 y TypeScript
- [x] Instalar y configurar Tailwind CSS, Lucide React y `@supabase/supabase-js`
- [x] Configurar `.env.example`, `src/types/database.ts` y cliente centralizado `src/lib/supabase.ts`
- [x] Crear Layout base (Navbar con selector de Centro Universitario y Ciclo, Tabs de navegación: Profesores, Aulas Libres, Grupos)
- [x] Crear vistas iniciales (`ProfessorsView`, `FreeRoomsView`, `GroupsView`) y `Footer`
- [x] Validar compilación limpia con `npm run build`

## Verificación

- [x] Compilación frontend limpia (`npm run build`) → ✅ COMPLETADO (0 errores)
- [ ] Pre-revisión de cambios → ⏳ AGUARDANDO APROBACIÓN DEL USUARIO
- [ ] Commit semántico en rama `feature/T-02-frontend-scaffolding` → ⏳ PENDIENTE

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
