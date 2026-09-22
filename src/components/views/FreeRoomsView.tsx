import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Building2 } from 'lucide-react';

interface FreeRoomsViewProps {
  selectedCenter: string;
  selectedCycle: string;
}

const DIAS_SEMANA = [
  { id: 'L', label: 'Lunes' },
  { id: 'M', label: 'Martes' },
  { id: 'I', label: 'Miércoles' },
  { id: 'J', label: 'Jueves' },
  { id: 'V', label: 'Viernes' },
  { id: 'S', label: 'Sábado' },
];

export const FreeRoomsView: React.FC<FreeRoomsViewProps> = ({ selectedCenter, selectedCycle }) => {
  const [selectedDay, setSelectedDay] = useState('L');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-amber-500" />
          Buscador de Aulas Libres
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Localiza aulas desocupadas en <span className="font-semibold text-slate-700">{selectedCenter}</span> ({selectedCycle}) para estudiar o realizar actividades académicas.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Selector de Día */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Día de la semana
            </label>
            <div className="grid grid-cols-6 gap-1">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia.id}
                  onClick={() => setSelectedDay(dia.id)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    selectedDay === dia.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={dia.label}
                >
                  {dia.id}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Horas */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Hora Inicio
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Hora Fin
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results placeholder */}
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          Consulta de disponibilidad lista
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          El algoritmo de Supabase <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">get_aulas_libres</code> comparará los horarios ocupados para mostrarte todas las aulas desocupadas.
        </p>
      </div>
    </div>
  );
};
