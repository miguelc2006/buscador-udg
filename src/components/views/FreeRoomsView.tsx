import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Building2,
  Search,
  Filter,
  Users,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronRight,
  Info,
  CalendarDays,
} from 'lucide-react';
import {
  AulaLibreResultado,
  searchFreeRooms,
  getModulos,
} from '../../services/rooms';
import { RoomScheduleModal } from '../rooms/RoomScheduleModal';
import {
  DiaSiiau,
  DIAS_MAP,
  getDiaSiiau,
  timeToMinutes,
} from '../../lib/schedule-utils';

interface FreeRoomsViewProps {
  selectedCenter: string;
  selectedCycle: string;
}

const DIAS_SEMANA: Array<{ id: DiaSiiau; label: string; short: string }> = [
  { id: 'L', label: 'Lunes', short: 'Lun' },
  { id: 'M', label: 'Martes', short: 'Mar' },
  { id: 'I', label: 'Miércoles', short: 'Mié' },
  { id: 'J', label: 'Jueves', short: 'Jue' },
  { id: 'V', label: 'Viernes', short: 'Vie' },
  { id: 'S', label: 'Sábado', short: 'Sáb' },
];

const TIPOS_AULA = ['Todos', 'Aula', 'Laboratorio', 'Taller', 'Auditorio'];

