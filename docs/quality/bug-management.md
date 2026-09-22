# Gestión de Bugs — [PROYECTO]

## Clasificación de Severidad

| Severidad | Criterio | Prioridad asignada |
|-----------|----------|-------------------|
| **S1 — Bloqueante** | Impide uso completo del sistema | 🔴 CRÍTICA |
| **S2 — Mayor** | Afecta funcionalidad principal, hay workaround | 🟠 ALTA |
| **S3 — Menor** | Afecta funcionalidad secundaria o cosmética | 🟡 MEDIA |
| **S4 — Cosmético** | No afecta funcionalidad, mejora visual | 🟢 BAJA |

## Ciclo de Vida de un Bug
```
Detección → Registro (Issue) → DISEÑO → BACKLOG → EN PROGRESO → Fix → Validación → COMPLETADO
```

## Reglas de Cierre
1. Compilación exitosa.
2. Pruebas relacionadas pasan.
3. No se introduce regresión verificable.
4. Causa raíz documentada en el Issue.
5. Rama y commit registrados.
6. Estado actualizado a `✅ COMPLETADO`.
