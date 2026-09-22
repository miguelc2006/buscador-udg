# [PROYECTO] — Plantilla de Proyecto con IA

[Descripción breve del proyecto]

## ⚠️ Inicialización de un nuevo proyecto (Eliminar esta sección tras completar)

1. Crear el repositorio desde esta plantilla.
2. Reemplazar todos los marcadores `[PLACEHOLDER]` (como `[PROYECTO]`, `[STACK]`, etc.).
3. Revisar y configurar el archivo `.gitignore`.
4. Configurar la versión del lenguaje en `docs/architecture/overview.md` y `docs/development/setup.md`.
5. Copiar `.env.example` a `.env` y configurar las variables de entorno.
6. Revisar y configurar GitHub Actions en `.github/workflows/`.
7. Crear el primer Milestone en GitHub.
8. Crear el GitHub Project correspondiente.
9. Eliminar esta sección del `README.md`.

## Inicio Rápido

1. Clonar este repositorio
2. Abrir en VS Code con GitHub Copilot
3. Seguir las instrucciones en `BOOTSTRAP.md`

## Estructura

```
├── .agents/skills/          # Skills predefinidas (8)
├── .github/
│   ├── agents/              # Definiciones de agentes
│   ├── instructions/        # Reglas del proyecto
│   └── prompts/             # Prompts predefinidos
├── .project-memory/         # Memoria del proyecto
├── .memory/                 # Memoria del agente
├── docs/                    # Documentación del proyecto (ADRs, arquitectura, calidad, seguridad)
├── AUTO_SETUP.md            # Protocolo de auto-montaje
├── BOOTSTRAP.md             # Guía de inicio rápido
├── CREATE_CUSTOM_SKILLS.md  # Guía para skills personalizadas
├── AGENTS.md                # Instrucciones para agentes
└── skills-lock.json         # Registro de skills
```

## Personalización

### Opción A: Auto-configuración
Abrir `AUTO_SETUP.md` y seguir el protocolo de auto-montaje.

### Opción B: Manual
1. Editar `copilot-instructions.md` con tu stack
2. Modificar placeholders `[PROYECTO]`, `[STACK]`, `[COMANDO_BUILD]`
3. Crear skills personalizadas con `CREATE_CUSTOM_SKILLS.md`

## Skills Incluidas

| Skill | Propósito |
|-------|-----------|
| caveman | Comunicación comprimida (~75% menos tokens) |
| create-skill | Guía para crear nuevas skills |
| diagnose | Diagnóstico disciplinado de bugs |
| git-commit | Commits convencionales en español |
| git-context-reader | Recuperar contexto del proyecto |
| git-flow-branch-creator | Crear ramas Git Flow |
| grill-me | Entrevista de diseño exhaustiva |
| workflow-orchestration-patterns | Patrones de orquestación |

## Documentación

- `BOOTSTRAP.md` — Inicio rápido y referencias
- `AUTO_SETUP.md` — Protocolo de auto-montaje
- `CREATE_CUSTOM_SKILLS.md` — Guía de skills personalizadas
- `AGENTS.md` — Instrucciones para agentes
- `.github/copilot-instructions.md` — Instrucciones de Copilot
- `docs/` — Documentación detallada del ciclo de vida del software (ISO 12207, ISO 25010, OWASP SAMM)
