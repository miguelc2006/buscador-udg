# Descripción General de la Arquitectura — Buscador UDG

## 1. Stack Tecnológico

| Componente | Tecnología | Detalle / Justificación |
|------------|-----------|-------------------------|
| **Frontend** | React 18 + Vite + TypeScript | SPA de alta velocidad, bundle liviano, despliegue estático |
| **Estilos & UI** | Tailwind CSS + Lucide Icons + Shadcn/Radix UI | Componentes accesibles, responsivos y modulares |
| **Backend & Base de Datos** | Supabase (PostgreSQL 15+) | Base de datos relacional serverless con PostgREST integrado |
| **Scraping / Ingesta** | Supabase Edge Functions (Deno / TS) + Cheerio | Extracción serverless y upsert por lotes de la oferta académica |
| **Hosting & CI/CD** | Vercel / Cloudflare Pages + GitHub Actions | Alojamiento en capa gratuita con despliegues atómicos |

---

## 2. Diagrama de Arquitectura de Alto Nivel

```mermaid
graph TD
    subgraph Fuentes de Datos UDG
        SIIAU[SIIAU / Portal Oferta Académica UDG]
    end

    subgraph Backend Serverless en Supabase
        EF[Supabase Edge Functions: Scraper & Ingester]
        DB[(Supabase PostgreSQL Database)]
        PGR[PostgREST API / RLS Policies]
        
        EF -->|1. Consulta HTML/Tablas| SIIAU
        EF -->|2. Parseo y Upsert por lotes| DB
        DB --- PGR
    end

    subgraph Frontend Web SPA - React + Vite
        UI[App Web / UI SPA]
        SearchProf[Módulo: Buscador de Profesores]
        SearchRoom[Módulo: Buscador de Aulas Libres]
        SearchGroup[Módulo: Ubicador de Grupos]
        TrackGen[Módulo: Rastreador de Generaciones]
        
        UI --> SearchProf
        UI --> SearchRoom
        UI --> SearchGroup
        UI --> TrackGen
        
        UI -->|Consultas HTTP indexadas con supabase-js| PGR
    end
```

---

## 3. Modelo Relacional de Datos (ERD)

```mermaid
erDiagram
    CENTROS ||--o{ MODULOS : contiene
    MODULOS ||--o{ AULAS : contiene
    CENTROS ||--o{ OFERTAS : pertenece
    MATERIAS ||--o{ OFERTAS : impartida_en
    PROFESORES ||--o{ OFERTAS : asignado_a
    OFERTAS ||--|{ SESIONES_HORARIO : programada_en
    AULAS ||--o{ SESIONES_HORARIO : asignada_en

    CENTROS {
        varchar codigo PK
        varchar nombre
        varchar campus
    }

    PROFESORES {
        uuid id PK
        varchar codigo_profesor
        varchar nombre_completo
        varchar departamento
    }

    MATERIAS {
        varchar clave PK
        varchar nombre
        int creditos
        varchar area
    }

    MODULOS {
        uuid id PK
        varchar centro_codigo FK
        varchar codigo_modulo
        varchar nombre
    }

    AULAS {
        uuid id PK
        uuid modulo_id FK
        varchar centro_codigo FK
        varchar codigo_aula
        varchar tipo
        int capacidad
    }

    OFERTAS {
        uuid id PK
        varchar nrc
        varchar ciclo
        varchar centro_codigo FK
        varchar materia_clave FK
        uuid profesor_id FK
        varchar seccion
        int cupo_total
        int cupo_disponible
    }

    SESIONES_HORARIO {
        uuid id PK
        uuid oferta_id FK
        varchar nrc
        varchar dia
        time hora_inicio
        time hora_fin
        uuid aula_id FK
        varchar modulo_texto
        varchar aula_texto
        date fecha_inicio
        date fecha_fin
    }
```

---

## 4. Estrategia de Búsqueda de Aulas Libres

Para determinar qué aulas están **libres** en un centro, módulo, día y rango horario específico $[H_{inicio}, H_{fin}]$:

1. **Aulas Ocupadas:**
   $$\text{AulasOcupadas} = \{ a \in \text{Aulas} \mid \exists s \in \text{Sesiones} : s.aula\_id = a.id \land s.dia = D \land (s.hora\_inicio < H_{fin} \land s.hora\_fin > H_{inicio}) \}$$
2. **Aulas Libres:**
   $$\text{AulasLibres} = \text{AulasDelModulo} \setminus \text{AulasOcupadas}$$
3. Se implementa mediante una función RPC en PostgreSQL (`get_free_classrooms(centro, modulo, dia, hora_ini, hora_fin)`) para ejecutar la diferencia de conjuntos directamente en base de datos con índices B-Tree en `(dia, hora_inicio, hora_fin)`.

---

## 5. Estrategia de Ingesta y Resiliencia

- **Particionamiento por Centro y Departamento:** Dado el límite de ejecución de Edge Functions (Free Tier: 50s-150s CPU time), la ingesta se ejecuta particionada por Centro Universitario y/o departamento/carrera.
- **Normalización de Texto:** Limpieza de nombres de profesores (eliminación de acentos, mayúsculas, espacios extra) para permitir búsquedas `ILIKE` o `trigram` (extensión `pg_trgm`).
- **Idempotencia:** Uso intensivo de `ON CONFLICT (ciclo, nrc) DO UPDATE` para permitir resincronizaciones sin duplicados.
