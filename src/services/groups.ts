import { supabase } from '../lib/supabase';
import { normalizeText } from '../lib/string-utils';
import {
  calcularEstadoGrupo,
  estimarCohorteGeneracion,
  EstadoGrupo,
  InfoCohorte,
  SesionConDetalles,
  timeToMinutes,
} from '../lib/schedule-utils';

export interface ProgramaAcademico {
  codigo: string;
  nombre: string;
  centro_codigo: string;
  totalSemestres: number;
  grado: 'Licenciatura' | 'Ingeniería' | 'Posgrado' | 'Técnico';
}

export interface MateriaMalla {
  clave: string;
  nombre: string;
  semestre: number;
  creditos: number;
  area: 'Básica Común' | 'Básica Particular' | 'Especializante' | 'Optativa';
}

export interface OfertaDetalleGrupo {
  nrc: string;
  materia_clave: string;
  materia_nombre: string;
  semestreEstimado?: number;
  creditos: number;
  seccion: string;
  profesor_nombre: string;
  cupo_total: number;
  cupo_disponible: number;
  sesiones: SesionConDetalles[];
}

export interface GrupoAcademico {
  id: string;
  centro_codigo: string;
  carrera_codigo: string;
  carrera_nombre: string;
  semestre: number;
  seccion: string;
  turno: 'Matutino' | 'Vespertino' | 'Mixto';
  cohorte: InfoCohorte;
  materias: OfertaDetalleGrupo[];
  sesionesTotales: SesionConDetalles[];
  estadoActual: EstadoGrupo;
  totalCreditos: number;
  totalHorasSemana: number;
  modulosFrecuentes: string[];
}

export interface FiltrosGrupos {
  centro_codigo: string;
  ciclo: string;
  carrera_codigo?: string;
  semestre?: number; // 0 o undefined = Todos
  turno?: 'TODOS' | 'Matutino' | 'Vespertino';
  busqueda?: string;
}

