import React from 'react';
import { Search, MapPin, Users, School } from 'lucide-react';

export type ActiveTab = 'profesores' | 'aulas' | 'grupos';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCenter: string;
  setSelectedCenter: (center: string) => void;
  selectedCycle: string;
  setSelectedCycle: (cycle: string) => void;
}

export const CENTROS_DISPONIBLES = [
  { codigo: 'CUCEI', nombre: 'CUCEI — Cs. Exactas e Ingenierías' },
  { codigo: 'CUCEA', nombre: 'CUCEA — Cs. Económico Administrativas' },
  { codigo: 'CUSH', nombre: 'CUCSH — Cs. Sociales y Humanidades' },
  { codigo: 'CUCS', nombre: 'CUCS — Cs. de la Salud' },
  { codigo: 'CUAAD', nombre: 'CUAAD — Arte, Arquitectura y Diseño' },
  { codigo: 'CUCBA', nombre: 'CUCBA — Cs. Biológicas y Agropecuarias' },
  { codigo: 'CUTONALA', nombre: 'CUTONALÁ — Centro Universitario de Tonalá' },
  { codigo: 'CUZAPOPAN', nombre: 'CUSUR / Centros Regionales' },
];

export const CICLOS_DISPONIBLES = ['2026A', '2025B', '2025A'];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCenter,
  setSelectedCenter,
  selectedCycle,
  setSelectedCycle,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-slate-950 p-2 rounded-xl font-bold flex items-center justify-center shadow-md">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Buscador</span>
                <span className="font-extrabold text-xl tracking-tight text-amber-400">UDG</span>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                  Beta
                </span>
              </div>
              <p className="text-xs text-slate-400">Oferta Académica, Profesores y Aulas Libres</p>
            </div>
          </div>

          {/* Selectores de Centro y Ciclo */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-800/80 rounded-lg px-2.5 py-1.5 border border-slate-700 text-sm">
              <span className="text-slate-400 text-xs mr-2 font-medium">Centro:</span>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-sm"
              >
                {CENTROS_DISPONIBLES.map((c) => (
                  <option key={c.codigo} value={c.codigo} className="bg-slate-900 text-white">
                    {c.codigo}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-slate-800/80 rounded-lg px-2.5 py-1.5 border border-slate-700 text-sm">
              <span className="text-slate-400 text-xs mr-2 font-medium">Ciclo:</span>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="bg-transparent text-amber-300 font-medium focus:outline-none cursor-pointer text-sm"
              >
                {CICLOS_DISPONIBLES.map((cycle) => (
                  <option key={cycle} value={cycle} className="bg-slate-900 text-white">
                    {cycle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav className="flex space-x-2 border-t border-slate-800/80 pt-2 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profesores')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'profesores'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Buscador de Profesores</span>
          </button>

          <button
            onClick={() => setActiveTab('aulas')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'aulas'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Aulas Libres</span>
          </button>

          <button
            onClick={() => setActiveTab('grupos')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'grupos'
                ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ubicador de Grupos</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
