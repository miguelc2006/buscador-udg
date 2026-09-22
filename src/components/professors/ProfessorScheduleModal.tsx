import React from 'react';
import { X, Calendar, Clock, MapPin, BookOpen, User, Users } from 'lucide-react';
import { ProfesorConCarga } from '../../services/professors';
import { DIAS_MAP, DIAS_ORDEN, formatTime, DiaSiiau } from '../../lib/schedule-utils';

interface ProfessorScheduleModalProps {
  profesor: ProfesorConCarga | null;
  onClose: () => void;
}

export const ProfessorScheduleModal: React.FC<ProfessorScheduleModalProps> = ({
  profesor,
  onClose,
}) => {
  if (!profesor) return null;

  // Agrupar todas las sesiones por día de la semana
  const sesionesPorDia: Record<DiaSiiau, typeof profesor.sesionesTotales> = {
    L: [],
    M: [],
    I: [],
    J: [],
    V: [],
    S: [],
  };

  for (const ses of profesor.sesionesTotales) {
    if (sesionesPorDia[ses.dia]) {
      sesionesPorDia[ses.dia].push(ses);
    }
  }

  // Ordenar las sesiones de cada día por hora de inicio
  for (const dia of DIAS_ORDEN) {
    sesionesPorDia[dia].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-udg-blue to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-lg shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Docente UDG
                </span>
                {profesor.departamento && (
                  <span className="text-xs text-slate-300 font-medium">
                    {profesor.departamento}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mt-1 tracking-tight text-white">
                {profesor.nombre_completo}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {profesor.ofertas.length} materia{profesor.ofertas.length !== 1 ? 's' : ''} asignada{profesor.ofertas.length !== 1 ? 's' : ''} · {profesor.sesionesTotales.length} sesiones semanales
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs / Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {/* Materias Impartidas */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-udg-blue" />
              Materias Impartidas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profesor.ofertas.map((of) => (
                <div
                  key={of.nrc}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono font-bold text-udg-blue">{of.materia_clave}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        NRC {of.nrc} · Sec {of.seccion}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                      {of.materia_nombre}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Cupo: {of.cupo_disponible} / {of.cupo_total} disp.
                    </span>
                    {of.creditos ? (
                      <span className="text-[11px] font-medium text-slate-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                        {of.creditos} créditos
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horario Semanal */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-udg-blue" />
              Horario Semanal
            </h4>

            <div className="space-y-3">
              {DIAS_ORDEN.map((dia) => {
                const sesionesDia = sesionesPorDia[dia];
                if (sesionesDia.length === 0) return null;

                return (
                  <div
                    key={dia}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                  >
                    <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                      <span>{DIAS_MAP[dia]}</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        {sesionesDia.length} clase{sesionesDia.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {sesionesDia.map((ses, idx) => (
                        <div
                          key={`${ses.id}-${idx}`}
                          className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-800">
                                {ses.materia_nombre || 'Materia'}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                Sec {ses.seccion}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                {formatTime(ses.hora_inicio)} - {formatTime(ses.hora_fin)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-udg-blue border border-blue-200/60">
                              <MapPin className="w-3.5 h-3.5 text-udg-blue" />
                              {ses.modulo_texto || 'Módulo'} · Aula {ses.aula_texto || 'S/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
