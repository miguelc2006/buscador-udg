# Visión del Producto — Buscador UDG

## Problema
Los estudiantes, profesores y personal administrativo de la Universidad de Guadalajara (UDG) frecuentemente enfrentan dificultades para:
1. Localizar en qué aula o edificio está impartiendo clase un profesor en un momento determinado.
2. Encontrar aulas o espacios de estudio libres para trabajo en equipo, clases de reposición o estudio individual.
3. Ubicar dónde se concentran grupos o generaciones completas de una carrera según las materias de su semestre.

## Usuarios
- **Estudiantes de la UDG:** Para encontrar espacios libres para estudiar y localizar a profesores para dudas o firmas.
- **Profesores y Coordinadores:** Para gestionar espacios, localizar colegas o ubicar a grupos de estudiantes.
- **Comunidad Universitaria:** Para consultar de forma instantánea y visual la oferta de horarios y aulas.

## Propuesta de Valor
Una aplicación web ultraligera, moderna y sin costo de mantenimiento que transforma las tablas estáticas del SIIAU en una herramienta de consulta en tiempo real interactiva, con búsqueda difusa, mapas de ocupación de aulas y filtrado instantáneo.

## Alcance Inicial (v0.1.0 - MVP)
- **Buscador de Profesores:** Búsqueda por nombre o departamento; muestra materias, NRCs, horarios y aulas actuales.
- **Buscador de Aulas Libres:** Filtro por centro universitario, módulo/edificio, día de la semana y rango horario (o botón "Libres ahora").
- **Pipeline de Ingesta Serverless:** Función de scraping que extrae y sincroniza la oferta académica hacia Supabase.
- **Buscador de Grupos por NRC/Materia:** Localización geográfica del aula según el horario.

## Fuera de Alcance Inicial
- Autenticación o inicio de sesión de usuarios (el sistema es 100% público y de consulta abierta).
- Edición o alteración de datos académicos (los datos provienen exclusivamente del SIIAU/UDG).
- Notificaciones push o mensajería interna.

## Restricciones
- Alojamiento en capa gratuita (Supabase Free Tier, Vercel/Cloudflare Pages).
- Respeto a los límites de tiempo de ejecución de serverless functions.
- Tratamiento de datos públicos sin almacenar PII sensible no oficial.
