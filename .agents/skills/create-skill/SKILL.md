---
name: create-skill
description: Guide for creating effective skills following best practices. Use when creating or updating skills that extend agent capabilities.
---

# Create Skill

Guide for creating effective skills that extend agent capabilities with specialized knowledge, workflows, and tool integrations.

## About Skills

Skills are modular, self-contained packages that extend agent capabilities by providing specialized knowledge, workflows, and tools.

### What Skills Provide

1. Specialized workflows — Multi-step procedures for specific domains
2. Tool integrations — Instructions for working with specific file formats or APIs
3. Domain expertise — Project-specific knowledge and business logic
4. Bundled resources — Scripts, references, and assets for complex tasks

## Progressive Disclosure Principle

**The 200-line rule is critical.** SKILL.md must be under 200 lines. If you need more, split content into `references/` files.

### Three-Level Loading System

1. **Metadata (name + description)** — Always in context (~100 words)
2. **SKILL.md body** — When skill triggers (<200 lines)
3. **Bundled resources** — As needed by agent (unlimited)

## Skill Structure

```
skill-name/
├── SKILL.md (required, <200 lines)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          — Executable code
    ├── references/       — Documentation loaded as needed
    └── assets/           — Files used in output
```

## Creating a Skill

### Step 1 — Identify the Trigger

When should this skill activate? Define:
- User phrases that should trigger it
- File patterns that should activate it
- Task types that need this skill

### Step 2 — Write the Description

The description is CRITICAL — it determines when the skill activates. Be specific about:
- What the skill does
- When to use it
- When NOT to use it

### Step 3 — Write SKILL.md

Follow this template:

```markdown
---
name: skill-name
description: >
  Clear description of what this skill does and when to use it.
---

# Skill Title

## When to Use
- Trigger condition 1
- Trigger condition 2

## Workflow
1. Step 1
2. Step 2
3. Step 3

## Rules
- Rule 1
- Rule 2

## Output Format
[Expected output structure]
```

### Step 4 — Test the Skill

1. Save the SKILL.md file
2. Start a new conversation
3. Use the trigger phrases
4. Verify the skill activates and produces correct output

## Best Practices

1. **Keep it focused** — One skill, one purpose
2. **Be specific** — Vague descriptions = poor activation
3. **Include examples** — Show, don't just tell
4. **Define boundaries** — What the skill does AND doesn't do
5. **Progressive disclosure** — Load only what's needed
