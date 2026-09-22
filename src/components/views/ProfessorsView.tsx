import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  UserCheck,
  MapPin,
  Clock,
  BookOpen,
  Calendar,
  Filter,
  Sparkles,
  AlertCircle,
  X,
  Radio,
} from 'lucide-react';
import { searchProfessors, ProfesorConCarga } from '../../services/professors';
import { formatTime, DIAS_MAP, getDiaSiiau } from '../../lib/schedule-utils';
import { ProfessorScheduleModal } from '../professors/ProfessorScheduleModal';

interface ProfessorsViewProps {
  selectedCenter: string;
  selectedCycle: string;
}

type FilterStatus = 'all' | 'in_class' | 'upcoming_today';

export const ProfessorsView: React.FC<ProfessorsViewProps> = ({
  selectedCenter,
  selectedCycle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [professors, setProfessors] = useState<ProfesorConCarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfesor, setSelectedProfesor] = useState<ProfesorConCarga | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar reloj cada minuto para recalcular estados en vivo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Cargar profesores desde el servicio
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    searchProfessors(selectedCenter, selectedCycle, debouncedQuery, currentTime)
      .then((data) => {
        if (isMounted) {
          setProfessors(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error cargando profesores:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCenter, selectedCycle, debouncedQuery]);

  // Filtrar según el estado seleccionado
  const filteredProfessors = useMemo(() => {
    return professors.filter((prof) => {
      if (statusFilter === 'in_class') {
        return prof.estadoActual.enClase;
      }
      if (statusFilter === 'upcoming_today') {
        return !prof.estadoActual.enClase && !!prof.estadoActual.proximaSesionHoy;
      }
      return true;
    });
  }, [professors, statusFilter]);

  // Conteo de profesores por estado
  const inClassCount = useMemo(() => {
    return professors.filter((p) => p.estadoActual.enClase).length;
  }, [professors]);

  const upcomingCount = useMemo(() => {
    return professors.filter((p) => !p.estadoActual.enClase && !!p.estadoActual.proximaSesionHoy).length;
  }, [professors]);

  const currentDiaSiiau = getDiaSiiau(currentTime);
  const currentDiaNombre = currentDiaSiiau ? DIAS_MAP[currentDiaSiiau] : 'Domingo';
  const currentFormattedTime = currentTime.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Search Bar & Filters Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-amber-500" />
              Buscador de Profesores en Tiempo Real
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Localiza dónde están impartiendo clase los docentes en{' '}
              <span className="font-semibold text-slate-700">{selectedCenter}</span> ({selectedCycle})
              y su carga horaria semanal.
            </p>
          </div>

          {/* Reloj en vivo */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shrink-0 self-start md:self-auto shadow-inner">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>
              {currentDiaNombre}, {currentFormattedTime}
            </span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe el nombre del profesor o materia (ej. Hernández, Datos, Redes)..."
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pestañas de filtrado rápido */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({professors.length})
          </button>

          <button
            onClick={() => setStatusFilter('in_class')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'in_class'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            En clase ahora ({inClassCount})
          </button>

          <button
            onClick={() => setStatusFilter('upcoming_today')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'upcoming_today'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Próxima clase hoy ({upcomingCount})
          </button>
        </div>
      </div>

      {/* Grid de Profesores */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse space-y-4"
            >
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="h-20 bg-slate-100 rounded-xl"></div>
              <div className="h-9 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredProfessors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfessors.map((prof) => {
            const { enClase, sesionActual, proximaSesionHoy, minutosParaProxima } = prof.estadoActual;

            return (
              <div
                key={prof.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header de la tarjeta */}
                <div className="p-5 pb-4">
                  {/* Estado en Vivo */}
                  <div className="mb-3">
                    {enClase && sesionActual ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
                        En clase activa
                      </div>
                    ) : proximaSesionHoy && minutosParaProxima !== undefined ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Clase en {minutosParaProxima > 60 ? `${Math.floor(minutosParaProxima / 60)}h ${minutosParaProxima % 60}m` : `${minutosParaProxima} min`}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        Sin clase en este momento
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-udg-blue transition-colors leading-snug">
                    {prof.nombre_completo}
                  </h3>
                  {prof.departamento && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prof.departamento}</p>
                  )}

                  {/* Panel de Ubicación Actual o Próxima */}
                  {enClase && sesionActual ? (
                    <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {sesionActual.modulo_texto || 'Módulo'} · Aula {sesionActual.aula_texto || 'S/A'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-800 line-clamp-1 pl-5">
                        {sesionActual.materia_nombre} (Sec {sesionActual.seccion})
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 pl-5">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>
                          {formatTime(sesionActual.hora_inicio)} a {formatTime(sesionActual.hora_fin)}
                        </span>
                      </div>
                    </div>
                  ) : proximaSesionHoy ? (
                    <div className="mt-4 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Próxima: {proximaSesionHoy.modulo_texto || 'Módulo'} · Aula {proximaSesionHoy.aula_texto || 'S/A'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-amber-800 line-clamp-1 pl-5">
                        {proximaSesionHoy.materia_nombre} (Sec {proximaSesionHoy.seccion})
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 pl-5">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>
                          {formatTime(proximaSesionHoy.hora_inicio)} a {formatTime(proximaSesionHoy.hora_fin)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {prof.ofertas.length} materia{prof.ofertas.length !== 1 ? 's' : ''} impartida{prof.ofertas.length !== 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {prof.sesionesTotales.length} sesiones/sem
                      </span>
                    </div>
                  )}

                  {/* Etiquetas de Materias */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prof.ofertas.slice(0, 3).map((of) => (
                      <span
                        key={of.nrc}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md line-clamp-1"
                        title={of.materia_nombre}
                      >
                        {of.materia_nombre}
                      </span>
                    ))}
                    {prof.ofertas.length > 3 && (
                      <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                        +{prof.ofertas.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón de acción footer */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedProfesor(prof)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors group-hover:bg-udg-blue group-hover:text-white group-hover:border-udg-blue"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Ver horario completo
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No se encontraron profesores con los filtros aplicados
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            {searchTerm
              ? `No hubo coincidencias para "${searchTerm}" en ${selectedCenter}. Intenta con otro apellido o palabra clave.`
              : `No hay profesores registrados con el filtro "${statusFilter}".`}
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Restablecer filtros
            </button>
          )}
        </div>
      )}

      {/* Modal de Horario Completo */}
      <ProfessorScheduleModal
        profesor={selectedProfesor}
        onClose={() => setSelectedProfesor(null)}
      />
    </div>
  );
};
