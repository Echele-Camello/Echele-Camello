import React, { useState, useMemo } from 'react';
import { WorkerProfile, WorkerCategory } from '../../types';
import { Search, ShieldCheck, MapPin, Star, Clock, Filter, ArrowRight } from 'lucide-react';
import { platformGateway } from '../../architecture/gateway/ApiGateway';

interface WorkerDiscoveryProps {
  workers: WorkerProfile[];
  categories: WorkerCategory[];
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenChat: (worker: WorkerProfile) => void;
  initialCategory?: string;
  initialQuery?: string;
}

export const WorkerDiscovery: React.FC<WorkerDiscoveryProps> = ({
  workers,
  categories,
  onSelectWorker,
  onOpenChat,
  initialCategory,
  initialQuery
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxRadiusKm, setMaxRadiusKm] = useState(20);
  const [sortBy, setSortBy] = useState<'cercania' | 'calificacion' | 'precio_menor' | 'experiencia'>('cercania');

  const searchResults = useMemo(() => {
    const res = platformGateway.msBusqueda.searchWorkers(workers, {
      termino: searchTerm,
      categoriaId: selectedCategory,
      soloVerificados: onlyVerified,
      soloDisponibles: onlyAvailable,
      estrategiaOrdenamiento: sortBy
    });
    return res.filter((r) => r.worker.radioKm <= maxRadiusKm || maxRadiusKm >= 20);
  }, [workers, searchTerm, selectedCategory, onlyVerified, onlyAvailable, maxRadiusKm, sortBy]);

  const filteredWorkers = useMemo(() => searchResults.map((r) => r.worker), [searchResults]);
  const distanceByWorkerId = useMemo(() => {
    const map: Record<string, number> = {};
    searchResults.forEach((r) => {
      map[r.worker.id] = r.distanciaKm;
    });
    return map;
  }, [searchResults]);

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#ff5900] mb-1 tracking-wide">
              BÚSQUEDA GEOLOCALIZADA & PRIVACIDAD (RF-14, RF-05)
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
              Especialistas y Oficios Disponibles en Bogotá
            </h2>
            <p className="text-xs text-[#60646c] mt-1">
              La dirección exacta se mantiene privada hasta confirmar el contrato. Solo se expone la zona aproximada.
            </p>
          </div>

          <div className="text-xs text-[#60646c]">
            Mostrando <strong className="text-black font-semibold">{filteredWorkers.length}</strong> trabajadores activos
          </div>
        </div>

        {/* Filter Toolbar (Brex clean style) */}
        <div className="bg-[#f3f3f7] p-4 rounded-[12px] border border-[#b9bbc6]/40 mb-8 space-y-4">
          
          {/* Main search and category row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            <div className="md:col-span-5 relative flex items-center bg-white rounded-[10px] border border-[#b9bbc6]/50 px-3 py-2">
              <Search className="w-4 h-4 text-[#8b8d98] mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por especialidad, oficio o nombre..."
                className="w-full text-xs text-black placeholder:text-[#8b8d98] bg-transparent outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-[#8b8d98] hover:text-black cursor-pointer ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="md:col-span-4 bg-white rounded-[10px] border border-[#b9bbc6]/50 px-3 py-2 flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filtrar por categoría"
                className="w-full text-xs font-medium text-black bg-transparent outline-none cursor-pointer"
              >
                <option value="all">Todas las categorías de oficio</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 bg-white rounded-[10px] border border-[#b9bbc6]/50 px-3 py-2 flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Ordenar resultados"
                className="w-full text-xs font-medium text-black bg-transparent outline-none cursor-pointer"
              >
                <option value="cercania">Más Cercanos en Km (Strategy Haversine)</option>
                <option value="calificacion">Mejor Calificados (★ 5.0)</option>
                <option value="precio_menor">Tarifa base más económica</option>
                <option value="experiencia">Más servicios completados</option>
              </select>
            </div>

          </div>

          {/* Quick toggle chips & radius slider */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#b9bbc6]/30 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-black">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-[#ff5900] focus:ring-[#ff5900] accent-[#ff5900]"
                />
                <span>Solo con documento verificado</span>
              </label>

              <span className="text-[#b9bbc6]">·</span>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-black">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-[#ff5900] focus:ring-[#ff5900] accent-[#ff5900]"
                />
                <span>Disponible de inmediato</span>
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#60646c]">
              <span>Radio de cobertura:</span>
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                className="w-24 accent-[#ff5900] cursor-pointer"
              />
              <span className="font-semibold text-black tabular-nums">{maxRadiusKm} km</span>
            </div>
          </div>

        </div>

        {/* Worker Cards Grid (Brex Style: Paper canvas, 12px radius, hairline border, no slop pills) */}
        {filteredWorkers.length === 0 ? (
          <div className="p-12 text-center border border-[#b9bbc6]/40 rounded-[12px] bg-[#f3f3f7]">
            <p className="text-sm font-medium text-black">No se encontraron trabajadores con estos filtros.</p>
            <p className="text-xs text-[#60646c] mt-1">Prueba ampliando el radio de búsqueda o cambiando la categoría.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setOnlyVerified(false);
                setOnlyAvailable(false);
                setMaxRadiusKm(20);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#ff5900] rounded-[10px] cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 flex flex-col justify-between hover:border-[#ff5900] hover:-translate-y-0.5 transition-smooth shadow-xs"
              >
                <div>
                  
                  {/* Top row: Avatar + Identity + Verified Status */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <img
                      src={worker.avatarUrl}
                      alt={worker.nombre}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-[10px] object-cover border border-[#b9bbc6]/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-semibold text-black tracking-tight truncate">
                          {worker.nombre}
                        </h3>
                        {worker.verificado && (
                          <span title="Identidad Verificada por Échele Camello" className="inline-flex items-center text-[#ff5900]">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      
                      {/* Zero-pill metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-[#60646c] mt-0.5 flex-wrap">
                        <span className="text-black font-medium">{worker.categoriaNombre.split('(')[0]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5 text-black font-semibold">
                          <Star className="w-3.5 h-3.5 fill-[#ff5900] text-[#ff5900]" />
                          <span className="tabular-nums">{worker.calificacionPromedio.toFixed(1)}</span>
                        </span>
                        <span className="text-[#8b8d98]">({worker.serviciosCompletados} serv.)</span>
                      </div>
                    </div>
                  </div>

                  {/* Coverage zone & Privacy note */}
                  <div className="flex items-center gap-1.5 text-xs text-[#60646c] mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#8b8d98] shrink-0" />
                    <span className="truncate">{worker.barrio}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-black tabular-nums font-medium">{worker.radioKm} km cob.</span>
                    {typeof distanceByWorkerId[worker.id] === 'number' && (
                      <span className="ml-auto text-[10px] font-mono bg-[#fff2eb] text-[#ff5900] px-1.5 py-0.5 rounded font-bold">
                        ~{distanceByWorkerId[worker.id]} km
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#60646c] line-clamp-2 leading-relaxed mb-4">
                    {worker.descripcion}
                  </p>

                  {/* Specialties tags (styled with subtle hairline box, no loud pills) */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {worker.especialidades.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-black bg-[#f3f3f7] px-2 py-0.5 rounded-[6px] border border-[#b9bbc6]/40"
                      >
                        {spec}
                      </span>
                    ))}
                    {worker.especialidades.length > 3 && (
                      <span className="text-[11px] text-[#8b8d98] self-center">
                        +{worker.especialidades.length - 3}
                      </span>
                    )}
                  </div>

                </div>

                {/* Bottom actions & Rate */}
                <div className="pt-4 border-t border-[#f3f3f7] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#8b8d98] block">Tarifa estimada base</span>
                    <span className="text-sm font-bold text-black tabular-nums">
                      ${worker.tarifaPorHora.toLocaleString('es-CO')} COP
                      <span className="text-[10px] font-normal text-[#60646c]"> /hora</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectWorker(worker)}
                      className="px-3 py-1.5 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] transition-colors cursor-pointer"
                    >
                      Ver perfil
                    </button>
                    <button
                      onClick={() => onOpenChat(worker)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Cotizar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
