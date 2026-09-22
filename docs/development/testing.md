# Estrategia de Pruebas — [PROYECTO]

## Tipos de Pruebas
- **Pruebas Unitarias:** Pruebas aisladas para lógica de negocio y funciones individuales.
- **Pruebas de Integración:** Pruebas que verifican la interacción entre componentes y bases de datos.
- **Smoke Tests:** Pruebas rápidas para verificar que los flujos críticos del sistema funcionan tras un despliegue.

## Ejecución de Pruebas
Para ejecutar la suite de pruebas localmente:
```bash
[COMANDO_TEST]
```

## Regresión
Para cada bug corregido, se debe agregar una prueba unitaria o de integración que reproduzca el escenario del fallo para evitar que vuelva a ocurrir en el futuro.
