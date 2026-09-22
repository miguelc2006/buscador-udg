# Creación de Skills Personalizadas — Guía Post-Idea

## Cuándo crear skills personalizadas

Después de que el proyecto tenga una idea clara y se haya inicializado la estructura base, es momento de crear skills específicas para el dominio del proyecto.

## Skills personalizadas recomendadas

### 1. `project-orchestration` — Orquestación específica del proyecto

Coordinador delgado que decide, delega y verifica. No reemplaza la especialización de las skills invocadas.

**Crear cuando:** El proyecto tenga múltiples módulos, agentes o flujos complejos.

**Estructura sugerida:**
```markdown
---
name: project-orchestration
description: Orquesta tareas complejas del proyecto [NOMBRE] mediante delegación a subagentes y routing de skills.
---

# Orquestación — [NOMBRE]

## Límites
- Empieza con un agente. Escala solo por independencia real
- Separa orquestación de actividades
- Conserva el plan reproducible

## Delegación
[Catálogo de subagentes del proyecto]

## Routing de skills
[Mapa de decisiones según tipo de tarea]

## Control de contexto
[Archivos de memoria y ciclo de vida]
```

### 2. `pre-commit-review` — Gate de calidad pre-commit

Obligatorio antes de cualquier commit. Ejecuta verificación de llamadores, pruebas, resumen de cambios y aguarda aprobación del usuario.

**Crear cuando:** Se quiera garantizar calidad consistente en cada commit.

**Estructura sugerida:**
```markdown
---
name: pre-commit-review
description: Obligatorio antes de cualquier commit. Ejecuta verificación completa y aguarda aprobación.
---

# Pre-commit Review

## Flujo obligatorio
Implementar → Compilar → Tests → Verificar → Presentar resumen → Aguardar aprobación → Commit

## Checklist
1. Compilación exitosa
2. Tests pasando
3. Llamadores verificados
4. Regresiones revisadas
5. Resumen presentado
6. Aprobación del usuario
```

### 3. Skills de dominio específico

Según el tipo de proyecto:

| Tipo de Proyecto | Skills Sugeridas |
|-----------------|------------------|
| **Web App** | `api-design-review`, `ui-component-patterns`, `database-migration` |
| **API/Microservicio** | `endpoint-testing`, `schema-validation`, `rate-limiting` |
| **CLI** | `argument-parsing`, `output-formatting`, `shell-completion` |
| **Librería** | `api-surface-review`, `backward-compatibility`, `documentation-gen` |
| **Móvil** | `ui-patterns`, `offline-sync`, `push-notifications` |

## Flujo de creación

```
1. Identificar necesidad de skill
2. Definir trigger y scope
3. Usar create-skill como guía
4. Escribir SKILL.md (<200 líneas)
5. Crear references/ si es necesario
6. Testear la skill
7. Documentar en AGENTS.md
```

## Plantilla base para skills personalizadas

```markdown
---
name: [nombre-skill]
description: >
  [Descripción clara de qué hace y cuándo usarla. Incluye triggers específicos.]
---

# [Nombre de la Skill]

## Cuándo usar
- Trigger 1
- Trigger 2

## Cuándo NO usar
- Excepción 1
- Excepción 2

## Workflow
1. Paso 1
2. Paso 2
3. Paso 3

## Reglas
- Regla 1
- Regla 2

## Output
[Formato de salida esperado]
```

## Registro

Al crear una skill personalizada:
1. Agrégala en `.agents/skills/[nombre]/SKILL.md`
2. Actualiza `skills-lock.json`
3. Documenta en `AGENTS.md` la nueva skill
4. Prueba que se activa correctamente
