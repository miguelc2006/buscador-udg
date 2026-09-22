---
applyTo: "**"
---

# Reglas Git Flow y Commits — [PROYECTO]

Antes de implementar una tarea nueva:

1. Ejecutar `git status`
2. Ejecutar `git diff` o `git diff --cached`
3. Leer el ID, tipo, prioridad y versión de la tarea en `.project-memory/CURRENT_TASK.md`
4. Determinar el tipo de rama
5. Crear una rama semántica vinculada al ID

## Clasificación de Ramas

| Tipo | Origen | Uso | Formato preferido |
|------|--------|-----|-------------------|
| `feature` | `develop` | Nuevas funciones y características | `feature/ID-descripcion` |
| `fix` | `develop` | Corrección de errores y bugs | `fix/ID-descripcion` |
| `refactor` | `develop` | Refactorización de código sin cambiar comportamiento | `refactor/ID-descripcion` |
| `docs` | `develop` | Cambios exclusivos en documentación | `docs/ID-descripcion` |
| `test` | `develop` | Añadir o modificar pruebas | `test/ID-descripcion` |
| `security` | `develop` | Correcciones de seguridad y vulnerabilidades | `security/ID-descripcion` |
| `release` | `develop` | Preparación de versión, changelog, pruebas finales | `release-X.Y.Z` |
| `hotfix` | `master` | Fallo crítico en producción, seguridad, datos | `hotfix/ID-descripcion` |

## Reglas de nombres de ramas

- Usar minúsculas y `kebab-case`
- Incluir el ID de la tarea cuando exista (ej. `feature/T-12_login-oauth`)
- Mantener el nombre breve y descriptivo
- No reutilizar nombres de ramas existentes

## Convención de Commits (Conventional Commits)

Los mensajes de commit deben seguir el estándar de Conventional Commits:

```text
<tipo>(<ámbito>): <descripción corta en español>

[cuerpo opcional con detalles]

[pie de página opcional con referencias a Issues, ej: Closes #123]
```

### Tipos permitidos:
- `feat`: Nueva funcionalidad.
- `fix`: Corrección de un error.
- `docs`: Cambios en la documentación.
- `test`: Añadir o corregir pruebas.
- `refactor`: Cambios en el código que no corrigen errores ni añaden funciones.
- `perf`: Cambios para mejorar el rendimiento.
- `security`: Cambios relacionados con la seguridad.
- `build`: Cambios que afectan al sistema de construcción o dependencias externas.
- `ci`: Cambios en los archivos y scripts de configuración de CI/CD.
- `chore`: Tareas de mantenimiento general.
- `revert`: Revertir un commit anterior.

### Ejemplos:
- `feat(auth): add role-based permissions`
- `fix(reports): correct duplicated page header`
- `test(patients): add validation tests`
- `security(config): remove hardcoded credentials`

## Casos especiales

- Si hay cambios mezclados, proponer separar el trabajo
- Si ya existe una rama apropiada, reutilizarla
- Si no hay cambios ni tarea definida, no crear rama automáticamente
- `feature`, `fix`, `refactor`, `docs`, `test`, `security` y `release` parten de `develop`
- `hotfix` parte de `master`
- Las ramas se eliminan después de un merge exitoso
