import { supabase } from '../lib/supabase';
import { normalizeText } from '../lib/string-utils';
import { syncSiiau } from './sync';
import {
  DiaSiiau,
  SesionConDetalles,
} from '../lib/schedule-utils';

export interface AulaInfo {
  id: string;
  codigo_aula: string;
  modulo_id?: string;
  codigo_modulo: string;
  centro_codigo: string;
  tipo: string;
  capacidad: number;
  sesiones: SesionConDetalles[];
}

export interface AulaLibreResultado {
  id: string;
  codigo_aula: string;
  modulo_id?: string;
  codigo_modulo: string;
  centro_codigo: string;
  tipo: string;
  capacidad: number;
  disponible: boolean;
  proximaOcupacion?: {
    hora_inicio: string;
    hora_fin: string;
    materia_nombre?: string;
    profesor_nombre?: string;
    minutosPara?: number;
  };
  sesionesTotales?: SesionConDetalles[];
}

export interface FiltrosAulasLibres {
  centro: string;
  ciclo: string;
  dia: DiaSiiau;
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
  moduloId?: string; // Filtrar por código o ID de módulo
  tipo?: string; // 'Todos' | 'Aula' | 'Laboratorio' | 'Taller'
  query?: string; // Búsqueda de texto (ej. "M201", "Lab Computo")
}

// Datos de demostración eliminados. Se requiere conexión a Supabase.

/**
 * Obtiene la lista única de módulos disponibles para un centro universitario
 */
export async function getModulos(centro: string = 'CUCEI'): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('modulos')
      .select('codigo_modulo')
      .eq('centro_codigo', centro)
      .order('codigo_modulo');

    if (!error && data && data.length > 0) {
      return Array.from(new Set(data.map((m) => m.codigo_modulo)));
    }
  } catch (err) {
    console.error('Fallo en consulta Supabase:', err);
  }

  return [];
}

/**
 * Busca aulas libres según los criterios de día, rango horario y filtros
 */
export async function searchFreeRooms(
  filtros: FiltrosAulasLibres
): Promise<AulaLibreResultado[]> {
  const { centro, ciclo, dia, horaInicio, horaFin, moduloId, tipo, query } = filtros;

  try {
    // Verificar si hay datos en la base de datos para este centro y ciclo
    const { count } = await supabase
      .from('oferta_academica')
      .select('*', { count: 'exact', head: true })
      .eq('centro_codigo', centro)
      .eq('ciclo', ciclo);

    if (count === 0) {
      await syncSiiau(centro, ciclo, 'TODAS');
    }

    // 1. Intentar llamar al procedimiento almacenado RPC de Supabase
    const { data: rpcAulas, error: rpcError } = await supabase.rpc('get_aulas_libres', {
      p_centro: centro,
      p_ciclo: ciclo,
      p_dia: dia,
      p_hora_inicio: `${horaInicio}:00`,
      p_hora_fin: `${horaFin}:00`,
      p_codigo_modulo: moduloId && moduloId !== 'ALL' ? moduloId : null,
    });

    if (!rpcError && rpcAulas && rpcAulas.length > 0) {
      // Mapear resultados del RPC
      let resultados: AulaLibreResultado[] = rpcAulas.map((a: any) => ({
        id: a.aula_id,
        codigo_aula: a.codigo_aula,
        modulo_id: a.modulo_id,
        codigo_modulo: a.codigo_modulo || 'SIN MÓDULO',
        centro_codigo: centro,
        tipo: a.tipo || 'Aula',
        capacidad: a.capacidad || 40,
        disponible: true,
      }));

      // Aplicar filtros adicionales en cliente si es necesario
      if (tipo && tipo !== 'Todos') {
        resultados = resultados.filter(
          (r) => r.tipo.toLowerCase() === tipo.toLowerCase()
        );
      }

      if (query && query.trim().length > 0) {
        const qNorm = normalizeText(query);
        resultados = resultados.filter(
          (r) =>
            normalizeText(r.codigo_aula).includes(qNorm) ||
            normalizeText(r.codigo_modulo).includes(qNorm)
        );
      }

      return resultados;
    }
  } catch (err) {
    console.error('Fallo consulta RPC de Supabase:', err);
  }

  return [];
}

/**
 * Obtiene el horario completo semanal de un aula
 */
export async function getRoomSchedule(
  aulaId: string
): Promise<{ aula: AulaInfo | null; sesiones: SesionConDetalles[] }> {
  try {
    const { data: aulaDb, error } = await supabase
      .from('aulas')
      .select('*, modulos(codigo_modulo)')
      .eq('id', aulaId)
      .single();

    if (!error && aulaDb) {
      const { data: sesionesDb } = await supabase
        .from('sesiones_horario')
        .select(`
          id, dia, hora_inicio, hora_fin,
          oferta_academica (
            nrc, seccion,
            materias (clave, nombre),
            profesores (nombre_completo)
          )
        `)
        .eq('aula_id', aulaId);

      const sesionesFormateadas: SesionConDetalles[] = (sesionesDb || []).map((s: any) => ({
        id: s.id,
        dia: s.dia,
        hora_inicio: s.hora_inicio,
        hora_fin: s.hora_fin,
        materia_clave: s.oferta_academica?.materias?.clave,
        materia_nombre: s.oferta_academica?.materias?.nombre,
        seccion: s.oferta_academica?.seccion,
        profesor_nombre: s.oferta_academica?.profesores?.nombre_completo,
      }));

      return {
        aula: {
          id: aulaDb.id,
          codigo_aula: aulaDb.codigo_aula,
          codigo_modulo: aulaDb.modulos?.codigo_modulo || 'SIN MÓDULO',
          centro_codigo: aulaDb.centro_codigo,
          tipo: aulaDb.tipo,
          capacidad: aulaDb.capacidad,
          sesiones: sesionesFormateadas,
        },
        sesiones: sesionesFormateadas,
      };
    }
  } catch (err) {
    console.error('Fallo en consulta Supabase:', err);
  }

  return {
    aula: null,
    sesiones: [],
  };
}
