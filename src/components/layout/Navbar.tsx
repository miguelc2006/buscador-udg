import React, { useEffect, useState, useRef } from 'react';
import { Search, MapPin, Users, School, Loader2, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export type ActiveTab = 'profesores' | 'aulas' | 'grupos';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onConsultar: (center: string, cycle: string, career: string) => void;
  initialCenter?: string;
  initialCycle?: string;
  initialCareer?: string;
}

interface OptionItem {
  value: string;
  description: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onConsultar,
  initialCenter = 'CUCEI',
  initialCycle = '2026A',
  initialCareer = 'TODAS',
}) => {
  const [centros, setCentros] = useState<OptionItem[]>([]);
  const [ciclos, setCiclos] = useState<OptionItem[]>([]);
  const [carreras, setCarreras] = useState<OptionItem[]>([]);
  
  const [selectedCenter, setSelectedCenter] = useState<string>(initialCenter);
  const [selectedCycle, setSelectedCycle] = useState<string>(initialCycle);
  const [selectedCareer, setSelectedCareer] = useState<string>(initialCareer);
  
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingCarreras, setLoadingCarreras] = useState(false);

  // Autocomplete state para Carrera
  const [busquedaCarrera, setBusquedaCarrera] = useState<string>('Todas las carreras');
  const [mostrarSugerencias, setMostrarSugerencias] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar Centros y Ciclos al montar
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('siiau-catalogs', {
          body: { action: 'options' },
          method: 'POST',
        });
        
        if (error) throw error;
        
        if (data && data.cup) {
          setCentros(data.cup);
          if (!data.cup.find((c: OptionItem) => c.value === selectedCenter) && data.cup.length > 0) {
            setSelectedCenter(data.cup[0].value);
          }
        }
        
        if (data && data.ciclop) {
          setCiclos(data.ciclop);
          if (!data.ciclop.find((c: OptionItem) => c.value === selectedCycle) && data.ciclop.length > 0) {
            setSelectedCycle(data.ciclop[0].value);
          }
        }
      } catch (err) {
        console.error('Error fetching options:', err);
        setCentros([{ value: 'CUCEI', description: 'CUCEI' }]);
        setCiclos([{ value: '2026A', description: '2026A' }]);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Cargar Carreras cuando cambia el Centro
  useEffect(() => {
    if (!selectedCenter) return;
    
    const fetchCarreras = async () => {
      setLoadingCarreras(true);
      try {
        const { data, error } = await supabase.functions.invoke('siiau-catalogs', {
          body: { action: 'majors', cup: selectedCenter },
          method: 'POST',
        });
        
        if (error) throw error;
        
        if (data && Array.isArray(data)) {
          setCarreras(data);
          setSelectedCareer('TODAS');
          setBusquedaCarrera('Todas las carreras');
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
        setCarreras([]);
      } finally {
        setLoadingCarreras(false);
      }
    };

    fetchCarreras();
  }, [selectedCenter]);

  // Filtrado de carreras para el autocomplete
  const carrerasFiltradas = carreras.filter((c) => {
    if (selectedCareer === 'TODAS' && busquedaCarrera === 'Todas las carreras') {
      return true; // Mostrar todas si no ha escrito nada nuevo
    }
    const query = busquedaCarrera.toLowerCase();
    return (
      c.value.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  });

  const handleCarreraSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaCarrera(e.target.value);
    setMostrarSugerencias(true);
    if (e.target.value === '') {
      setSelectedCareer('TODAS');
    }
  };

  const seleccionarCarrera = (value: string, label: string) => {
    setSelectedCareer(value);
    setBusquedaCarrera(label);
    setMostrarSugerencias(false);
  };

  const handleConsultar = () => {
    onConsultar(selectedCenter, selectedCycle, selectedCareer);
  };

  return (
    <header className="bg-udg-blue border-b border-udg-dark text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-udg-red text-white p-2 rounded-xl font-bold flex items-center justify-center shadow-md">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl tracking-tight text-white">Buscador</span>
                <span className="font-serif font-bold text-xl tracking-tight text-udg-gold">UDG</span>
                <span className="bg-udg-gold/20 text-udg-gold text-xs px-2 py-0.5 rounded-full font-semibold border border-udg-gold/30">
                  Beta
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">Oferta Académica, Profesores y Aulas Libres</p>
            </div>
          </div>

          {/* Formulario de Centro, Carrera y Ciclo con Botón Consultar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Centro */}
            <div className="flex items-center bg-udg-dark/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 text-sm">
              <span className="text-slate-300 text-xs mr-2 font-medium">Centro:</span>
              {loadingOptions ? (
                <Loader2 className="w-4 h-4 animate-spin text-udg-gold" />
              ) : (
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-sm max-w-[140px] truncate"
                >
                  {centros.map((c) => (
                    <option key={c.value} value={c.value} className="bg-udg-blue text-white">
                      {c.value} - {c.description}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Carrera con Autocomplete */}
            <div className="relative flex items-center bg-udg-dark/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 text-sm" ref={wrapperRef}>
              <span className="text-slate-300 text-xs mr-2 font-medium">Carrera:</span>
              {loadingCarreras ? (
                <Loader2 className="w-4 h-4 animate-spin text-udg-gold" />
              ) : (
                <input
                  type="text"
                  value={busquedaCarrera}
                  onChange={handleCarreraSearch}
                  onFocus={(e) => {
                    if (selectedCenter && !loadingCarreras) setMostrarSugerencias(true);
                    e.target.select();
                  }}
                  disabled={loadingCarreras || !selectedCenter}
                  placeholder={loadingCarreras ? "Cargando..." : "Buscar carrera..."}
                  className="bg-transparent text-white font-medium focus:outline-none text-sm w-[150px] sm:w-[180px] truncate"
                />
              )}

              {/* Sugerencias desplegables */}
              {mostrarSugerencias && (
                <div className="absolute left-0 top-full mt-1 w-72 max-h-60 overflow-y-auto bg-udg-dark border border-slate-700 rounded-lg shadow-xl z-50 py-1">
                  <div
                    onClick={() => seleccionarCarrera('TODAS', 'Todas las carreras')}
                    className={`px-3 py-2 cursor-pointer hover:bg-udg-blue/80 text-xs ${
                      selectedCareer === 'TODAS' ? 'bg-udg-blue text-udg-gold font-bold' : 'text-slate-200'
                    }`}
                  >
                    🌟 Todas las carreras
                  </div>
                  {carrerasFiltradas.length > 0 ? (
                    carrerasFiltradas.map((c) => (
                      <div
                        key={c.value}
                        onClick={() => seleccionarCarrera(c.value, `${c.value} - ${c.description}`)}
                        className={`px-3 py-1.5 cursor-pointer hover:bg-udg-blue/80 text-xs truncate ${
                          selectedCareer === c.value ? 'bg-udg-blue text-udg-gold font-semibold' : 'text-slate-200'
                        }`}
                        title={`${c.value} - ${c.description}`}
                      >
                        <span className="font-mono text-udg-gold mr-1.5">[{c.value}]</span>
                        {c.description}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-slate-400 text-xs text-center">
                      No se encontraron carreras
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ciclo */}
            <div className="flex items-center bg-udg-dark/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50 text-sm">
              <span className="text-slate-300 text-xs mr-2 font-medium">Ciclo:</span>
              {loadingOptions ? (
                <Loader2 className="w-4 h-4 animate-spin text-udg-gold" />
              ) : (
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="bg-transparent text-udg-gold font-medium focus:outline-none cursor-pointer text-sm max-w-[100px]"
                >
                  {ciclos.map((cycle) => (
                    <option key={cycle.value} value={cycle.value} className="bg-udg-blue text-white">
                      {cycle.description}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Botón Consultar */}
            <button
              onClick={handleConsultar}
              disabled={loadingOptions || loadingCarreras}
              className="flex items-center gap-1.5 bg-udg-gold hover:bg-amber-400 text-udg-dark font-bold px-3.5 py-1.5 rounded-lg text-sm transition-colors shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Consultar</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav className="flex space-x-2 border-t border-slate-700/50 pt-2 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profesores')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'profesores'
                ? 'bg-udg-gold text-udg-dark shadow-md font-semibold'
                : 'text-slate-300 hover:bg-udg-dark hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Buscador de Profesores</span>
          </button>

          <button
            onClick={() => setActiveTab('aulas')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'aulas'
                ? 'bg-udg-gold text-udg-dark shadow-md font-semibold'
                : 'text-slate-300 hover:bg-udg-dark hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Aulas Libres</span>
          </button>

          <button
            onClick={() => setActiveTab('grupos')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'grupos'
                ? 'bg-udg-gold text-udg-dark shadow-md font-semibold'
                : 'text-slate-300 hover:bg-udg-dark hover:text-white'
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
