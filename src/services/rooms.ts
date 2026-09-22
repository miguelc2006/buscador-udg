import { supabase } from '../lib/supabase';
import { normalizeText } from '../lib/string-utils';
import {
  DiaSiiau,
  SesionConDetalles,
  calcularDisponibilidadAula,
  formatTime,
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

// Catálogo demo de aulas y sesiones para CUCEI y centros UDG
const MOCK_AULAS: AulaInfo[] = [
  // Módulo M (CUCEI)
  {
    id: 'aula-m101',
    codigo_aula: 'M101',
    codigo_modulo: 'MOD M',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 45,
    sesiones: [
      {
        id: 's-m101-1',
        dia: 'L',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'CALCULO DIFERENCIAL E INTEGRAL',
        materia_clave: 'MT101',
        seccion: 'D01',
        profesor_nombre: 'SANCHEZ DIAZ, ROBERTO',
      },
      {
        id: 's-m101-2',
        dia: 'I',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'CALCULO DIFERENCIAL E INTEGRAL',
        materia_clave: 'MT101',
        seccion: 'D01',
        profesor_nombre: 'SANCHEZ DIAZ, ROBERTO',
      },
      {
        id: 's-m101-3',
        dia: 'L',
        hora_inicio: '13:00:00',
        hora_fin: '14:55:00',
        materia_nombre: 'ALGEBRA LINEAL',
        materia_clave: 'MT102',
        seccion: 'D03',
        profesor_nombre: 'GOMEZ MARTINEZ, ELENA',
      },
      {
        id: 's-m101-4',
        dia: 'M',
        hora_inicio: '09:00:00',
        hora_fin: '10:55:00',
        materia_nombre: 'FISICA GENERAL',
        materia_clave: 'FS101',
        seccion: 'D02',
        profesor_nombre: 'TORRES VAZQUEZ, CARLOS',
      },
    ],
  },
  {
    id: 'aula-m102',
    codigo_aula: 'M102',
    codigo_modulo: 'MOD M',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 40,
    sesiones: [
      {
        id: 's-m102-1',
        dia: 'M',
        hora_inicio: '11:00:00',
        hora_fin: '12:55:00',
        materia_nombre: 'MECANICA VECTORIAL',
        materia_clave: 'FS103',
        seccion: 'D01',
        profesor_nombre: 'RAMIREZ SOLIS, PEDRO',
      },
      {
        id: 's-m102-2',
        dia: 'J',
        hora_inicio: '11:00:00',
        hora_fin: '12:55:00',
        materia_nombre: 'MECANICA VECTORIAL',
        materia_clave: 'FS103',
        seccion: 'D01',
        profesor_nombre: 'RAMIREZ SOLIS, PEDRO',
      },
    ],
  },
  {
    id: 'aula-m201',
    codigo_aula: 'M201',
    codigo_modulo: 'MOD M',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 50,
    sesiones: [
      {
        id: 's-m201-1',
        dia: 'L',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'ESTRUCTURAS DE DATOS',
        materia_clave: 'I5886',
        seccion: 'D01',
        profesor_nombre: 'HERNANDEZ LOPEZ, JUAN CARLOS',
      },
      {
        id: 's-m201-2',
        dia: 'I',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'ESTRUCTURAS DE DATOS',
        materia_clave: 'I5886',
        seccion: 'D01',
        profesor_nombre: 'HERNANDEZ LOPEZ, JUAN CARLOS',
      },
      {
        id: 's-m201-3',
        dia: 'M',
        hora_inicio: '15:00:00',
        hora_fin: '16:55:00',
        materia_nombre: 'INTELIGENCIA ARTIFICIAL',
        materia_clave: 'CC401',
        seccion: 'D02',
        profesor_nombre: 'HERNANDEZ LOPEZ, JUAN CARLOS',
      },
    ],
  },
  {
    id: 'aula-m202',
    codigo_aula: 'M202',
    codigo_modulo: 'MOD M',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 35,
    sesiones: [],
  },

  // Módulo O (Laboratorios de Cómputo - CUCEI)
  {
    id: 'aula-lab-o1',
    codigo_aula: 'LAB-COMP1',
    codigo_modulo: 'MOD O',
    centro_codigo: 'CUCEI',
    tipo: 'Laboratorio',
    capacidad: 30,
    sesiones: [
      {
        id: 's-lab-o1-1',
        dia: 'L',
        hora_inicio: '09:00:00',
        hora_fin: '10:55:00',
        materia_nombre: 'PROGRAMACION ORIENTADA A OBJETOS',
        materia_clave: 'I5888',
        seccion: 'D01',
        profesor_nombre: 'GARCIA NAVARRO, MARIA GUADALUPE',
      },
      {
        id: 's-lab-o1-2',
        dia: 'I',
        hora_inicio: '09:00:00',
        hora_fin: '10:55:00',
        materia_nombre: 'PROGRAMACION ORIENTADA A OBJETOS',
        materia_clave: 'I5888',
        seccion: 'D01',
        profesor_nombre: 'GARCIA NAVARRO, MARIA GUADALUPE',
      },
      {
        id: 's-lab-o1-3',
        dia: 'V',
        hora_inicio: '07:00:00',
        hora_fin: '10:55:00',
        materia_nombre: 'TALLER DE BASES DE DATOS',
        materia_clave: 'I5890',
        seccion: 'D02',
        profesor_nombre: 'RUIZ VELASCO, FERNANDO',
      },
    ],
  },
  {
    id: 'aula-lab-o2',
    codigo_aula: 'LAB-REDES',
    codigo_modulo: 'MOD O',
    centro_codigo: 'CUCEI',
    tipo: 'Laboratorio',
    capacidad: 25,
    sesiones: [
      {
        id: 's-lab-o2-1',
        dia: 'J',
        hora_inicio: '14:00:00',
        hora_fin: '16:55:00',
        materia_nombre: 'REDES DE COMPUTADORAS',
        materia_clave: 'I5895',
        seccion: 'D01',
        profesor_nombre: 'MORALES CASTILLO, DAVID',
      },
    ],
  },
  {
    id: 'aula-lab-o3',
    codigo_aula: 'LAB-IA',
    codigo_modulo: 'MOD O',
    centro_codigo: 'CUCEI',
    tipo: 'Laboratorio',
    capacidad: 25,
    sesiones: [],
  },

  // Módulo Y (Electrónica - CUCEI)
  {
    id: 'aula-y101',
    codigo_aula: 'Y101',
    codigo_modulo: 'MOD Y',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 40,
    sesiones: [
      {
        id: 's-y101-1',
        dia: 'L',
        hora_inicio: '11:00:00',
        hora_fin: '12:55:00',
        materia_nombre: 'CIRCUITOS ELECTRICOS I',
        materia_clave: 'IE201',
        seccion: 'D01',
        profesor_nombre: 'LOPEZ ALVAREZ, ARTURO',
      },
      {
        id: 's-y101-2',
        dia: 'I',
        hora_inicio: '11:00:00',
        hora_fin: '12:55:00',
        materia_nombre: 'CIRCUITOS ELECTRICOS I',
        materia_clave: 'IE201',
        seccion: 'D01',
        profesor_nombre: 'LOPEZ ALVAREZ, ARTURO',
      },
    ],
  },
  {
    id: 'aula-y-taller',
    codigo_aula: 'TALLER-EMBEBIDOS',
    codigo_modulo: 'MOD Y',
    centro_codigo: 'CUCEI',
    tipo: 'Taller',
    capacidad: 20,
    sesiones: [
      {
        id: 's-y-taller-1',
        dia: 'M',
        hora_inicio: '13:00:00',
        hora_fin: '15:55:00',
        materia_nombre: 'SISTEMAS EMBEBIDOS',
        materia_clave: 'IE305',
        seccion: 'D02',
        profesor_nombre: 'ZAMORA ORTEGA, MANUEL',
      },
    ],
  },

  // CETIC (Centro de Tecnologías para el Aprendizaje - CUCEI)
  {
    id: 'aula-cetic-a1',
    codigo_aula: 'SALA-A1',
    codigo_modulo: 'CETIC',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 60,
    sesiones: [
      {
        id: 's-cetic-1',
        dia: 'L',
        hora_inicio: '16:00:00',
        hora_fin: '18:55:00',
        materia_nombre: 'SEMINARIO DE TITULACION',
        materia_clave: 'I5899',
        seccion: 'D01',
        profesor_nombre: 'VILLASEÑOR SOLORIO, PATRICIA',
      },
    ],
  },
  {
    id: 'aula-cetic-auditorio',
    codigo_aula: 'AUDITORIO-1',
    codigo_modulo: 'CETIC',
    centro_codigo: 'CUCEI',
    tipo: 'Auditorio',
    capacidad: 120,
    sesiones: [],
  },

  // Módulo X (Química - CUCEI)
  {
    id: 'aula-x101',
    codigo_aula: 'X101',
    codigo_modulo: 'MOD X',
    centro_codigo: 'CUCEI',
    tipo: 'Aula',
    capacidad: 45,
    sesiones: [
      {
        id: 's-x101-1',
        dia: 'M',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'QUIMICA GENERAL',
        materia_clave: 'QM101',
        seccion: 'D01',
        profesor_nombre: 'HERRERA GOMEZ, LUCIA',
      },
    ],
  },
  {
    id: 'aula-x-lab',
    codigo_aula: 'LAB-QUIMICA-ORG',
    codigo_modulo: 'MOD X',
    centro_codigo: 'CUCEI',
    tipo: 'Laboratorio',
    capacidad: 25,
    sesiones: [
      {
        id: 's-x-lab-1',
        dia: 'V',
        hora_inicio: '11:00:00',
        hora_fin: '14:55:00',
        materia_nombre: 'LABORATORIO DE QUIMICA ORGANICA',
        materia_clave: 'QM202',
        seccion: 'D01',
        profesor_nombre: 'HERRERA GOMEZ, LUCIA',
      },
    ],
  },
];

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
    console.warn('Fallback a módulos locales:', err);
  }

  // Fallback demo
  const modulosLocales = MOCK_AULAS.filter((a) => a.centro_codigo === centro).map(
    (a) => a.codigo_modulo
  );
  return Array.from(new Set(modulosLocales)).sort();
}

