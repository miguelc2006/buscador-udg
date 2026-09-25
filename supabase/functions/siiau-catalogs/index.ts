import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let action = url.searchParams.get("action");
    let cup = url.searchParams.get("cup");

    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body.action) action = body.action;
        if (body.cup) cup = body.cup;
      } catch (e) {
        // Ignore JSON parse errors if body is empty
      }
    }

    action = action || "options";

    if (action === "majors") {
      if (!cup) {
        return new Response(JSON.stringify({ error: "El parámetro 'cup' es requerido." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const MAJORS_URL = `https://siiauescolar.siiau.udg.mx/wal/sspseca.lista_carreras?cup=${cup}`;
      const response = await fetch(MAJORS_URL);
      
      if (!response.ok) {
        throw new Error("No se pudo conectar al SIIAU");
      }

      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder("iso-8859-1");
      const html = decoder.decode(buffer);
      
      const $ = cheerio.load(html);
      const majors: { value: string; description: string }[] = [];
      
      $("tr").each((i, row) => {
        if (i === 0) return;
        const cells = $(row).find("td");
        if (cells.length >= 2) {
          const value = $(cells[0]).text().trim();
          const description = $(cells[1]).text().trim();
          if (value) {
            majors.push({ value, description });
          }
        }
      });

      return new Response(JSON.stringify(majors), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } 
    
    if (action === "options") {
      const FORM_URL = "https://siiauescolar.siiau.udg.mx/wal/sspseca.forma_consulta";
      const response = await fetch(FORM_URL);
      
      if (!response.ok) {
        throw new Error("No se pudo conectar al SIIAU");
      }

      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder("iso-8859-1");
      const html = decoder.decode(buffer);
      
      const $ = cheerio.load(html);
      const optionsData: Record<string, { value: string; description: string }[]> = {};
      const importantFields = ["ciclop", "cup"];

      importantFields.forEach(fieldName => {
        const selectTag = $(`select[name="${fieldName}"]`);
        if (selectTag.length) {
          const options: { value: string; description: string }[] = [];
          selectTag.find("option").each((i, option) => {
            const value = $(option).attr("value")?.trim();
            if (value) {
              const fullText = $(option).text().trim().replace(/\s+/g, " ");
              const parts = fullText.split("-");
              const description = parts.length > 1 ? parts.slice(1).join("-").trim() : fullText;
              options.push({ value, description });
            }
          });
          optionsData[fieldName] = options;
        }
      });

      return new Response(JSON.stringify(optionsData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Acción no válida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
