import React from 'react';
import { School, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <School className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-slate-200">Buscador UDG</span>
          <span className="text-slate-500">— Proyecto de código abierto para la comunidad UDG</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <span>Desarrollado con</span>
          <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          <span>para estudiantes y profesores</span>
        </div>
      </div>
    </footer>
  );
};
