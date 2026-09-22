---
applyTo: "**"
---

# Sistema de propuesta de ideas — [PROYECTO]

## Propósito

Estandarizar la captura, evaluación e incorporación de ideas y mejoras al backlog del proyecto.

## Limitaciones

- **No toda idea se convierte en tarea.** Requiere evaluación de factibilidad y prioridad
- **No se implementa sin registro.** Toda idea debe existir primero como entrada
- **No se saltan etapas.** Una idea no pasa de `DISEÑO` a `EN PROGRESO` sin plan aprobado

## Prioridad (obligatoria en toda entrada)

| Nivel | Significado | Criterio |
|-------|------------|----------|
| 🔴 CRÍTICA | Bloquea operación o compromete seguridad | Sin workaround inmediato |
| 🟠 ALTA | Mejora significativa del flujo diario | Afecta productividad |
| 🟡 MEDIA | Beneficio funcional sin urgencia | Mejora deseable |
| 🟢 BAJA | Mejora cosmética o funcionalidad de nicho | Nice-to-have |

## Complejidad (obligatoria en toda entrada)

| Nivel | Estimación | Riesgo |
|-------|-----------|--------|
| BAJA | < 1 día | Mínimo |
| MEDIA | 1-5 días | Moderado |
| ALTA | 1-3 semanas | Requiere diseño previo |
| MUY ALTA | > 3 semanas | Requiere planificación detallada |

## Formato de entrada

```markdown
## [ID] — [TÍTULO CORTO]

**Tipo:** BUG | MEJORA | FUNCIÓN | ARQUITECTURA | CALIDAD | SEGURIDAD
**Prioridad:** 🔴 CRÍTICA | 🟠 ALTA | 🟡 MEDIA | 🟢 BAJA
**Complejidad:** BAJA | MEDIA | ALTA | MUY ALTA
**Estado:** 📐 DISEÑO | 📋 BACKLOG

### Descripción
[Descripción clara de la necesidad]

### Criterios de aceptación
- [ ] Criterio 1
- [ ] Criterio 2

### Alcance
[Qué SÍ y qué NO incluye]
```

## Flujo de una idea

```
Idea bruta → Evaluación → Registro → DISEÑO → BACKLOG → EN PROGRESO → COMPLETADO
                                              ↓
                                      Rechazada (justificada)
```
