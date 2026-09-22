# Política de Seguridad — [PROYECTO]

## Principios de Seguridad
El proyecto sigue las directrices de seguridad basadas en OWASP SAMM:

1. **Gestión de Secretos:** Nunca almacenar credenciales, tokens o claves privadas en el repositorio. Usar variables de entorno.
2. **Validación de Entradas:** Validar y sanitizar todas las entradas del usuario para prevenir inyecciones (SQL, XSS, etc.).
3. **Control de Accesos:** Validar permisos y autenticación en cada solicitud o endpoint.
4. **Registro de Eventos:** Mantener logs de auditoría sin exponer información sensible (PII, contraseñas).
5. **Revisión de Vulnerabilidades:** Escanear dependencias periódicamente en busca de CVEs conocidos.
