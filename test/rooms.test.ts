import { describe, it, expect } from 'vitest';
import {
  haySolapamientoHorario,
  calcularDisponibilidadAula,
  SesionConDetalles,
} from '../src/lib/schedule-utils';
import { searchMockFreeRooms } from '../src/services/rooms';

describe('Cálculo de Colisiones y Disponibilidad de Aulas', () => {
  it('detecta solapamiento cuando dos intervalos se cruzan', () => {
    // 07:00 - 09:00 cruza con 08:00 - 10:00
    expect(haySolapamientoHorario('07:00', '09:00', '08:00', '10:00')).toBe(true);

    // 09:00 - 11:00 contiene a 09:30 - 10:30
    expect(haySolapamientoHorario('09:00', '11:00', '09:30', '10:30')).toBe(true);

    // 08:00 - 10:00 es igual a 08:00 - 10:00
    expect(haySolapamientoHorario('08:00', '10:00', '08:00', '10:00')).toBe(true);
  });

  it('no detecta solapamiento cuando los intervalos son contiguos o separados', () => {
    // Clases contiguas: termina 08:55 y la siguiente inicia 08:55
    expect(haySolapamientoHorario('07:00', '08:55', '08:55', '10:55')).toBe(false);

    // Intervalos completamente separados
    expect(haySolapamientoHorario('07:00', '08:55', '11:00', '13:00')).toBe(false);
    expect(haySolapamientoHorario('15:00', '17:00', '09:00', '11:00')).toBe(false);
  });

  it('determina que un aula está libre si no tiene sesiones ese día', () => {
    const sesiones: SesionConDetalles[] = [
      {
        id: 's-1',
        dia: 'M',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'FÍSICA',
      },
    ];

    // Consultamos el Lunes
    const disponibilidad = calcularDisponibilidadAula(
      sesiones,
      'L',
      '07:00:00',
      '09:00:00'
    );

    expect(disponibilidad.disponible).toBe(true);
    expect(disponibilidad.sesionConflicto).toBeUndefined();
  });

  it('determina que un aula está ocupada si hay colisión horaria', () => {
    const sesiones: SesionConDetalles[] = [
      {
        id: 's-1',
        dia: 'L',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        materia_nombre: 'ESTRUCTURAS DE DATOS',
      },
    ];

    // Consultamos el Lunes en rango 08:00 - 10:00 (se cruza con 07:00 - 08:55)
    const disponibilidad = calcularDisponibilidadAula(
      sesiones,
      'L',
      '08:00:00',
      '10:00:00'
    );

    expect(disponibilidad.disponible).toBe(false);
    expect(disponibilidad.sesionConflicto?.id).toBe('s-1');
  });

  it('calcula la próxima ocupación del aula para el día de consulta', () => {
    const sesiones: SesionConDetalles[] = [
      {
        id: 's-1',
        dia: 'L',
        hora_inicio: '13:00:00',
        hora_fin: '14:55:00',
        materia_nombre: 'ALGEBRA LINEAL',
      },
    ];

    // Consultamos Lunes en la mañana (09:00 - 11:00) -> Libre, próxima ocupación a las 13:00
    const disponibilidad = calcularDisponibilidadAula(
      sesiones,
      'L',
      '09:00:00',
      '11:00:00'
    );

    expect(disponibilidad.disponible).toBe(true);
    expect(disponibilidad.proximaOcupacionHoy?.materia_nombre).toBe('ALGEBRA LINEAL');
    expect(disponibilidad.minutosParaProxima).toBe(120); // 13:00 - 11:00 = 120 mins
  });
});

describe('Servicio de Búsqueda de Aulas Libres (searchMockFreeRooms)', () => {
  it('encuentra aulas desocupadas en el rango matutino', () => {
    const resultados = searchMockFreeRooms({
      centro: 'CUCEI',
      ciclo: '2026A',
      dia: 'L',
      horaInicio: '09:00',
      horaFin: '11:00',
    });

    expect(resultados.length).toBeGreaterThan(0);
    // M202 no tiene sesiones asignadas, debe estar libre
    const m202 = resultados.find((r) => r.codigo_aula === 'M202');
    expect(m202).toBeDefined();
    expect(m202?.disponible).toBe(true);
  });

  it('excluye aulas que tienen clases en el horario consultado', () => {
    // M101 tiene clase Lunes 07:00 a 08:55
    const resultados = searchMockFreeRooms({
      centro: 'CUCEI',
      ciclo: '2026A',
      dia: 'L',
      horaInicio: '07:00',
      horaFin: '08:00',
    });

    const m101 = resultados.find((r) => r.codigo_aula === 'M101');
    expect(m101).toBeUndefined(); // Debe estar excluida por ocupada
  });

  it('filtra correctamente por módulo', () => {
    const resultados = searchMockFreeRooms({
      centro: 'CUCEI',
      ciclo: '2026A',
      dia: 'V',
      horaInicio: '15:00',
      horaFin: '17:00',
      moduloId: 'MOD M',
    });

    expect(resultados.every((r) => r.codigo_modulo === 'MOD M')).toBe(true);
  });

  it('filtra correctamente por tipo de aula (Laboratorio)', () => {
    const resultados = searchMockFreeRooms({
      centro: 'CUCEI',
      ciclo: '2026A',
      dia: 'V',
      horaInicio: '15:00',
      horaFin: '17:00',
      tipo: 'Laboratorio',
    });

    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.every((r) => r.tipo.toLowerCase() === 'laboratorio')).toBe(true);
  });

  it('filtra por búsqueda de texto de aula', () => {
    const resultados = searchMockFreeRooms({
      centro: 'CUCEI',
      ciclo: '2026A',
      dia: 'M',
      horaInicio: '09:00',
      horaFin: '11:00',
      query: 'comp',
    });

    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.some((r) => r.codigo_aula.includes('COMP'))).toBe(true);
  });
});
