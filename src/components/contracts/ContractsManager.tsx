import React, { useState } from 'react';
import { Contract, ContractStatus, UserRole } from '../../types';
import { 
  Lock, CheckCircle2, AlertTriangle, Clock, ArrowRight, ShieldCheck, 
  FileCheck2, DollarSign, RefreshCw, XCircle, Star, MessageSquare 
} from 'lucide-react';

interface ContractsManagerProps {
  contracts: Contract[];
  currentRole: UserRole;
  onPayEscrow: (contract: Contract) => void;
  onUpdateContractStatus: (contractId: string, newStatus: ContractStatus, note?: string) => void;
  onOpenDispute: (contract: Contract) => void;
  onOpenReview: (contract: Contract) => void;
  onOpenChatWithWorker: (workerId: string) => void;
}

export const ContractsManager: React.FC<ContractsManagerProps> = ({
  contracts,
  currentRole,
  onPayEscrow,
  onUpdateContractStatus,
  onOpenDispute,
  onOpenReview,
  onOpenChatWithWorker
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  const [expandedContractId, setExpandedContractId] = useState<string | null>(contracts[0]?.id || null);

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case 'oferta_enviada':
        return { label: 'Oferta Enviada', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'pendiente_pago':
        return { label: 'Pendiente de Pago', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
      case 'pagado_escrow':
        return { label: 'Pagado en Custodia (Escrow)', color: 'bg-orange-50 text-[#ff5900] border-[#ff5900]/30 font-bold' };
      case 'en_curso':
        return { label: 'Servicio en Curso', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'terminado':
        return { label: 'Trabajador Marcó Terminado', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'completado':
        return { label: 'Completado & Fondos Liberados', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' };
      case 'en_disputa':
        return { label: 'En Disputa (Fondos Congelados)', color: 'bg-rose-50 text-rose-800 border-rose-300 font-bold' };
      case 'cancelado':
        return { label: 'Cancelado / Reembolsado', color: 'bg-slate-100 text-slate-700 border-slate-300' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const filteredContracts = contracts.filter((c) => {
    if (selectedStatusFilter === 'todos') return true;
    if (selectedStatusFilter === 'activos') {
      return ['pendiente_pago', 'pagado_escrow', 'en_curso', 'terminado'].includes(c.estado);
    }
    if (selectedStatusFilter === 'completados') return c.estado === 'completado';
    if (selectedStatusFilter === 'disputas') return c.estado === 'en_disputa';
    return true;
  });

  return (
    <section className="w-full bg-white py-10 min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#ff5900] mb-1 tracking-wide">
              MÁQUINA DE ESTADOS & ESCROW (SRS SECCIÓN 4)
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
              Gestión de Contratos y Pagos en Custodia
            </h2>
            <p className="text-xs text-[#60646c] mt-1">
              Trazabilidad inmutable de cada transición. Los fondos quedan retenidos hasta la aprobación de satisfacción.
            </p>
          </div>

          {/* Quick tab filter (buttons, allowed per frontend-design) */}
          <div className="flex items-center text-xs font-medium bg-[#f3f3f7] rounded-[10px] p-1 border border-[#b9bbc6]/40">
            <button
              onClick={() => setSelectedStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-[8px] cursor-pointer transition-colors ${
                selectedStatusFilter === 'todos' ? 'bg-white text-black font-bold shadow-xs' : 'text-[#60646c]'
              }`}
            >
              Todos ({contracts.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('activos')}
              className={`px-3 py-1.5 rounded-[8px] cursor-pointer transition-colors ${
                selectedStatusFilter === 'activos' ? 'bg-white text-black font-bold shadow-xs' : 'text-[#60646c]'
              }`}
            >
              Activos / En Custodia
            </button>
            <button
              onClick={() => setSelectedStatusFilter('completados')}
              className={`px-3 py-1.5 rounded-[8px] cursor-pointer transition-colors ${
                selectedStatusFilter === 'completados' ? 'bg-white text-black font-bold shadow-xs' : 'text-[#60646c]'
              }`}
            >
              Completados
            </button>
            <button
              onClick={() => setSelectedStatusFilter('disputas')}
              className={`px-3 py-1.5 rounded-[8px] cursor-pointer transition-colors ${
                selectedStatusFilter === 'disputas' ? 'bg-white text-black font-bold shadow-xs' : 'text-[#60646c]'
              }`}
            >
              Disputas
            </button>
          </div>
        </div>

        {/* Contracts List */}
        {filteredContracts.length === 0 ? (
          <div className="p-12 text-center bg-[#f3f3f7] rounded-[12px] border border-[#b9bbc6]/40">
            <FileCheck2 className="w-8 h-8 text-[#8b8d98] mx-auto mb-2" />
            <p className="text-sm font-semibold text-black">No hay contratos en esta categoría.</p>
            <p className="text-xs text-[#60646c] mt-1">Busca un trabajador y solicita una cotización formal para iniciar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((c) => {
              const badge = getStatusBadge(c.estado);
              const isExpanded = expandedContractId === c.id;

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-5 shadow-xs transition-all"
                >
                  {/* Top Contract Summary Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-black">{c.codigoRadicado}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-[6px] border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-[#8b8d98]">· {c.fechaCreacion}</span>
                      </div>

                      <h3 className="text-sm font-bold text-black">
                        {c.descripcionServicio}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-[#60646c]">
                        <span>Cliente: <strong className="text-black">{c.clienteNombre}</strong></span>
                        <span>·</span>
                        <span>Trabajador: <strong className="text-black">{c.trabajadorNombre}</strong></span>
                        <span>·</span>
                        <span className="text-[#8b8d98]">{c.categoriaNombre}</span>
                      </div>
                    </div>

                    {/* Financial summary + Quick Action */}
                    <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[#8b8d98] block">Monto en Escrow</span>
                        <span className="text-base font-black text-black tabular-nums">
                          ${c.montoBrutoCOP.toLocaleString('es-CO')} COP
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedContractId(isExpanded ? null : c.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[8px] hover:bg-[#f3f3f7] cursor-pointer"
                      >
                        {isExpanded ? 'Ocultar detalles' : 'Gestionar estado'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded State Machine Details & Interactive Transitions */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-[#f3f3f7] space-y-6">
                      
                      {/* State Machine Visual Stepper */}
                      <div className="bg-[#f3f3f7] p-4 rounded-[10px] border border-[#b9bbc6]/40">
                        <div className="text-xs font-bold text-black mb-3 flex items-center justify-between">
                          <span>Línea de Tiempo del Contrato (§4.1)</span>
                          <span className="text-[11px] font-normal text-[#60646c]">
                            Comisión plataforma 10%: ${c.comisionCOP.toLocaleString('es-CO')} COP · Neto trabajador: ${c.montoNetoTrabajadorCOP.toLocaleString('es-CO')} COP
                          </span>
                        </div>

                        {/* Dynamic Progress Bar (SRS RF-13, RF-23) */}
                        <div className="mb-3.5 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] text-[#60646c]">
                            <span>Progreso de ejecución y custodia</span>
                            <span className="font-semibold text-black">
                              {c.estado === 'oferta_enviada' && '20% · Negociación'}
                              {c.estado === 'pendiente_pago' && '40% · Esperando Custodia'}
                              {c.estado === 'pagado_escrow' && '60% · Fondos Retenidos en Escrow'}
                              {c.estado === 'en_curso' && '75% · Trabajo en Sitio'}
                              {c.estado === 'terminado' && '90% · Esperando Visto Bueno (72h)'}
                              {c.estado === 'completado' && '100% · Fondos Desembolsados'}
                              {c.estado === 'en_disputa' && 'Fondos Congelados en Mediación'}
                              {c.estado === 'cancelado' && 'Contrato Reembolsado'}
                            </span>
                          </div>
                          <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#b9bbc6]/40">
                            <div 
                              className="bg-[#ff5900] h-full transition-all duration-500 ease-out"
                              style={{
                                width: c.estado === 'oferta_enviada' ? '20%' :
                                       c.estado === 'pendiente_pago' ? '40%' :
                                       c.estado === 'pagado_escrow' ? '60%' :
                                       c.estado === 'en_curso' ? '75%' :
                                       c.estado === 'terminado' ? '90%' :
                                       c.estado === 'completado' ? '100%' : '50%'
                              }}
                            />
                          </div>
                        </div>

                        {/* Interactive transition steps */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                          <div className={`p-2 rounded-[6px] border transition-smooth ${c.estado !== 'oferta_enviada' ? 'bg-white border-emerald-500 text-emerald-800' : 'bg-white border-[#ff5900] font-bold shadow-xs'}`}>
                            <div className="text-[10px] text-[#8b8d98]">1. Oferta</div>
                            <div className="text-xs">Formalizada</div>
                          </div>

                          <div className={`p-2 rounded-[6px] border transition-smooth ${['pagado_escrow', 'en_curso', 'terminado', 'completado'].includes(c.estado) ? 'bg-white border-emerald-500 text-emerald-800' : c.estado === 'pendiente_pago' ? 'bg-white border-[#ff5900] font-bold shadow-xs' : 'bg-white/50 border-[#b9bbc6]/40 text-[#8b8d98]'}`}>
                            <div className="text-[10px] text-[#8b8d98]">2. Pago</div>
                            <div className="text-xs">Custodia Escrow</div>
                          </div>

                          <div className={`p-2 rounded-[6px] border transition-smooth ${['en_curso', 'terminado', 'completado'].includes(c.estado) ? 'bg-white border-emerald-500 text-emerald-800' : c.estado === 'pagado_escrow' ? 'bg-white border-[#ff5900] font-bold shadow-xs' : 'bg-white/50 border-[#b9bbc6]/40 text-[#8b8d98]'}`}>
                            <div className="text-[10px] text-[#8b8d98]">3. Ejecución</div>
                            <div className="text-xs">En curso</div>
                          </div>

                          <div className={`p-2 rounded-[6px] border transition-smooth ${c.estado === 'completado' ? 'bg-white border-emerald-500 text-emerald-800' : c.estado === 'terminado' ? 'bg-white border-[#ff5900] font-bold shadow-xs' : 'bg-white/50 border-[#b9bbc6]/40 text-[#8b8d98]'}`}>
                            <div className="text-[10px] text-[#8b8d98]">4. Entrega</div>
                            <div className="text-xs">Terminado</div>
                          </div>

                          <div className={`p-2 rounded-[6px] border transition-smooth ${c.estado === 'completado' ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold shadow-xs' : 'bg-white/50 border-[#b9bbc6]/40 text-[#8b8d98]'}`}>
                            <div className="text-[10px] text-[#8b8d98]">5. Cierre</div>
                            <div className="text-xs">Desembolso</div>
                          </div>
                        </div>
                      </div>

                      {/* State Specific Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-[10px] border border-[#b9bbc6]/50">
                        
                        <div>
                          <div className="text-xs font-bold text-black">Acciones disponibles para este estado:</div>
                          <div className="text-[11px] text-[#60646c]">
                            {c.estado === 'pendiente_pago' && 'El cliente debe consignar en escrow para que el trabajador pueda iniciar.'}
                            {c.estado === 'pagado_escrow' && 'Fondos retenidos. El trabajador ya puede desplazarse y marcar inicio de servicio.'}
                            {c.estado === 'en_curso' && 'El servicio está siendo ejecutado. Al finalizar, el trabajador marca como terminado.'}
                            {c.estado === 'terminado' && 'El trabajador terminó. Si el cliente no responde en 72h, se libera automáticamente (RF-24).'}
                            {c.estado === 'completado' && 'Fondos acreditados al trabajador. Pueden calificarse mutuamente (RF-32).'}
                            {c.estado === 'en_disputa' && 'Los fondos están congelados hasta la resolución del equipo de auditoría.'}
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          
                          {/* Case 1: Pendiente de pago */}
                          {c.estado === 'pendiente_pago' && (
                            <button
                              onClick={() => onPayEscrow(c)}
                              className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[8px] cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Pagar en Escrow (${c.montoBrutoCOP.toLocaleString('es-CO')} COP)</span>
                            </button>
                          )}

                          {/* Case 2: Pagado en escrow */}
                          {c.estado === 'pagado_escrow' && (
                            <>
                              <button
                                onClick={() => onUpdateContractStatus(c.id, 'en_curso', 'Trabajador inició labores en el sitio.')}
                                className="px-3.5 py-2 text-xs font-semibold text-white bg-black hover:bg-slate-800 rounded-[8px] cursor-pointer"
                              >
                                Iniciar Servicio en el Sitio
                              </button>
                              <button
                                onClick={() => onUpdateContractStatus(c.id, 'cancelado', 'Cancelado antes de iniciar. Reembolso 100% al cliente.')}
                                className="px-3 py-2 text-xs font-medium text-rose-700 border border-rose-300 rounded-[8px] hover:bg-rose-50 cursor-pointer"
                              >
                                Cancelar (Reembolso 100%)
                              </button>
                            </>
                          )}

                          {/* Case 3: En curso */}
                          {c.estado === 'en_curso' && (
                            <>
                              <button
                                onClick={() => onUpdateContractStatus(c.id, 'terminado', 'Trabajador declaró el servicio terminado a satisfacción.')}
                                className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[8px] cursor-pointer"
                              >
                                Marcar como Terminado
                              </button>
                              <button
                                onClick={() => onOpenDispute(c)}
                                className="px-3 py-2 text-xs font-medium text-rose-700 border border-rose-300 rounded-[8px] hover:bg-rose-50 cursor-pointer"
                              >
                                Abrir Disputa
                              </button>
                            </>
                          )}

                          {/* Case 4: Terminado */}
                          {c.estado === 'terminado' && (
                            <>
                              <button
                                onClick={() => onUpdateContractStatus(c.id, 'completado', 'Cliente verificó el servicio a plena satisfacción. Fondos liberados.')}
                                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-[8px] cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Aprobar y Liberar Fondos</span>
                              </button>
                              <button
                                onClick={() => onOpenDispute(c)}
                                className="px-3 py-2 text-xs font-medium text-rose-700 border border-rose-300 rounded-[8px] hover:bg-rose-50 cursor-pointer"
                              >
                                Reclamar / Abrir Disputa
                              </button>
                            </>
                          )}

                          {/* Case 5: Completado */}
                          {c.estado === 'completado' && (
                            <button
                              onClick={() => onOpenReview(c)}
                              className="px-4 py-2 text-xs font-semibold text-black bg-[#f3f3f7] hover:bg-slate-200 border border-[#b9bbc6] rounded-[8px] cursor-pointer flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#ff5900] text-[#ff5900]" />
                              <span>Dejar Calificación & Reseña (RF-32)</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenChatWithWorker(c.trabajadorId)}
                            className="px-3 py-2 text-xs font-medium text-black border border-[#b9bbc6] rounded-[8px] hover:bg-[#f3f3f7] cursor-pointer flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Abrir Chat</span>
                          </button>
                        </div>
                      </div>

                      {/* Audit Log / History Entries (RF-23) */}
                      <div>
                        <div className="text-xs font-bold text-black mb-2">Registro de Auditoría e Historial (RF-23):</div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {c.historialEstados.map((h, i) => (
                            <div key={i} className="text-[11px] p-2 bg-[#f3f3f7] rounded-[6px] border border-[#b9bbc6]/20 flex items-start justify-between gap-2">
                              <div>
                                <span className="font-semibold text-black">[{h.estado.toUpperCase()}]</span>
                                <span className="text-[#60646c] ml-1.5">{h.nota || 'Transición registrada en el sistema.'}</span>
                              </div>
                              <div className="text-[10px] text-[#8b8d98] shrink-0">
                                {h.autor} · {h.fecha}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
