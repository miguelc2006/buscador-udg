// Supabase Edge Function: sync-oferta-udg
// Sincroniza la oferta académica de la UDG directamente a la base de datos PostgreSQL de Supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CENTRO_A_SIIAU_CUP: Record<string, string> = {
  CUCEI: 'D',
  CUCEA: 'C',
  CUCSH: 'H',
  CUCS: 'J',
  CUAAD: 'A',
  CUCBA: 'B',
  CUTONALA: 'K',
};

function parseCicloToSiiau(cicloUI: string): string {
  const match = cicloUI.match(/^(\d{4})([AB])$/i);
  if (!match) return cicloUI;
  const year = match[1];
  const term = match[2].toUpperCase() === 'A' ? '10' : '20';
  return `${year}${term}`;
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function parseTime(timeStr: string): string {
  const clean = timeStr.trim();
  if (!clean || clean.length !== 4 || !/^\d+$/.test(clean)) {
    return '00:00:00';
  }
  return `${clean.substring(0, 2)}:${clean.substring(2, 4)}:00`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { centro = "CUCEI", ciclo = "2026A", carrera = "" } = await req.json();

    const cup = CENTRO_A_SIIAU_CUP[centro] || centro;
    const ciclop = parseCicloToSiiau(ciclo);

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

    const siiauRes = await fetch("https://siiauescolar.siiau.udg.mx/wal/sspseca.consulta_oferta", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!siiauRes.ok) {
      throw new Error(`SIIAU respondió con estado ${siiauRes.status}`);
    }

    const htmlBuffer = await siiauRes.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-1");
    const html = decoder.decode(htmlBuffer);

    if (html.includes("ORA-01403")) {
      return new Response(JSON.stringify({ message: "No se encontraron clases", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const $ = cheerio.load(html);

    // Asegurar Centro Universitario en DB
    await supabaseClient
      .from("centros_universitarios")
      .upsert({ codigo: centro, nombre: `Centro Universitario ${centro}` }, { onConflict: "codigo" });

    const tableRows = $("table tr");
    let procesados = 0;

    for (let i = 0; i < tableRows.length; i++) {
      const cells = $(tableRows[i]).children("td");
      if (cells.length < 8) continue;

      const nrc = cells.eq(0).text().trim();
      if (!nrc || !/^\d+$/.test(nrc)) continue;

      const clave = cells.eq(1).text().trim();
      const materia = cells.eq(2).text().trim().replace(/\s+/g, " ");
      const seccion = cells.eq(3).text().trim();
      const creditos = parseInt(cells.eq(4).text().trim(), 10) || 0;
      const cupos = parseInt(cells.eq(5).text().trim(), 10) || 0;
      const disponibles = parseInt(cells.eq(6).text().trim(), 10) || 0;

      let profesor = "NO ASIGNADO";
      const profCell = cells.eq(8).find(".tdprofesor");
      if (profCell.length > 0) {
        profesor = profCell.last().text().trim().replace(/\s+/g, " ");
      } else {
        const rawProf = cells.eq(8).text().trim().replace(/\s+/g, " ");
        if (rawProf && !/^\d+$/.test(rawProf)) profesor = rawProf;
      }
      if (profesor.length < 3) profesor = "NO ASIGNADO";
      const profNorm = normalizeText(profesor);

      // 1. Upsert Materia
      if (clave) {
        await supabaseClient.from("materias").upsert(
          { clave, nombre: materia, creditos },
          { onConflict: "clave" }
        );
      }

      // 2. Upsert Profesor
      let profesorId: string | null = null;
      if (profesor !== "NO ASIGNADO") {
        const { data: profData } = await supabaseClient
          .from("profesores")
          .upsert(
            { nombre_completo: profesor, nombre_normalizado: profNorm },
            { onConflict: "nombre_normalizado" }
          )
          .select("id")
          .single();

        if (profData) profesorId = profData.id;
      }

      // 3. Upsert Oferta Académica
      const { data: ofertaData } = await supabaseClient
        .from("oferta_academica")
        .upsert(
          {
            ciclo,
            nrc,
            centro_codigo: centro,
            materia_clave: clave,
            profesor_id: profesorId,
            profesor_nombre_original: profesor,
            seccion,
            cupo_total: cupos,
            cupo_disponible: disponibles,
          },
          { onConflict: "ciclo,nrc" }
        )
        .select("id")
        .single();

      if (ofertaData) {
        // 4. Limpiar y recrear sesiones para este NRC
        await supabaseClient.from("sesiones_horario").delete().eq("oferta_id", ofertaData.id);

        const horarioTable = cells.eq(7).find("table");
        if (horarioTable.length > 0) {
          const sesRows = horarioTable.find("tr");
          for (let j = 0; j < sesRows.length; j++) {
            const sesCells = $(sesRows[j]).find("td");
            if (sesCells.length >= 5) {
              const horaRaw = sesCells.eq(1).text().trim();
              const diasRaw = sesCells.eq(2).text().trim().toUpperCase();
              const modulo = sesCells.eq(3).text().trim().replace(/\s+/g, " ") || "SIN MODULO";
              const aula = sesCells.eq(4).text().trim().replace(/\s+/g, " ") || "SIN AULA";

              const [hIniStr, hFinStr] = horaRaw.split("-");
              const hora_inicio = parseTime(hIniStr || "");
              const hora_fin = parseTime(hFinStr || "");

              // Crear módulo y aula si aplican
              let aulaId: string | null = null;
              if (modulo !== "SIN MODULO") {
                const { data: modData } = await supabaseClient
                  .from("modulos")
                  .upsert({ centro_codigo: centro, codigo_modulo: modulo }, { onConflict: "centro_codigo,codigo_modulo" })
                  .select("id")
                  .single();

                if (modData && aula !== "SIN AULA") {
                  const { data: aulaData } = await supabaseClient
                    .from("aulas")
                    .upsert(
                      { centro_codigo: centro, modulo_id: modData.id, codigo_aula: aula },
                      { onConflict: "centro_codigo,codigo_aula" }
                    )
                    .select("id")
                    .single();
                  if (aulaData) aulaId = aulaData.id;
                }
              }

              for (const dia of diasRaw) {
                if (["L", "M", "I", "J", "V", "S"].includes(dia)) {
                  await supabaseClient.from("sesiones_horario").insert({
                    oferta_id: ofertaData.id,
                    nrc,
                    ciclo,
                    dia,
                    hora_inicio,
                    hora_fin,
                    aula_id: aulaId,
                    modulo_texto: modulo,
                    aula_texto: aula,
                  });
                }
              }
            }
          }
        } else if (cells.length >= 11) {
          // Formato plano (fila directa sin tabla anidada)
          const horaRaw = cells.eq(7).text().trim();
          const diasRaw = cells.eq(8).text().trim().toUpperCase();
          const modulo = cells.eq(9).text().trim().replace(/\s+/g, " ") || "SIN MODULO";
          const aula = cells.eq(10).text().trim().replace(/\s+/g, " ") || "SIN AULA";

          const [hIniStr, hFinStr] = horaRaw.split("-");
          const hora_inicio = parseTime(hIniStr || "");
          const hora_fin = parseTime(hFinStr || "");

          // Crear módulo y aula si aplican
          let aulaId: string | null = null;
          if (modulo !== "SIN MODULO") {
            const { data: modData } = await supabaseClient
              .from("modulos")
              .upsert({ centro_codigo: centro, codigo_modulo: modulo }, { onConflict: "centro_codigo,codigo_modulo" })
              .select("id")
              .single();

            if (modData && aula !== "SIN AULA") {
              const { data: aulaData } = await supabaseClient
                .from("aulas")
                .upsert(
                  { centro_codigo: centro, modulo_id: modData.id, codigo_aula: aula },
                  { onConflict: "centro_codigo,codigo_aula" }
                )
                .select("id")
                .single();
              if (aulaData) aulaId = aulaData.id;
            }
          }

          for (const dia of diasRaw) {
            if (["L", "M", "I", "J", "V", "S"].includes(dia)) {
              await supabaseClient.from("sesiones_horario").insert({
                oferta_id: ofertaData.id,
                nrc,
                ciclo,
                dia,
                hora_inicio,
                hora_fin,
                aula_id: aulaId,
                modulo_texto: modulo,
                aula_texto: aula,
              });
            }
          }
        }
      }

      procesados++;
    }

    return new Response(JSON.stringify({ success: true, centro, ciclo, procesados }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
