import React, { useState } from 'react';
import { Users, GraduationCap, Search } from 'lucide-react';

interface GroupsViewProps {
  selectedCenter: string;
  selectedCycle: string;
}

export const GroupsView: React.FC<GroupsViewProps> = ({ selectedCenter, selectedCycle }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Search Bar & Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-500" />
          Ubicador de Grupos y Generaciones
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Rastrea en qué módulo y aula se reúnen los grupos de una materia o una generación en <span className="font-semibold text-slate-700">{selectedCenter}</span> ({selectedCycle}).
        </p>

        <div className="mt-5 relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por NRC, nombre de materia o clave..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-base"
          />
        </div>
      </div>

      {/* Info Card sobre Spike de Generaciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900">
        <div className="flex items-start space-x-3">
          <GraduationCap className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-base text-blue-950">Mapeo de Mallas Curriculares (Fase 2)</h4>
            <p className="text-sm text-blue-800/90 mt-1">
              Próximamente podrás filtrar por Carrera (ej. Ingeniería en Computación, Lic. en Administración) y Semestre para visualizar la ubicación simultánea de todas las materias que cursa una misma generación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
