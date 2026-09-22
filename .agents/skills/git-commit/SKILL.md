---
name: git-commit
description: 'Ejecuta git commit con análisis de mensajes convencionales, preparación inteligente de archivos y generación de mensajes en español. Úsalo cuando el usuario pida confirmar cambios (commit), crear un commit de git o mencione "/commit".'
license: MIT
---

# Git Commit con Conventional Commits (en Español)

## Resumen

Crea commits de git estandarizados y semánticos usando la especificación de Conventional Commits, con mensajes en **español**. Analiza el diff real para determinar el tipo, ámbito y mensaje apropiados.

## Formato de Commit Convencional

```
<tipo>[ámbito opcional]: <descripción en español>

[cuerpo opcional]
```

## Tipos de Commit

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

## Proceso

1. Ejecuta `git diff` para analizar cambios
2. Identifica archivos modificados y su naturaleza
3. Determina el tipo de commit más apropiado
4. Genera mensaje descriptivo en español
5. Prepara archivos relacionados lógicamente
6. Ejecuta el commit
7. Confirma resultado

## Reglas

- Mensaje en español, claro y descriptivo
- Máximo 72 caracteres en la primera línea
- Tipo correcto según la naturaleza del cambio
- Ámbito claro cuando hay múltiples módulos
- No commitear archivos sensibles o temporales
