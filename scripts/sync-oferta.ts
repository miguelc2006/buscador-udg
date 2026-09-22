/**
 * Script CLI de Sincronización Masiva de Oferta Académica UDG -> Supabase
 * Ejecución: npm run sync -- --centro=CUCEI --ciclo=2026A
 */

import { createClient } from '@supabase/supabase-js';
import { fetchOfertaSiiau, ParsedItemOferta } from '../src/lib/udg-scraper';
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env.local o .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Configura VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o VITE_SUPABASE_ANON_KEY) en .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Obtener argumentos CLI
const args = process.argv.slice(2);
const centroArg = args.find((a) => a.startsWith('--centro='))?.split('=')[1] || 'CUCEI';
const cicloArg = args.find((a) => a.startsWith('--ciclo='))?.split('=')[1] || '2026A';
const carreraArg = args.find((a) => a.startsWith('--carrera='))?.split('=')[1] || '';

async function runSync() {
  console.log(`\n======================================================`);
  console.log(`🚀 INICIANDO SINCRONIZACIÓN DE OFERTA ACADÉMICA UDG`);
  console.log(`   Centro: ${centroArg} | Ciclo: ${cicloArg} | Carrera: ${carreraArg || 'Todas'}`);
  console.log(`======================================================\n`);

  try {
    console.log(`📡 Consultando oferta a SIIAU...`);
    const result = await fetchOfertaSiiau(centroArg, cicloArg, carreraArg);

    console.log(`✅ Consulta exitosa:`);
    console.log(`   - Secciones/NRCs: ${result.ofertas.length}`);
    console.log(`   - Profesores únicos: ${result.profesoresUnicos.length}`);
    console.log(`   - Materias únicas: ${result.materiasUnicas.length}`);
    console.log(`   - Módulos detectados: ${result.modulosUnicos.length}`);
    console.log(`   - Aulas detectadas: ${result.aulasUnicas.length}\n`);

    if (result.ofertas.length === 0) {
      console.log(`⚠️ No se encontraron materias para los filtros seleccionados.`);
      return;
    }

    // 1. Asegurar Centro Universitario
    console.log(`🏢 Sincronizando Centro Universitario...`);
    await supabase
      .from('centros_universitarios')
      .upsert(
        { codigo: centroArg, nombre: `Centro Universitario ${centroArg}` },
        { onConflict: 'codigo' }
      );

    // 2. Sincronizar Materias en Batch
    console.log(`📚 Sincronizando ${result.materiasUnicas.length} materias...`);
    for (let i = 0; i < result.materiasUnicas.length; i += 100) {
      const batch = result.materiasUnicas.slice(i, i + 100).map((m) => ({
        clave: m.clave,
        nombre: m.nombre,
        creditos: m.creditos,
      }));
      await supabase.from('materias').upsert(batch, { onConflict: 'clave' });
    }

    // 3. Sincronizar Profesores en Batch
    console.log(`👨🏫 Sincronizando ${result.profesoresUnicos.length} profesores...`);
    for (let i = 0; i < result.profesoresUnicos.length; i += 100) {
      const batch = result.profesoresUnicos.slice(i, i + 100).map((p) => ({
        nombre_completo: p.nombre,
        nombre_normalizado: p.nombre_normalizado,
      }));
      await supabase
        .from('profesores')
        .upsert(batch, { onConflict: 'nombre_normalizado' });
    }

    // 4. Sincronizar Módulos y Aulas
    console.log(`🏛️ Sincronizando ${result.modulosUnicos.length} módulos...`);
    const modulosMap = new Map<string, string>(); // modulo_codigo -> uuid

    for (const mod of result.modulosUnicos) {
      const { data } = await supabase
        .from('modulos')
        .upsert(
          { centro_codigo: centroArg, codigo_modulo: mod },
          { onConflict: 'centro_codigo,codigo_modulo' }
        )
        .select('id, codigo_modulo')
        .single();

      if (data) {
        modulosMap.set(data.codigo_modulo, data.id);
      }
    }

    console.log(`🚪 Sincronizando ${result.aulasUnicas.length} aulas...`);
    const aulasMap = new Map<string, string>(); // "modulo__aula" -> uuid

    for (const aula of result.aulasUnicas) {
      const modId = modulosMap.get(aula.modulo) || null;
      const { data } = await supabase
        .from('aulas')
        .upsert(
          {
            centro_codigo: centroArg,
            modulo_id: modId,
            codigo_aula: aula.codigo_aula,
            tipo: 'AULA',
          },
          { onConflict: 'centro_codigo,codigo_aula' }
        )
        .select('id, codigo_aula')
        .single();

      if (data) {
        aulasMap.set(`${aula.modulo}__${data.codigo_aula}`, data.id);
      }
    }

    // 5. Cargar catálogo de profesores para mapear profesor_id
    console.log(`🔗 Mapeando IDs de profesores...`);
    const { data: todosProfesores } = await supabase
      .from('profesores')
      .select('id, nombre_normalizado');

    const profLookup = new Map<string, string>();
    todosProfesores?.forEach((p) => {
      profLookup.set(p.nombre_normalizado, p.id);
    });

    // 6. Sincronizar Ofertas y Sesiones de Horario
    console.log(`📝 Sincronizando ofertas académicas y horarios...`);
    let ofertasGuardadas = 0;

    for (const oferta of result.ofertas) {
      const profesorId = profLookup.get(oferta.profesor_normalizado) || null;

      const { data: ofertaGuardada, error: ofertaError } = await supabase
        .from('oferta_academica')
        .upsert(
          {
            ciclo: cicloArg,
            nrc: oferta.nrc,
            centro_codigo: centroArg,
            materia_clave: oferta.clave_materia,
            profesor_id: profesorId,
            profesor_nombre_original: oferta.profesor_nombre,
            seccion: oferta.seccion,
            cupo_total: oferta.cupo_total,
            cupo_disponible: oferta.cupo_disponible,
          },
          { onConflict: 'ciclo,nrc' }
        )
        .select('id')
        .single();

      if (ofertaError || !ofertaGuardada) {
        continue;
      }

      // Eliminar sesiones anteriores de este NRC e insertar las nuevas
      await supabase.from('sesiones_horario').delete().eq('oferta_id', ofertaGuardada.id);

      if (oferta.sesiones.length > 0) {
        const sesionesPayload = oferta.sesiones.map((s) => ({
          oferta_id: ofertaGuardada.id,
          nrc: oferta.nrc,
          ciclo: cicloArg,
          dia: s.dia,
          hora_inicio: s.hora_inicio,
          hora_fin: s.hora_fin,
          aula_id: aulasMap.get(`${s.modulo}__${s.aula}`) || null,
          modulo_texto: s.modulo,
          aula_texto: s.aula,
        }));

        await supabase.from('sesiones_horario').insert(sesionesPayload);
      }

      ofertasGuardadas++;
    }

    console.log(`\n🎉 ¡SINCRONIZACIÓN FINALIZADA CON ÉXITO!`);
    console.log(`   - Secciones procesadas: ${ofertasGuardadas} / ${result.ofertas.length}`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error(`\n❌ Error durante la sincronización:`, error);
  }
}

runSync();
