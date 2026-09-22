# Modelo de Amenazas — [PROYECTO]

## Activos a Proteger
- Datos de usuario (PII)
- Credenciales de acceso
- Base de datos del sistema

## Amenazas Identificadas
1. **Inyección de Código / SQL:** Entrada maliciosa que altera consultas a la base de datos.
   - *Mitigación:* Uso de consultas parametrizadas y validación estricta de tipos.
2. **Exposición de Datos Sensibles:** Fuga de información en logs o respuestas de error.
   - *Mitigación:* Sanitización de logs y manejo genérico de errores hacia el cliente.
3. **Fuerza Bruta / Acceso no Autorizado:** Intentos repetidos de inicio de sesión.
   - *Mitigación:* Implementación de rate limiting y políticas de contraseñas fuertes.
