import React, { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';

interface ProfessorsViewProps {
  selectedCenter: string;
  selectedCycle: string;
}

export const ProfessorsView: React.FC<ProfessorsViewProps> = ({ selectedCenter, selectedCycle }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Search Bar & Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-500" />
            Buscador de Profesores
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Encuentra profesores por nombre o apellido en <span className="font-semibold text-slate-700">{selectedCenter}</span> ({selectedCycle}), consulta qué materias imparten y en qué aula se encuentran en tiempo real.
          </p>
        </div>

        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe el nombre del profesor (ej. García, López, Hernández)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-base"
          />
        </div>
      </div>

      {/* Results / Empty state placeholder */}
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          {searchTerm ? `Buscando resultados para "${searchTerm}"` : 'Empieza buscando a un profesor'}
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Conéctate a Supabase y ejecuta la sincronización de la oferta académica para explorar materias, horarios y ubicaciones en vivo.
        </p>
      </div>
    </div>
  );
};
