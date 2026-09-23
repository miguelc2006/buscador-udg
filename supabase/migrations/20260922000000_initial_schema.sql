-- ==============================================================================
-- BUSCADOR UDG — ESQUEMA INICIAL DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- Versión: 1.0.0
-- Fecha: 2026-09-22
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Búsqueda difusa de profesores y materias

-- 2. Tabla de Centros Universitarios
CREATE TABLE IF NOT EXISTS public.centros_universitarios (
    codigo VARCHAR(20) PRIMARY KEY, -- Ej: 'CUCEI', 'CUCEA', 'CUSH'
    nombre VARCHAR(255) NOT NULL,
    campus VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Tabla de Profesores
CREATE TABLE IF NOT EXISTS public.profesores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_profesor VARCHAR(50),
    nombre_completo VARCHAR(255) NOT NULL,
    nombre_normalizado VARCHAR(255) NOT NULL, -- Minúsculas sin acentos para búsqueda rápida
    departamento VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Tabla de Materias
CREATE TABLE IF NOT EXISTS public.materias (
    clave VARCHAR(30) PRIMARY KEY, -- Ej: 'I5886'
    nombre VARCHAR(255) NOT NULL,
    creditos INT DEFAULT 0,
    area VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Tabla de Módulos / Edificios
CREATE TABLE IF NOT EXISTS public.modulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_codigo VARCHAR(20) REFERENCES public.centros_universitarios(codigo) ON DELETE CASCADE,
    codigo_modulo VARCHAR(50) NOT NULL, -- Ej: 'M', 'Y', 'Aulas 1'
    nombre VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(centro_codigo, codigo_modulo)
);

-- 6. Tabla de Aulas / Espacios
CREATE TABLE IF NOT EXISTS public.aulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_codigo VARCHAR(20) REFERENCES public.centros_universitarios(codigo) ON DELETE CASCADE,
    modulo_id UUID REFERENCES public.modulos(id) ON DELETE SET NULL,
    codigo_aula VARCHAR(50) NOT NULL, -- Ej: 'M101', 'LAB-1', 'AULA 3'
    tipo VARCHAR(50) DEFAULT 'AULA', -- 'AULA', 'LABORATORIO', 'AUDITORIO'
    capacidad INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(centro_codigo, codigo_aula)
);

-- 7. Tabla de Oferta Académica (Secciones / NRCs por Ciclo)
CREATE TABLE IF NOT EXISTS public.oferta_academica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ciclo VARCHAR(20) NOT NULL, -- Ej: '2026A', '2026B'
    nrc VARCHAR(20) NOT NULL,
    centro_codigo VARCHAR(20) REFERENCES public.centros_universitarios(codigo) ON DELETE CASCADE,
    materia_clave VARCHAR(30) REFERENCES public.materias(clave) ON DELETE RESTRICT,
    profesor_id UUID REFERENCES public.profesores(id) ON DELETE SET NULL,
    profesor_nombre_original VARCHAR(255),
    seccion VARCHAR(20),
    cupo_total INT DEFAULT 0,
    cupo_disponible INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(ciclo, nrc)
);

-- 8. Tabla de Sesiones y Horarios
CREATE TABLE IF NOT EXISTS public.sesiones_horario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oferta_id UUID REFERENCES public.oferta_academica(id) ON DELETE CASCADE,
    nrc VARCHAR(20) NOT NULL,
    ciclo VARCHAR(20) NOT NULL,
    dia CHAR(1) NOT NULL, -- 'L', 'M', 'I', 'J', 'V', 'S'
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    aula_id UUID REFERENCES public.aulas(id) ON DELETE SET NULL,
    modulo_texto VARCHAR(50),
    aula_texto VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- ÍNDICES DE ALTO RENDIMIENTO
-- ==============================================================================

-- Búsqueda de profesores por texto difuso (trigramas)
CREATE INDEX IF NOT EXISTS idx_profesores_nombre_trgm ON public.profesores USING gin (nombre_normalizado gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_materias_nombre_trgm ON public.materias USING gin (nombre gin_trgm_ops);

-- Búsqueda de ofertas por ciclo, profesor y materia
CREATE INDEX IF NOT EXISTS idx_oferta_ciclo_profesor ON public.oferta_academica (ciclo, profesor_id);
CREATE INDEX IF NOT EXISTS idx_oferta_ciclo_materia ON public.oferta_academica (ciclo, materia_clave);
CREATE INDEX IF NOT EXISTS idx_oferta_nrc ON public.oferta_academica (nrc);

-- Búsqueda de aulas libres (índice compuesto de tiempo y espacio)
CREATE INDEX IF NOT EXISTS idx_sesiones_busqueda_aulas ON public.sesiones_horario (ciclo, dia, hora_inicio, hora_fin, aula_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_oferta_id ON public.sesiones_horario (oferta_id);

-- ==============================================================================
-- FUNCIONES RPC / STORED PROCEDURES PARA CONSULTAS COMPLEJAS
-- ==============================================================================

-- Función para obtener aulas libres por Centro, Módulo, Día y Rango Horario
CREATE OR REPLACE FUNCTION public.get_aulas_libres(
    p_centro VARCHAR(20),
    p_ciclo VARCHAR(20),
    p_dia CHAR(1),
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_modulo_id UUID DEFAULT NULL
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
      AND (p_modulo_id IS NULL OR a.modulo_id = p_modulo_id)
      AND a.id NOT IN (
          -- Subconsulta de aulas ocupadas en ese rango y día
          SELECT DISTINCT s.aula_id
          FROM public.sesiones_horario s
          WHERE s.ciclo = p_ciclo
            AND s.dia = p_dia
            AND s.aula_id IS NOT NULL
            AND (s.hora_inicio < p_hora_fin AND s.hora_fin > p_hora_inicio)
      )
    ORDER BY m.codigo_modulo NULLS LAST, a.codigo_aula ASC;
$$;

-- ==============================================================================
-- POLÍTICAS RLS (Row Level Security)
-- ==============================================================================
ALTER TABLE public.centros_universitarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oferta_academica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones_horario ENABLE ROW LEVEL SECURITY;

-- Acceso público de sólo lectura a los datos académicos
CREATE POLICY "Lectura pública de centros" ON public.centros_universitarios FOR SELECT USING (true);
CREATE POLICY "Lectura pública de profesores" ON public.profesores FOR SELECT USING (true);
CREATE POLICY "Lectura pública de materias" ON public.materias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de modulos" ON public.modulos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de aulas" ON public.aulas FOR SELECT USING (true);
CREATE POLICY "Lectura pública de oferta" ON public.oferta_academica FOR SELECT USING (true);
CREATE POLICY "Lectura pública de sesiones" ON public.sesiones_horario FOR SELECT USING (true);
