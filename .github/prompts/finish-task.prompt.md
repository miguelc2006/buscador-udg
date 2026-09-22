---
description: Valida y cierra formalmente la tarea activa
---

## Checklist de cierre

Antes de marcar la tarea como completada:

### 1. Compilación
```bash
[COMANDO_BUILD]
```
- ¿Compila sin errores?
- ¿Compila sin warnings nuevos?

### 2. Pruebas
```bash
[COMANDO_TEST]
```
- ¿Las pruebas relacionadas pasan?
- ¿Hay pruebas de regresión para el fix?

### 3. Revisión de código
- Revisa calidad del código
- Verifica separación de responsabilidades
- Revisa manejo de errores

### 4. Git
```bash
git diff
git status
```
- ¿Hay archivos accidentales o secretos?
- ¿Los archivos modificados son los correctos?

### 5. Documentación
- Actualiza `.project-memory/CURRENT_TASK.md` con el resultado
- Registra decisiones en `.project-memory/DECISIONS.md`
- Actualiza `.project-memory/PROJECT_STATE.md` si cambió el estado

### 6. Validación de trazabilidad
- ID de tarea identificado
- Rama vinculada correctamente
- Alcance implementado sin desviaciones
- Decisiones registradas
- Estado actualizado a `COMPLETADO`

### 7. Commit
```bash
git commit
```
- Formato convencional
- Mensaje descriptivo en español