/**
 * Busca aulas libres según los criterios de día, rango horario y filtros
 */
export async function searchFreeRooms(
  filtros: FiltrosAulasLibres
): Promise<AulaLibreResultado[]> {
  const { centro, ciclo, dia, horaInicio, horaFin, moduloId, tipo, query } = filtros;

  try {
    // 1. Intentar llamar al procedimiento almacenado RPC de Supabase
    const { data: rpcAulas, error: rpcError } = await supabase.rpc('get_aulas_libres', {
      p_centro: centro,
      p_ciclo: ciclo,
      p_dia: dia,
      p_hora_inicio: `${horaInicio}:00`,
      p_hora_fin: `${horaFin}:00`,
      p_modulo_id: moduloId || null,
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
    console.warn('Fallo consulta RPC de Supabase, usando cálculo local de aulas:', err);
  }

  // 2. Fallback de cálculo local con datos MOCK
  return searchMockFreeRooms(filtros);
}

/**
 * Cálculo local y filtrado de aulas libres sobre datos MOCK
 */
export function searchMockFreeRooms(
  filtros: FiltrosAulasLibres
): AulaLibreResultado[] {
  const { centro, dia, horaInicio, horaFin, moduloId, tipo, query } = filtros;

  const aulasCentro = MOCK_AULAS.filter((a) => a.centro_codigo === centro);

  const resultados: AulaLibreResultado[] = [];

  for (const aula of aulasCentro) {
    // Filtro de módulo
    if (moduloId && moduloId !== 'ALL' && aula.codigo_modulo !== moduloId) {
      continue;
    }

    // Filtro de tipo
    if (tipo && tipo !== 'Todos' && aula.tipo.toLowerCase() !== tipo.toLowerCase()) {
      continue;
    }

    // Filtro de búsqueda de texto
    if (query && query.trim().length > 0) {
      const qNorm = normalizeText(query);
      const matchAula = normalizeText(aula.codigo_aula).includes(qNorm);
      const matchModulo = normalizeText(aula.codigo_modulo).includes(qNorm);
      if (!matchAula && !matchModulo) {
        continue;
      }
    }

    // Calcular disponibilidad en el rango horario solicitado
    const estado = calcularDisponibilidadAula(
      aula.sesiones,
      dia,
      `${horaInicio}:00`,
      `${horaFin}:00`
    );

    if (estado.disponible) {
      resultados.push({
        id: aula.id,
        codigo_aula: aula.codigo_aula,
        modulo_id: aula.modulo_id,
        codigo_modulo: aula.codigo_modulo,
        centro_codigo: aula.centro_codigo,
        tipo: aula.tipo,
        capacidad: aula.capacidad,
        disponible: true,
        proximaOcupacion: estado.proximaOcupacionHoy
          ? {
              hora_inicio: formatTime(estado.proximaOcupacionHoy.hora_inicio),
              hora_fin: formatTime(estado.proximaOcupacionHoy.hora_fin),
              materia_nombre: estado.proximaOcupacionHoy.materia_nombre,
              profesor_nombre: estado.proximaOcupacionHoy.profesor_nombre,
              minutosPara: estado.minutosParaProxima,
            }
          : undefined,
        sesionesTotales: aula.sesiones,
      });
    }
  }

  // Ordenar por módulo y luego por código de aula
  return resultados.sort((a, b) => {
    if (a.codigo_modulo !== b.codigo_modulo) {
      return a.codigo_modulo.localeCompare(b.codigo_modulo);
    }
    return a.codigo_aula.localeCompare(b.codigo_aula);
  });
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
    console.warn('Fallback a horario local de aula:', err);
  }

  // Fallback MOCK
  const aulaMock = MOCK_AULAS.find((a) => a.id === aulaId || a.codigo_aula === aulaId);
  return {
    aula: aulaMock || null,
    sesiones: aulaMock?.sesiones || [],
  };
}