export const FreeRoomsView: React.FC<FreeRoomsViewProps> = ({
  selectedCenter,
  selectedCycle,
}) => {
  // Inicializar con día actual (o Lunes si es domingo) y hora redondeada
  const initialDate = new Date();
  const diaActual = getDiaSiiau(initialDate) || 'L';
  const currentHours = initialDate.getHours();
  const startHourStr = `${String(Math.max(7, Math.min(20, currentHours))).padStart(2, '0')}:00`;
  const endHourStr = `${String(Math.max(8, Math.min(21, currentHours + 2))).padStart(2, '0')}:00`;

  const [selectedDay, setSelectedDay] = useState<DiaSiiau>(diaActual);
  const [startTime, setStartTime] = useState(startHourStr);
  const [endTime, setEndTime] = useState(endHourStr);
  const [selectedModulo, setSelectedModulo] = useState<string>('ALL');
  const [selectedTipo, setSelectedTipo] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupByModule, setGroupByModule] = useState(true);

  const [modulosDisponibles, setModulosDisponibles] = useState<string[]>([]);
  const [aulasLibres, setAulasLibres] = useState<AulaLibreResultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAulaForSchedule, setSelectedAulaForSchedule] =
    useState<AulaLibreResultado | null>(null);

  // Cargar lista de módulos cuando cambia el centro universitario
  useEffect(() => {
    let isMounted = true;
    getModulos(selectedCenter).then((mods) => {
      if (isMounted) {
        setModulosDisponibles(mods);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCenter]);

  // Ejecutar búsqueda de aulas libres al cambiar filtros
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    searchFreeRooms({
      centro: selectedCenter,
      ciclo: selectedCycle,
      dia: selectedDay,
      horaInicio: startTime,
      horaFin: endTime,
      moduloId: selectedModulo,
      tipo: selectedTipo,
      query: searchQuery,
    })
      .then((resultados) => {
        if (isMounted) {
          setAulasLibres(resultados);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error al buscar aulas libres:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    selectedCenter,
    selectedCycle,
    selectedDay,
    startTime,
    endTime,
    selectedModulo,
    selectedTipo,
    searchQuery,
  ]);

  // Establecer hora y día actual con un solo clic ("Libres AHORA")
  const setFilterToNow = () => {
    const now = new Date();
    const dia = getDiaSiiau(now) || 'L';
    setSelectedDay(dia);

    const h = now.getHours();
    const hStart = `${String(Math.max(7, Math.min(20, h))).padStart(2, '0')}:00`;
    const hEnd = `${String(Math.max(8, Math.min(21, h + 1))).padStart(2, '0')}:00`;
    setStartTime(hStart);
    setEndTime(hEnd);
  };

  // Agrupar aulas por módulo
  const aulasPorModulo = useMemo(() => {
    const groups: Record<string, AulaLibreResultado[]> = {};
    aulasLibres.forEach((aula) => {
      const mod = aula.codigo_modulo || 'SIN MÓDULO';
      if (!groups[mod]) {
        groups[mod] = [];
      }
      groups[mod].push(aula);
    });
    return groups;
  }, [aulasLibres]);

  const modulosKeys = Object.keys(aulasPorModulo).sort();

  // Validar si el rango de horario es coherente
  const esRangoValido = timeToMinutes(endTime) > timeToMinutes(startTime);

  return (
    <div className="space-y-6">
      {/* Panel Superior de Filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-500" />
              Buscador de Aulas Libres
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Localiza espacios desocupados en{' '}
              <span className="font-semibold text-slate-700">{selectedCenter}</span> ({selectedCycle}) para estudio, reuniones o clases.
            </p>
          </div>

          <button
            onClick={setFilterToNow}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl font-medium text-sm transition-all shadow-sm flex-shrink-0"
            title="Ajustar al día y hora actual"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Libres AHORA</span>
          </button>
        </div>

        {/* Filtros Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Selector de Día */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Día de la semana
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia.id}
                  onClick={() => setSelectedDay(dia.id)}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    selectedDay === dia.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-500/20 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="hidden sm:inline">{dia.short}</span>
                  <span className="sm:hidden">{dia.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hora Inicio */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Hora Inicio
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Hora Fin */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Hora Fin
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800 text-sm focus:ring-2 focus:outline-none ${
                !esRangoValido
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-slate-200 focus:ring-amber-500'
              }`}
            />
          </div>
        </div>

        {/* Filtros Secundarios: Módulo, Tipo y Búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          {/* Módulo */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Módulo / Edificio
            </label>
            <select
              value={selectedModulo}
              onChange={(e) => setSelectedModulo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="ALL">Todos los módulos</option>
              {modulosDisponibles.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Espacio */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Tipo de espacio
            </label>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {TIPOS_AULA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Búsqueda rápida por nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Buscar aula específica
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. M101, Lab, CETIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {!esRangoValido && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <Info className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>
              La <strong>Hora Fin</strong> ({endTime}) debe ser posterior a la{' '}
              <strong>Hora Inicio</strong> ({startTime}).
            </span>
          </div>
        )}
      </div>

      {/* Barra de Estadísticas y Modos de Vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            {loading ? 'Buscando...' : `${aulasLibres.length} aulas libres`}
          </span>
          <span>para el</span>
          <span className="font-medium text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md text-xs">
            {DIAS_MAP[selectedDay]} {startTime} - {endTime}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setGroupByModule(!groupByModule)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              groupByModule
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Agrupar por módulo</span>
          </button>
        </div>
      </div>

      {/* Contenido / Lista de Resultados */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">
            Consultando disponibilidad de aulas...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Revisando cruces de horarios y sesiones académicas en {selectedCenter}
          </p>
        </div>
      ) : aulasLibres.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No se encontraron aulas libres
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            No hay aulas disponibles con los filtros actuales para {DIAS_MAP[selectedDay]} de{' '}
            {startTime} a {endTime}. Intenta ajustar el rango horario o seleccionar otro módulo.
          </p>
          <button
            onClick={() => {
              setSelectedModulo('ALL');
              setSelectedTipo('Todos');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Limpiar filtros adicionales
          </button>
        </div>
      ) : groupByModule ? (
        // Vista Agrupada por Módulo
        <div className="space-y-6">
          {modulosKeys.map((modulo) => (
            <div
              key={modulo}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Header del Módulo */}
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{modulo}</h3>
                    <p className="text-[11px] text-slate-500">
                      {aulasPorModulo[modulo].length} aula(s) libre(s)
                    </p>
                  </div>
                </div>

                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Disponible
                </span>
              </div>

              {/* Grid de Aulas en este módulo */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aulasPorModulo[modulo].map((aula) => (
                  <AulaCard
                    key={aula.id}
                    aula={aula}
                    onVerHorario={() => setSelectedAulaForSchedule(aula)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista en Lista Plana
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aulasLibres.map((aula) => (
            <AulaCard
              key={aula.id}
              aula={aula}
              onVerHorario={() => setSelectedAulaForSchedule(aula)}
            />
          ))}
        </div>
      )}

      {/* Modal de Horario Completo del Aula */}
      <RoomScheduleModal
        aula={selectedAulaForSchedule}
        onClose={() => setSelectedAulaForSchedule(null)}
      />
    </div>
  );
};

interface AulaCardProps {
  aula: AulaLibreResultado;
  onVerHorario: () => void;
}

const AulaCard: React.FC<AulaCardProps> = ({ aula, onVerHorario }) => {
  const getTipoBadgeClass = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'laboratorio':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'taller':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'auditorio':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {aula.codigo_aula}
              </h4>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getTipoBadgeClass(
                  aula.tipo
                )}`}
              >
                {aula.tipo}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {aula.codigo_modulo}
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Libre
          </span>
        </div>

        <div className="space-y-1.5 py-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Capacidad aprox: <strong>{aula.capacidad}</strong> estudiantes</span>
          </div>

          {aula.proximaOcupacion ? (
            <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Próxima clase hoy:</span>
                <span className="text-[11px] text-amber-900">
                  {aula.proximaOcupacion.hora_inicio} - {aula.proximaOcupacion.hora_fin} (
                  {aula.proximaOcupacion.materia_nombre || 'Clase'})
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 mt-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px]">Sin más clases programadas hoy</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onVerHorario}
        className="mt-3 w-full py-2 px-3 bg-slate-50 hover:bg-amber-500 hover:text-slate-950 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200 hover:border-amber-500"
      >
        <CalendarDays className="w-3.5 h-3.5" />
        <span>Ver horario completo</span>
        <ChevronRight className="w-3 h-3 ml-auto opacity-70" />
      </button>
    </div>
  );
};
