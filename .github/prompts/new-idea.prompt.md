---
description: Registrar una nueva idea o mejora
---

## Instrucciones

### Paso 1 — Capturar la idea

1. Escucha la descripción del usuario
2. Pregunta por detalles faltantes:
   - ¿Qué problema resuelve?
   - ¿Quién se beneficia?
   - ¿Es urgente o deseable?
3. Clasifica:
   - **Tipo:** BUG | MEJORA | FUNCIÓN | ARQUITECTURA | CALIDAD | SEGURIDAD
   - **Prioridad:** 🔴 CRÍTICA | 🟠 ALTA | 🟡 MEDIA | 🟢 BAJA
   - **Complejidad:** BAJA | MEDIA | ALTA | MUY ALTA

### Paso 2 — Evaluar factibilidad

1. ¿Es técnicamente posible?
2. ¿Es compatible con la arquitectura actual?
3. ¿Hay dependencias?
4. ¿Cuál es el esfuerzo estimado?

### Paso 3 — Registrar

Crea la entrada en `.project-memory/CURRENT_TASK.md` o en un archivo dedicado:

```markdown
## [ID] — [TÍTULO]

**Tipo:** [TIPO]
**Prioridad:** [PRIORIDAD]
**Complejidad:** [COMPLEJIDAD]
**Estado:** 📐 DISEÑO

### Descripción
[Descripción clara]

### Criterios de aceptación
- [ ] Criterio 1
```

### Paso 4 — Siguiente paso

- Si la prioridad es 🔴 o 🟠 → proponer planificar inmediatamente
- Si es 🟡 o 🟢 → agregar al backlog y continuar
