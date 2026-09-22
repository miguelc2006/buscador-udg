import React, { useEffect } from 'react';
import {
  X,
  Building2,
  Users,
  Calendar,
  Clock,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';
import { AulaLibreResultado } from '../../services/rooms';
import {
  DIAS_ORDEN,
  DIAS_MAP,
  DiaSiiau,
  formatTime,
  timeToMinutes,
} from '../../lib/schedule-utils';

interface RoomScheduleModalProps {
  aula: AulaLibreResultado | null;
  onClose: () => void;
}

export const RoomScheduleModal: React.FC<RoomScheduleModalProps> = ({ aula, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!aula) return null;

  const sesiones = aula.sesionesTotales || [];

  // Agrupar sesiones por día
  const sesionesPorDia: Record<DiaSiiau, typeof sesiones> = {
    L: [],
    M: [],
    I: [],
    J: [],
    V: [],
    S: [],
  };

  sesiones.forEach((s) => {
    if (sesionesPorDia[s.dia as DiaSiiau]) {
      sesionesPorDia[s.dia as DiaSiiau].push(s);
    }
  });

  // Ordenar sesiones cronológicamente dentro de cada día
  DIAS_ORDEN.forEach((dia) => {
    sesionesPorDia[dia].sort(
      (a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio)
    );
  });

  const totalClasesSemana = sesiones.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 font-bold text-2xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Aula {aula.codigo_aula}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                  {aula.codigo_modulo}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-medium border border-emerald-800">
                  {aula.tipo}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-3">
                <span>{aula.centro_codigo}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  Capacidad: {aula.capacidad} estudiantes
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Quick Summary Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-950">
                  Ocupación semanal del espacio
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  {totalClasesSemana === 0
                    ? 'Esta aula no tiene clases regulares programadas en el ciclo actual.'
                    : `Tiene ${totalClasesSemana} bloques de clase programados de lunes a sábado.`}
                </p>
              </div>
            </div>
            {aula.proximaOcupacion && (
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-semibold text-amber-900 block">
                  Próxima clase hoy:
                </span>
                <span className="text-xs text-amber-700 font-medium">
                  {aula.proximaOcupacion.hora_inicio} - {aula.proximaOcupacion.hora_fin}
                </span>
              </div>
            )}
          </div>

          {/* Weekly Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIAS_ORDEN.map((dia) => {
              const clasesDia = sesionesPorDia[dia];
              const tieneClases = clasesDia.length > 0;

              return (
                <div
                  key={dia}
                  className={`rounded-xl border transition-all ${
                    tieneClases
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-slate-50/60 border-slate-200/60 opacity-80'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-xl">
                    <span className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {DIAS_MAP[dia]}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tieneClases
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tieneClases ? `${clasesDia.length} clase(s)` : 'Libre todo el día'}
                    </span>
                  </div>

                  <div className="p-3 space-y-2.5">
                    {tieneClases ? (
                      clasesDia.map((sesion) => (
                        <div
                          key={sesion.id}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              {formatTime(sesion.hora_inicio)} - {formatTime(sesion.hora_fin)}
                            </span>
                            {sesion.seccion && (
                              <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                                Sec {sesion.seccion}
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-slate-900 line-clamp-1 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            {sesion.materia_nombre || 'Materia sin registrar'}
                          </p>

                          {sesion.profesor_nombre && (
                            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
                              <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              {sesion.profesor_nombre}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Espacio totalmente disponible
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Horarios sincronizados con el sistema oficial SIIAU de la Universidad de Guadalajara.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
