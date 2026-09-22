import { describe, it, expect } from 'vitest';
import {
  getDiaSiiau,
  timeToMinutes,
  formatTime,
  calcularEstadoProfesor,
  SesionConDetalles,
} from '../src/lib/schedule-utils';

describe('Schedule Utilities Tests', () => {
  it('convierte Date al código de día SIIAU correspondiente', () => {
    // 2026-09-21 fue Lunes (1) -> L
    const lunes = new Date(2026, 8, 21);
    expect(getDiaSiiau(lunes)).toBe('L');

    // 2026-09-22 fue Martes (2) -> M
    const martes = new Date(2026, 8, 22);
    expect(getDiaSiiau(martes)).toBe('M');

    // 2026-09-23 fue Miércoles (3) -> I
    const miercoles = new Date(2026, 8, 23);
    expect(getDiaSiiau(miercoles)).toBe('I');

    // 2026-09-24 fue Jueves (4) -> J
    const jueves = new Date(2026, 8, 24);
    expect(getDiaSiiau(jueves)).toBe('J');

    // 2026-09-25 fue Viernes (5) -> V
    const viernes = new Date(2026, 8, 25);
    expect(getDiaSiiau(viernes)).toBe('V');

    // 2026-09-26 fue Sábado (6) -> S
    const sabado = new Date(2026, 8, 26);
    expect(getDiaSiiau(sabado)).toBe('S');

    // 2026-09-27 fue Domingo (0) -> null
    const domingo = new Date(2026, 8, 27);
    expect(getDiaSiiau(domingo)).toBeNull();
  });

  it('formatea y calcula minutos desde medianoche', () => {
    expect(timeToMinutes('07:00:00')).toBe(420);
    expect(timeToMinutes('08:55:00')).toBe(535);
    expect(timeToMinutes('14:30:00')).toBe(870);
    expect(formatTime('07:00:00')).toBe('07:00');
    expect(formatTime('15:45:00')).toBe('15:45');
  });

  it('detecta correctamente cuando un profesor está en clase activa', () => {
    const sesiones: SesionConDetalles[] = [
      {
        id: '1',
        oferta_id: 'o1',
        nrc: '12345',
        ciclo: '2026A',
        dia: 'M', // Martes
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        modulo_texto: 'MOD M',
        aula_texto: 'M201',
        materia_nombre: 'ESTRUCTURAS DE DATOS',
      },
    ];

    // Simular un Martes a las 07:30 AM
    const martesEnClase = new Date(2026, 8, 22, 7, 30, 0);
    const estado = calcularEstadoProfesor(sesiones, martesEnClase);

    expect(estado.enClase).toBe(true);
    expect(estado.sesionActual).toBeDefined();
    expect(estado.sesionActual?.materia_nombre).toBe('ESTRUCTURAS DE DATOS');
    expect(estado.sesionActual?.aula_texto).toBe('M201');
    expect(estado.sesionActual?.modulo_texto).toBe('MOD M');
  });

  it('detecta correctamente cuando el profesor NO está en clase pero tiene una más tarde', () => {
    const sesiones: SesionConDetalles[] = [
      {
        id: '1',
        oferta_id: 'o1',
        nrc: '12345',
        ciclo: '2026A',
        dia: 'M', // Martes
        hora_inicio: '11:00:00',
        hora_fin: '12:55:00',
        modulo_texto: 'MOD F',
        aula_texto: 'F102',
        materia_nombre: 'ALGORITMOS AVANZADOS',
      },
    ];

    // Simular un Martes a las 10:00 AM (1 hora antes)
    const martesAntesClase = new Date(2026, 8, 22, 10, 0, 0);
    const estado = calcularEstadoProfesor(sesiones, martesAntesClase);

    expect(estado.enClase).toBe(false);
    expect(estado.proximaSesionHoy).toBeDefined();
    expect(estado.proximaSesionHoy?.materia_nombre).toBe('ALGORITMOS AVANZADOS');
    expect(estado.minutosParaProxima).toBe(60); // 60 minutos faltantes
  });

  it('retorna enClase: false cuando es fin de semana o no hay clases hoy', () => {
    const sesiones: SesionConDetalles[] = [
      {
        id: '1',
        oferta_id: 'o1',
        nrc: '12345',
        ciclo: '2026A',
        dia: 'L', // Lunes
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        modulo_texto: 'MOD M',
        aula_texto: 'M201',
      },
    ];

    // Domingo
    const domingo = new Date(2026, 8, 27, 8, 0, 0);
    const estado = calcularEstadoProfesor(sesiones, domingo);
    expect(estado.enClase).toBe(false);
    expect(estado.sesionActual).toBeUndefined();
    expect(estado.proximaSesionHoy).toBeUndefined();
  });
});
