---
description: Inicia una tarea usando estado persistente y git-context-reader
---

## Instrucciones

### Paso 0 — Vincular con la tarea

1. Solicita o identifica el ID de tarea
2. Lee `.project-memory/CURRENT_TASK.md`
3. Confirma título, estado, prioridad y dependencias
4. Verifica si existe una rama asociada

### Paso 1 — Recuperar contexto

Ejecuta el skill `git-context-reader`:
1. `git log -n 10 --oneline --stat`
2. `git status`
3. Resume los últimos cambios y el estado actual

### Paso 2 — Leer memoria del proyecto

Lee estos archivos:
- `.project-memory/PROJECT_STATE.md`
- `.project-memory/CURRENT_TASK.md`
- `.project-memory/DECISIONS.md`
- `.project-memory/KNOWN_ISSUES.md`
- `AGENTS.md`

### Paso 3 — Analizar solicitud

1. Define un objetivo único y verificable
2. Busca el código real relacionado (no inventes)
3. Identifica archivos y dependencias
4. Detecta restricciones aplicables
5. Separa hechos de suposiciones
6. Propón un plan por etapas

### Paso 4 — Validar con grill-me

Si la solicitud es ambigua o tiene múltiples ramas de decisión:
- Usa el skill `grill-me` para interrogar al usuario
- Resuelve cada rama del árbol de decisiones
- Obtén confirmación antes de planificar

### Paso 5 — Registrar

Actualiza `.project-memory/CURRENT_TASK.md` con:
- Objetivo verificable
- Plan aprobado
- Archivos involucrados
