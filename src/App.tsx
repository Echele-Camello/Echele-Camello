import React, { useState } from 'react';
import { 
  User, UserRole, WorkerProfile, WorkerCategory, Contract, 
  ChatMessage, Review, Dispute, FormalOffer, ContractStatus,
  WorkerAnnouncement
} from './types';
import { 
  MOCK_USERS, MOCK_WORKERS, INITIAL_CATEGORIES, 
  INITIAL_CONTRACTS, INITIAL_MESSAGES, INITIAL_REVIEWS, INITIAL_DISPUTES 
} from './data/mockData';
import { INITIAL_ANNOUNCEMENTS } from './data/mockAnnouncements';

// Layout Components
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CookieConsentModal } from './components/common/CookieConsentModal';
import { FloatingWorkerButton } from './components/common/FloatingWorkerButton';

// Corporate Landing Page & Views
import { CompanyLandingPage } from './components/landing/CompanyLandingPage';
import { EscrowExplanationView } from './components/landing/EscrowExplanationView';

// Worker Catalog & Forum
import { WorkerCatalogView } from './components/catalog/WorkerCatalogView';
import { WorkerForumView } from './components/forum/WorkerForumView';

// Client Portal & Discovery
import { ClientPortalView } from './components/client/ClientPortalView';
import { WorkerDiscovery } from './components/discovery/WorkerDiscovery';
import { WorkerProfileModal } from './components/discovery/WorkerProfileModal';
import { WorkerProfileEditor } from './components/worker/WorkerProfileEditor';
import { WorkerOnboardingModal } from './components/worker/WorkerOnboardingModal';

// Chat & Negotiation
import { ChatModal } from './components/chat/ChatModal';

// Escrow & Contracts
import { EscrowPaymentModal } from './components/escrow/EscrowPaymentModal';
import { ContractsManager } from './components/contracts/ContractsManager';
import { DisputeModal } from './components/contracts/DisputeModal';

// Reviews & Admin
import { ReviewModal } from './components/reviews/ReviewModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { LoginRegisterModal } from './components/auth/LoginRegisterModal';
import { UserProfileDashboard } from './components/profile/UserProfileDashboard';

