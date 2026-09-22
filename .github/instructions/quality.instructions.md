---
applyTo: "**"
---

# Criterios de Calidad y Estándares — [PROYECTO]

## Propósito

Establecer estándares de calidad que todo código debe cumplir antes de ser integrado, basados en estándares internacionales de ingeniería de software.

## Estándares de Referencia

El proyecto se alinea con los siguientes estándares:
- **ISO/IEC 25010:** Para la calidad del producto de software (adecuación funcional, fiabilidad, seguridad, mantenibilidad, compatibilidad, eficiencia).
- **ISO/IEC/IEEE 90003:** Como guía de calidad aplicada al software (procesos repetibles, control de cambios, registro de pruebas).

## Compilación y Construcción

- Todo código debe compilar sin errores (`[COMANDO_BUILD]`).
- Los warnings nuevos deben justificarse o resolverse.
- Las dependencias deben estar actualizadas y sin CVEs conocidos.

## Pruebas y Verificación

- Todo cambio debe incluir pruebas unitarias o de integración cuando sea aplicable.
- Las pruebas deben ser determinísticas (sin dependencia de tiempo, red o estado externo).
- Cobertura mínima obligatoria: [PORCENTAJE_OBLIGATORIO].
- **Pruebas de regresión:** Para cada bug corregido se debe agregar una prueba que impida su reaparición.

## Código Limpio y Mantenibilidad

### Principios SOLID
- **S** — Responsabilidad única (Single Responsibility).
- **O** — Abierto/cerrado (Open/Closed).
- **L** — Sustitución de Liskov (Liskov Substitution).
- **I** — Segregación de interfaces (Interface Segregation).
- **D** — Inversión de dependencias (Dependency Inversion).

### Convenciones
- Nombres descriptivos y autoexplicativos (sin abreviaturas ambiguas).
- Funciones/métodos cortos (< 30 líneas preferiblemente).
- Comentarios solo cuando la intención del código no sea obvia.
- Sin código muerto, comentarios obsoletos ni variables no usadas.

### Manejo de errores
- Capturar excepciones específicas, nunca genéricas.
- Registrar logs con contexto suficiente para diagnosticar problemas.
- No silenciar errores (evitar bloques catch vacíos).
- Validar entradas en los límites del sistema.

## Política de Actualización de Dependencias

Toda actualización importante de dependencias debe:
1. Registrarse como un Issue.
2. Identificar la versión actual y la versión objetivo.
3. Revisar notas oficiales y cambios incompatibles.
4. Crear una rama independiente.
5. Compilar desde cero y ejecutar pruebas automáticas y manuales.
6. Probar la instalación y actualización.
7. Documentar incompatibilidades.
8. Integrarse únicamente tras aprobación.

## Documentación

- Funciones públicas con docstring/Javadoc/TSDoc.
- Archivo `README.md` actualizado con cambios relevantes.
- Decisiones arquitectónicas registradas en `docs/adr/` usando la plantilla correspondiente.
- Archivo `CHANGELOG.md` actualizado siguiendo el formato de Keep a Changelog.
- Checklist de lanzamiento completado en `docs/quality/release-checklist.md` antes de cada tag.
