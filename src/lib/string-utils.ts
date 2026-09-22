/**
 * Normaliza cadenas de texto eliminando acentos, diacríticos y espacios duplicados.
 * Apto para ejecución tanto en navegador como en Node/Deno.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}
