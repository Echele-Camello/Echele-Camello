import React, { useState } from 'react';
import { User, WorkerProfile, WorkerCategory, Contract } from '../../types';
import { WorkerDiscovery } from '../discovery/WorkerDiscovery';
import { ContractsManager } from '../contracts/ContractsManager';
import { EscrowExplanationView } from '../landing/EscrowExplanationView';
import { 
  Search, ShieldCheck, Lock, FileCheck2, UserCheck, 
  ArrowRight, DollarSign, CheckCircle2, Clock 
} from 'lucide-react';

interface ClientPortalViewProps {
  currentUser: User;
  workers: WorkerProfile[];
  categories: WorkerCategory[];
  contracts: Contract[];
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenChat: (worker: WorkerProfile) => void;
  onPayEscrow: (contract: Contract) => void;
  onUpdateContractStatus: (contractId: string, newStatus: any, note?: string) => void;
  onOpenDispute: (contract: Contract) => void;
  onOpenReview: (contract: Contract) => void;
  onOpenAuthModal: () => void;
  onOpenProfile: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  currentUser,
  workers,
  categories,
  contracts,
  onSelectWorker,
  onOpenChat,
  onPayEscrow,
  onUpdateContractStatus,
  onOpenDispute,
  onOpenReview,
  onOpenAuthModal,
  onOpenProfile
}) => {
  const [clientSubTab, setClientSubTab] = useState<'explorar' | 'contratos' | 'garantia'>('explorar');

  const myContracts = contracts.filter(c => c.clienteId === currentUser.id || true);
  const activeEscrowContracts = myContracts.filter(c => ['pendiente_pago', 'pagado_escrow', 'en_curso', 'terminado'].includes(c.estado));

  return (
    <div className="w-full bg-[#f3f3f7] min-h-[85vh] py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-8">
        
        {/* Welcome Client Card */}
        <div className="bg-white p-6 rounded-[14px] border border-[#b9bbc6]/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.nombre}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-[12px] object-cover border border-[#b9bbc6]/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-black tracking-tight">
                  Portal de Clientes · {currentUser.nombre}
                </h1>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
                  Rol: Cliente Activo
                </span>
              </div>
              <p className="text-xs text-[#60646c] mt-0.5">
                Contrata oficios certificados en Colombia con custodia total de tu pago en Escrow.
              </p>
            </div>
          </div>

          {/* Quick stats for this client */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="bg-[#f3f3f7] px-3.5 py-2 rounded-[10px] border border-[#b9bbc6]/30">
              <span className="text-[10px] text-[#8b8d98] block">Contratos activos</span>
              <span className="text-sm font-bold text-black tabular-nums">{activeEscrowContracts.length} en curso</span>
            </div>
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2 bg-[#ff5900] hover:bg-[#e04f00] text-white rounded-[10px] font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Mi Perfil & Billetera
            </button>
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 bg-white hover:bg-[#f3f3f7] text-black border border-[#b9bbc6] rounded-[10px] font-semibold cursor-pointer transition-colors"
            >
              Ley 1581
            </button>
          </div>
        </div>

        {/* Client Subnavigation Tabs (Brex clean pills) */}
        <div className="flex items-center gap-2 border-b border-[#b9bbc6]/40 pb-2">
          <button
            onClick={() => setClientSubTab('explorar')}
            className={`px-4 py-2 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors ${
              clientSubTab === 'explorar'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-[#b9bbc6]/50 hover:bg-[#f3f3f7]'
            }`}
          >
            Buscar Trabajadores ({workers.length})
          </button>

          <button
            onClick={() => setClientSubTab('contratos')}
            className={`px-4 py-2 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              clientSubTab === 'contratos'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-[#b9bbc6]/50 hover:bg-[#f3f3f7]'
            }`}
          >
            <span>Mis Contratos & Escrow</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              clientSubTab === 'contratos' ? 'bg-[#ff5900] text-white' : 'bg-[#f3f3f7] text-black'
            }`}>
              {myContracts.length}
            </span>
          </button>

          <button
            onClick={() => setClientSubTab('garantia')}
            className={`px-4 py-2 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors ${
              clientSubTab === 'garantia'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-[#b9bbc6]/50 hover:bg-[#f3f3f7]'
            }`}
          >
            Cómo Funciona el Escrow
          </button>
        </div>

        {/* Subtab Contents */}
        <div className="bg-white rounded-[14px] border border-[#b9bbc6]/50 overflow-hidden shadow-xs">
          {clientSubTab === 'explorar' && (
            <WorkerDiscovery
              workers={workers}
              categories={categories}
              onSelectWorker={onSelectWorker}
              onOpenChat={onOpenChat}
            />
          )}

          {clientSubTab === 'contratos' && (
            <ContractsManager
              contracts={contracts}
              currentRole="cliente"
              onPayEscrow={onPayEscrow}
              onUpdateContractStatus={onUpdateContractStatus}
              onOpenDispute={onOpenDispute}
              onOpenReview={onOpenReview}
              onOpenChatWithWorker={(workerId) => {
                const wk = workers.find(w => w.id === workerId);
                if (wk) onOpenChat(wk);
              }}
            />
          )}

          {clientSubTab === 'garantia' && (
            <EscrowExplanationView
              onStartSearch={() => setClientSubTab('explorar')}
            />
          )}
        </div>

      </div>
    </div>
  );
};
