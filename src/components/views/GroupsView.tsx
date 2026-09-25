import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  BookOpen,
  MapPin,
  Clock,
  Layers,
  GraduationCap,
  RefreshCw,
  School,
  ArrowRight,
} from 'lucide-react';
import {
  GrupoAcademico,
  searchGroups,
} from '../../services/groups';
import { GroupScheduleModal } from '../groups/GroupScheduleModal';
import { formatTime } from '../../lib/schedule-utils';

interface GroupsViewProps {
  selectedCenter: string;
  selectedCycle: string;
  selectedCareer: string;
}

export const GroupsView: React.FC<GroupsViewProps> = ({ selectedCenter, selectedCycle, selectedCareer }) => {
  const [selectedSemestre, setSelectedSemestre] = useState<number>(0); // 0 = Todos
  const [selectedTurno, setSelectedTurno] = useState<'TODOS' | 'Matutino' | 'Vespertino'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const [grupos, setGrupos] = useState<GrupoAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrupoModal, setSelectedGrupoModal] = useState<GrupoAcademico | null>(null);

  // Cargar y filtrar grupos
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    searchGroups({
      centro_codigo: selectedCenter,
      ciclo: selectedCycle,
      carrera_codigo: selectedCareer === 'TODAS' ? undefined : selectedCareer,
      semestre: selectedSemestre === 0 ? undefined : selectedSemestre,
      turno: selectedTurno,
      busqueda: searchTerm,
    })
      .then((data) => {
        if (isMounted) {
          setGrupos(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCenter, selectedCycle, selectedCareer, selectedSemestre, selectedTurno, searchTerm]);

  // Estadísticas rápidas
  const totalEnClase = useMemo(() => {
    return grupos.filter((g) => g.estadoActual.enClase).length;
  }, [grupos]);

  return (
    <div className="space-y-6">
      {/* Search Bar & Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-500" />
              Localizador de Grupos y Generaciones
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Rastrea en tiempo real el aula, materias y avance de cada grupo y generación en{' '}
              <span className="font-semibold text-slate-700">{selectedCenter}</span> ({selectedCycle}).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
              <School className="w-4 h-4 text-amber-600" />
              <span>{grupos.length} grupos encontrados</span>
            </div>
            {totalEnClase > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{totalEnClase} en clase ahora</span>
              </div>
            )}
          </div>
        </div>

        {/* Input de Búsqueda */}
        <div className="mt-5 relative max-w-3xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por NRC, nombre de materia, código, profesor o sección..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm sm:text-base"
          />
        </div>

        {/* Filtros Interactivos: Semestre, Turno */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Selector de Turno */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['TODOS', 'Matutino', 'Vespertino'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTurno(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedTurno === t
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'TODOS' ? 'Todos los Turnos' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Semestre */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
            <span className="text-xs text-slate-400 font-semibold mr-1">Semestre:</span>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSemestre(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedSemestre === s
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 0 ? 'Todos' : `${s}º`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Card sobre Generaciones & Mapeo Reticular */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-blue-800 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="text-xs sm:text-sm">
          <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
            Mapeo de Cohortes y Avance de Generaciones
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 font-mono">
              Fase 2 Activa
            </span>
          </h4>
          <p className="text-blue-200/90 mt-1 leading-relaxed">
            Calcula la generación de ingreso (cohorte) y proyecta el ciclo de graduación de cada sección.
            Haz clic en <span className="font-semibold text-amber-300">"Ver Horario"</span> para consultar la matriz semanal completa de materias, profesores y módulos de cada grupo.
          </p>
        </div>
      </div>

      {/* Grid de Grupos */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">Buscando y agrupando oferta académica...</p>
        </div>
      ) : grupos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron grupos</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Prueba ajustando los filtros de carrera, semestre o turno, o realiza una búsqueda con otros términos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grupos.map((grupo) => {
            const estado = grupo.estadoActual;

            return (
              <div
                key={grupo.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-400">
                          {grupo.carrera_codigo}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900">
                          {grupo.semestre}º Semestre
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-100 text-blue-900">
                          Sección {grupo.seccion}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {grupo.turno}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={grupo.carrera_nombre}>
                      {grupo.carrera_nombre}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      {grupo.cohorte.etiquetaGeneracion}
                    </p>
                  </div>

                  {/* Estado en Vivo (Live Status) */}
                  <div className="px-5 py-3 border-b border-slate-100 bg-white">
                    {estado.enClase && estado.sesionActual ? (
                      <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <span className="relative flex h-2.5 w-2.5 mt-0.5 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <div>
                          <div className="font-bold">En clase ahora:</div>
                          <div className="font-medium text-emerald-950 truncate max-w-[230px]">
                            {estado.sesionActual.materia_nombre}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500" />
                            {estado.sesionActual.modulo_texto} {estado.sesionActual.aula_texto} (hasta las {formatTime(estado.sesionActual.hora_fin)})
                          </div>
                        </div>
                      </div>
                    ) : estado.proximaSesionHoy ? (
                      <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-bold">Próxima clase hoy ({formatTime(estado.proximaSesionHoy.hora_inicio)}):</div>
                          <div className="font-medium text-amber-950 truncate max-w-[230px]">
                            {estado.proximaSesionHoy.materia_nombre}
                          </div>
                          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500" />
                            {estado.proximaSesionHoy.modulo_texto} {estado.proximaSesionHoy.aula_texto}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 py-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sin clases programadas en este momento</span>
                      </div>
                    )}
                  </div>

                  {/* Resumen de Materias del Bloque */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        Materias ({grupo.materias.length})
                      </span>
                      <span>{grupo.totalCreditos} Créditos</span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {grupo.materias.map((m) => (
                        <div
                          key={m.nrc}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div className="truncate max-w-[200px]">
                            <span className="font-bold text-slate-700 font-mono text-[11px] mr-1.5">
                              {m.materia_clave}
                            </span>
                            <span className="text-slate-800 font-medium">{m.materia_nombre}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                            NRC {m.nrc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{grupo.modulosFrecuentes.join(', ') || 'Varios Módulos'}</span>
                    </div>

                    <button
                      onClick={() => setSelectedGrupoModal(grupo)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Ver Horario</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Horario Consolidado */}
      {selectedGrupoModal && (
        <GroupScheduleModal
          grupo={selectedGrupoModal}
          onClose={() => setSelectedGrupoModal(null)}
        />
      )}
    </div>
  );
};
