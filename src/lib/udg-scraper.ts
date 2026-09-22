import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { normalizeText } from './string-utils';

export { normalizeText };

export const SIIAU_OFERTA_URL = 'https://siiauescolar.siiau.udg.mx/wal/sspseca.consulta_oferta';

// Mapeo de códigos de centro institucionales a códigos de parámetro en SIIAU (cup)
export const CENTRO_A_SIIAU_CUP: Record<string, string> = {
  CUCEI: 'D',
  CUCEA: 'C',
  CUCSH: 'H',
  CUCS: 'J',
  CUAAD: 'A',
  CUCBA: 'B',
  CUTONALA: 'K',
  CUVALLLES: 'V',
  CUSUR: 'S',
  CUCIENEGA: 'G',
  CUCOSTA: 'O',
  CULAGOS: 'L',
  CUALTOS: 'T',
  CUNORTE: 'N',
  SUV: 'U',
};

// Conversión de formato ciclo de UI (ej: "2026A", "2025B", "2026V") a formato SIIAU ("202610", "202520", "202630")
export function parseCicloToSiiau(cicloUI: string): string {
  const match = cicloUI.match(/^(\d{4})([ABV])$/i);
  if (!match) return cicloUI;
  const year = match[1];
  const letter = match[2].toUpperCase();
  const term = letter === 'A' ? '10' : letter === 'B' ? '20' : '30';
  return `${year}${term}`;
}

export function parseCicloFromSiiau(cicloSiiau: string): string {
  if (cicloSiiau.length === 6) {
    const year = cicloSiiau.substring(0, 4);
    const suffix = cicloSiiau.substring(4);
    const term = suffix === '10' ? 'A' : suffix === '20' ? 'B' : suffix === '30' ? 'V' : suffix;
    return `${year}${term}`;
  }
  return cicloSiiau;
}

export function parseTime(timeStr: string): string {
  const clean = timeStr.trim();
  if (!clean || clean.length !== 4 || !/^\d+$/.test(clean)) {
    return '00:00:00';
  }
  return `${clean.substring(0, 2)}:${clean.substring(2, 4)}:00`;
}

