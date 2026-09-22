---
description: Diagnosticar bugs usando el skill diagnose
---

## Instrucciones

### Fase 1 — Feedback loop

Construye un loop de reproducción determinístico:
1. Identifica el síntoma exacto
2. Busca la ruta de código más probable
3. Construye un test o script que reproduzca el bug
4. Itera hasta tener un repro 100% confiable

### Fase 2 — Hipótesis

1. Genera hipótesis basadas en el código
2. Valida cada hipótesis con evidencia
3. Descarta hipótesis sin soporte
4. Identifica la causa raíz

### Fase 3 — Fix

1. Implementa la corrección mínima necesaria
2. Verifica que el fix resuelve el bug
3. Verifica que no introduce regresiones
4. Busca bugs diversificados (misma lógica en otros puntos)

### Fase 4 — Regresión

1. Ejecuta tests existentes
2. Agrega tests para el bug corregido
3. Verifica edge cases
4. Documenta el fix
