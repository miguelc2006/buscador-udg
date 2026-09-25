import { useState } from 'react';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProfessorsView } from './components/views/ProfessorsView';
import { FreeRoomsView } from './components/views/FreeRoomsView';
import { GroupsView } from './components/views/GroupsView';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profesores');
  
  // Estado aplicado (el que usan las vistas para buscar)
  const [appliedFilters, setAppliedFilters] = useState({
    center: 'CUCEI',
    cycle: '2026A',
    career: 'TODAS'
  });

  const handleConsultar = (center: string, cycle: string, career: string) => {
    setAppliedFilters({ center, cycle, career });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans">
      {/* Navbar con selectores globales de Centro, Carrera y Ciclo */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConsultar={handleConsultar}
        initialCenter={appliedFilters.center}
        initialCycle={appliedFilters.cycle}
        initialCareer={appliedFilters.career}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profesores' && (
          <ProfessorsView 
            selectedCenter={appliedFilters.center} 
            selectedCycle={appliedFilters.cycle} 
            selectedCareer={appliedFilters.career} 
          />
        )}

        {activeTab === 'aulas' && (
          <FreeRoomsView 
            selectedCenter={appliedFilters.center} 
            selectedCycle={appliedFilters.cycle} 
          />
        )}

        {activeTab === 'grupos' && (
          <GroupsView 
            selectedCenter={appliedFilters.center} 
            selectedCycle={appliedFilters.cycle} 
            selectedCareer={appliedFilters.career}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
