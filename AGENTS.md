# Instrucciones para agentes — [PROYECTO]

## Inicio de una tarea

1. Ejecuta el protocolo de auto-montaje (`AUTO_SETUP.md`) si es la primera vez
2. Usa `git-context-reader` para recuperar contexto
3. Lee `.project-memory/PROJECT_STATE.md`
4. Lee `.project-memory/CURRENT_TASK.md`
5. Lee las decisiones aplicables en `DECISIONS.md`
6. Inspecciona el código antes de planear
7. Distingue hechos verificados de suposiciones

## Durante la tarea

- Mantén una sola meta principal
- Divide cambios grandes en etapas
- Valida cada etapa (build + tests)
- No amplíes el alcance sin registrarlo
- Conserva evidencia de comandos y resultados
- Usa las skills apropiadas:
  - `diagnose` para bugs difíciles
  - `grill-me` para validar planes ambiguos
  - `git-commit` para commits convencionales
  - `caveman` para respuestas comprimidas

## Cierre de una tarea

- Actualiza `CURRENT_TASK.md`
- Actualiza `PROJECT_STATE.md` cuando cambie el estado real
- Registra decisiones permanentes en `DECISIONS.md`
- Registra problemas no resueltos en `KNOWN_ISSUES.md`
- Pre-revisión obligatoria — presenta resumen de cambios
- Aprobación del usuario — no ejecutes `git commit` sin confirmación
- Usa `git-commit` para el commit
- Resume el siguiente paso exacto

## Skills del proyecto

Las skills están en `.agents/skills/`. Úsalas cuando apliquen:

| Skill | Cuándo usar |
|-------|-------------|
| `orchestration` | Tareas multietapa, coordinación de skills/subagentes |
| `git-context-reader` | Inicio de sesión, pérdida de contexto |
| `git-commit` | Crear commits convencionales |
| `git-flow-branch-creator` | Crear ramas feature/hotfix/release |
| `diagnose` | Bugs difíciles, regresiones |
| `grill-me` | Validar planes ambiguos |
| `caveman` | Ahorrar tokens en respuestas simples |
| `create-skill` | Crear nuevas skills personalizadas |

## Subagentes disponibles

| Subagente | Uso principal |
|-----------|---------------|
| **Code Reviewer** | Revisión independiente después de implementar |
| **Implementation** | Escritura de código con compilación frecuente |
| **Project Planner** | Planificación de features y decisiones |
| **Explore** | Búsqueda read-only del codebase |

## Orquestación

Para tareas complejas, usa la skill `orchestration`. Define:
- **Subagente** adecuado según el tipo de tarea
- **Skills** que debe invocar el subagente
- **Gate de aprobación** antes de acciones irreversibles
- **Checkpoint** al completar cada fase
