export interface CentroUniversitario {
  codigo: string;
  nombre: string;
  campus?: string;
  created_at?: string;
}

export interface Profesor {
  id: string;
  codigo_profesor?: string;
  nombre_completo: string;
  nombre_normalizado: string;
  departamento?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Materia {
  clave: string;
  nombre: string;
  creditos?: number;
  area?: string;
  created_at?: string;
}

export interface Modulo {
  id: string;
  centro_codigo: string;
  codigo_modulo: string;
  nombre?: string;
  created_at?: string;
}

export interface Aula {
  id: string;
  centro_codigo: string;
  modulo_id?: string;
  codigo_aula: string;
  tipo: string;
  capacidad: number;
  created_at?: string;
}

export interface OfertaAcademica {
  id: string;
  ciclo: string;
  nrc: string;
  centro_codigo: string;
  materia_clave: string;
  profesor_id?: string;
  profesor_nombre_original?: string;
  seccion?: string;
  cupo_total?: number;
  cupo_disponible?: number;
  materias?: Materia;
  profesores?: Profesor;
}

export interface SesionHorario {
  id: string;
  oferta_id: string;
  nrc: string;
  ciclo: string;
  dia: 'L' | 'M' | 'I' | 'J' | 'V' | 'S';
  hora_inicio: string;
  hora_fin: string;
  aula_id?: string;
  modulo_texto?: string;
  aula_texto?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  oferta?: OfertaAcademica;
}

export interface AulaLibreResult {
  aula_id: string;
  codigo_aula: string;
  modulo_id?: string;
  codigo_modulo?: string;
  tipo: string;
  capacidad: number;
}
