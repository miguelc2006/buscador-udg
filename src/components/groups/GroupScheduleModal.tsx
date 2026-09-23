import React, { useEffect, useState } from 'react';
import {
  X,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { GrupoAcademico } from '../../services/groups';
import {
  DIAS_ORDEN,
  DIAS_MAP,
  DiaSiiau,
  formatTime,
  timeToMinutes,
  SesionConDetalles,
} from '../../lib/schedule-utils';

interface GroupScheduleModalProps {
  grupo: GrupoAcademico | null;
  onClose: () => void;
}

// Paleta de colores para diferenciar materias en el horario
const MATERIA_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', badge: 'bg-blue-200 text-blue-800' },
  { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-200 text-emerald-800' },
  { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', badge: 'bg-purple-200 text-purple-800' },
  { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', badge: 'bg-amber-200 text-amber-800' },
  { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-900', badge: 'bg-rose-200 text-rose-800' },
  { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-900', badge: 'bg-cyan-200 text-cyan-800' },
  { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-900', badge: 'bg-indigo-200 text-indigo-800' },
];

export const GroupScheduleModal: React.FC<GroupScheduleModalProps> = ({ grupo, onClose }) => {
  const [activeTab, setActiveTab] = useState<'horario' | 'materias' | 'cohorte'>('horario');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!grupo) return null;

  const sesiones = grupo.sesionesTotales || [];

  // Mapear color fijo por clave de materia
  const materiaColorMap = new Map<string, typeof MATERIA_COLORS[0]>();
  grupo.materias.forEach((m, idx) => {
    materiaColorMap.set(m.materia_clave, MATERIA_COLORS[idx % MATERIA_COLORS.length]);
  });

  // Agrupar sesiones por día
  const sesionesPorDia: Record<DiaSiiau, SesionConDetalles[]> = {
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

  // Ordenar sesiones cronológicamente
  DIAS_ORDEN.forEach((dia) => {
    sesionesPorDia[dia].sort(
      (a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio)
    );
  });

  const estado = grupo.estadoActual;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 font-bold text-2xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Grupo {grupo.carrera_codigo} — Semestre {grupo.semestre} ({grupo.seccion})
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                  {grupo.turno}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-medium border border-blue-800">
                  {grupo.cohorte.etiquetaGeneracion}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-slate-200">{grupo.carrera_nombre}</span>
                <span>•</span>
                <span>{grupo.centro_codigo}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                  {grupo.materias.length} materias ({grupo.totalCreditos} créditos)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  {grupo.totalHorasSemana} hrs/semana
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Live Location / Status Alert */}
        <div className="px-6 py-3 border-b flex items-center justify-between gap-4 flex-wrap bg-slate-50 flex-shrink-0">
          {estado.enClase && estado.sesionActual ? (
            <div className="flex items-center gap-3 text-emerald-800 bg-emerald-100/80 px-4 py-2 rounded-xl border border-emerald-300 w-full sm:w-auto">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div className="text-sm">
                <span className="font-bold">En clase ahora:</span> {estado.sesionActual.materia_nombre} en{' '}
                <span className="font-semibold">{estado.sesionActual.modulo_texto} {estado.sesionActual.aula_texto}</span>{' '}
                ({formatTime(estado.sesionActual.hora_inicio)} - {formatTime(estado.sesionActual.hora_fin)})
                {estado.sesionActual.profesor_nombre && (
                  <span className="text-emerald-950 font-medium"> — Prof. {estado.sesionActual.profesor_nombre}</span>
                )}
              </div>
            </div>
          ) : estado.proximaSesionHoy ? (
            <div className="flex items-center gap-3 text-amber-800 bg-amber-50 px-4 py-2 rounded-xl border border-amber-300 w-full sm:w-auto">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-bold">Próxima clase hoy:</span> {estado.proximaSesionHoy.materia_nombre} a las{' '}
                <span className="font-semibold">{formatTime(estado.proximaSesionHoy.hora_inicio)}</span> en{' '}
                <span className="font-semibold">{estado.proximaSesionHoy.modulo_texto} {estado.proximaSesionHoy.aula_texto}</span>
                {estado.minutosParaProxima && estado.minutosParaProxima > 0 && (
                  <span className="text-amber-700"> (en ~{estado.minutosParaProxima} min)</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span>El grupo no tiene clases programadas en este momento.</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('horario')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'horario'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Horario Semanal
            </button>
            <button
              onClick={() => setActiveTab('materias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'materias'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Materias ({grupo.materias.length})
            </button>
            <button
              onClick={() => setActiveTab('cohorte')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cohorte'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Generación & Módulos
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'horario' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DIAS_ORDEN.map((dia) => {
                  const sesDia = sesionesPorDia[dia];
                  const tieneClases = sesDia.length > 0;

                  return (
                    <div
                      key={dia}
                      className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                        tieneClases
                          ? 'bg-white border-slate-200 shadow-sm'
                          : 'bg-slate-100/60 border-dashed border-slate-200 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            {DIAS_MAP[dia]}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              tieneClases
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {sesDia.length} {sesDia.length === 1 ? 'bloque' : 'bloques'}
                          </span>
                        </div>

                        {tieneClases ? (
                          <div className="space-y-2.5">
                            {sesDia.map((s, idx) => {
                              const style = materiaColorMap.get(s.materia_clave || '') || MATERIA_COLORS[0];
                              return (
                                <div
                                  key={`${s.id}-${idx}`}
                                  className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${style.bg} ${style.border}`}
                                >
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-800">
                                      {formatTime(s.hora_inicio)} - {formatTime(s.hora_fin)}
                                    </span>
                                    {s.nrc && (
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        NRC {s.nrc}
                                      </span>
                                    )}
                                  </div>
                                  <div className={`font-semibold text-xs leading-tight mb-1.5 ${style.text}`}>
                                    {s.materia_nombre}
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-slate-600 gap-2 flex-wrap">
                                    <span className="flex items-center gap-1 font-medium bg-white/70 px-1.5 py-0.5 rounded border border-slate-200/80">
                                      <MapPin className="w-3 h-3 text-red-500" />
                                      {s.modulo_texto} {s.aula_texto}
                                    </span>
                                    {s.profesor_nombre && (
                                      <span className="text-slate-500 text-[10px] truncate max-w-[130px]" title={s.profesor_nombre}>
                                        {s.profesor_nombre}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic py-6 text-center">
                            Sin clases programadas este día
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'materias' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grupo.materias.map((m) => {
                  const style = materiaColorMap.get(m.materia_clave) || MATERIA_COLORS[0];
                  return (
                    <div
                      key={m.nrc}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {m.materia_clave}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">NRC: {m.nrc}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${style.badge}`}>
                            {m.creditos} Créditos
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{m.materia_nombre}</h4>
                        <p className="text-xs text-slate-600 mb-3">
                          <span className="font-medium text-slate-700">Profesor:</span> {m.profesor_nombre}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {m.sesiones.map((s) => `${s.dia} ${formatTime(s.hora_inicio)}`).join(', ')}
                        </span>
                        <span className="font-medium text-slate-600">
                          Cupo: {m.cupo_total - m.cupo_disponible}/{m.cupo_total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'cohorte' && (
            <div className="space-y-6">
              {/* Cohort Estimation Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Información Generacional y Avance Reticular
                    </h4>
                    <p className="text-xs text-slate-500">
                      Cálculo de ingreso y proyección de graduación para el grupo {grupo.seccion}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Semestre Actual</span>
                    <span className="text-xl font-extrabold text-slate-900">{grupo.semestre}º Semestre</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Ciclo de Ingreso</span>
                    <span className="text-xl font-extrabold text-blue-700">{grupo.cohorte.cicloIngreso}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Egreso Estimado</span>
                    <span className="text-xl font-extrabold text-emerald-700">{grupo.cohorte.cicloEgresoEstimado}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-medium block mb-1">Total Créditos</span>
                    <span className="text-xl font-extrabold text-amber-700">{grupo.totalCreditos} pts</span>
                  </div>
                </div>
              </div>

              {/* Modules Visited / Campus Route */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Ruta de Módulos Frecuentes en el Campus
                    </h4>
                    <p className="text-xs text-slate-500">
                      Módulos y edificios donde este grupo tiene clases a lo largo de la semana
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {grupo.modulosFrecuentes.map((mod) => (
                    <div
                      key={mod}
                      className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-2 rounded-xl text-sm font-semibold"
                    >
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Datos actualizados de la Oferta Académica SIIAU UDG</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
