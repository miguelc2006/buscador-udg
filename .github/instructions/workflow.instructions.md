---
applyTo: "**"
---

# Flujo obligatorio de trabajo — [PROYECTO]

Toda tarea debe seguir este orden:

1. Identificar la tarea en `.project-memory/CURRENT_TASK.md`
2. Recuperar contexto Git y memoria del proyecto
3. Confirmar objetivo, alcance y criterio de finalización (Definition of Ready)
4. Registrar o actualizar `CURRENT_TASK.md`
5. Seleccionar agente
6. Determinar la rama Git adecuada
7. Implementar por etapas pequeñas
8. Compilar y ejecutar pruebas relacionadas
9. **Pre-revisión** — Antes de cualquier commit, presentar al usuario un resumen estructurado
10. **Aprobación del usuario** — No ejecutar `git commit` sin confirmación explícita
11. Revisar cambios reales con `git diff`
12. Actualizar memoria y estado del proyecto
13. Crear commit lógico en español (siguiendo Conventional Commits)
14. Validar contra la Definition of Done antes de dar por finalizada la tarea

## Trazabilidad y Control de Cambios

Cada cambio importante debe poder relacionarse con el flujo:
`Necesidad o problema → Issue → Planificación → Rama → Commits → Pull Request → Pruebas → Versión → Lanzamiento`

No se deben realizar modificaciones importantes sin registrar:
- Qué problema se intenta resolver.
- Qué parte del sistema será afectada.
- Qué riesgos existen.
- Cómo se comprobará el resultado.
- En qué versión se incluirá.

## Definition of Ready (DoR)

Una tarea puede iniciar únicamente cuando cumple con:
- [ ] El problema o necesidad está claramente descrito.
- [ ] Existe un objetivo definido.
- [ ] Tiene criterios de aceptación claros.
- [ ] Se identificaron las áreas afectadas del sistema.
- [ ] Tiene prioridad asignada.
- [ ] Tiene una estimación de tamaño aproximado.
- [ ] Se conocen las dependencias principales.
- [ ] Existe una versión objetivo o autorización de investigación.

## Definition of Done (DoD)

Una tarea se considera terminada únicamente cuando cumple con:
- [ ] El código fue implementado por completo.
- [ ] El proyecto compila sin errores (`[COMANDO_BUILD]`).
- [ ] Las pruebas aplicables fueron ejecutadas y pasaron (`[COMANDO_TEST]`).
- [ ] Los resultados de las pruebas fueron registrados.
- [ ] Se revisaron efectos secundarios y posibles regresiones.
- [ ] Se actualizó la documentación correspondiente en `docs/`.
- [ ] Se actualizó el archivo `CHANGELOG.md`.
- [ ] El Pull Request está relacionado con un Issue.
- [ ] No existen secretos ni credenciales en el código.
- [ ] Se comprobaron permisos y seguridad.
- [ ] Se verificó la compatibilidad con datos anteriores.
- [ ] El cambio está asignado a una versión específica.

## Pre-revisión obligatoria

**Ningún commit se ejecuta sin aprobación explícita del usuario.** Después de implementar y compilar exitosamente, la IA debe presentar:

### Resumen de cambios (formato obligatorio)

```
## Resumen de cambios para [T-##]

### Archivos modificados
- `path/al/archivo.ext` — [qué cambió y por qué]

### Solución implementada
[Descripción de 2-5 líneas del approach]

### Verificación realizada
- [ ] Compilación: `[COMANDO_BUILD]` → ✅/❌
- [ ] Tests: `[COMANDO_TEST]` → ✅/❌ (N/N pasaron)
- [ ] Llamadores verificados: [lista de archivos que usan el código modificado]
- [ ] Regresiones revisadas: [qué flujos relacionados podrían afectarse]

### Riesgos conocidos
- [Riesgo 1 si aplica]

### ¿Procedo con commit?
[Aguardar confirmación del usuario antes de ejecutar git commit]
```

### Reglas de pre-revisión

- **Ejecutar tests** antes del resumen, no después
- **Trazer llamadores** para identificar todos los puntos que usan el código modificado
- **Verificar regresiones** — Identificar qué otros flujos podrían afectarse
- **No asumir completitud** — Si la solución solo arregla un aspecto, indicarlo explícitamente
- **Presentar el diff** si es una corrección de bug

## Reglas

- Mantener una sola meta principal por ciclo
- No implementar una tarea sin ID o vínculo explícito
- No ampliar el alcance sin registrarlo
- No declarar una tarea completada sin evidencia
- La conversación no es fuente de verdad; usar Git, archivos de memoria y resultados de comandos
- **No ejecutar `git commit` sin aprobación explícita del usuario**
- **No declarar "solución completa" sin verificar llamadores y ejecutar tests**
