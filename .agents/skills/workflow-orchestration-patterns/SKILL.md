---
name: workflow-orchestration-patterns
description: Design durable workflows with Temporal for distributed systems. Covers workflow vs activity separation, saga patterns, state management, and determinism constraints. Use when building long-running processes, distributed transactions, or microservice orchestration.
---

# Workflow Orchestration Patterns

Master workflow orchestration architecture with Temporal, covering fundamental design decisions, resilience patterns, and best practices.

## When to Use Workflow Orchestration

### Ideal Use Cases

- **Multi-step processes** spanning machines/services/databases
- **Distributed transactions** requiring all-or-nothing semantics
- **Long-running workflows** (hours to years) with automatic state persistence
- **Failure recovery** that must resume from last successful step
- **Business processes**: bookings, orders, campaigns, approvals
- **Entity lifecycle management**: inventory tracking, account management
- **Infrastructure automation**: CI/CD pipelines, provisioning, deployments
- **Human-in-the-loop** systems requiring timeouts and escalations

### When NOT to Use

- Simple CRUD operations (use direct API calls)
- Pure data processing pipelines (use Airflow, batch processing)
- Stateless request/response (use standard APIs)
- Real-time streaming (use Kafka, event processors)

## Core Concepts

### Workflow vs Activity

| Concept | Purpose | Characteristics |
|---------|---------|-----------------|
| **Workflow** | Orchestration logic | Deterministic, replays, no side effects |
| **Activity** | Side effects | Non-deterministic, retries, timeouts |

### Key Principles

1. **Workflows orchestrate, activities execute**
2. **Workflows must be deterministic** — no random, no time, no I/O
3. **Activities are idempotent** — safe to retry
4. **State is managed by Temporal** — no local state in workflows

## Patterns

### Saga Pattern
For distributed transactions that need compensation on failure.

### Retry Policy
Configure retry behavior for activities with different failure modes.

### Timeout Strategy
Set appropriate timeouts for workflows and activities.

### Signal and Query
Communicate with running workflows via signals (commands) and queries (reads).

## Best Practices

1. **Keep workflows focused** — Single responsibility per workflow
2. **Small workflows** — Use child workflows for scalability
3. **Clear boundaries** — Workflow orchestrates, activities execute
4. **Test locally** — Use time-skipping test environment
5. **Idempotent activities** — Safe to retry
6. **Set timeouts always** — Prevent infinite hangs
7. **Heartbeat long tasks** — Report progress
