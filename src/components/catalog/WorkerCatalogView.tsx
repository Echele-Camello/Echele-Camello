import React, { useState, useMemo } from 'react';
import { WorkerProfile, WorkerCategory } from '../../types';
import { 
  Search, ShieldCheck, MapPin, Star, Clock, Filter, 
  RotateCcw, CheckCircle2, ChevronDown, DollarSign, 
  ArrowRight, Briefcase, Zap, PhoneCall, Award
} from 'lucide-react';
import { COLOMBIA_DEPARTMENTS } from '../../data/colombiaData';
import { platformGateway } from '../../architecture/gateway/ApiGateway';

interface WorkerCatalogViewProps {
  workers: WorkerProfile[];
  categories: WorkerCategory[];
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenChat: (worker: WorkerProfile) => void;
  onOpenContract?: (worker: WorkerProfile) => void;
}

export const WorkerCatalogView: React.FC<WorkerCatalogViewProps> = ({
  workers,
  categories,
  onSelectWorker,
  onOpenChat,
  onOpenContract
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('all');
  const [minPriceCOP, setMinPriceCOP] = useState<number>(20000);
  const [maxPriceCOP, setMaxPriceCOP] = useState<number>(120000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevancia' | 'cercania' | 'calificacion' | 'precio_menor' | 'precio_mayor' | 'experiencia'>('relevancia');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Colombian Cities list for dropdown
  const citiesList = useMemo(() => {
    const list = [
      'Bogotá D.C.',
      'Medellín',
      'Cali',
      'Barranquilla',
      'Bucaramanga',
      'Cartagena',
      'Pereira',
      'Manizales',
      'Santa Marta',
      'Cúcuta',
      'Ibagué',
      'Villavicencio',
      'Pasto',
      'Armenia',
      'Montería',
      'Neiva',
      'Popayán',
      'Valledupar',
      'Tunja'
    ];
    return list;
  }, []);

  // Filter & Sort logic delegated to ms-busqueda (Patrón Strategy + Adapter Geolocalización + DTO)
  const searchResults = useMemo(() => {
    return platformGateway.msBusqueda.searchWorkers(workers, {
      termino: searchTerm,
      categoriaId: selectedCategory,
      ciudad: selectedCity,
      soloDisponibles: onlyAvailable,
      soloVerificados: onlyVerified,
      horario: selectedSchedule,
      precioMinCOP: minPriceCOP,
      precioMaxCOP: maxPriceCOP,
      calificacionMinima: minRating,
      estrategiaOrdenamiento: sortBy
    });
  }, [
    workers, searchTerm, selectedCategory, selectedCity,
    onlyAvailable, onlyVerified, selectedSchedule,
    minPriceCOP, maxPriceCOP, minRating, sortBy
  ]);

  const filteredWorkers = useMemo(() => searchResults.map((r) => r.worker), [searchResults]);
  const distanceByWorkerId = useMemo(() => {
    const map: Record<string, number> = {};
    searchResults.forEach((r) => {
      map[r.worker.id] = r.distanciaKm;
    });
    return map;
  }, [searchResults]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setOnlyAvailable(false);
    setOnlyVerified(false);
    setSelectedSchedule('all');
    setMinPriceCOP(20000);
    setMaxPriceCOP(120000);
    setMinRating(0);
    setSortBy('relevancia');
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedCity !== 'all',
    onlyAvailable,
    onlyVerified,
    selectedSchedule !== 'all',
    minPriceCOP > 20000 || maxPriceCOP < 120000,
    minRating > 0
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-[#fdfdfd] min-h-screen py-8">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#b9bbc6]/40">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#fff2eb] text-[#ff5900] text-xs font-semibold tracking-wide mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CATÁLOGO NACIONAL DE TRABAJADORES</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Directorio de Trabajadores Certificados
            </h1>
            <p className="text-sm text-[#60646c] mt-1 max-w-2xl">
              Filtra por ciudad colombiana, oficio, rango de tarifa en pesos y disponibilidad. Todo contrato cuenta con protección de pagos retenidos en custodia Escrow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#f3f3f7] border border-[#b9bbc6] rounded-[10px] text-xs font-semibold text-black"
            >
              <Filter className="w-4 h-4 text-[#ff5900]" />
              <span>Filtros ({activeFiltersCount})</span>
            </button>

            <div className="text-xs text-[#60646c] bg-white border border-[#b9bbc6]/50 px-3.5 py-2 rounded-[10px] shadow-2xs">
              Trabajadores disponibles: <strong className="text-black font-semibold text-sm">{filteredWorkers.length}</strong>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left Filters + Right Catalog Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR FILTERS (w-full lg:col-span-4 xl:col-span-3) */}
          <aside className={`
            lg:col-span-4 xl:col-span-3 bg-white border border-[#b9bbc6]/60 rounded-[14px] p-5 shadow-2xs space-y-6
            ${showMobileFilters ? 'block mb-6' : 'hidden lg:block'}
          `}>
            
            {/* Sidebar Title & Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-[#b9bbc6]/30">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#ff5900]" />
                <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                  Filtros de Búsqueda
                </h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#ff5900] hover:text-[#e04f00] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Restablecer todos los filtros"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* Filter 1: Desplegable de Ciudad que necesita */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>¿En qué ciudad necesita el servicio?</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-[#ff5900] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Todas las ciudades de Colombia</option>
                  {citiesList.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8b8d98] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Filter 2: Rol que necesitan contratar (Categoría / Oficio) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>¿Qué rol u oficio necesita contratar?</span>
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-[8px] transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#ff5900] text-white font-semibold'
                      : 'bg-[#f8f9fa] text-black hover:bg-[#eceef2]'
                  }`}
                >
                  <span>Todos los oficios y roles</span>
                  <span className="text-[10px] opacity-80">{workers.length}</span>
                </button>

                {categories.map((cat) => {
                  const countInCat = workers.filter(w => w.categoriaId === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-[8px] transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff5900] text-white font-semibold'
                          : 'bg-[#f8f9fa] text-black hover:bg-[#eceef2]'
                      }`}
                    >
                      <span className="truncate">{cat.nombre}</span>
                      <span className="text-[10px] opacity-80 ml-2">{countInCat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Rango de Precio (Tarifa COP) */}
            <div className="space-y-3 pt-2 border-t border-[#b9bbc6]/30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#ff5900]" />
                  <span>Rango de Tarifa (COP / hora)</span>
                </label>
              </div>

              {/* Slider for Max Price */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="20000"
                  max="120000"
                  step="5000"
                  value={maxPriceCOP}
                  onChange={(e) => setMaxPriceCOP(Number(e.target.value))}
                  className="w-full accent-[#ff5900] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs text-[#60646c]">
                  <span>Min: ${minPriceCOP.toLocaleString('es-CO')}</span>
                  <span className="font-semibold text-black">
                    Hasta: ${maxPriceCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => { setMinPriceCOP(20000); setMaxPriceCOP(50000); }}
                  className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                    maxPriceCOP === 50000 && minPriceCOP === 20000 
                      ? 'border-[#ff5900] bg-[#fff2eb] text-[#ff5900] font-semibold' 
                      : 'border-[#b9bbc6]/40 hover:bg-[#f3f3f7] text-black'
                  }`}
                >
                  Económico (&lt;$50k)
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPriceCOP(20000); setMaxPriceCOP(80000); }}
                  className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                    maxPriceCOP === 80000 && minPriceCOP === 20000 
                      ? 'border-[#ff5900] bg-[#fff2eb] text-[#ff5900] font-semibold' 
                      : 'border-[#b9bbc6]/40 hover:bg-[#f3f3f7] text-black'
                  }`}
                >
                  Medio (&lt;$80k)
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPriceCOP(20000); setMaxPriceCOP(120000); }}
                  className={`col-span-2 text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                    maxPriceCOP === 120000 && minPriceCOP === 20000 
                      ? 'border-[#ff5900] bg-[#fff2eb] text-[#ff5900] font-semibold' 
                      : 'border-[#b9bbc6]/40 hover:bg-[#f3f3f7] text-black'
                  }`}
                >
                  Todos los precios
                </button>
              </div>
            </div>

            {/* Filter 4: Si está disponible o no */}
            <div className="space-y-3 pt-2 border-t border-[#b9bbc6]/30">
              <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Disponibilidad Inmediata</span>
              </label>
              
              <label className="flex items-center gap-2.5 p-2 rounded-[8px] bg-[#f8f9fa] hover:bg-[#f3f3f7] cursor-pointer transition-colors border border-transparent hover:border-[#b9bbc6]/40">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-[#ff5900] rounded"
                />
                <div className="text-xs">
                  <div className="font-semibold text-black flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Disponible hoy / ahora</span>
                  </div>
                  <div className="text-[10px] text-[#60646c]">
                    Oculta trabajadores con agenda copada
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-[8px] bg-[#f8f9fa] hover:bg-[#f3f3f7] cursor-pointer transition-colors border border-transparent hover:border-[#b9bbc6]/40">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#ff5900] rounded"
                />
                <div className="text-xs">
                  <div className="font-semibold text-black flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Solo certificados Escrow (Cédula validada)</span>
                  </div>
                  <div className="text-[10px] text-[#60646c]">
                    Identidad cotejada con Registraduría
                  </div>
                </div>
              </label>
            </div>

            {/* Filter 5: Horarios de atención */}
            <div className="space-y-2 pt-2 border-t border-[#b9bbc6]/30">
              <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Horarios y Jornada</span>
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Cualquier horario' },
                  { id: '24h', label: '🚨 Servicio 24 Horas / Emergencias' },
                  { id: 'manana', label: '☀️ Mañanas (Desde 6:30 AM)' },
                  { id: 'tarde', label: '🌤️ Tardes y fines de semana' },
                  { id: 'jornada_completa', label: '📅 Lunes a Sábado completo' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-black py-1 px-1.5 rounded hover:bg-[#f3f3f7] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="schedule_filter"
                      value={item.id}
                      checked={selectedSchedule === item.id}
                      onChange={() => setSelectedSchedule(item.id)}
                      className="accent-[#ff5900]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 6: Calificación Mínima */}
            <div className="space-y-2 pt-2 border-t border-[#b9bbc6]/30">
              <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Calificación mínima</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[0, 4.0, 4.5, 4.8].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setMinRating(stars)}
                    className={`flex-1 py-1 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      minRating === stars
                        ? 'border-[#ff5900] bg-[#fff2eb] text-[#ff5900] font-bold'
                        : 'border-[#b9bbc6]/40 hover:bg-[#f3f3f7] text-black'
                    }`}
                  >
                    {stars === 0 ? 'Todas' : `${stars}★`}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* RIGHT COLUMN: SEARCH BAR, ACTIVE CHIPS & WORKER CARDS */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            
            {/* Top Toolbar: Search input + Sorting selector */}
            <div className="bg-white p-3.5 rounded-[14px] border border-[#b9bbc6]/50 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#8b8d98] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, especialidad, herramienta o barrio..."
                  className="w-full bg-[#f8f9fa] border border-[#b9bbc6]/50 rounded-[10px] pl-10 pr-4 py-2 text-xs md:text-sm text-black placeholder-[#8b8d98] focus:outline-none focus:border-[#ff5900] focus:bg-white transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-xs text-[#8b8d98] hover:text-black"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <span className="text-xs text-[#60646c] whitespace-nowrap">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-2.5 py-1.5 text-xs font-semibold text-black focus:outline-none focus:border-[#ff5900] cursor-pointer"
                >
                  <option value="relevancia">Relevancia (Strategy Multicriterio)</option>
                  <option value="cercania">Más Cercanos en Km (Strategy Haversine)</option>
                  <option value="calificacion">Mejor Calificados (5★)</option>
                  <option value="precio_menor">Menor Tarifa COP</option>
                  <option value="precio_mayor">Mayor Tarifa COP</option>
                  <option value="experiencia">Más Trabajos Completados</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="text-[#60646c] font-medium">Filtros activos:</span>
                
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#fff2eb] text-[#ff5900] px-2.5 py-1 rounded-full font-semibold border border-[#ff5900]/30">
                    Ciudad: {selectedCity}
                    <button onClick={() => setSelectedCity('all')} className="hover:text-black">✕</button>
                  </span>
                )}

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#fff2eb] text-[#ff5900] px-2.5 py-1 rounded-full font-semibold border border-[#ff5900]/30">
                    Rol: {categories.find(c => c.id === selectedCategory)?.nombre}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-black">✕</button>
                  </span>
                )}

                {maxPriceCOP < 120000 && (
                  <span className="inline-flex items-center gap-1 bg-[#fff2eb] text-[#ff5900] px-2.5 py-1 rounded-full font-semibold border border-[#ff5900]/30">
                    Hasta ${maxPriceCOP.toLocaleString('es-CO')} COP
                    <button onClick={() => setMaxPriceCOP(120000)} className="hover:text-black">✕</button>
                  </span>
                )}

                {onlyAvailable && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    Disponibles hoy
                    <button onClick={() => setOnlyAvailable(false)} className="hover:text-black">✕</button>
                  </span>
                )}

                {onlyVerified && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full font-semibold border border-blue-200">
                    Certificados
                    <button onClick={() => setOnlyVerified(false)} className="hover:text-black">✕</button>
                  </span>
                )}

                {selectedSchedule !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#f3f3f7] text-black px-2.5 py-1 rounded-full font-semibold border border-[#b9bbc6]/40">
                    Horario: {selectedSchedule}
                    <button onClick={() => setSelectedSchedule('all')} className="hover:text-black">✕</button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#60646c] hover:text-black underline ml-2 cursor-pointer"
                >
                  Borrar todos
                </button>
              </div>
            )}

            {/* WORKERS GRID */}
            {filteredWorkers.length === 0 ? (
              <div className="bg-white border border-[#b9bbc6]/50 rounded-[14px] p-12 text-center shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#fff2eb] text-[#ff5900] flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  No se encontraron trabajadores con estos filtros
                </h3>
                <p className="text-xs text-[#60646c] max-w-md mx-auto">
                  Prueba ampliando el rango de precio, cambiando la ciudad seleccionada o desactivando la casilla de disponibilidad inmediata.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-semibold rounded-[10px] transition-colors cursor-pointer"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-white border border-[#b9bbc6]/50 hover:border-[#ff5900]/80 rounded-[14px] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Worker Card Top: Avatar, Name, Verification, Rating */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="relative shrink-0">
                          <img
                            src={worker.avatarUrl}
                            alt={worker.nombre}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-full object-cover border border-[#b9bbc6]/60 shadow-xs"
                          />
                          {worker.disponible ? (
                            <span 
                              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                              title="Disponible ahora para contratación inmediata"
                            ></span>
                          ) : (
                            <span 
                              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-zinc-400 border-2 border-white"
                              title="Agenda ocupada temporalmente"
                            ></span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-black truncate group-hover:text-[#ff5900] transition-colors">
                              {worker.nombre}
                            </h3>
                            {worker.verificado && (
                              <span 
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200"
                                title="Identidad y antecedentes cotejados bajo Ley 1581"
                              >
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                <span>Verificado</span>
                              </span>
                            )}
                          </div>

                          <div className="text-xs font-medium text-[#60646c] mt-0.5 truncate">
                            {worker.categoriaNombre}
                          </div>

                          <div className="flex items-center gap-2 mt-1.5 text-xs">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{worker.calificacionPromedio.toFixed(1)}</span>
                            </div>
                            <span className="text-[#8b8d98]">•</span>
                            <span className="text-[#60646c] text-[11px]">
                              {worker.serviciosCompletados} trabajos
                            </span>
                            <span className="text-[#8b8d98]">•</span>
                            <span className="text-emerald-700 font-semibold text-[11px]">
                              100% Escrow
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location & Schedule Chips */}
                      <div className="space-y-1.5 py-2.5 border-y border-[#b9bbc6]/30 text-xs">
                        <div className="flex items-center gap-1.5 text-[#60646c]">
                          <MapPin className="w-3.5 h-3.5 text-[#ff5900] shrink-0" />
                          <span className="font-semibold text-black">{worker.ciudad}</span>
                          <span className="text-[#8b8d98] truncate">({worker.barrio})</span>
                          {typeof distanceByWorkerId[worker.id] === 'number' && (
                            <span className="ml-auto text-[10px] font-mono bg-[#fff2eb] text-[#ff5900] px-1.5 py-0.5 rounded font-bold shrink-0">
                              ~{distanceByWorkerId[worker.id]} km
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[#60646c]">
                          <Clock className="w-3.5 h-3.5 text-[#8b8d98] shrink-0" />
                          <span className="text-[11px] truncate">{worker.horarioAtencion}</span>
                        </div>
                      </div>

                      {/* Description excerpt */}
                      <p className="text-xs text-[#60646c] mt-3 line-clamp-2 leading-relaxed">
                        {worker.descripcion}
                      </p>

                      {/* Specialties tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {worker.especialidades.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#f3f3f7] text-[#60646c] px-2 py-0.5 rounded-[6px] border border-[#b9bbc6]/30 font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                        {worker.especialidades.length > 3 && (
                          <span className="text-[10px] text-[#8b8d98] px-1 py-0.5">
                            +{worker.especialidades.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Worker Card Bottom: Tarifa COP & Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-[#b9bbc6]/30 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#8b8d98] tracking-wider">
                          Tarifa estimada
                        </div>
                        <div className="text-base font-extrabold text-black tracking-tight">
                          ${worker.tarifaPorHora.toLocaleString('es-CO')}{' '}
                          <span className="text-[11px] font-medium text-[#60646c]">COP / hr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectWorker(worker)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-black hover:bg-[#f3f3f7] border border-[#b9bbc6] rounded-[10px] transition-colors cursor-pointer"
                          title="Ver portafolio de trabajos y calificaciones"
                        >
                          Ver Perfil
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenChat(worker)}
                          className="px-3 py-1.5 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-bold rounded-[10px] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="Iniciar conversación protegida y propuesta con pago en custodia Escrow"
                        >
                          <span>Contratar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
