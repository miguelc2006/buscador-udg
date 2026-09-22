export type DiaSiiau = 'L' | 'M' | 'I' | 'J' | 'V' | 'S';

export const DIAS_MAP: Record<DiaSiiau, string> = {
  L: 'Lunes',
  M: 'Martes',
  I: 'Miércoles',
  J: 'Jueves',
  V: 'Viernes',
  S: 'Sábado',
};

export const DIAS_ORDEN: DiaSiiau[] = ['L', 'M', 'I', 'J', 'V', 'S'];

/**
 * Obtiene el código de día SIIAU para un objeto Date (o fecha actual por defecto)
 */
export function getDiaSiiau(date: Date = new Date()): DiaSiiau | null {
  const dayIndex = date.getDay(); // 0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado
  switch (dayIndex) {
    case 1:
      return 'L';
    case 2:
      return 'M';
    case 3:
      return 'I';
    case 4:
      return 'J';
    case 5:
      return 'V';
    case 6:
      return 'S';
    default:
      return null;
  }
}

/**
 * Formatea una hora HH:MM:SS o HH:MM a formato de 12 o 24 horas legible
 */
export function formatTime(timeStr: string): string {
  if (!timeStr) return '--:--';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parts[0].padStart(2, '0');
  const minutes = parts[1].padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Convierte una hora "HH:MM:SS" o "HH:MM" a minutos transcurridos desde medianoche
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  return h * 60 + m;
}

export interface SesionConDetalles {
  id: string;
  dia: DiaSiiau;
  hora_inicio: string;
  hora_fin: string;
  oferta_id?: string;
  nrc?: string;
  ciclo?: string;
  modulo_id?: string;
  aula_id?: string;
  modulo_texto?: string;
  aula_texto?: string;
  materia_nombre?: string;
  materia_clave?: string;
  seccion?: string;
  profesor_nombre?: string;
}

export interface EstadoProfesor {
  enClase: boolean;
  sesionActual?: SesionConDetalles;
  proximaSesionHoy?: SesionConDetalles;
  minutosParaProxima?: number;
}

/**
 * Calcula el estado de actividad del profesor para una fecha/hora dada
 */
export function calcularEstadoProfesor(
  sesiones: SesionConDetalles[],
  ahora: Date = new Date()
): EstadoProfesor {
  if (!sesiones || sesiones.length === 0) {
    return { enClase: false };
  }

  const diaHoy = getDiaSiiau(ahora);
  if (!diaHoy) {
    return { enClase: false };
  }

  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  // Filtrar sesiones del día de hoy
  const sesionesHoy = sesiones.filter((s) => s.dia === diaHoy);

  // 1. Buscar si hay una sesión activa en este momento
  const sesionActiva = sesionesHoy.find((s) => {
    const inicio = timeToMinutes(s.hora_inicio);
    const fin = timeToMinutes(s.hora_fin);
    return minutosAhora >= inicio && minutosAhora < fin;
  });

  if (sesionActiva) {
    return {
      enClase: true,
      sesionActual: sesionActiva,
    };
  }

  // 2. Buscar próxima sesión el día de hoy
  const proximasHoy = sesionesHoy
    .filter((s) => timeToMinutes(s.hora_inicio) > minutosAhora)
    .sort((a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio));

  if (proximasHoy.length > 0) {
    const proxima = proximasHoy[0];
    const minutosPara = timeToMinutes(proxima.hora_inicio) - minutosAhora;
    return {
      enClase: false,
      proximaSesionHoy: proxima,
      minutosParaProxima: minutosPara,
    };
  }

  return {
    enClase: false,
  };
}

/**
 * Determina si dos intervalos de tiempo se solapan
 */
export function haySolapamientoHorario(
  inicioA: string,
  finA: string,
  inicioB: string,
  finB: string
): boolean {
  const minInicioA = timeToMinutes(inicioA);
  const minFinA = timeToMinutes(finA);
  const minInicioB = timeToMinutes(inicioB);
  const minFinB = timeToMinutes(finB);

  return minInicioA < minFinB && minFinA > minInicioB;
}

export interface EstadoOcupacionAula {
  disponible: boolean;
  sesionConflicto?: SesionConDetalles;
  proximaOcupacionHoy?: SesionConDetalles;
  minutosParaProxima?: number;
}

/**
 * Determina la disponibilidad de un aula para un día y rango horario dado
 */
export function calcularDisponibilidadAula(
  sesiones: SesionConDetalles[],
  dia: DiaSiiau,
  horaInicio: string,
  horaFin: string
): EstadoOcupacionAula {
  const sesionesDia = (sesiones || []).filter((s) => s.dia === dia);

  // Buscar si hay colisión en el rango especificado
  const conflicto = sesionesDia.find((s) =>
    haySolapamientoHorario(s.hora_inicio, s.hora_fin, horaInicio, horaFin)
  );

  if (conflicto) {
    return {
      disponible: false,
      sesionConflicto: conflicto,
    };
  }

  // Buscar próxima sesión a partir de la hora de fin consultada (o hora actual)
  const minFinConsulta = timeToMinutes(horaFin);
  const proximas = sesionesDia
    .filter((s) => timeToMinutes(s.hora_inicio) >= minFinConsulta)
    .sort((a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio));

  if (proximas.length > 0) {
    const proxima = proximas[0];
    const minutosPara = timeToMinutes(proxima.hora_inicio) - minFinConsulta;
    return {
      disponible: true,
      proximaOcupacionHoy: proxima,
      minutosParaProxima: minutosPara,
    };
  }

  return {
    disponible: true,
  };
}
