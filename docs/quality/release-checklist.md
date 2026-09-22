# Checklist de Lanzamiento — [PROYECTO]

## Identificación
- [ ] Número de versión definido (SemVer)
- [ ] Milestone revisado y cerrado en GitHub
- [ ] Todos los Issues incluidos confirmados y validados
- [ ] Archivo `CHANGELOG.md` actualizado

## Calidad
- [ ] Compilación exitosa (`[COMANDO_BUILD]`)
- [ ] Pruebas unitarias aprobadas (`[COMANDO_TEST]`)
- [ ] Pruebas de integración aprobadas
- [ ] Smoke tests aprobados en entorno de staging
- [ ] Pruebas de regresión completadas
- [ ] Todos los bugs críticos cerrados

## Datos
- [ ] Migraciones de base de datos probadas
- [ ] Compatibilidad con datos anteriores verificada
- [ ] Respaldo de base de datos probado
- [ ] Restauración de base de datos probada

## Seguridad
- [ ] Dependencias revisadas y sin vulnerabilidades críticas
- [ ] Alertas de seguridad (Dependabot/GitHub) atendidas
- [ ] Secretos y credenciales revisados (ninguno en el repositorio)
- [ ] Permisos y accesos comprobados
- [ ] Logs de auditoría revisados

## Distribución
- [ ] Artefacto de producción generado
- [ ] Hash de verificación generado
- [ ] Instalación limpia probada
- [ ] Proceso de actualización probado
- [ ] Release publicada en GitHub con tag correspondiente
- [ ] Notas de lanzamiento publicadas para los usuarios
