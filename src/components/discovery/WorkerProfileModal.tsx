import React, { useState } from 'react';
import { WorkerProfile, Review } from '../../types';
import { X, ShieldCheck, MapPin, Star, Clock, CheckCircle2, MessageSquare, Image, AlertCircle } from 'lucide-react';

interface WorkerProfileModalProps {
  worker: WorkerProfile;
  reviews: Review[];
  onClose: () => void;
  onOpenChat: (worker: WorkerProfile) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  reviews,
  onClose,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'sobre_mi' | 'portafolio' | 'resenas'>('sobre_mi');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const workerReviews = reviews.filter(r => r.destinatarioId === worker.id || r.destinatarioId === worker.userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-[16px] border border-[#b9bbc6] shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-[#f3f3f7] flex items-start justify-between gap-4 bg-white sticky top-0 z-10">
          <div className="flex items-start gap-4">
            <img
              src={worker.avatarUrl}
              alt={worker.nombre}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-[12px] object-cover border border-[#b9bbc6]/50 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black tracking-tight">{worker.nombre}</h2>
                {worker.verificado && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff5900] bg-[#f3f3f7] px-2 py-0.5 rounded-[6px] border border-[#ff5900]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff5900]" />
                    <span>Identidad Verificada</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-[#60646c] mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-black font-semibold">{worker.categoriaNombre}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-black font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#ff5900] text-[#ff5900]" />
                  <span className="tabular-nums">{worker.calificacionPromedio.toFixed(1)}</span>
                </span>
                <span>({worker.serviciosCompletados} servicios terminados)</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#60646c] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8b8d98]" />
                <span>{worker.barrio} (Cobertura: {worker.radioKm} km)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-[#8b8d98] hover:text-black rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs within modal */}
        <div className="px-6 border-b border-[#f3f3f7] flex items-center gap-6 text-xs font-medium bg-[#f3f3f7]/50">
          <button
            onClick={() => setActiveTab('sobre_mi')}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'sobre_mi'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            Información & Tarifas
          </button>
          <button
            onClick={() => setActiveTab('portafolio')}
            className={`py-3 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'portafolio'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <span>Portafolio de Trabajos</span>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#b9bbc6]/40 text-black">
              {worker.portafolio.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('resenas')}
            className={`py-3 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'resenas'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <span>Reseñas de Clientes</span>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#b9bbc6]/40 text-black">
              {workerReviews.length}
            </span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'sobre_mi' && (
            <div className="space-y-6">
              
              <div>
                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Descripción del profesional</h4>
                <p className="text-sm text-[#60646c] leading-relaxed">
                  {worker.descripcion}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Habilidades y servicios comprobados</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {worker.especialidades.map((esp, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#f3f3f7] text-xs font-medium text-black border border-[#b9bbc6]/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5900] shrink-0" />
                      <span>{esp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial & Security guarantees */}
              <div className="p-4 rounded-[12px] bg-[#f3f3f7] border border-[#b9bbc6]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-black">
                  <span>Tarifa base pactable</span>
                  <span className="text-base text-black tabular-nums font-bold">
                    ${worker.tarifaPorHora.toLocaleString('es-CO')} COP / hora
                  </span>
                </div>
                <div className="text-xs text-[#60646c] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#ff5900]" />
                    <span>Pago protegido con retención de fondos (Escrow) de Échele Camello.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#ff5900]" />
                    <span>Comisión de plataforma del 10% ya calculada en cotización formal.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#ff5900]" />
                    <span>Horario habitual: {worker.horarioAtencion}</span>
                  </div>
                </div>
              </div>

              {/* Privacy Notice (RF-05) */}
              <div className="p-3 bg-white rounded-[10px] border border-[#b9bbc6]/40 flex items-start gap-2 text-xs text-[#60646c]">
                <AlertCircle className="w-4 h-4 text-[#8b8d98] shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de Privacidad (RF-05 / Ley 1581):</strong> La dirección y contacto directo del trabajador o del cliente solo se habilitan una vez aceptada la oferta formal y retenido el pago en escrow, garantizando seguridad física y evitando fraudes.
                </span>
              </div>

            </div>
          )}

          {activeTab === 'portafolio' && (
            <div className="space-y-4">
              <div className="text-xs text-[#60646c]">
                Evidencia fotográfica de trabajos ejecutados anteriormente (RF-10, máx 12 fotos):
              </div>

              {worker.portafolio.length === 0 ? (
                <div className="p-8 text-center bg-[#f3f3f7] rounded-[12px]">
                  <p className="text-xs text-[#60646c]">Este trabajador no ha cargado fotografías de portafolio todavía.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {worker.portafolio.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-[12px] border border-[#b9bbc6]/50 overflow-hidden group cursor-pointer hover:border-[#ff5900]"
                      onClick={() => setSelectedPhoto(item.fotoUrl)}
                    >
                      <div className="h-44 overflow-hidden relative bg-[#f3f3f7]">
                        <img
                          src={item.fotoUrl}
                          alt={item.titulo}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-[4px]">
                          {item.fecha}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h5 className="text-xs font-bold text-black">{item.titulo}</h5>
                        <p className="text-[11px] text-[#60646c] line-clamp-2">{item.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f3f7]">
                <div>
                  <div className="text-sm font-bold text-black">Calificación Global</div>
                  <div className="text-xs text-[#60646c]">Basada en contratos verificados y completados en plataforma</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-black flex items-center justify-end gap-1">
                    <Star className="w-5 h-5 fill-[#ff5900] text-[#ff5900]" />
                    <span className="tabular-nums">{worker.calificacionPromedio.toFixed(1)}</span>
                  </div>
                  <div className="text-[11px] text-[#8b8d98]">{worker.reseñasCount} valoraciones</div>
                </div>
              </div>

              {workerReviews.length === 0 ? (
                <div className="p-8 text-center bg-[#f3f3f7] rounded-[12px]">
                  <p className="text-xs text-[#60646c]">No hay reseñas registradas aún para este perfil.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {workerReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-[12px] bg-[#f3f3f7] border border-[#b9bbc6]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black">{rev.autorNombre}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < rev.puntuacion
                                  ? 'fill-[#ff5900] text-[#ff5900]'
                                  : 'text-[#b9bbc6]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#60646c] leading-relaxed">
                        "{rev.comentario}"
                      </p>
                      {rev.respuesta && (
                        <div className="mt-2 pl-3 border-l-2 border-[#ff5900] text-[11px] text-black bg-white p-2 rounded-[6px]">
                          <strong className="block text-[#ff5900]">Respuesta de {worker.nombre}:</strong>
                          <span>{rev.respuesta}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-[#8b8d98] text-right">
                        {rev.fecha}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 border-t border-[#f3f3f7] bg-white flex items-center justify-between gap-4">
          <div className="text-xs text-[#60646c]">
            <span>Tarifa base: </span>
            <strong className="text-black font-semibold tabular-nums">${worker.tarifaPorHora.toLocaleString('es-CO')} COP/h</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenChat(worker);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chatear y Solicitar Oferta</span>
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox for portfolio */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh]">
            <img src={selectedPhoto} alt="Ampliación de portafolio" className="max-w-full max-h-[80vh] object-contain rounded-[8px]" />
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-black/50 px-3 py-1 rounded cursor-pointer"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
