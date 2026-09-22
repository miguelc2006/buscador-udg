# 🚀 Auto-Montaje — Plantilla de Proyecto AI

## Bienvenido

Esta plantilla está diseñada para configurarse automáticamente en la primera interacción con un agente de IA (Copilot, ChatGPT, Claude, etc.).

## Primer Arranque

Cuando inicies una nueva conversación en este directorio, el agente detectará esta plantilla y ejecutará el siguiente flujo:

```
1. Detectar plantilla (presencia de .agents/, .github/, .project-memory/)
2. Ejecutar AUTO_SETUP.md
3. Solicitar idea/concepto del proyecto
4. Adaptar instrucciones, prompts y modelos
5. Crear skills personalizadas (post-idea)
6. Confirmar listo para trabajar
```

## Qué incluye la plantilla

### Instrucciones (`.github/instructions/`)
- `project-setup.instructions.md` — Configuración inicial del proyecto
- `workflow.instructions.md` — Flujo de trabajo obligatorio
- `git-flow.instructions.md` — Reglas de branching
- `bug-tracking.instructions.md` — Gestión de bugs
- `idea-proposal.instructions.md` — Sistema de ideas
- `quality.instructions.md` — Criterios de calidad
- `security.instructions.md` — Reglas de seguridad

### Skills por defecto (`.agents/skills/`)
- `caveman` — Comunicación ultra-comprimida
- `create-skill` — Guía para crear skills
- `diagnose` — Loop de diagnóstico disciplinado
- `git-commit` — Commits convencionales en español
- `git-context-reader` — Recuperación de contexto git
- `git-flow-branch-creator` — Creación inteligente de ramas
- `grill-me` — Entrevista exhaustiva de diseño
- `workflow-orchestration-patterns` — Patrones de orquestación

### Agentes (`.github/agents/`)
- `project-planner.agent.md` — Planificador técnico
- `implementation.agent.md` — Implementador principal
- `code-reviewer.agent.md` — Revisor independiente
- `workflow-orchestrator.agent.md` — Orquestador de flujo

### Prompts (`.github/prompts/`)
- `start-task.prompt.md` — Iniciar tarea
- `plan-feature.prompt.md` — Planificar feature
- `finish-task.prompt.md` — Cerrar tarea
- `git-commit.prompt.md` — Ejecutar commit
- `diagnose-bug.prompt.md` — Diagnosticar bug
- `new-idea.prompt.md` — Registrar idea

### Memoria del proyecto (`.project-memory/`)
- `PROJECT_STATE.md` — Estado general
- `CURRENT_TASK.md` — Tarea activa
- `DECISIONS.md` — Decisiones arquitectónicas
- `KNOWN_ISSUES.md` — Problemas conocidos
- `SESSION_LOG.md` — Registro de sesiones

## Personalización después del primer arranque

Una vez que el agente haya configurado el proyecto, podrás:

1. **Crear skills personalizadas** — Usa la skill `create-skill` o pide al agente que genere skills específicas para tu dominio
2. **Modificar instrucciones** — Edita los archivos en `.github/instructions/` para adaptarlas a tu stack
3. **Agregar agentes** — Crea nuevos agentes en `.github/agents/` para roles específicos
4. **Personalizar prompts** — Modifica los prompts en `.github/prompts/` para flujos específicos

## Comandos rápidos

| Comando | Descripción |
|---------|-------------|
| `/start-task` | Iniciar una tarea existente |
| `/plan-feature` | Planificar una nueva feature |
| `/finish-task` | Cerrar la tarea activa |
| `/commit` | Ejecutar commit conventional |
| `/diagnose` | Diagnosticar un bug |
| `/new-idea` | Registrar una nueva idea |
| `/caveman` | Modo comunicación comprimida |
| `/context` | Recuperar contexto del proyecto |