export default function App() {
  // Navigation & Authentication State
  const [currentTab, setCurrentTab] = useState<string>('landing'); // Initial index is corporate landing
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('cliente');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.cliente1);

  // Core Data State
  const [workers, setWorkers] = useState<WorkerProfile[]>(MOCK_WORKERS);
  const [categories] = useState<WorkerCategory[]>(INITIAL_CATEGORIES);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [announcements, setAnnouncements] = useState<WorkerAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  // Interactive Modals State
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [showWorkerOnboarding, setShowWorkerOnboarding] = useState<boolean>(false);
  const [activeWorkerProfile, setActiveWorkerProfile] = useState<WorkerProfile | null>(null);
  const [chatWorker, setChatWorker] = useState<WorkerProfile | null>(null);
  const [escrowPayingContract, setEscrowPayingContract] = useState<Contract | null>(null);
  const [disputingContract, setDisputingContract] = useState<Contract | null>(null);
  const [reviewingContract, setReviewingContract] = useState<Contract | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  // Success Login / Register Handler (via Google, Facebook or Form)
  const handleSuccessLogin = (userData: Partial<User>, provider?: string) => {
    setIsLoggedIn(true);
    setCurrentRole('cliente');
    setCurrentUser({
      ...MOCK_USERS.cliente1,
      ...userData,
      currentRole: 'cliente',
      roles: ['cliente']
    });
    // Direct redirect to Catalogo page
    setCurrentTab('catalogo');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentTab('landing');
  };

  // Open Chat Handler
  const handleOpenChat = (worker: WorkerProfile) => {
    setChatWorker(worker);
  };

  const handleSendMessage = (text: string, oferta?: FormalOffer) => {
    if (!chatWorker) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversacionId: `conv-${chatWorker.id}`,
      remitenteId: currentUser.id,
      remitenteNombre: currentUser.nombre,
      texto: text,
      tipo: oferta ? 'oferta' : 'texto',
      oferta,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      entregado: true,
      leido: false
    };

    const currentChatMsgs = messages[chatWorker.id] || [];
    setMessages({
      ...messages,
      [chatWorker.id]: [...currentChatMsgs, newMsg]
    });
  };

  // Accept formal offer -> creates contract in 'pendiente_pago' state
  const handleAcceptOffer = (offer: FormalOffer) => {
    if (!chatWorker) return;

    const currentChatMsgs = messages[chatWorker.id] || [];
    const updatedMsgs = currentChatMsgs.map(m => {
      if (m.oferta && m.oferta.id === offer.id) {
        return {
          ...m,
          oferta: { ...m.oferta, estado: 'aceptada' as const }
        };
      }
      return m;
    });

    setMessages({
      ...messages,
      [chatWorker.id]: updatedMsgs
    });

    const comision = Math.round(offer.precioCOP * 0.1);
    const newContract: Contract = {
      id: `cont-${Date.now()}`,
      codigoRadicado: `EC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clienteId: currentUser.id,
      clienteNombre: currentUser.nombre,
      trabajadorId: chatWorker.id,
      trabajadorNombre: chatWorker.nombre,
      categoriaNombre: chatWorker.categoriaNombre,
      descripcionServicio: offer.descripcionServicio,
      montoBrutoCOP: offer.precioCOP,
      comisionPorcentaje: 10,
      comisionCOP: comision,
      montoNetoTrabajadorCOP: offer.precioCOP - comision,
      estado: 'pendiente_pago',
      fechaCreacion: new Date().toISOString().replace('T', ' ').slice(0, 16),
      historialEstados: [
        {
          estado: 'oferta_enviada',
          fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          autor: chatWorker.nombre,
          nota: 'Oferta formal acordada por chat.'
        },
        {
          estado: 'pendiente_pago',
          fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          autor: currentUser.nombre,
          nota: 'Oferta aceptada por el cliente. Esperando depósito en escrow.'
        }
      ]
    };

    setContracts([newContract, ...contracts]);
    setChatWorker(null);
    setEscrowPayingContract(newContract);
  };

  const handleRejectOffer = (offerId: string) => {
    if (!chatWorker) return;
    const currentChatMsgs = messages[chatWorker.id] || [];
    const updatedMsgs = currentChatMsgs.map(m => {
      if (m.oferta && m.oferta.id === offerId) {
        return {
          ...m,
          oferta: { ...m.oferta, estado: 'rechazada' as const }
        };
      }
      return m;
    });

    setMessages({
      ...messages,
      [chatWorker.id]: updatedMsgs
    });
  };

  const handleCounterOffer = (offer: FormalOffer, newPriceCOP: number, newNotes: string) => {
    if (!chatWorker) return;

    const counterOffer: FormalOffer = {
      ...offer,
      id: `off-counter-${Date.now()}`,
      version: offer.version + 1,
      precioCOP: newPriceCOP,
      estado: 'pendiente',
      fechaEnvio: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    handleSendMessage(`Contraoferta enviada con nuevo precio pactado: $${newPriceCOP.toLocaleString('es-CO')} COP`, counterOffer);
  };

  // Escrow Payment confirmation
  const handleConfirmEscrowPayment = (contractId: string, method: any, reference: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          estado: 'pagado_escrow',
          metodoPago: method,
          referenciaPasarela: reference,
          fechaPagoEscrow: new Date().toISOString().replace('T', ' ').slice(0, 16),
          historialEstados: [
            ...c.historialEstados,
            {
              estado: 'pagado_escrow',
              fecha: new Date().toISOString().replace('T', ' ').slice(0, 16),
              autor: `Pasarela ${method.toUpperCase()} Wompi`,
              nota: `Depósito de $${c.montoBrutoCOP.toLocaleString('es-CO')} COP retenido en custodia. Ref: ${reference}`
            }
          ]
        };
      }
      return c;
    }));
  };

  // Contract State transitions handler
  const handleUpdateContractStatus = (contractId: string, newStatus: ContractStatus, note?: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          estado: newStatus,
          historialEstados: [
            ...c.historialEstados,
            {
              estado: newStatus,
              fecha: new Date().toISOString().replace('T', ' ').slice(0, 16),
              autor: currentUser.nombre,
              nota: note || `Cambio de estado a ${newStatus}`
            }
          ]
        };
      }
      return c;
    }));
  };

  // Dispute submission
  const handleSubmitDispute = (disputeData: Partial<Dispute>) => {
    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      contratoId: disputeData.contratoId || '',
      iniciadaPorId: currentUser.id,
      iniciadaPorNombre: currentUser.nombre,
      iniciadaPorRol: currentRole as any,
      motivo: disputeData.motivo || 'Disputa de servicio',
      descripcion: disputeData.descripcion || '',
      evidencias: disputeData.evidencias || [],
      estado: 'en_revision',
      fechaApertura: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setDisputes([newDispute, ...disputes]);

    if (disputeData.contratoId) {
      handleUpdateContractStatus(
        disputeData.contratoId, 
        'en_disputa', 
        `Disputa radicada: ${disputeData.motivo}. Fondos en custodia congelados preventivamente.`
      );
    }
  };

  // Admin dispute resolution
  const handleResolveDispute = (disputeId: string, decision: 'liberar' | 'reembolsar' | 'dividir', motivo: string) => {
    const disp = disputes.find(d => d.id === disputeId);
    if (!disp) return;

    setDisputes(disputes.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          estado: decision === 'liberar' ? 'resuelta_liberado' : decision === 'reembolsar' ? 'resuelta_reembolsado' : 'resuelta_dividido',
          dictamenAdmin: motivo,
          fechaResolucion: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return d;
    }));

    if (decision === 'liberar') {
      handleUpdateContractStatus(disp.contratoId, 'completado', `Resolución arbitral de Admin: fondos liberados al trabajador. Dictamen: ${motivo}`);
    } else if (decision === 'reembolsar') {
      handleUpdateContractStatus(disp.contratoId, 'cancelado', `Resolución arbitral de Admin: reembolso 100% al cliente. Dictamen: ${motivo}`);
    } else {
      handleUpdateContractStatus(disp.contratoId, 'completado', `Resolución arbitral de Admin: división 50/50 acordada. Dictamen: ${motivo}`);
    }
  };

  // Review submission
  const handleSubmitReview = (reviewData: Partial<Review>) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      contratoId: reviewData.contratoId || '',
      autorId: currentUser.id,
      autorNombre: currentUser.nombre,
      autorRol: currentRole as any,
      destinatarioId: reviewData.destinatarioId || '',
      puntuacion: reviewData.puntuacion || 5,
      comentario: reviewData.comentario || '',
      fecha: new Date().toISOString().split('T')[0]
    };

    setReviews([newRev, ...reviews]);

    if (reviewData.destinatarioId) {
      setWorkers(workers.map(w => {
        if (w.id === reviewData.destinatarioId || w.userId === reviewData.destinatarioId) {
          const wReviews = [...reviews.filter(r => r.destinatarioId === w.id), newRev];
          const avg = wReviews.reduce((sum, r) => sum + r.puntuacion, 0) / wReviews.length;
          return {
            ...w,
            calificacionPromedio: avg,
            reseñasCount: wReviews.length,
            serviciosCompletados: w.serviciosCompletados + 1
          };
        }
        return w;
      }));
    }
  };

  // Admin worker verification approval
  const handleApproveWorkerVerification = (workerId: string) => {
    setWorkers(workers.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          verificado: true,
          estadoVerificacion: 'aprobado'
        };
      }
      return w;
    }));
  };

  const handleRejectWorkerVerification = (workerId: string, motivo: string) => {
    setWorkers(workers.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          verificado: false,
          estadoVerificacion: 'rechazado'
        };
      }
      return w;
    }));
    alert(`Verificación rechazada para este perfil. Motivo: "${motivo}".`);
  };

  // Worker onboarding completion from floating button
  const handleCompleteWorkerRegistration = (workerData: Partial<WorkerProfile>) => {
    const fullName = `${currentUser.nombre} ${currentUser.apellido || ''}`.trim();
    const newWorker: WorkerProfile = {
      id: `wk-user-${currentUser.id}`,
      userId: currentUser.id,
      nombre: fullName || 'Profesional Certificado',
      avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      categoriaId: workerData.categoriaId || 'cat-serv-no-reg',
      categoriaNombre: workerData.categoriaNombre || 'Servicios No Regulados',
      especialidades: workerData.especialidades || ['Reparaciones y mantenimientos certificados'],
      descripcion: workerData.descripcion || 'Profesional con verificación de identidad y garantía de pago Escrow.',
      ciudad: currentUser.ciudad || currentUser.municipio || 'Bogotá D.C.',
      barrio: currentUser.barrio || 'Área de Cobertura',
      radioKm: workerData.radioKm || 15,
      tarifaPorHora: workerData.tarifaPorHora || 45000,
      verificado: true,
      estadoVerificacion: 'aprobado',
      tipoDocumento: workerData.tipoDocumento || 'CC',
      numeroDocumento: workerData.numeroDocumento || '1.032.485.912',
      fechaExpedicionDocumento: workerData.fechaExpedicionDocumento || '2016-04-18',
      documentoIdentidadUrl: workerData.documentoIdentidadUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      documentoReversoUrl: workerData.documentoReversoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      selfieUrl: workerData.selfieUrl || currentUser.avatarUrl,
      cuentaBancariaDesembolso: workerData.cuentaBancariaDesembolso,
      experienciaAnos: workerData.experienciaAnos || 6,
      disponible: true,
      horarioAtencion: workerData.horarioAtencion || 'Lunes a Sábado: 8:00 AM - 6:00 PM',
      calificacionPromedio: 5.0,
      serviciosCompletados: 0,
      reseñasCount: 0,
      portafolio: workerData.portafolio || []
    };

    setWorkers([newWorker, ...workers.filter(w => w.userId !== currentUser.id)]);
    setIsLoggedIn(true);
    setCurrentRole('trabajador');
    setCurrentUser({
      ...currentUser,
      currentRole: 'trabajador',
      roles: Array.from(new Set([...currentUser.roles, 'trabajador']))
    });
    setCurrentTab('perfil');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-[#ff5900] selection:text-white">
      
      {/* Brex Announcement Bar */}
      <AnnouncementBar onLearnMoreClick={() => setCurrentTab('como_funciona')} />

      {/* Navbar with exact 'Inicio' and 'Registrar' buttons */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setAuthModalMode('login')}
        onOpenRegister={() => setAuthModalMode('register')}
        onLogout={handleLogout}
        contractsCount={contracts.length}
      />

      {/* Main Content Render */}
      <main className="flex-1">
        {/* Landing Page: Corporate Information of the company */}
        {currentTab === 'landing' && (
          <CompanyLandingPage
            onOpenLogin={() => setAuthModalMode('login')}
            onOpenRegister={() => setAuthModalMode('register')}
            onOpenWorkerOnboarding={() => setShowWorkerOnboarding(true)}
          />
        )}

        {/* Catálogo de Trabajadores con Filtros a la Izquierda */}
        {(currentTab === 'catalogo' || currentTab === 'clientes_portal') && (
          <WorkerCatalogView
            workers={workers}
            categories={categories}
            onSelectWorker={(worker) => setActiveWorkerProfile(worker)}
            onOpenChat={handleOpenChat}
          />
        )}

        {/* Foro de Anuncios de Trabajadores */}
        {currentTab === 'foro' && (
          <WorkerForumView
            announcements={announcements}
            categories={categories}
            currentUser={currentUser}
            workers={workers}
            onOpenChatWithWorker={(workerId) => {
              const wk = workers.find(w => w.id === workerId);
              if (wk) {
                handleOpenChat(wk);
              } else if (workers.length > 0) {
                handleOpenChat(workers[0]);
              }
            }}
            onAddAnnouncement={(newAnn) => {
              setAnnouncements([newAnn, ...announcements]);
            }}
          />
        )}

        {/* Explorar Trabajadores */}
        {currentTab === 'explorar' && (
          <WorkerDiscovery
            workers={workers}
            categories={categories}
            onSelectWorker={(worker) => setActiveWorkerProfile(worker)}
            onOpenChat={handleOpenChat}
          />
        )}

        {/* Mis Contratos */}
        {currentTab === 'contratos' && (
          <ContractsManager
            contracts={contracts}
            currentRole={currentRole}
            onPayEscrow={(contract) => setEscrowPayingContract(contract)}
            onUpdateContractStatus={handleUpdateContractStatus}
            onOpenDispute={(contract) => setDisputingContract(contract)}
            onOpenReview={(contract) => setReviewingContract(contract)}
            onOpenChatWithWorker={(workerId) => {
              const wk = workers.find(w => w.id === workerId);
              if (wk) handleOpenChat(wk);
            }}
          />
        )}

        {/* Garantía Escrow */}
        {currentTab === 'como_funciona' && (
          <EscrowExplanationView
            onStartSearch={() => {
              if (isLoggedIn) setCurrentTab('clientes_portal');
              else setAuthModalMode('register');
            }}
          />
        )}

        {/* Panel Administrador */}
        {currentTab === 'admin' && (
          <AdminDashboard
            contracts={contracts}
            workers={workers}
            disputes={disputes}
            onApproveWorkerVerification={handleApproveWorkerVerification}
            onRejectWorkerVerification={handleRejectWorkerVerification}
            onResolveDispute={handleResolveDispute}
          />
        )}

        {/* Perfil & Dashboard Completo (Cliente / Trabajador) */}
        {currentTab === 'perfil' && (
          <UserProfileDashboard
            currentUser={currentUser}
            contracts={contracts}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onOpenContractDetails={(contract) => {
              setCurrentTab('contratos');
            }}
          />
        )}

        {/* Perfil Laboral del Trabajador */}
        {currentTab === 'perfil_laboral' && (
          <WorkerProfileEditor
            currentWorker={workers[0]}
            categories={categories}
            onSaveWorkerProfile={(updated) => setWorkers(workers.map(w => w.id === updated.id ? updated : w))}
            onRequestVerification={(id) => {
              alert('Solicitud de verificación radicada. Nuestro equipo revisará la cédula y selfie en el panel administrativo.');
            }}
          />
        )}
      </main>

      {/* Dark Abyss Brex Footer */}
      <Footer
        onOpenPrivacyTerms={() => setShowPrivacyModal(true)}
        onOpenEscrowInfo={() => setCurrentTab('como_funciona')}
      />

      {/* Floating Bottom-Right Button: '¿Quieres ser contratado? Presiona aquí' (Oculto en landing page) */}
      {currentTab !== 'landing' && (
        <FloatingWorkerButton
          onClick={() => setShowWorkerOnboarding(true)}
        />
      )}

      {/* Login & Register Modal (Google, Facebook, Email, Ley 1581) */}
      {authModalMode && (
        <LoginRegisterModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccessLogin={handleSuccessLogin}
        />
      )}

      {/* Worker Onboarding Modal from Floating Button */}
      {showWorkerOnboarding && (
        <WorkerOnboardingModal
          currentUser={currentUser}
          categories={categories}
          onCompleteWorkerRegistration={handleCompleteWorkerRegistration}
          onClose={() => setShowWorkerOnboarding(false)}
        />
      )}

      {/* Worker Profile Modal */}
      {activeWorkerProfile && (
        <WorkerProfileModal
          worker={activeWorkerProfile}
          reviews={reviews}
          onClose={() => setActiveWorkerProfile(null)}
          onOpenChat={(worker) => {
            setActiveWorkerProfile(null);
            handleOpenChat(worker);
          }}
        />
      )}

      {/* Interactive Real-Time Chat Modal with Formal Offers */}
      {chatWorker && (
        <ChatModal
          worker={chatWorker}
          currentUser={currentUser}
          messages={messages[chatWorker.id] || []}
          onSendMessage={handleSendMessage}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
          onCounterOffer={handleCounterOffer}
          onClose={() => setChatWorker(null)}
        />
      )}

      {/* Escrow Payment Simulator Modal */}
      {escrowPayingContract && (
        <EscrowPaymentModal
          contract={escrowPayingContract}
          onConfirmPayment={handleConfirmEscrowPayment}
          onClose={() => setEscrowPayingContract(null)}
        />
      )}

      {/* Dispute Opening Modal */}
      {disputingContract && (
        <DisputeModal
          contract={disputingContract}
          onSubmitDispute={handleSubmitDispute}
          onClose={() => setDisputingContract(null)}
        />
      )}

      {/* Review & Rating Modal */}
      {reviewingContract && (
        <ReviewModal
          contract={reviewingContract}
          onSubmitReview={handleSubmitReview}
          onClose={() => setReviewingContract(null)}
        />
      )}

      {/* User Account & Ley 1581 Privacy Modal */}
      {showPrivacyModal && (
        <AuthModal
          currentUser={currentUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {/* Cookie Consent Modal */}
      <CookieConsentModal
        onLearnMore={() => setShowPrivacyModal(true)}
      />

    </div>
  );
}
