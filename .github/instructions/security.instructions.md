---
applyTo: "**"
---

# Reglas de Seguridad y OWASP SAMM — [PROYECTO]

## Propósito

Garantizar que el código y la configuración del proyecto cumplan con estándares de seguridad básicos y se alineen con el modelo de madurez OWASP SAMM.

## Principio de Exclusión de Secretos

**Nunca** deben incorporarse al repositorio (ni en commits, ni en ramas, ni en Pull Requests):
- Contraseñas o frases de paso.
- Tokens de API o claves de acceso.
- Claves privadas o certificados privados.
- Credenciales de servicios o bases de datos.
- Bases de datos reales o copias de seguridad de producción.
- Datos personales (PII), clínicos o financieros reales.
- Archivos `.env` reales (usar siempre `.env.example` como plantilla).
- Configuraciones sensibles de infraestructura.

## Controles Iniciales OWASP SAMM

El proyecto implementa los siguientes controles de seguridad:
1. **Inventario de dependencias:** Mantener un registro claro de todas las librerías utilizadas.
2. **Revisión de vulnerabilidades:** Escaneo periódico de dependencias en busca de CVEs conocidos.
3. **Gestión de secretos:** Uso exclusivo de variables de entorno para configuraciones sensibles.
4. **Validación de entradas:** Sanitización y validación estricta de todos los datos de entrada del usuario.
5. **Revisión de permisos:** Control de accesos basado en el principio de mínimo privilegio.
6. **Registro de eventos:** Logging seguro sin exposición de datos sensibles.
7. **Pruebas de seguridad:** Casos de prueba específicos para validar límites y controles de seguridad.

## Reglas Obligatorias

### 1. Credenciales y secretos
- Usar variables de entorno o archivos `.env` (excluidos de git).
- Asegurar que los archivos sensibles estén en `.gitignore`.

### 2. Autenticación y autorización
- Validar credenciales y permisos en cada endpoint/solicitud.
- Implementar rate limiting donde sea apropiado.
- Usar tokens con expiración corta.
- No almacenar contraseñas en texto plano (usar algoritmos de hashing seguros como bcrypt o argon2).

### 3. Validación de entradas
- Validar todos los datos de entrada del usuario (tipos, longitudes, formatos).
- Sanitizar contra inyección (SQL, XSS, etc.).
- Usar siempre consultas parametrizadas o un ORM seguro.
- Limitar el tamaño máximo de las solicitudes y archivos subidos.

### 4. Datos sensibles
- Identificar qué datos son sensibles (PII, financieros, etc.).
- Cifrar datos sensibles en reposo y en tránsito (HTTPS/TLS).
- Implementar logging sin exponer datos sensibles.

### 5. Dependencias
- Revisar dependencias vulnerables periódicamente.
- Actualizar dependencias con CVEs conocidos de forma prioritaria.

### 6. Git
- No commitear archivos sensibles.
- Configurar `.gitignore` apropiadamente.
- Revisar minuciosamente el `git diff` antes de cada commit.

## Checklist de seguridad pre-commit

- [ ] Sin credenciales ni secretos en el diff.
- [ ] Sin datos sensibles en logs.
- [ ] Entradas validadas y sanitizadas.
- [ ] Consultas parametrizadas utilizadas.
- [ ] Dependencias sin CVEs críticos.
- [ ] Archivo `.gitignore` actualizado.
