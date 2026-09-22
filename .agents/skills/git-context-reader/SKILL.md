---
name: git-context-reader
description: "Úsalo SIEMPRE al inicio de una nueva conversación para entender en qué estado se quedó el proyecto, o cuando el usuario indique 'pérdida de contexto'. Ejecuta comandos de git para analizar los últimos cambios."
---

# Git Context Reader

Recupera contexto técnico profundo sobre el estado actual del proyecto leyendo el historial de control de versiones.

## Cuándo usarlo

- **Inicio de sesión:** Al comenzar un nuevo chat
- **Pérdida de contexto:** Si en un chat largo el usuario pide recapitular
- **Petición explícita:** Cuando pregunte por "historial de cambios" o "estado del repositorio"

## Cómo ejecutarlo

1. **Historial reciente:**
   ```bash
   git log -n 10 --oneline --stat
   ```

2. **Estado actual:**
   ```bash
   git status
   ```

3. **Cambios detallados (si hay):**
   ```bash
   git diff
   ```

## Formato de Salida

### 1. Estado Actual (Cambios en Proceso)
- Archivos modificados (según `git status`)
- Deduce qué funcionalidad está en progreso

### 2. Últimos Cambios (Historial)
- Resume los commits más importantes
- Menciona componentes o áreas afectadas

### 3. Contexto Técnico Inferido
- Deducción del estado actual
- Pregunta proactiva al usuario

## Reglas

- No superficial — genera un resumen con alta carga técnica
- Distingue hechos (git) de deducciones
- Cierra con pregunta técnica y proactiva
