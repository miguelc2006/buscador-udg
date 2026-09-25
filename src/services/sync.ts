import { supabase } from '../lib/supabase';

export async function syncSiiau(centro: string, ciclo: string, carrera: string = 'TODAS'): Promise<boolean> {
  try {
    console.log(`Sincronizando con SIIAU: Centro=${centro}, Ciclo=${ciclo}, Carrera=${carrera}`);
    const { data, error } = await supabase.functions.invoke('sync-oferta-udg', {
      body: { 
        centro, 
        ciclo, 
        carrera: carrera === 'TODAS' ? '' : carrera 
      },
      method: 'POST',
    });

    if (error) {
      console.error('Error en sync-oferta-udg:', error);
      return false;
    }

    console.log('Sincronización completada:', data);
    return true;
  } catch (err) {
    console.error('Excepción al sincronizar con SIIAU:', err);
    return false;
  }
}
