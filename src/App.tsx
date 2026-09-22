import { useState } from 'react';
import { Navbar, ActiveTab, CENTROS_DISPONIBLES, CICLOS_DISPONIBLES } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProfessorsView } from './components/views/ProfessorsView';
import { FreeRoomsView } from './components/views/FreeRoomsView';
import { GroupsView } from './components/views/GroupsView';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profesores');
  const [selectedCenter, setSelectedCenter] = useState<string>(CENTROS_DISPONIBLES[0].codigo);
  const [selectedCycle, setSelectedCycle] = useState<string>(CICLOS_DISPONIBLES[0]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900">
      {/* Navbar con selectores globales de Centro y Ciclo */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCenter={selectedCenter}
        setSelectedCenter={setSelectedCenter}
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profesores' && (
          <ProfessorsView selectedCenter={selectedCenter} selectedCycle={selectedCycle} />
        )}

        {activeTab === 'aulas' && (
          <FreeRoomsView selectedCenter={selectedCenter} selectedCycle={selectedCycle} />
        )}

        {activeTab === 'grupos' && (
          <GroupsView selectedCenter={selectedCenter} selectedCycle={selectedCycle} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