// Catálogo de carreras por Centro Universitario UDG
export const CATALOGO_CARRERAS: ProgramaAcademico[] = [
  // CUCEI
  { codigo: 'INCO', nombre: 'Ingeniería en Computación', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Ingeniería' },
  { codigo: 'INNI', nombre: 'Ingeniería Informática', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Ingeniería' },
  { codigo: 'ICOM', nombre: 'Ingeniería en Comunicaciones y Electrónica', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Ingeniería' },
  { codigo: 'IBIO', nombre: 'Ingeniería Biomédica', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Ingeniería' },
  { codigo: 'IQFI', nombre: 'Ingeniería Química', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Ingeniería' },
  { codigo: 'QFB', nombre: 'Químico Farmacobiólogo', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'MATE', nombre: 'Licenciatura en Matemáticas', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'FISI', nombre: 'Licenciatura en Física', centro_codigo: 'CUCEI', totalSemestres: 8, grado: 'Licenciatura' },

  // CUCEA
  { codigo: 'LCP', nombre: 'Licenciatura en Contaduría Pública', centro_codigo: 'CUCEA', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'LADM', nombre: 'Licenciatura en Administración', centro_codigo: 'CUCEA', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'LNEG', nombre: 'Licenciatura en Negocios Internacionales', centro_codigo: 'CUCEA', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'LMKT', nombre: 'Licenciatura en Mercadotecnia', centro_codigo: 'CUCEA', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'LTI', nombre: 'Licenciatura en Tecnologías de la Información', centro_codigo: 'CUCEA', totalSemestres: 8, grado: 'Licenciatura' },

  // CUCS
  { codigo: 'MED', nombre: 'Médico Cirujano y Partero', centro_codigo: 'CUCS', totalSemestres: 12, grado: 'Licenciatura' },
  { codigo: 'ENF', nombre: 'Licenciatura en Enfermería', centro_codigo: 'CUCS', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'NUT', nombre: 'Licenciatura en Nutrición', centro_codigo: 'CUCS', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'PSI', nombre: 'Licenciatura en Psicología', centro_codigo: 'CUCS', totalSemestres: 8, grado: 'Licenciatura' },

  // CUAAD
  { codigo: 'ARQ', nombre: 'Licenciatura en Arquitectura', centro_codigo: 'CUAAD', totalSemestres: 10, grado: 'Licenciatura' },
  { codigo: 'DG', nombre: 'Licenciatura en Diseño Gráfico', centro_codigo: 'CUAAD', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'ART', nombre: 'Licenciatura en Artes Visuales', centro_codigo: 'CUAAD', totalSemestres: 8, grado: 'Licenciatura' },

  // CUCSH
  { codigo: 'ABO', nombre: 'Licenciatura en Derecho', centro_codigo: 'CUCSH', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'SOC', nombre: 'Licenciatura en Sociología', centro_codigo: 'CUCSH', totalSemestres: 8, grado: 'Licenciatura' },
  { codigo: 'HIS', nombre: 'Licenciatura en Historia', centro_codigo: 'CUCSH', totalSemestres: 8, grado: 'Licenciatura' },
];

// Malla curricular de referencia para INCO / CUCEI (Fase 2 de Mallas)
export const MALLA_INCO: MateriaMalla[] = [
  // Semestre 1
  { clave: 'I5882', nombre: 'PROGRAMACIÓN ESTRUCTURADA', semestre: 1, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5884', nombre: 'MATEMÁTICAS DISCRETAS', semestre: 1, creditos: 8, area: 'Básica Común' },
  { clave: 'MT101', nombre: 'CÁLCULO DIFERENCIAL E INTEGRAL', semestre: 1, creditos: 9, area: 'Básica Común' },
  { clave: 'CC100', nombre: 'INTRODUCCIÓN A LA COMPUTACIÓN', semestre: 1, creditos: 6, area: 'Básica Particular' },
  { clave: 'CS100', nombre: 'COMUNICACIÓN ORAL Y ESCRITA', semestre: 1, creditos: 6, area: 'Básica Común' },

  // Semestre 2
  { clave: 'I5886', nombre: 'ESTRUCTURAS DE DATOS', semestre: 2, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5885', nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS', semestre: 2, creditos: 8, area: 'Básica Particular' },
  { clave: 'MT102', nombre: 'ÁLGEBRA LINEAL', semestre: 2, creditos: 8, area: 'Básica Común' },
  { clave: 'FS100', nombre: 'MECÁNICA CLÁSICA', semestre: 2, creditos: 8, area: 'Básica Común' },

  // Semestre 3
  { clave: 'I5887', nombre: 'ALGORITMOS AVANZADOS', semestre: 3, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5891', nombre: 'BASES DE DATOS', semestre: 3, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5888', nombre: 'ARQUITECTURA DE COMPUTADORAS', semestre: 3, creditos: 8, area: 'Básica Particular' },
  { clave: 'MT201', nombre: 'ECUACIONES DIFERENCIALES', semestre: 3, creditos: 8, area: 'Básica Común' },

  // Semestre 4
  { clave: 'I5892', nombre: 'SISTEMAS OPERATIVOS', semestre: 4, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5893', nombre: 'REDES DE COMPUTADORAS', semestre: 4, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5894', nombre: 'INGENIERÍA DE SOFTWARE I', semestre: 4, creditos: 8, area: 'Básica Particular' },
  { clave: 'MT301', nombre: 'PROBABILIDAD Y ESTADÍSTICA', semestre: 4, creditos: 8, area: 'Básica Común' },

  // Semestre 5
  { clave: 'I5895', nombre: 'INTELIGENCIA ARTIFICIAL', semestre: 5, creditos: 8, area: 'Especializante' },
  { clave: 'I5896', nombre: 'COMPILADORES', semestre: 5, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5897', nombre: 'INGENIERÍA DE SOFTWARE II', semestre: 5, creditos: 8, area: 'Básica Particular' },
  { clave: 'I5898', nombre: 'SEGURIDAD INFORMÁTICA', semestre: 5, creditos: 8, area: 'Especializante' },
];

// Datos Mock de Grupos Académicos para demostración completa y offline
const MOCK_GRUPOS: GrupoAcademico[] = [
  {
    id: 'CUCEI-INCO-1-D01',
    centro_codigo: 'CUCEI',
    carrera_codigo: 'INCO',
    carrera_nombre: 'Ingeniería en Computación',
    semestre: 1,
    seccion: 'D01',
    turno: 'Matutino',
    cohorte: estimarCohorteGeneracion(1, '2026B', 8),
    totalCreditos: 37,
    totalHorasSemana: 25,
    modulosFrecuentes: ['MOD M', 'MOD P', 'MOD C'],
    estadoActual: { enClase: false },
    materias: [
      {
        nrc: '11001',
        materia_clave: 'I5882',
        materia_nombre: 'PROGRAMACIÓN ESTRUCTURADA',
        semestreEstimado: 1,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'GOMEZ BARRAGAN, ALEJANDRO',
        cupo_total: 35,
        cupo_disponible: 3,
        sesiones: [
          { id: 's-1', dia: 'L', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD M', aula_texto: 'M101', materia_nombre: 'PROGRAMACIÓN ESTRUCTURADA', seccion: 'D01', profesor_nombre: 'GOMEZ BARRAGAN, ALEJANDRO' },
          { id: 's-2', dia: 'I', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD M', aula_texto: 'M101', materia_nombre: 'PROGRAMACIÓN ESTRUCTURADA', seccion: 'D01', profesor_nombre: 'GOMEZ BARRAGAN, ALEJANDRO' },
        ],
      },
      {
        nrc: '11002',
        materia_clave: 'I5884',
        materia_nombre: 'MATEMÁTICAS DISCRETAS',
        semestreEstimado: 1,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'VARGAS MENDOZA, CARLOS',
        cupo_total: 35,
        cupo_disponible: 5,
        sesiones: [
          { id: 's-3', dia: 'M', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD P', aula_texto: 'P102', materia_nombre: 'MATEMÁTICAS DISCRETAS', seccion: 'D01', profesor_nombre: 'VARGAS MENDOZA, CARLOS' },
          { id: 's-4', dia: 'J', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD P', aula_texto: 'P102', materia_nombre: 'MATEMÁTICAS DISCRETAS', seccion: 'D01', profesor_nombre: 'VARGAS MENDOZA, CARLOS' },
        ],
      },
      {
        nrc: '11003',
        materia_clave: 'MT101',
        materia_nombre: 'CÁLCULO DIFERENCIAL E INTEGRAL',
        semestreEstimado: 1,
        creditos: 9,
        seccion: 'D01',
        profesor_nombre: 'PEREZ GUZMAN, HECTOR',
        cupo_total: 40,
        cupo_disponible: 0,
        sesiones: [
          { id: 's-5', dia: 'L', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD C', aula_texto: 'C201', materia_nombre: 'CÁLCULO DIFERENCIAL E INTEGRAL', seccion: 'D01', profesor_nombre: 'PEREZ GUZMAN, HECTOR' },
          { id: 's-6', dia: 'I', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD C', aula_texto: 'C201', materia_nombre: 'CÁLCULO DIFERENCIAL E INTEGRAL', seccion: 'D01', profesor_nombre: 'PEREZ GUZMAN, HECTOR' },
          { id: 's-7', dia: 'V', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD C', aula_texto: 'C201', materia_nombre: 'CÁLCULO DIFERENCIAL E INTEGRAL', seccion: 'D01', profesor_nombre: 'PEREZ GUZMAN, HECTOR' },
        ],
      },
      {
        nrc: '11004',
        materia_clave: 'CC100',
        materia_nombre: 'INTRODUCCIÓN A LA COMPUTACIÓN',
        semestreEstimado: 1,
        creditos: 6,
        seccion: 'D01',
        profesor_nombre: 'MARTINEZ FLORES, LUCIA',
        cupo_total: 30,
        cupo_disponible: 2,
        sesiones: [
          { id: 's-8', dia: 'M', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD M', aula_texto: 'M105', materia_nombre: 'INTRODUCCIÓN A LA COMPUTACIÓN', seccion: 'D01', profesor_nombre: 'MARTINEZ FLORES, LUCIA' },
          { id: 's-9', dia: 'J', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD M', aula_texto: 'M105', materia_nombre: 'INTRODUCCIÓN A LA COMPUTACIÓN', seccion: 'D01', profesor_nombre: 'MARTINEZ FLORES, LUCIA' },
        ],
      },
    ],
    sesionesTotales: [],
  },
  {
    id: 'CUCEI-INCO-3-D01',
    centro_codigo: 'CUCEI',
    carrera_codigo: 'INCO',
    carrera_nombre: 'Ingeniería en Computación',
    semestre: 3,
    seccion: 'D01',
    turno: 'Matutino',
    cohorte: estimarCohorteGeneracion(3, '2026B', 8),
    totalCreditos: 32,
    totalHorasSemana: 20,
    modulosFrecuentes: ['MOD M', 'MOD P', 'LAB REDES'],
    estadoActual: { enClase: false },
    materias: [
      {
        nrc: '13001',
        materia_clave: 'I5887',
        materia_nombre: 'ALGORITMOS AVANZADOS',
        semestreEstimado: 3,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'HERNANDEZ LOPEZ, JUAN CARLOS',
        cupo_total: 35,
        cupo_disponible: 4,
        sesiones: [
          { id: 's-10', dia: 'L', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD M', aula_texto: 'M201', materia_nombre: 'ALGORITMOS AVANZADOS', seccion: 'D01', profesor_nombre: 'HERNANDEZ LOPEZ, JUAN CARLOS' },
          { id: 's-11', dia: 'I', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD M', aula_texto: 'M201', materia_nombre: 'ALGORITMOS AVANZADOS', seccion: 'D01', profesor_nombre: 'HERNANDEZ LOPEZ, JUAN CARLOS' },
        ],
      },
      {
        nrc: '13002',
        materia_clave: 'I5891',
        materia_nombre: 'BASES DE DATOS',
        semestreEstimado: 3,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'TORRES NAVARRO, ROBERTO',
        cupo_total: 35,
        cupo_disponible: 1,
        sesiones: [
          { id: 's-12', dia: 'M', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD M', aula_texto: 'M203', materia_nombre: 'BASES DE DATOS', seccion: 'D01', profesor_nombre: 'TORRES NAVARRO, ROBERTO' },
          { id: 's-13', dia: 'J', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'MOD M', aula_texto: 'M203', materia_nombre: 'BASES DE DATOS', seccion: 'D01', profesor_nombre: 'TORRES NAVARRO, ROBERTO' },
        ],
      },
      {
        nrc: '13003',
        materia_clave: 'I5888',
        materia_nombre: 'ARQUITECTURA DE COMPUTADORAS',
        semestreEstimado: 3,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'SILVA MORALES, PATRICIA',
        cupo_total: 30,
        cupo_disponible: 0,
        sesiones: [
          { id: 's-14', dia: 'L', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD P', aula_texto: 'P204', materia_nombre: 'ARQUITECTURA DE COMPUTADORAS', seccion: 'D01', profesor_nombre: 'SILVA MORALES, PATRICIA' },
          { id: 's-15', dia: 'I', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD P', aula_texto: 'P204', materia_nombre: 'ARQUITECTURA DE COMPUTADORAS', seccion: 'D01', profesor_nombre: 'SILVA MORALES, PATRICIA' },
        ],
      },
      {
        nrc: '13004',
        materia_clave: 'MT201',
        materia_nombre: 'ECUACIONES DIFERENCIALES',
        semestreEstimado: 3,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'RAMIREZ CHAVEZ, JORGE',
        cupo_total: 40,
        cupo_disponible: 6,
        sesiones: [
          { id: 's-16', dia: 'M', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD P', aula_texto: 'P201', materia_nombre: 'ECUACIONES DIFERENCIALES', seccion: 'D01', profesor_nombre: 'RAMIREZ CHAVEZ, JORGE' },
          { id: 's-17', dia: 'J', hora_inicio: '09:00:00', hora_fin: '10:55:00', modulo_texto: 'MOD P', aula_texto: 'P201', materia_nombre: 'ECUACIONES DIFERENCIALES', seccion: 'D01', profesor_nombre: 'RAMIREZ CHAVEZ, JORGE' },
        ],
      },
    ],
    sesionesTotales: [],
  },
  {
    id: 'CUCEI-INNI-2-V01',
    centro_codigo: 'CUCEI',
    carrera_codigo: 'INNI',
    carrera_nombre: 'Ingeniería Informática',
    semestre: 2,
    seccion: 'V01',
    turno: 'Vespertino',
    cohorte: estimarCohorteGeneracion(2, '2026B', 8),
    totalCreditos: 32,
    totalHorasSemana: 20,
    modulosFrecuentes: ['MOD M', 'MOD P'],
    estadoActual: { enClase: false },
    materias: [
      {
        nrc: '22001',
        materia_clave: 'I5886',
        materia_nombre: 'ESTRUCTURAS DE DATOS',
        semestreEstimado: 2,
        creditos: 8,
        seccion: 'V01',
        profesor_nombre: 'RUIZ DIAZ, ESTEBAN',
        cupo_total: 35,
        cupo_disponible: 8,
        sesiones: [
          { id: 's-18', dia: 'L', hora_inicio: '15:00:00', hora_fin: '16:55:00', modulo_texto: 'MOD M', aula_texto: 'M202', materia_nombre: 'ESTRUCTURAS DE DATOS', seccion: 'V01', profesor_nombre: 'RUIZ DIAZ, ESTEBAN' },
          { id: 's-19', dia: 'I', hora_inicio: '15:00:00', hora_fin: '16:55:00', modulo_texto: 'MOD M', aula_texto: 'M202', materia_nombre: 'ESTRUCTURAS DE DATOS', seccion: 'V01', profesor_nombre: 'RUIZ DIAZ, ESTEBAN' },
        ],
      },
      {
        nrc: '22002',
        materia_clave: 'I5885',
        materia_nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
        semestreEstimado: 2,
        creditos: 8,
        seccion: 'V01',
        profesor_nombre: 'MENDOZA RIVERA, LAURA',
        cupo_total: 35,
        cupo_disponible: 2,
        sesiones: [
          { id: 's-20', dia: 'M', hora_inicio: '15:00:00', hora_fin: '16:55:00', modulo_texto: 'MOD M', aula_texto: 'M204', materia_nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS', seccion: 'V01', profesor_nombre: 'MENDOZA RIVERA, LAURA' },
          { id: 's-21', dia: 'J', hora_inicio: '15:00:00', hora_fin: '16:55:00', modulo_texto: 'MOD M', aula_texto: 'M204', materia_nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS', seccion: 'V01', profesor_nombre: 'MENDOZA RIVERA, LAURA' },
        ],
      },
      {
        nrc: '22003',
        materia_clave: 'MT102',
        materia_nombre: 'ÁLGEBRA LINEAL',
        semestreEstimado: 2,
        creditos: 8,
        seccion: 'V01',
        profesor_nombre: 'ALVAREZ SANDOVAL, FERNANDO',
        cupo_total: 40,
        cupo_disponible: 12,
        sesiones: [
          { id: 's-22', dia: 'L', hora_inicio: '17:00:00', hora_fin: '18:55:00', modulo_texto: 'MOD P', aula_texto: 'P103', materia_nombre: 'ÁLGEBRA LINEAL', seccion: 'V01', profesor_nombre: 'ALVAREZ SANDOVAL, FERNANDO' },
          { id: 's-23', dia: 'I', hora_inicio: '17:00:00', hora_fin: '18:55:00', modulo_texto: 'MOD P', aula_texto: 'P103', materia_nombre: 'ÁLGEBRA LINEAL', seccion: 'V01', profesor_nombre: 'ALVAREZ SANDOVAL, FERNANDO' },
        ],
      },
    ],
    sesionesTotales: [],
  },
  {
    id: 'CUCEA-LCP-1-D01',
    centro_codigo: 'CUCEA',
    carrera_codigo: 'LCP',
    carrera_nombre: 'Licenciatura en Contaduría Pública',
    semestre: 1,
    seccion: 'D01',
    turno: 'Matutino',
    cohorte: estimarCohorteGeneracion(1, '2026B', 8),
    totalCreditos: 30,
    totalHorasSemana: 20,
    modulosFrecuentes: ['EDIF A', 'EDIF B'],
    estadoActual: { enClase: false },
    materias: [
      {
        nrc: '31001',
        materia_clave: 'CP101',
        materia_nombre: 'CONTABILIDAD BÁSICA I',
        semestreEstimado: 1,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'GUTIERREZ LARA, MARTHA',
        cupo_total: 40,
        cupo_disponible: 5,
        sesiones: [
          { id: 's-24', dia: 'L', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'EDIF A', aula_texto: 'A101', materia_nombre: 'CONTABILIDAD BÁSICA I', seccion: 'D01', profesor_nombre: 'GUTIERREZ LARA, MARTHA' },
          { id: 's-25', dia: 'I', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'EDIF A', aula_texto: 'A101', materia_nombre: 'CONTABILIDAD BÁSICA I', seccion: 'D01', profesor_nombre: 'GUTIERREZ LARA, MARTHA' },
        ],
      },
      {
        nrc: '31002',
        materia_clave: 'AD101',
        materia_nombre: 'ADMINISTRACIÓN GENERAL',
        semestreEstimado: 1,
        creditos: 8,
        seccion: 'D01',
        profesor_nombre: 'RANGEL OROZCO, GABRIEL',
        cupo_total: 40,
        cupo_disponible: 3,
        sesiones: [
          { id: 's-26', dia: 'M', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'EDIF B', aula_texto: 'B102', materia_nombre: 'ADMINISTRACIÓN GENERAL', seccion: 'D01', profesor_nombre: 'RANGEL OROZCO, GABRIEL' },
          { id: 's-27', dia: 'J', hora_inicio: '07:00:00', hora_fin: '08:55:00', modulo_texto: 'EDIF B', aula_texto: 'B102', materia_nombre: 'ADMINISTRACIÓN GENERAL', seccion: 'D01', profesor_nombre: 'RANGEL OROZCO, GABRIEL' },
        ],
      },
    ],
    sesionesTotales: [],
  },
];

// Inicializar sesiones totales y estado para cada grupo mock
MOCK_GRUPOS.forEach((g) => {
  const todasSesiones: SesionConDetalles[] = [];
  g.materias.forEach((m) => {
    todasSesiones.push(...m.sesiones);
  });
  g.sesionesTotales = todasSesiones;
  g.estadoActual = calcularEstadoGrupo(todasSesiones);
});

/**
 * Obtiene la lista de carreras disponibles para un Centro Universitario
 */
export function getCarreras(centro_codigo?: string): ProgramaAcademico[] {
  if (!centro_codigo) return CATALOGO_CARRERAS;
  return CATALOGO_CARRERAS.filter((c) => c.centro_codigo === centro_codigo);
}

/**
 * Busca y agrupa grupos académicos a partir de filtros
 */
export async function searchGroups(filtros: FiltrosGrupos): Promise<GrupoAcademico[]> {
  try {
    // Intentar consultar Supabase si está disponible
    const { data: ofertas, error } = await supabase
      .from('oferta_academica')
      .select(`
        id,
        nrc,
        ciclo,
        seccion,
        centro_codigo,
        cupo_total,
        cupo_disponible,
        materias (
          clave,
          nombre,
          creditos,
          area
        ),
        profesores (
          id,
          nombre_completo
        ),
        sesiones_horario (
          id,
          dia,
          hora_inicio,
          hora_fin,
          modulo_texto,
          aula_texto,
          aulas (
            codigo_aula,
            modulos (codigo_modulo)
          )
        )
      `)
      .eq('centro_codigo', filtros.centro_codigo)
      .eq('ciclo', filtros.ciclo);

    if (error || !ofertas || ofertas.length === 0) {
      return searchMockGroups(filtros);
    }

    // Agrupar ofertas por sección y carrera aproximada
    const gruposMap = new Map<string, GrupoAcademico>();

    for (const of of ofertas) {
      const seccion = of.seccion || 'D01';
      const turno: 'Matutino' | 'Vespertino' | 'Mixto' = seccion.startsWith('V')
        ? 'Vespertino'
        : seccion.startsWith('D')
        ? 'Matutino'
        : 'Mixto';

      // Estimar carrera y semestre a partir de clave de materia o catálogo
      const materiaClave = (of.materias as any)?.clave || 'MAT';
      const materiaNombre = (of.materias as any)?.nombre || 'MATERIA';
      const creditos = (of.materias as any)?.creditos || 8;
      const profNombre = (of.profesores as any)?.nombre_completo || 'PROFESOR SIN ASIGNAR';

      // Buscar en malla INCO u homologar
      const enMalla = MALLA_INCO.find((m) => m.clave === materiaClave);
      const semestre = enMalla?.semestre || 1;
      const carreraCodigo = filtros.carrera_codigo || 'INCO';
      const carreraInfo = CATALOGO_CARRERAS.find((c) => c.codigo === carreraCodigo) || CATALOGO_CARRERAS[0];

      const groupId = `${filtros.centro_codigo}-${carreraCodigo}-${semestre}-${seccion}`;

      let grupo = gruposMap.get(groupId);
      if (!grupo) {
        grupo = {
          id: groupId,
          centro_codigo: filtros.centro_codigo,
          carrera_codigo: carreraCodigo,
          carrera_nombre: carreraInfo.nombre,
          semestre,
          seccion,
          turno,
          cohorte: estimarCohorteGeneracion(semestre, filtros.ciclo, carreraInfo.totalSemestres),
          materias: [],
          sesionesTotales: [],
          estadoActual: { enClase: false },
          totalCreditos: 0,
          totalHorasSemana: 0,
          modulosFrecuentes: [],
        };
        gruposMap.set(groupId, grupo);
      }

      // Mapear sesiones
      const sesionesMapeadas: SesionConDetalles[] = ((of.sesiones_horario as any[]) || []).map((s) => ({
        id: s.id,
        dia: s.dia,
        hora_inicio: s.hora_inicio,
        hora_fin: s.hora_fin,
        modulo_texto: s.modulo_texto || s.aulas?.modulos?.codigo_modulo,
        aula_texto: s.aula_texto || s.aulas?.codigo_aula,
        materia_nombre: materiaNombre,
        materia_clave: materiaClave,
        seccion,
        profesor_nombre: profNombre,
      }));

      grupo.materias.push({
        nrc: of.nrc,
        materia_clave: materiaClave,
        materia_nombre: materiaNombre,
        semestreEstimado: semestre,
        creditos,
        seccion,
        profesor_nombre: profNombre,
        cupo_total: of.cupo_total || 35,
        cupo_disponible: of.cupo_disponible || 0,
        sesiones: sesionesMapeadas,
      });

      grupo.sesionesTotales.push(...sesionesMapeadas);
      grupo.totalCreditos += creditos;
    }

    // Calcular estadísticas y estado de cada grupo
    const gruposList = Array.from(gruposMap.values());
    for (const g of gruposList) {
      g.estadoActual = calcularEstadoGrupo(g.sesionesTotales);
      
      // Calcular horas totales
      let minutosTotales = 0;
      const modulosSet = new Set<string>();
      for (const s of g.sesionesTotales) {
        minutosTotales += timeToMinutes(s.hora_fin) - timeToMinutes(s.hora_inicio);
        if (s.modulo_texto) modulosSet.add(s.modulo_texto);
      }
      g.totalHorasSemana = Math.round(minutosTotales / 60);
      g.modulosFrecuentes = Array.from(modulosSet);
    }

    return filtrarGrupos(gruposList, filtros);
  } catch {
    return searchMockGroups(filtros);
  }
}

/**
 * Filtrado en memoria de grupos Mock
 */
export function searchMockGroups(filtros: FiltrosGrupos): GrupoAcademico[] {
  let resultado = MOCK_GRUPOS.map((g) => {
    // Recalcular estado actual en tiempo real
    const estado = calcularEstadoGrupo(g.sesionesTotales);
    const cohorte = estimarCohorteGeneracion(g.semestre, filtros.ciclo || '2026B');
    return {
      ...g,
      estadoActual: estado,
      cohorte,
    };
  });

  return filtrarGrupos(resultado, filtros);
}

function filtrarGrupos(grupos: GrupoAcademico[], filtros: FiltrosGrupos): GrupoAcademico[] {
  let resultado = grupos;

  // Filtro por Centro
  if (filtros.centro_codigo) {
    resultado = resultado.filter((g) => g.centro_codigo === filtros.centro_codigo);
  }

  // Filtro por Carrera
  if (filtros.carrera_codigo && filtros.carrera_codigo !== 'TODAS') {
    resultado = resultado.filter((g) => g.carrera_codigo === filtros.carrera_codigo);
  }

  // Filtro por Semestre
  if (filtros.semestre && filtros.semestre > 0) {
    resultado = resultado.filter((g) => g.semestre === filtros.semestre);
  }

  // Filtro por Turno
  if (filtros.turno && filtros.turno !== 'TODOS') {
    resultado = resultado.filter((g) => g.turno === filtros.turno);
  }

  // Búsqueda por texto (código de materia, nombre de materia, NRC, sección o profesor)
  if (filtros.busqueda && filtros.busqueda.trim() !== '') {
    const qNorm = normalizeText(filtros.busqueda);
    resultado = resultado.filter((g) => {
      // Buscar en sección, carrera
      if (normalizeText(g.seccion).includes(qNorm)) return true;
      if (normalizeText(g.carrera_nombre).includes(qNorm)) return true;
      if (normalizeText(g.carrera_codigo).includes(qNorm)) return true;
      if (normalizeText(g.cohorte.etiquetaGeneracion).includes(qNorm)) return true;

      // Buscar en materias impartidas del grupo
      return g.materias.some((m) => {
        return (
          normalizeText(m.materia_nombre).includes(qNorm) ||
          normalizeText(m.materia_clave).includes(qNorm) ||
          m.nrc.includes(qNorm) ||
          normalizeText(m.profesor_nombre).includes(qNorm)
        );
      });
    });
  }

  return resultado;
}
