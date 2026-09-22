# Estado del proyecto

Última actualización: 2026-09-22

## Identidad

- Nombre: Buscador UDG
- Versión: v0.1.0
- Rama principal: main
- Etapa actual: Planificación y Diseño Arquitectónico
- Descripción: Plataforma web para la consulta y búsqueda inteligente de profesores, aulas libres, ubicación de grupos y seguimiento de generaciones a partir de la oferta académica de la Universidad de Guadalajara.

## Tecnologías

| Capa | Tecnología | Versión / Detalle |
|------|-----------|-------------------|
| Frontend | React + Vite | SPA con TypeScript |
| Backend & DB | Supabase (PostgreSQL + PostgREST) | Cloud Free Tier |
| Sincronización / Ingesta | Supabase Edge Functions (Deno / TS) | Serverless Scraping |
| Hosting | Vercel / Cloudflare Pages | Free Tier |
| Mapeo Generacional | Spike de Investigación (ADR-001) | Mallas curriculares / JSON |

## Arquitectura vigente

Arquitectura serverless desacoplada:
1. **Frontend (React + Vite):** Cliente SPA que consume directamente la API de Supabase (PostgREST) con políticas de lectura pública / RLS.
2. **Supabase Edge Functions:** Funciones serverless para consultar SIIAU/Oferta UDG, parsear el HTML/JSON y realizar `upsert` por lotes en las tablas relacionales.
3. **Base de Datos PostgreSQL:** Tablas estructuradas con índices en (centro, ciclo, profesor, aula, dia, hora_inicio, hora_fin, materia, nrc).

## Módulos principales

1. **Extractor / Sincronizador de Datos:** Ingesta de tablas de oferta académica UDG a Supabase.
2. **Buscador de Profesores:** Ubicación actual, materias impartidas, horarios y aulas.
3. **Buscador de Aulas Libres:** Consulta de espacios disponibles por centro universitario, módulo, día y rango horario.
4. **Localizador de Grupos y Generaciones:** Mapeo de avance reticular y ubicación de bloques de materias por cohorte.
