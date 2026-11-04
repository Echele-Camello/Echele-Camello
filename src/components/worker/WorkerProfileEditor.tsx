import React, { useState } from 'react';
import { WorkerProfile, WorkerCategory, PortfolioItem } from '../../types';
import { ShieldCheck, Upload, CheckCircle2, Image, Clock, MapPin, DollarSign, Plus, Trash2 } from 'lucide-react';

interface WorkerProfileEditorProps {
  currentWorker: WorkerProfile;
  categories: WorkerCategory[];
  onSaveWorkerProfile: (updated: WorkerProfile) => void;
  onRequestVerification: (workerId: string) => void;
}

export const WorkerProfileEditor: React.FC<WorkerProfileEditorProps> = ({
  currentWorker,
  categories,
  onSaveWorkerProfile,
  onRequestVerification
}) => {
  const [nombre, setNombre] = useState(currentWorker.nombre);
  const [categoriaId, setCategoriaId] = useState(currentWorker.categoriaId);
  const [tarifaPorHora, setTarifaPorHora] = useState(currentWorker.tarifaPorHora);
  const [barrio, setBarrio] = useState(currentWorker.barrio);
  const [radioKm, setRadioKm] = useState(currentWorker.radioKm);
  const [descripcion, setDescripcion] = useState(currentWorker.descripcion);
  const [especialidadesText, setEspecialidadesText] = useState(currentWorker.especialidades.join(', '));
  const [disponible, setDisponible] = useState(currentWorker.disponible);
  const [horarioAtencion, setHorarioAtencion] = useState(currentWorker.horarioAtencion);
  const [portafolio, setPortafolio] = useState<PortfolioItem[]>(currentWorker.portafolio);

  // New portfolio item subform
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImgUrl.trim()) return;

    if (portafolio.length >= 12) {
      alert('Máximo 12 fotos permitidas por portafolio (RF-10).');
      return;
    }

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      titulo: newTitle.trim(),
      descripcion: newDesc.trim() || 'Servicio ejecutado a satisfacción.',
      fotoUrl: newImgUrl.trim(),
      fecha: 'Reciente'
    };

    setPortafolio([...portafolio, newItem]);
    setNewTitle('');
    setNewDesc('');
    setNewImgUrl('');
    setShowAddPhoto(false);
  };

  const handleRemovePortfolio = (id: string) => {
    setPortafolio(portafolio.filter(p => p.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === categoriaId);

    const updated: WorkerProfile = {
      ...currentWorker,
      nombre,
      categoriaId,
      categoriaNombre: cat ? cat.nombre : currentWorker.categoriaNombre,
      tarifaPorHora,
      barrio,
      radioKm,
      descripcion,
      especialidades: especialidadesText.split(',').map(s => s.trim()).filter(Boolean),
      disponible,
      horarioAtencion,
      portafolio
    };

    onSaveWorkerProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <section className="w-full bg-[#f3f3f7] py-10 min-h-[80vh]">
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-[#ff5900] mb-1">
              EXPEDIENTE LABORAL DEL TRABAJADOR (SRS RF-08, RF-10, RF-11)
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Gestiona tu Perfil de Oficios y Tarifas
            </h2>
            <p className="text-xs text-[#60646c] mt-0.5">
              Publica tu información técnica para recibir solicitudes y emitir cotizaciones formales.
            </p>
          </div>

          {currentWorker.verificado ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5900] bg-white px-3 py-1.5 rounded-[10px] border border-[#ff5900]/40 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#ff5900]" />
              <span>Insignia Verificado Activa</span>
            </span>
          ) : (
            <button
              onClick={() => onRequestVerification(currentWorker.id)}
              className="text-xs font-semibold text-white bg-black hover:bg-slate-800 px-3.5 py-2 rounded-[10px] cursor-pointer"
            >
              Solicitar Verificación de Identidad (RF-09)
            </button>
          )}
        </div>

        {isSaved && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-[10px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Perfil laboral guardado con éxito. Cambios reflejados de inmediato en búsquedas.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Box 1: Core Details */}
          <div className="bg-white p-6 rounded-[12px] border border-[#b9bbc6]/50 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-black border-b border-[#f3f3f7] pb-2">
              Datos Principales y Categoría de Oficio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Nombre completo:</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Categoría de servicio:</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] bg-white text-black"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Tarifa base por hora / visita (COP):</label>
                <input
                  type="number"
                  min="20000"
                  step="5000"
                  required
                  value={tarifaPorHora}
                  onChange={(e) => setTarifaPorHora(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] font-bold text-black tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Horario habitual de atención:</label>
                <input
                  type="text"
                  value={horarioAtencion}
                  onChange={(e) => setHorarioAtencion(e.target.value)}
                  placeholder="Lunes a Sábado: 8:00 AM - 6:00 PM"
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Descripción y trayectoria profesional:</label>
              <textarea
                rows={3}
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full text-xs p-3 rounded-[8px] border border-[#b9bbc6] text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Especialidades o habilidades (separadas por comas):
              </label>
              <input
                type="text"
                value={especialidadesText}
                onChange={(e) => setEspecialidadesText(e.target.value)}
                placeholder="Detección de fugas, destapes, calentadores..."
                className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] text-black"
              />
            </div>
          </div>

          {/* Box 2: Geolocation & Coverage */}
          <div className="bg-white p-6 rounded-[12px] border border-[#b9bbc6]/50 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-black border-b border-[#f3f3f7] pb-2">
              Zona de Cobertura y Disponibilidad (RF-11)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Barrios o zona aproximada:</label>
                <input
                  type="text"
                  required
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] text-black"
                />
                <span className="text-[10px] text-[#8b8d98] mt-1 block">
                  Por seguridad (RF-05), la dirección exacta nunca se expone públicamente.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Radio máximo de desplazamiento: <span className="text-[#ff5900]">{radioKm} km</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={radioKm}
                  onChange={(e) => setRadioKm(Number(e.target.value))}
                  className="w-full accent-[#ff5900] cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="accent-[#ff5900] rounded"
                />
                <span className="text-xs font-bold text-black">
                  Actualmente disponible para recibir nuevas cotizaciones
                </span>
              </label>
            </div>
          </div>

          {/* Box 3: Portfolio Management (RF-10) */}
          <div className="bg-white p-6 rounded-[12px] border border-[#b9bbc6]/50 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f3f3f7] pb-2">
              <div>
                <h3 className="text-sm font-bold text-black">
                  Portafolio de Trabajos Anteriores (RF-10)
                </h3>
                <span className="text-[11px] text-[#60646c]">Hasta 12 fotografías con compresión automática.</span>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPhoto(!showAddPhoto)}
                className="px-3 py-1.5 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[8px] hover:bg-[#f3f3f7] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Agregar foto</span>
              </button>
            </div>

            {/* Subform to add photo */}
            {showAddPhoto && (
              <div className="p-4 bg-[#f3f3f7] rounded-[10px] border border-[#b9bbc6]/40 space-y-3">
                <div className="text-xs font-bold text-black">Añadir trabajo al portafolio</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Título del trabajo (ej: Cambio de grifería)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white text-black"
                  />
                  <input
                    type="text"
                    placeholder="URL de foto o evidencia"
                    value={newImgUrl}
                    onChange={(e) => setNewImgUrl(e.target.value)}
                    className="text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white text-black"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Breve descripción del resultado..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white text-black"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPhoto(false)}
                    className="text-xs text-[#60646c] hover:underline cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPortfolio}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-black rounded-[6px] cursor-pointer"
                  >
                    Guardar en portafolio
                  </button>
                </div>
              </div>
            )}

            {/* Existing photos grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {portafolio.map((item) => (
                <div key={item.id} className="relative rounded-[8px] overflow-hidden border border-[#b9bbc6]/40 bg-[#f3f3f7] group">
                  <img src={item.fotoUrl} alt={item.titulo} className="w-full h-32 object-cover" />
                  <div className="p-2 bg-white text-xs">
                    <div className="font-bold text-black truncate">{item.titulo}</div>
                    <div className="text-[10px] text-[#60646c] truncate">{item.descripcion}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolio(item.id)}
                    className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Submit bar */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs md:text-sm font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] shadow-xs cursor-pointer"
            >
              Guardar Cambios del Expediente
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};
