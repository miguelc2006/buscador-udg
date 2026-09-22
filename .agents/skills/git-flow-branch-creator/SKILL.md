---
name: git-flow-branch-creator
description: 'Intelligent Git Flow branch creator that analyzes git status/diff and creates appropriate branches following the nvie Git Flow branching model.'
---

# Git Flow Branch Creator

Analiza tus cambios actuales y crea ramas siguiendo el modelo Git Flow.

## Workflow

1. Ejecuta `git status` para ver el estado del repositorio
2. Ejecuta `git diff` para analizar la naturaleza de los cambios
3. Analiza los cambios usando el framework de análisis
4. Determina el tipo de rama apropiado
5. Genera un nombre semántico
6. Crea la rama y cámbiate a ella
7. Proporciona un resumen

## Git Flow Branch Analysis Framework

### Tipos de Rama

| Tipo | Origen | Merge a | Uso | Formato |
|------|--------|---------|-----|---------|
| `feature` | `develop` | `develop` | Nuevas funcionalidades | `feature/descripcion` |
| `release` | `develop` | `master` | Preparación de versión | `release-X.Y.Z` |
| `hotfix` | `master` | `master` | Fallos críticos | `hotfix/descripcion` |
| `bugfix` | `develop` | `develop` | Bugs no críticos | `bugfix/descripcion` |
| `chore` | `develop` | `develop` | Mantenimiento | `chore/descripcion` |

### Indicadores por Tipo

**Feature:**
- Nueva funcionalidad
- UI/UX mejoras
- Nuevos endpoints o métodos
- Opciones de configuración

**Hotfix:**
- Fallo en producción
- Vulnerabilidad de seguridad
- Corrupción de datos

**Release:**
- Preparación de versión
- Changelog
- Pruebas finales

**Bugfix:**
- Corrección de bug no crítico
- Comportamiento inesperado

## Reglas de Nombres

- Minúsculas y `kebab-case`
- Breve y descriptivo
- Sin reutilizar nombres existentes
- Incluir ID de tarea cuando exista
