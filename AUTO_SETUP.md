# ⚙️ Auto-Montaje — Guía de Configuración Automática

## Propósito

Este archivo contiene las instrucciones que el agente de IA debe seguir automáticamente al iniciar una conversación en este directorio. **No es un archivo para humanos** — es un protocolo de configuración para el agente.

## Detección de Plantilla

Al inicio de cualquier conversación, el agente debe:

1. Verificar si existen `.agents/`, `.github/`, `.project-memory/`
2. Si existen → ejecutar este protocolo
3. Si no existen → trabajar sin plantilla

## Protocolo de Auto-Montaje

### Fase 1 — Recuperación de Contexto (si ya existe proyecto)

```bash
git log -n 10 --oneline --stat
git status
```

Si hay commits previos:
- Lee `AGENTS.md`
- Lee `.project-memory/PROJECT_STATE.md`
- Lee `.project-memory/CURRENT_TASK.md`
- Resume el estado al usuario
- **No continues a Fase 2** — el proyecto ya está configurado

### Fase 2 — Proyecto Nuevo (sin commits o directorio vacío)

Si no hay commits o el directorio está vacío:

#### Paso 1 — Solicitar Concepto

Pregunta al usuario (una sola pregunta, no multiples):

```
¿Qué tipo de proyecto vas a construir?

Opciones:
1. Web App (frontend + backend)
2. API / Microservicio
3. Aplicación de escritorio
4. CLI / Herramienta
5. Librería / Paquete
6. Otro (describe)

Además, ¿tienes un archivo .md con el plan maestro o idea conceptual del proyecto?
Si sí, indica la ruta del archivo.
```

#### Paso 2 — Configurar Stack Tecnológico

Basado en la respuesta, configura:

| Aspecto | Acción |
|---------|--------|
| `AGENTS.md` | Actualizar nombre del proyecto, stack, arquitectura |
| `.project-memory/PROJECT_STATE.md` | Completar Identidad, Tecnologías, Arquitectura |
| `.github/instructions/` | Adaptar instrucciones al stack |
| `.github/agents/` | Adaptar agentes al dominio |
| `skills-lock.json` | Generar con skills activas |

#### Paso 3 — Adaptar Instrucciones

Para cada archivo en `.github/instructions/`:

1. Lee el contenido actual
2. Reemplaza `[PROYECTO]` por el nombre real del proyecto
3. Reemplaza `[STACK]` por las tecnologías reales
4. Reemplaza `[COMANDO_BUILD]` por el comando de build real
5. Reemplaza `[COMANDO_TEST]` por el comando de test real
6. Reemplaza `[COMANDO_LINT]` por el comando de lint real (si aplica)

#### Paso 4 — Adaptar Agentes

Para cada archivo en `.github/agents/`:

1. Reemplaza referencias al proyecto por el nombre real
2. Adapta las reglas de negocio al dominio
3. Mantén la estructura de responsabilidades

#### Paso 5 — Adaptar Skills

Skills por defecto son genéricas y funcionan sin cambios. Solo adapta si el proyecto lo requiere:
- `git-commit` → adapta el idioma si no es español
- `diagnose` → adapta los comandos de build/test

#### Paso 6 — Crear Memoria Inicial

Genera contenido para `.project-memory/`:

```markdown
# Estado del proyecto
Última actualización: [FECHA]

## Identidad
- Nombre: [NOMBRE]
- Versión: v0.1.0
- Rama principal: main (o master)
- Etapa: Inicialización
- Descripción: [DESCRIPCIÓN DEL PROYECTO]

## Tecnologías
[STACK DETECTADO O PROPUESTO]

## Arquitectura vigente
[ARQUITECTURA PROPUESTA]
```

#### Paso 7 — Skills Personalizadas (Post-Idea)

**Después** de que el usuario confirme la idea del proyecto:

1. Pregunta si quiere skills específicas para su dominio
2. Usa la skill `create-skill` como guía
3. Crea skills en `.agents/skills/` siguiendo la estructura:
   ```
   skill-name/
   ├── SKILL.md (requerido, <200 líneas)
   │   ├── YAML frontmatter
   │   │   ├── name: (requerido)
   │   │   └── description: (requerido)
   │   └── Markdown instructions
   └── references/ (opcional)
   ```

4. Ejemplos de skills personalizadas a sugerir:
   - **`project-orchestration`** — Coordinación específica del proyecto
   - **`pre-commit-review`** — Gate de calidad pre-commit
   - **`[dominio]-patterns`** — Patrones específicos del dominio
   - **`[stack]-best-practices`** — Mejores prácticas del stack

#### Paso 8 — Confirmación

Presenta al usuario:

```markdown
## ✅ Proyecto Configurado

### Nombre: [NOMBRE]
### Stack: [TECNOLOGÍAS]
### Skills activas: [NÚMERO]
### Agentes configurados: [NÚMERO]

### Próximos pasos:
1. Inicializar repositorio: `git init`
2. Crear estructura base del proyecto
3. Primera tarea: [SUGERENCIA]

### Comandos disponibles:
- `/start-task` — Iniciar tarea
- `/plan-feature` — Planificar feature
- `/commit` — Ejecutar commit
- `/caveman` — Modo comprimido
```

## Estructura Final Esperada

```
proyecto/
├── .agents/
│   └── skills/
│       ├── caveman/SKILL.md
│       ├── create-skill/SKILL.md
│       ├── diagnose/SKILL.md
│       ├── git-commit/SKILL.md
│       ├── git-context-reader/SKILL.md
│       ├── git-flow-branch-creator/SKILL.md
│       ├── grill-me/SKILL.md
│       └── workflow-orchestration-patterns/SKILL.md
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   │   ├── project-setup.instructions.md
│   │   ├── workflow.instructions.md
│   │   ├── git-flow.instructions.md
│   │   ├── bug-tracking.instructions.md
│   │   ├── idea-proposal.instructions.md
│   │   ├── quality.instructions.md
│   │   └── security.instructions.md
│   ├── prompts/
│   │   ├── start-task.prompt.md
│   │   ├── plan-feature.prompt.md
│   │   ├── finish-task.prompt.md
│   │   ├── git-commit.prompt.md
│   │   ├── diagnose-bug.prompt.md
│   │   └── new-idea.prompt.md
│   └── agents/
│       ├── project-planner.agent.md
│       ├── implementation.agent.md
│       ├── code-reviewer.agent.md
│       └── workflow-orchestrator.agent.md
├── .project-memory/
│   ├── PROJECT_STATE.md
│   ├── CURRENT_TASK.md
│   ├── DECISIONS.md
│   ├── KNOWN_ISSUES.md
│   └── SESSION_LOG.md
├── .memory/
│   └── (notas del agente)
├── AGENTS.md
├── BOOTSTRAP.md
├── AUTO_SETUP.md
└── skills-lock.json
```

## Notas para el Agente

- **No modifiques este archivo** — es la fuente de verdad del protocolo
- **Lee `BOOTSTRAP.md`** si necesitas una visión general para humanos
- **Prioriza la Fase 1** — si el proyecto ya existe, no reconfigures
- **Adapta, no inventes** — usa el código real como fuente de verdad
- **Pide una sola cosa a la vez** — no satures al usuario
