---
description: Ejecuta commit con análisis de mensajes convencionales
---

## Git Commit con Conventional Commits

### Formato de Commit

```
<tipo>[ámbito opcional]: <descripción en español>

[cuerpo opcional]
```

### Tipos de Commit

| Tipo       | Propósito                              |
| ---------- | -------------------------------------- |
| `feat`     | Nueva característica                   |
| `fix`      | Corrección de error (bug)              |
| `docs`     | Solo documentación                     |
| `style`    | Formato/estilo (sin cambios de lógica) |
| `refactor` | Refactorización de código              |
| `perf`     | Mejora de rendimiento                  |
| `test`     | Añadir/actualizar pruebas              |
| `build`    | Sistema de construcción/dependencias   |
| `ci`       | Cambios en CI/configuración            |
| `chore`    | Mantenimiento/tareas varias            |
| `revert`   | Revertir un commit anterior            |

### Proceso

1. Analiza `git diff` para determinar tipo y ámbito
2. Genera mensaje descriptivo en español
3. Prepara archivos relacionados lógicamente
4. Ejecuta commit
5. Confirma resultado
