# Flujo de Trabajo de Desarrollo — [PROYECTO]

## Ciclo de Vida de una Tarea
1. **Planificación:** Toda tarea debe comenzar como un Issue en GitHub.
2. **Rama:** Crear una rama a partir de `develop` (o `master` para hotfixes) con el formato `tipo/ID-descripcion`.
3. **Desarrollo:** Implementar los cambios siguiendo las directrices de código y calidad.
4. **Pruebas:** Ejecutar pruebas locales antes de subir los cambios.
5. **Pull Request:** Crear un Pull Request hacia `develop` usando la plantilla correspondiente.
6. **Revisión:** Obtener aprobación de al menos un revisor y verificar que la integración continua (CI) pase.
7. **Merge:** Integrar los cambios y eliminar la rama temporal.
