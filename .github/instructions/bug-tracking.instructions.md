---
applyTo: "**"
---

# Gestión y trazabilidad de bugs — [PROYECTO]

## Propósito

Estandarizar la detección, seguimiento, resolución y cierre de bugs, garantizando trazabilidad completa.

## Limitaciones

- **No se corrige sin registro.** Todo bug debe existir como entrada antes de implementar la corrección
- **No se cierra sin evidencia.** Requiere compilación exitosa, pruebas pasando y revisión de código
- **No se mezclan correcciones de bugs distintos** en un mismo commit o rama

## Clasificación de severidad

| Severidad | Criterio | Prioridad asignada |
|-----------|----------|-------------------|
| **S1 — Bloqueante** | Impide uso completo del sistema | 🔴 CRÍTICA |
| **S2 — Mayor** | Afecta funcionalidad principal, hay workaround | 🟠 ALTA |
| **S3 — Menor** | Afecta funcionalidad secundaria o cosmética | 🟡 MEDIA |
| **S4 — Cosmético** | No afecta funcionalidad, mejora visual | 🟢 BAJA |

## Formato de registro

```markdown
## [ID] — [Título del bug]

**Tipo:** BUG
**Prioridad:** 🔴 CRÍTICA | 🟠 ALTA | 🟡 MEDIA | 🟢 BAJA
**Severidad:** S1 | S2 | S3 | S4
**Estado:** 📋 BACKLOG | 🚧 EN PROGRESO | ✅ COMPLETADO

### Problema
[Descripción del comportamiento incorrecto]

### Pasos para reproducir
1. [Paso 1]
2. [Paso 2]

### Resultado esperado
[Qué debería ocurrir]

### Resultado actual
[Qué ocurre realmente]

### Evidencia
[Logs, screenshots, mensajes de error]

### Criterios de aceptación para la corrección
- [ ] Bug ya no se reproduce
- [ ] Compilación exitosa
- [ ] Pruebas pasan
- [ ] No se introduce regresión
```

## Ciclo de vida

```
Detección → Registro → DISEÑO → BACKLOG → EN PROGRESO → Fix → Validación → COMPLETADO
```

## Reglas de cierre

1. Compilación exitosa
2. Pruebas relacionadas pasan
3. No se introduce regresión verificable
4. Root cause documentado
5. Rama y commit registrados
6. Estado actualizado a `✅ COMPLETADO`
