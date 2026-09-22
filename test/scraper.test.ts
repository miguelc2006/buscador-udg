import { describe, it, expect } from 'vitest';
import { normalizeText, parseCicloToSiiau, parseSiiauHtml } from '../src/lib/udg-scraper';

describe('UDG Scraper & Parsing Tests', () => {
  it('normaliza texto eliminando acentos y espacios extra', () => {
    expect(normalizeText('  GARCÍA   PÉREZ, JOSÉ  ')).toBe('GARCIA PEREZ, JOSE');
    expect(normalizeText('Módulo C - Aula 201')).toBe('MODULO C - AULA 201');
  });

  it('convierte ciclos amigables al formato SIIAU', () => {
    expect(parseCicloToSiiau('2026A')).toBe('202610');
    expect(parseCicloToSiiau('2026B')).toBe('202620');
    expect(parseCicloToSiiau('2026V')).toBe('202630');
    expect(parseCicloToSiiau('202610')).toBe('202610');
  });

  it('parsea tablas HTML simuladas de SIIAU correctamente', () => {
    const mockHtml = `
      <html>
        <body>
          <table class="tabla_datos">
            <tr class="cabecera">
              <th>NRC</th><th>Clave</th><th>Materia</th><th>Sec</th><th>Créd</th><th>Cup</th><th>Dis</th>
              <th>Horario</th><th>Días</th><th>Edificio</th><th>Aula</th><th>Profesor</th><th>Fecha</th>
            </tr>
            <tr>
              <td>12345</td>
              <td>I5886</td>
              <td>ESTRUCTURAS DE DATOS</td>
              <td>D01</td>
              <td>8</td>
              <td>35</td>
              <td>5</td>
              <td>0700-0855</td>
              <td>.M.J...</td>
              <td>MOD M</td>
              <td>M201</td>
              <td>HERNANDEZ LOPEZ, JUAN CARLOS</td>
              <td>16/01/2026-25/05/2026</td>
            </tr>
            <tr>
              <td>67890</td>
              <td>I5887</td>
              <td>REDES DE COMPUTADORAS</td>
              <td>D02</td>
              <td>8</td>
              <td>30</td>
              <td>0</td>
              <td>0900-1055</td>
              <td>L.M.V..</td>
              <td>MOD F</td>
              <td>F102</td>
              <td>MARTINEZ RIVERA, ANA LAURA</td>
              <td>16/01/2026-25/05/2026</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const result = parseSiiauHtml(mockHtml, 'CUCEI', '2026A');

    expect(result.ofertas).toHaveLength(2);
    expect(result.profesoresUnicos).toHaveLength(2);
    expect(result.materiasUnicas).toHaveLength(2);
    expect(result.modulosUnicos).toHaveLength(2);
    expect(result.aulasUnicas).toHaveLength(2);

    // Validar primera oferta
    const primeraOferta = result.ofertas[0];
    expect(primeraOferta.nrc).toBe('12345');
    expect(primeraOferta.clave_materia).toBe('I5886');
    expect(primeraOferta.seccion).toBe('D01');
    expect(primeraOferta.cupo_total).toBe(35);
    expect(primeraOferta.cupo_disponible).toBe(5);
    expect(primeraOferta.profesor_nombre).toBe('HERNANDEZ LOPEZ, JUAN CARLOS');
    expect(primeraOferta.sesiones).toHaveLength(2); // Martes y Jueves
    expect(primeraOferta.sesiones[0].dia).toBe('M');
    expect(primeraOferta.sesiones[0].hora_inicio).toBe('07:00:00');
    expect(primeraOferta.sesiones[0].hora_fin).toBe('08:55:00');
    expect(primeraOferta.sesiones[0].modulo).toBe('MOD M');
    expect(primeraOferta.sesiones[0].aula).toBe('M201');

    // Validar segunda oferta
    const segundaOferta = result.ofertas[1];
    expect(segundaOferta.sesiones).toHaveLength(3); // Lunes, Miércoles (I en SIIAU), Viernes
    expect(segundaOferta.sesiones[0].dia).toBe('L');
    expect(segundaOferta.sesiones[1].dia).toBe('M');
    expect(segundaOferta.sesiones[2].dia).toBe('V');
  });
});
