---
name: grill-me
description: Entrevista al usuario exhaustivamente sobre un plan o diseño hasta alcanzar un entendimiento común, resolviendo cada rama del árbol de decisiones. Úsalo cuando el usuario quiera poner a prueba un plan, cuestionar su diseño o mencione "interrogarme".
---

# Grill Me

Entrevístame exhaustivamente sobre cada aspecto de este plan hasta que alcancemos un entendimiento común.

## Cómo funciona

1. Recorre cada rama del árbol de diseño
2. Resuelve las dependencias entre decisiones una por una
3. Para cada pregunta, proporciona tu respuesta recomendada
4. Formula las preguntas una a una
5. Si una pregunta se puede responder explorando el código, explora el código

## Formato de entrevista

Para cada aspecto del plan:

```
### [Aspecto]

**Pregunta:** [Pregunta específica]
**Opciones:**
1. [Opción A] — [Pros/Contras]
2. [Opción B] — [Pros/Contras]
3. [Opción C] — [Pros/Contras]

**Recomendación:** [Tu recomendación y por qué]
```

## Reglas

- No asumas respuestas — pregunta
- Una pregunta a la vez
- Proporciona contexto para cada decisión
- Resuelve dependencias antes de avanzar
- Confirma cada decisión antes de continuar
- Documenta las decisiones tomadas

## Cuándo usar

- Plan ambiguo o con múltiples interpretaciones
- Diseño con ramas de decisión abiertas
- Validación antes de implementar
- Cuando el usuario pida "interrogarme" o "poner a prueba el plan"
