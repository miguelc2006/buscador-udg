# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Añadido
- **T-11**: Rediseño institucional basado en el manual de identidad UDG 2025.
- **T-11**: Formularios dinámicos para selección de Centro, Carrera y Ciclo con autocompletado.
- **T-11**: Sincronización automática con SIIAU cuando la base de datos local no tiene registros para el centro y ciclo seleccionados.
- **T-08**: Conexión con scraping real de oferta académica (SIIAU) mediante Supabase Edge Functions.
- **T-06**: Localizador de grupos y seguimiento de generaciones.
- **T-05**: Buscador de aulas libres por módulo, día y rango horario.
- **T-04**: Buscador de profesores con filtros y estado en tiempo real.
- **T-03**: Pipeline de ingesta y scraping en Supabase Edge Functions.
- **T-02**: Scaffolding del proyecto frontend (React + Vite + Tailwind CSS).
- **T-01**: Planificación y diseño arquitectónico.

### Cambiado
- **T-11**: Se eliminaron todos los datos de prueba (mocks) de los servicios y tests, conectando las vistas exclusivamente a la base de datos real.
- **T-11**: El flujo de actualización de datos en las vistas ahora depende explícitamente del botón "Consultar", mejorando el rendimiento y la experiencia de usuario.
- **T-11**: La Edge Function `siiau-catalogs` ahora lee correctamente el cuerpo de las peticiones POST para extraer las carreras.

### Eliminado
- Datos de prueba (mocks) en `professors.ts`, `groups.ts` y `rooms.ts`.
