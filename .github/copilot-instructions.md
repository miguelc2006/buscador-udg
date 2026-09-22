# Instrucciones generales del proyecto

## Objetivo

Este repositorio contiene [PROYECTO], [DESCRIPCIÓN CORTA DEL PROYECTO].

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| [CAPA_1] | [TECNOLOGÍA_1] | [VERSIÓN_1] |
| [CAPA_2] | [TECNOLOGÍA_2] | [VERSIÓN_2] |
| [CAPA_3] | [TECNOLOGÍA_3] | [VERSIÓN_3] |

> **Nota:** Estos valores serán reemplazados durante el auto-montaje.

## Arquitectura

[DESCRIPCIÓN DE LA ARQUITECTURA DEL PROYECTO]

## Convenciones de código

- Commits siguen [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `build:`, `docs:`, `chore:`
- Separación clara de responsabilidades
- DTOs para transferencia de datos
- Modularidad y mantenibilidad

## Procedimiento obligatorio

Antes de modificar código:

1. Lee `.project-memory/PROJECT_STATE.md`
2. Lee `.project-memory/CURRENT_TASK.md`
3. Consulta `.project-memory/DECISIONS.md`
4. Busca el código real relacionado
5. Identifica las dependencias y posibles regresiones
6. Presenta un plan breve antes de cambios amplios

## Reglas de implementación

- No inventes archivos, clases, métodos o dependencias
- No supongas que una función falta sin buscarla
- Conserva compatibilidad con las funciones existentes
- Prefiere cambios pequeños, reversibles y comprobables
- No elimines comportamiento existente sin justificarlo
- No declares una tarea terminada sin ejecutar validaciones
- No expongas contraseñas, claves, tokens ni datos sensibles

## Validación

Después de modificar código:

1. Compila el proyecto
2. Ejecuta las pruebas relacionadas
3. Revisa errores y advertencias relevantes
4. Traza llamadores — identifica todos los puntos que usan el código modificado
5. Verifica regresiones — identifica qué flujos relacionados podrían afectarse
6. Presenta resumen de cambios al usuario
7. Aguarda aprobación explícita antes de ejecutar `git commit`
8. Registra los archivos modificados
9. Actualiza `.project-memory/CURRENT_TASK.md`
10. Registra decisiones permanentes en `DECISIONS.md`

## Comunicación

En cada entrega indica:

- Qué se encontró
- Qué se modificó
- Qué se comprobó
- Qué quedó pendiente
- Cuál es el siguiente paso recomendado