export interface ParsedSesion {
  dia: 'L' | 'M' | 'I' | 'J' | 'V' | 'S';
  hora_inicio: string;
  hora_fin: string;
  modulo: string;
  aula: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface ParsedItemOferta {
  nrc: string;
  clave_materia: string;
  nombre_materia: string;
  seccion: string;
  creditos: number;
  cupo_total: number;
  cupo_disponible: number;
  profesor_nombre: string;
  profesor_normalizado: string;
  sesiones: ParsedSesion[];
}

export interface ScraperResult {
  centro_codigo: string;
  ciclo: string;
  ofertas: ParsedItemOferta[];
  profesoresUnicos: Array<{ nombre: string; nombre_normalizado: string }>;
  materiasUnicas: Array<{ clave: string; nombre: string; creditos: number }>;
  modulosUnicos: string[];
  aulasUnicas: Array<{ modulo: string; codigo_aula: string }>;
}

/**
 * Parsea el HTML de la respuesta de SIIAU Consulta Oferta
 */
export function parseSiiauHtml(
  htmlString: string,
  centroCodigo: string,
  cicloUI: string
): ScraperResult {
  const $ = cheerio.load(htmlString);
  const ofertas: ParsedItemOferta[] = [];

  const profesoresMap = new Map<string, { nombre: string; nombre_normalizado: string }>();
  const materiasMap = new Map<string, { clave: string; nombre: string; creditos: number }>();
  const modulosSet = new Set<string>();
  const aulasMap = new Map<string, { modulo: string; codigo_aula: string }>();

  $('table tr').each((_, row) => {
    const cells = $(row).children('td');
    if (cells.length < 8) return;

    const nrc = cells.eq(0).text().trim();
    if (!nrc || !/^\d+$/.test(nrc)) return; // Ignora encabezados

    const clave = cells.eq(1).text().trim();
    const materia = cells.eq(2).text().trim().replace(/\s+/g, ' ');
    const seccion = cells.eq(3).text().trim();
    const creditos = parseInt(cells.eq(4).text().trim(), 10) || 0;
    const cupos = parseInt(cells.eq(5).text().trim(), 10) || 0;
    const disponibles = parseInt(cells.eq(6).text().trim(), 10) || 0;

    // Obtener Profesor
    let profesor = 'NO ASIGNADO';
    const profCell = cells.eq(8).find('.tdprofesor');
    if (profCell.length > 0) {
      profesor = profCell.last().text().trim().replace(/\s+/g, ' ');
    } else if (cells.length >= 12 && cells.eq(11).text().trim()) {
      // Formato plano extendido
      profesor = cells.eq(11).text().trim().replace(/\s+/g, ' ');
    } else {
      const rawProf = cells.eq(8).text().trim().replace(/\s+/g, ' ');
      if (rawProf && !/^\d+$/.test(rawProf)) {
        profesor = rawProf;
      }
    }

    if (profesor.length < 3) profesor = 'NO ASIGNADO';

    const profesorNormalizado = normalizeText(profesor);

    if (profesor !== 'NO ASIGNADO' && !profesoresMap.has(profesorNormalizado)) {
      profesoresMap.set(profesorNormalizado, {
        nombre: profesor,
        nombre_normalizado: profesorNormalizado,
      });
    }

    if (clave && !materiasMap.has(clave)) {
      materiasMap.set(clave, {
        clave,
        nombre: materia,
        creditos,
      });
    }

    // Parsear tabla interna de horarios o celdas planas
    const sesiones: ParsedSesion[] = [];
    const horarioTable = cells.eq(7).find('table');

    if (horarioTable.length > 0) {
      horarioTable.find('tr').each((_, sesRow) => {
        const sesCells = $(sesRow).find('td');
        if (sesCells.length >= 5) {
          const horaRaw = sesCells.eq(1).text().trim();
          const diasRaw = sesCells.eq(2).text().trim().toUpperCase();
          const modulo = sesCells.eq(3).text().trim().replace(/\s+/g, ' ') || 'SIN MODULO';
          const aula = sesCells.eq(4).text().trim().replace(/\s+/g, ' ') || 'SIN AULA';

          let fechaIni: string | undefined;
          let fechaFin: string | undefined;
          if (sesCells.length >= 6) {
            const fechaRaw = sesCells.eq(5).text().trim();
            const fechaParts = fechaRaw.split('-');
            if (fechaParts.length === 2) {
              fechaIni = fechaParts[0].trim();
              fechaFin = fechaParts[1].trim();
            }
          }

          if (modulo !== 'SIN MODULO') {
            modulosSet.add(modulo);
          }

          if (aula !== 'SIN AULA') {
            const aulaKey = `${modulo}__${aula}`;
            if (!aulasMap.has(aulaKey)) {
              aulasMap.set(aulaKey, { modulo, codigo_aula: aula });
            }
          }

          const [hIniStr, hFinStr] = horaRaw.split('-');
          const hora_inicio = parseTime(hIniStr || '');
          const hora_fin = parseTime(hFinStr || '');

          const validDays: Array<'L' | 'M' | 'I' | 'J' | 'V' | 'S'> = ['L', 'M', 'I', 'J', 'V', 'S'];
          for (const char of diasRaw) {
            const diaTyped = char as 'L' | 'M' | 'I' | 'J' | 'V' | 'S';
            if (validDays.includes(diaTyped)) {
              sesiones.push({
                dia: diaTyped,
                hora_inicio,
                hora_fin,
                modulo,
                aula,
                fecha_inicio: fechaIni,
                fecha_fin: fechaFin,
              });
            }
          }
        }
      });
    } else if (cells.length >= 11) {
      // Formato plano (fila directa sin tabla anidada)
      const horaRaw = cells.eq(7).text().trim();
      const diasRaw = cells.eq(8).text().trim().toUpperCase();
      const modulo = cells.eq(9).text().trim().replace(/\s+/g, ' ') || 'SIN MODULO';
      const aula = cells.eq(10).text().trim().replace(/\s+/g, ' ') || 'SIN AULA';

      let fechaIni: string | undefined;
      let fechaFin: string | undefined;
      if (cells.length >= 13) {
        const fechaRaw = cells.eq(12).text().trim();
        const fechaParts = fechaRaw.split('-');
        if (fechaParts.length === 2) {
          fechaIni = fechaParts[0].trim();
          fechaFin = fechaParts[1].trim();
        }
      }

      if (modulo !== 'SIN MODULO') {
        modulosSet.add(modulo);
      }

      if (aula !== 'SIN AULA') {
        const aulaKey = `${modulo}__${aula}`;
        if (!aulasMap.has(aulaKey)) {
          aulasMap.set(aulaKey, { modulo, codigo_aula: aula });
        }
      }

      const [hIniStr, hFinStr] = horaRaw.split('-');
      const hora_inicio = parseTime(hIniStr || '');
      const hora_fin = parseTime(hFinStr || '');

      const validDays: Array<'L' | 'M' | 'I' | 'J' | 'V' | 'S'> = ['L', 'M', 'I', 'J', 'V', 'S'];
      for (const char of diasRaw) {
        const diaTyped = char as 'L' | 'M' | 'I' | 'J' | 'V' | 'S';
        if (validDays.includes(diaTyped)) {
          sesiones.push({
            dia: diaTyped,
            hora_inicio,
            hora_fin,
            modulo,
            aula,
            fecha_inicio: fechaIni,
            fecha_fin: fechaFin,
          });
        }
      }
    }

    ofertas.push({
      nrc,
      clave_materia: clave,
      nombre_materia: materia,
      seccion,
      creditos,
      cupo_total: cupos,
      cupo_disponible: disponibles,
      profesor_nombre: profesor,
      profesor_normalizado: profesorNormalizado,
      sesiones,
    });
  });

  return {
    centro_codigo: centroCodigo,
    ciclo: cicloUI,
    ofertas,
    profesoresUnicos: Array.from(profesoresMap.values()),
    materiasUnicas: Array.from(materiasMap.values()),
    modulosUnicos: Array.from(modulosSet.values()),
    aulasUnicas: Array.from(aulasMap.values()),
  };
}

/**
 * Consulta la oferta académica a SIIAU por HTTP POST
 */
export async function fetchOfertaSiiau(
  centroCodigo: string,
  cicloUI: string,
  carrera: string = ''
): Promise<ScraperResult> {
  const cup = CENTRO_A_SIIAU_CUP[centroCodigo] || centroCodigo;
  const ciclop = parseCicloToSiiau(cicloUI);

  const bodyParams = new URLSearchParams({
    ciclop,
    cup,
    majrp: carrera,
    mostrarp: '2000',
    crsep: '',
    materiap: '',
    horaip: '',
    horafp: '',
    edifp: '',
    aulap: '',
    ordenp: '0',
  });

  const response = await fetch(SIIAU_OFERTA_URL, {
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    throw new Error(`Error en respuesta SIIAU: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const html = iconv.decode(Buffer.from(arrayBuffer), 'iso-8859-1');

  if (html.includes('ORA-01403') || html.includes('No se encontraron clases')) {
    return {
      centro_codigo: centroCodigo,
      ciclo: cicloUI,
      ofertas: [],
      profesoresUnicos: [],
      materiasUnicas: [],
      modulosUnicos: [],
      aulasUnicas: [],
    };
  }

  return parseSiiauHtml(html, centroCodigo, cicloUI);
}
