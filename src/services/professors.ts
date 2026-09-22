import { supabase } from '../lib/supabase';
import { normalizeText } from '../lib/string-utils';
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

// Datos de demostración cuando Supabase aún no tiene registros o no está conectado
const MOCK_PROFESORES: ProfesorConCarga[] = [
  {
    id: 'mock-1',
    nombre_completo: 'HERNANDEZ LOPEZ, JUAN CARLOS',
    nombre_normalizado: 'HERNANDEZ LOPEZ, JUAN CARLOS',
    departamento: 'Ciencias Computacionales',
    ofertas: [
      {
        nrc: '12345',
        seccion: 'D01',
        materia_clave: 'I5886',
        materia_nombre: 'ESTRUCTURAS DE DATOS',
        creditos: 8,
        cupo_total: 35,
        cupo_disponible: 4,
        sesiones: [
          {
            id: 'ses-1',
            dia: 'L',
            hora_inicio: '07:00:00',
            hora_fin: '08:55:00',
            modulo_texto: 'MOD M',
            aula_texto: 'M201',
          },
          {
            id: 'ses-2',
            dia: 'I',
            hora_inicio: '07:00:00',
            hora_fin: '08:55:00',
            modulo_texto: 'MOD M',
            aula_texto: 'M201',
          },
        ],
      },
      {
        nrc: '12346',
        seccion: 'D02',
        materia_clave: 'I5887',
        materia_nombre: 'ALGORITMOS AVANZADOS',
        creditos: 8,
        cupo_total: 30,
        cupo_disponible: 0,
        sesiones: [
          {
            id: 'ses-3',
            dia: 'M',
            hora_inicio: '11:00:00',
            hora_fin: '12:55:00',
            modulo_texto: 'MOD F',
            aula_texto: 'F102',
          },
          {
            id: 'ses-4',
            dia: 'J',
            hora_inicio: '11:00:00',
            hora_fin: '12:55:00',
            modulo_texto: 'MOD F',
            aula_texto: 'F102',
          },
        ],
      },
    ],
    sesionesTotales: [],
    estadoActual: { enClase: false },
  },
  {
    id: 'mock-2',
    nombre_completo: 'MARTINEZ RIVERA, ANA LAURA',
    nombre_normalizado: 'MARTINEZ RIVERA, ANA LAURA',
    departamento: 'Ingeniería de Software',
    ofertas: [
      {
        nrc: '12347',
        seccion: 'D03',
        materia_clave: 'I5890',
        materia_nombre: 'BASES DE DATOS DISTRIBUIDAS',
        creditos: 8,
        cupo_total: 32,
        cupo_disponible: 10,
        sesiones: [
          {
            id: 'ses-5',
            dia: 'L',
            hora_inicio: '09:00:00',
            hora_fin: '10:55:00',
            modulo_texto: 'MOD O',
            aula_texto: 'O105',
          },
          {
            id: 'ses-6',
            dia: 'I',
            hora_inicio: '09:00:00',
            hora_fin: '10:55:00',
            modulo_texto: 'MOD O',
            aula_texto: 'O105',
          },
          {
            id: 'ses-7',
            dia: 'V',
            hora_inicio: '09:00:00',
            hora_fin: '10:55:00',
            modulo_texto: 'MOD O',
            aula_texto: 'O105',
          },
        ],
      },
    ],
    sesionesTotales: [],
    estadoActual: { enClase: false },
  },
  {
    id: 'mock-3',
    nombre_completo: 'RAMIREZ GUTIERREZ, JORGE ALBERTO',
    nombre_normalizado: 'RAMIREZ GUTIERREZ, JORGE ALBERTO',
    departamento: 'Electrónica y Computación',
    ofertas: [
      {
        nrc: '12348',
        seccion: 'D04',
        materia_clave: 'I5895',
        materia_nombre: 'REDES Y COMUNICACIONES',
        creditos: 9,
        cupo_total: 28,
        cupo_disponible: 2,
        sesiones: [
          {
            id: 'ses-8',
            dia: 'M',
            hora_inicio: '13:00:00',
            hora_fin: '14:55:00',
            modulo_texto: 'MOD Y',
            aula_texto: 'LAB-REDES',
          },
          {
            id: 'ses-9',
            dia: 'J',
            hora_inicio: '13:00:00',
            hora_fin: '14:55:00',
            modulo_texto: 'MOD Y',
            aula_texto: 'LAB-REDES',
          },
        ],
      },
    ],
    sesionesTotales: [],
    estadoActual: { enClase: false },
  },
];

// Inicializar sesiones totales y estado para mocks
for (const mock of MOCK_PROFESORES) {
  const todasSesiones: SesionConDetalles[] = [];
  for (const ofe of mock.ofertas) {
    for (const ses of ofe.sesiones) {
      todasSesiones.push({
        id: ses.id,
        oferta_id: ofe.nrc,
        nrc: ofe.nrc,
        ciclo: '2026A',
        dia: ses.dia,
        hora_inicio: ses.hora_inicio,
        hora_fin: ses.hora_fin,
        modulo_texto: ses.modulo_texto,
        aula_texto: ses.aula_texto,
        materia_nombre: ofe.materia_nombre,
        materia_clave: ofe.materia_clave,
        seccion: ofe.seccion,
        profesor_nombre: mock.nombre_completo,
      });
    }
  }
  mock.sesionesTotales = todasSesiones;
  mock.estadoActual = calcularEstadoProfesor(todasSesiones);
}

/**
 * Consulta de profesores con su carga horaria y estado en vivo
 */
export async function searchProfessors(
  centroCodigo: string,
  ciclo: string,
  query: string = '',
  referenciaFecha: Date = new Date()
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

    const { data, error } = await supabaseQuery.limit(200);

    if (error || !data || data.length === 0) {
      // Si no hay datos en Supabase (ej: base vacía o no configurada), usar mocks filtrados
      return filterMockProfessores(query, referenciaFecha);
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
    console.warn('Fallo en consulta Supabase, fallback a mock:', err);
    return filterMockProfessores(query, referenciaFecha);
  }
}

function filterMockProfessores(query: string, referenciaFecha: Date): ProfesorConCarga[] {
  const normQuery = normalizeText(query);
  const filtered = MOCK_PROFESORES.filter((p) => {
    if (!normQuery) return true;
    return (
      p.nombre_normalizado.includes(normQuery) ||
      p.ofertas.some((o) => normalizeText(o.materia_nombre).includes(normQuery) || o.nrc.includes(query))
    );
  });

  return filtered.map((p) => ({
    ...p,
    estadoActual: calcularEstadoProfesor(p.sesionesTotales, referenciaFecha),
  }));
}
