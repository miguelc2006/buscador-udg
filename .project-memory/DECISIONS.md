# Registro de decisiones arquitectónicas

## Formato ADR (Architecture Decision Record)

Cada decisión debe seguir este formato:

```markdown
## ADR-[NÚMERO] — [TÍTULO]

- Fecha: [FECHA]
- Estado: Propuesta | Aceptada | Rechazada | Obsoleta

### Contexto
[Problema o situación que motivó la decisión]

### Decisión
[Qué se decidió]

### Razones
[Por qué se decidió esto]

### Consecuencias
- Beneficio: [beneficio esperado]
- Limitación: [limitación conocida]
- Trabajo futuro: [trabajo pendiente]
```

## Decisiones

## ADR-001 — Selección de Stack Tecnológico y Pipeline de Sincronización

- Fecha: 2026-09-22
- Estado: Aceptada

### Contexto
Se requiere una plataforma web rápida, con bajo consumo de recursos y alojable en capa gratuita, que consulte y analice la oferta académica de la Universidad de Guadalajara para buscar profesores, aulas libres y ubicaciones de grupos.

### Decisión
1. **Frontend:** React + Vite (SPA) con Tailwind CSS / componentes optimizados para despliegue en Vercel o Cloudflare Pages.
2. **Backend & Base de Datos:** Supabase (PostgreSQL relacional) utilizando Supabase Edge Functions / Deno para el pipeline de ingesta y scraping de datos de oferta académica.
3. **Mapeo de Generaciones:** Separar como spike técnico/investigación técnica para determinar la fuente y estructura idónea de las mallas curriculares y planes de estudio.

### Razones
- React + Vite ofrece velocidad de desarrollo instantánea, empaquetado mínimo y compatibilidad con hosting gratuito estático.
- Supabase Edge Functions permite ejecutar scrapers periódicos serverless en TypeScript sin mantener un servidor backend dedicado.
- PostgreSQL en Supabase permite indexar eficientemente búsquedas espaciales y temporales (módulos, días, bloques de horas, profesores).

### Consecuencias
- Beneficio: Coste $0 en infraestructura, arquitectura serverless escalable y consultas SQL de alta velocidad con índices.
- Limitación: Supabase Free Tier tiene límites de tiempo de ejecución en Edge Functions (requiere lotes o chunking para scraped masivo).
- Trabajo futuro: Diseñar la investigación de fuentes de datos para el mapeo de generaciones.
