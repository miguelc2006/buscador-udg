import { describe, it, expect } from 'vitest';
import {
  estimarCohorteGeneracion,
  calcularEstadoGrupo,
  SesionConDetalles,
} from '../src/lib/schedule-utils';
import {
  getCarreras,
} from '../src/services/groups';

describe('Localizador de Grupos y Estimador de Generaciones (T-06)', () => {
  describe('Cálculo de Cohorte y Generación', () => {
    it('debe estimar correctamente el ciclo de ingreso para Semestre 1 en ciclo 2026B', () => {
      const cohorte = estimarCohorteGeneracion(1, '2026B', 8);
      expect(cohorte.cicloIngreso).toBe('2026B');
      expect(cohorte.semestre).toBe(1);
      expect(cohorte.cicloEgresoEstimado).toBe('2030A');
      expect(cohorte.etiquetaGeneracion).toContain('2026B - 2030A');
    });

    it('debe retroceder los semestres correspondientes para calcular el ingreso', () => {
      // Semestre 3 en 2026B: 2 semestres atrás -> 2026A -> 2025B
      const cohorte = estimarCohorteGeneracion(3, '2026B', 8);
      expect(cohorte.cicloIngreso).toBe('2025B');
      expect(cohorte.cicloEgresoEstimado).toBe('2029A');
    });

    it('debe calcular adecuadamente las cohortes que ingresaron en ciclo A', () => {
      // Semestre 2 en 2026A: 1 semestre atrás -> 2025B
      const cohorte = estimarCohorteGeneracion(2, '2026A', 8);
      expect(cohorte.cicloIngreso).toBe('2025B');
    });
  });

  describe('Cálculo de Estado en Vivo del Grupo', () => {
    const sesionesGrupo: SesionConDetalles[] = [
      {
        id: 's-1',
        dia: 'L',
        hora_inicio: '07:00:00',
        hora_fin: '08:55:00',
        modulo_texto: 'MOD M',
        aula_texto: 'M101',
        materia_nombre: 'PROGRAMACIÓN ESTRUCTURADA',
        seccion: 'D01',
      },
      {
        id: 's-2',
        dia: 'L',
        hora_inicio: '09:00:00',
        hora_fin: '10:55:00',
        modulo_texto: 'MOD C',
        aula_texto: 'C201',
        materia_nombre: 'CÁLCULO DIFERENCIAL',
        seccion: 'D01',
      },
    ];

    it('debe detectar cuando el grupo está en clase activa', () => {
      // Lunes a las 07:30
      const fechaLunes730 = new Date(2026, 8, 21, 7, 30); // 21 sept 2026 = Lunes
      const estado = calcularEstadoGrupo(sesionesGrupo, fechaLunes730);

      expect(estado.enClase).toBe(true);
      expect(estado.sesionActual).toBeDefined();
      expect(estado.sesionActual?.materia_nombre).toBe('PROGRAMACIÓN ESTRUCTURADA');
      expect(estado.sesionActual?.aula_texto).toBe('M101');
    });

    it('debe detectar la próxima clase durante un hueco o antes de entrar', () => {
      // Lunes a las 06:30 (30 min antes de la primera clase)
      const fechaLunes630 = new Date(2026, 8, 21, 6, 30);
      const estado = calcularEstadoGrupo(sesionesGrupo, fechaLunes630);

      expect(estado.enClase).toBe(false);
      expect(estado.proximaSesionHoy).toBeDefined();
      expect(estado.proximaSesionHoy?.materia_nombre).toBe('PROGRAMACIÓN ESTRUCTURADA');
      expect(estado.minutosParaProxima).toBe(30);
    });

    it('debe reportar libre el resto del día tras terminar todas las clases', () => {
      // Lunes a las 12:00
      const fechaLunes1200 = new Date(2026, 8, 21, 12, 0);
      const estado = calcularEstadoGrupo(sesionesGrupo, fechaLunes1200);

      expect(estado.enClase).toBe(false);
      expect(estado.libreElRestoDelDia).toBe(true);
    });
  });

  describe('Catálogo y Búsqueda de Grupos', () => {
    it('debe filtrar carreras por Centro Universitario', () => {
      const cucei = getCarreras('CUCEI');
      expect(cucei.some((c) => c.codigo === 'INCO')).toBe(true);
      expect(cucei.some((c) => c.codigo === 'LCP')).toBe(false);

      const cucea = getCarreras('CUCEA');
      expect(cucea.some((c) => c.codigo === 'LCP')).toBe(true);
      expect(cucea.some((c) => c.codigo === 'INCO')).toBe(false);
    });
  });
});
