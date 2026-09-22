---
description: Planificación exhaustiva de features usando grill-me
---

## Instrucciones

Antes de implementar una nueva feature, valida el diseño exhaustivamente.

### Proceso
1. Presenta el plan inicial al usuario
2. Usa `grill-me` para interrogar cada aspecto:
   - Requisitos funcionales
   - Restricciones técnicas
   - Impacto en módulos existentes
   - Casos límite
   - Dependencias
3. Resuelve cada rama del árbol de decisiones
4. Obtén confirmación explícita
5. Registra la decisión en `.project-memory/DECISIONS.md`

### Vinculación obligatoria

El plan debe incluir:
- ID de tarea
- Prioridad y complejidad
- Dependencias
- Decisiones abiertas
- Rama Git propuesta
- Estrategia de pruebas
- Criterio de finalización

### Contexto del proyecto

Antes de planear, verifica:
- `PROJECT_STATE.md` — estado actual
- `DECISIONS.md` — decisiones previas
- `KNOWN_ISSUES.md` — problemas conocidos
