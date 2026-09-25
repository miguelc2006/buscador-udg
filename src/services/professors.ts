import { supabase } from '../lib/supabase';
import { normalizeText } from '../lib/string-utils';
import { syncSiiau } from './sync';
import {
  calcularEstadoProfesor,
  EstadoProfesor,
  SesionConDetalles,
} from '../lib/schedule-utils';

export interface OfertaDetalleProfesor {
  nrc: string;
  seccion: string;
  materia_clave: string;
  materia_nombre: string;
  creditos?: number;
  cupo_total?: number;
  cupo_disponible?: number;
  sesiones: Array<{
    id: string;
    dia: 'L' | 'M' | 'I' | 'J' | 'V' | 'S';
    hora_inicio: string;
    hora_fin: string;
    modulo_texto?: string;
    aula_texto?: string;
  }>;
}

export interface ProfesorConCarga {
  id: string;
  nombre_completo: string;
  nombre_normalizado: string;
  departamento?: string;
  ofertas: OfertaDetalleProfesor[];
  sesionesTotales: SesionConDetalles[];
  estadoActual: EstadoProfesor;
}

// Datos de demostración eliminados. Se requiere conexión a Supabase.

/**
 * Consulta de profesores con su carga horaria y estado en vivo
 */
export async function searchProfessors(
  centroCodigo: string,
  ciclo: string,
  query: string = '',
  referenciaFecha: Date = new Date(),
  _carrera: string = 'TODAS'
): Promise<ProfesorConCarga[]> {
  try {
    let supabaseQuery = supabase
      .from('oferta_academica')
      .select(`
        id,
        ciclo,
        nrc,
        seccion,
        cupo_total,
        cupo_disponible,
        profesor_id,
        profesor_nombre_original,
        profesores (
          id,
          nombre_completo,
          nombre_normalizado,
          departamento
        ),
        materias (
          clave,
          nombre,
          creditos
        ),
        sesiones_horario (
          id,
          dia,
          hora_inicio,
          hora_fin,
          modulo_texto,
          aula_texto
        )
      `)
      .eq('centro_codigo', centroCodigo)
      .eq('ciclo', ciclo);

    if (query.trim()) {
      const normalizado = normalizeText(query);
      supabaseQuery = supabaseQuery.or(
        `profesor_nombre_original.ilike.%${query.trim()}%,profesor_nombre_original.ilike.%${normalizado}%`
      );
    }

    // Verificar si hay datos en la base de datos para este centro y ciclo
    const { count } = await supabase
      .from('oferta_academica')
      .select('*', { count: 'exact', head: true })
      .eq('centro_codigo', centroCodigo)
      .eq('ciclo', ciclo);

    if (count === 0) {
      await syncSiiau(centroCodigo, ciclo, _carrera);
    }

    const { data, error } = await supabaseQuery.limit(200);

    if (error || !data || data.length === 0) {
      return [];
    }

    // Agrupar por profesor
    const profesoresMap = new Map<string, ProfesorConCarga>();

    for (const rawItem of data) {
      const item = rawItem as any;
      const profObj = Array.isArray(item.profesores) ? item.profesores[0] : item.profesores;
      const matObj = Array.isArray(item.materias) ? item.materias[0] : item.materias;

      const profName = profObj?.nombre_completo || item.profesor_nombre_original || 'SIN PROFESOR';
      if (profName === 'SIN PROFESOR' || profName === 'NO ASIGNADO') continue;

      const profId = profObj?.id || item.profesor_id || profName;
      const profNormalizado = profObj?.nombre_normalizado || normalizeText(profName);

      if (!profesoresMap.has(profId)) {
        profesoresMap.set(profId, {
          id: profId,
          nombre_completo: profName,
          nombre_normalizado: profNormalizado,
          departamento: profObj?.departamento,
          ofertas: [],
          sesionesTotales: [],
          estadoActual: { enClase: false },
        });
      }

      const profesor = profesoresMap.get(profId)!;

      const sesiones = (Array.isArray(item.sesiones_horario) ? item.sesiones_horario : []) as Array<{
        id: string;
        dia: 'L' | 'M' | 'I' | 'J' | 'V' | 'S';
        hora_inicio: string;
        hora_fin: string;
        modulo_texto?: string;
        aula_texto?: string;
      }>;

      const materiaClave = matObj?.clave || '';
      const materiaNombre = matObj?.nombre || '';
      const creditos = matObj?.creditos || 0;

      profesor.ofertas.push({
        nrc: item.nrc,
        seccion: item.seccion || '',
        materia_clave: materiaClave,
        materia_nombre: materiaNombre,
        creditos,
        cupo_total: item.cupo_total || 0,
        cupo_disponible: item.cupo_disponible || 0,
        sesiones,
      });

      for (const ses of sesiones) {
        profesor.sesionesTotales.push({
          id: ses.id,
          oferta_id: item.id,
          nrc: item.nrc,
          ciclo: item.ciclo,
          dia: ses.dia,
          hora_inicio: ses.hora_inicio,
          hora_fin: ses.hora_fin,
          modulo_texto: ses.modulo_texto,
          aula_texto: ses.aula_texto,
          materia_nombre: materiaNombre,
          materia_clave: materiaClave,
          seccion: item.seccion || '',
          profesor_nombre: profName,
        });
      }
    }

    // Calcular estado en tiempo real para cada profesor
    const resultado = Array.from(profesoresMap.values()).map((p) => {
      p.estadoActual = calcularEstadoProfesor(p.sesionesTotales, referenciaFecha);
      return p;
    });

    return resultado;
  } catch (err) {
    console.error('Fallo en consulta Supabase:', err);
    return [];
  }
}
