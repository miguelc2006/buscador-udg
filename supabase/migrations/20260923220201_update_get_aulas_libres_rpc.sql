-- Update get_aulas_libres to accept p_codigo_modulo instead of p_modulo_id

DROP FUNCTION IF EXISTS public.get_aulas_libres(VARCHAR, VARCHAR, CHAR, TIME, TIME, UUID);

CREATE OR REPLACE FUNCTION public.get_aulas_libres(
    p_centro VARCHAR(20),
    p_ciclo VARCHAR(20),
    p_dia CHAR(1),
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_codigo_modulo VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
    aula_id UUID,
    codigo_aula VARCHAR(50),
    modulo_id UUID,
    codigo_modulo VARCHAR(50),
    tipo VARCHAR(50),
    capacidad INT
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        a.id AS aula_id,
        a.codigo_aula,
        a.modulo_id,
        m.codigo_modulo,
        a.tipo,
        a.capacidad
    FROM public.aulas a
    LEFT JOIN public.modulos m ON a.modulo_id = m.id
    WHERE a.centro_codigo = p_centro
      AND (p_codigo_modulo IS NULL OR m.codigo_modulo = p_codigo_modulo)
      AND a.id NOT IN (
          -- Subconsulta de aulas ocupadas en ese rango y día
          SELECT DISTINCT s.aula_id
          FROM public.sesiones_horario s
          JOIN public.oferta_academica o ON s.oferta_id = o.id
          WHERE o.centro_codigo = p_centro
            AND o.ciclo = p_ciclo
            AND s.dia = p_dia
            AND s.aula_id IS NOT NULL
            -- Lógica de superposición de intervalos de tiempo
            AND (
                (p_hora_inicio >= s.hora_inicio AND p_hora_inicio < s.hora_fin) OR
                (p_hora_fin > s.hora_inicio AND p_hora_fin <= s.hora_fin) OR
                (p_hora_inicio <= s.hora_inicio AND p_hora_fin >= s.hora_fin)
            )
      )
    ORDER BY m.codigo_modulo, a.codigo_aula;
$$;
