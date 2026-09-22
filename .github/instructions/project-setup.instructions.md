---
applyTo: "**"
---

# Configuración del proyecto — [PROYECTO]

## Propósito

Establecer la configuración base del proyecto, incluyendo stack tecnológico, estructura de directorios, dependencias y herramientas.

## Configuración del stack

### Lenguaje y runtime
- **Lenguaje:** [LENGUAJE]
- **Runtime:** [RUNTIME]
- **Versión:** [VERSIÓN]

### Framework principal
- **Framework:** [FRAMEWORK]
- **Versión:** [VERSIÓN]
- **Dependencias core:** [DEPENDENCIAS]

### Base de datos
- **Motor:** [MOTOR_DB]
- **Driver:** [DRIVER_DB]
- **Configuración:** [CONFIG_DB]

### Herramientas de build
- **Build tool:** [BUILD_TOOL]
- **Comando build:** `[COMANDO_BUILD]`
- **Comando test:** `[COMANDO_TEST]`
- **Comando lint:** `[COMANDO_LINT]`

## Estructura de directorios

```
[ESTRUCTURA_BASE]
├── src/
│   ├── [FUENTES]
│   └── [TESTS]
├── .agents/skills/        # Skills del agente
├── .github/               # Instrucciones y configuración
├── .project-memory/       # Memoria persistente del proyecto
└── [ARCHIVOS_CONFIG]
```

## Inicialización

1. Ejecuta `git init` en la raíz del proyecto
2. Crea el `.gitignore` apropiado para el stack
3. Instala las dependencias iniciales
4. Verifica que el build funcione
5. Crea el primer commit con la estructura base

## Configuración del agente

- Skills por defecto en `.agents/skills/`
- Instrucciones en `.github/instructions/`
- Prompts en `.github/prompts/`
- Agentes en `.github/agents/`
- Memoria en `.project-memory/`
