import React, { useState } from 'react';
import { 
  User, Contract, PaymentCard, UserServiceItem, UserRole 
} from '../../types';
import { 
  User as UserIcon, CreditCard, History, MapPin, DollarSign, 
  TrendingUp, Clock, Star, ShieldCheck, CheckCircle2, Plus, 
  Trash2, Edit3, Smartphone, ExternalLink, Calendar, Compass, 
  Save, AlertCircle, ArrowUpRight, Camera, Image as ImageIcon,
  Lock, KeyRound, Mail, ShieldAlert, Sparkles
} from 'lucide-react';
import { COLOMBIA_DEPARTMENTS } from '../../data/colombiaData';
import { PhotoCaptureModal } from './PhotoCaptureModal';
import { VerificationOtpModal } from './VerificationOtpModal';

interface UserProfileDashboardProps {
  currentUser: User;
  contracts: Contract[];
  onUpdateUser: (updatedUser: User) => void;
  onOpenContractDetails?: (contract: Contract) => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  currentUser,
  contracts,
  onUpdateUser,
  onOpenContractDetails
}) => {
  // Tabs: Perfil Personal, Billetera & Métodos, Historial, (and Ganancias/Servicios if trabajador)
  const isWorker = currentUser.currentRole === 'trabajador';
  const [activeTab, setActiveTab] = useState<'datos' | 'billetera' | 'historial' | 'estadisticas' | 'servicios'>('datos');

  // Personal data edit state
  const [nombre, setNombre] = useState(currentUser.nombre);
  const [apellido, setApellido] = useState(currentUser.apellido || 'Gómez Restrepo');
  const [apodo, setApodo] = useState(currentUser.apodo || 'Alejo');
  const [correo, setCorreo] = useState(currentUser.correo);
  const [telefono, setTelefono] = useState(currentUser.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState(currentUser.fechaNacimiento || '1992-06-15');
  const [departamento, setDepartamento] = useState(currentUser.departamento || 'Cundinamarca');
  const [municipio, setMunicipio] = useState(currentUser.municipio || 'Bogotá D.C. (Teusaquillo)');
  const [direccion, setDireccion] = useState(currentUser.direccion || 'Carrera 17 # 45-28, Apto 402');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [lat, setLat] = useState(currentUser.lat || 4.6362);
  const [lng, setLng] = useState(currentUser.lng || -74.0722);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState('');

  // Encrypted avatar storage URL state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [avatarUrlEncrypted, setAvatarUrlEncrypted] = useState(
    currentUser.avatarUrlEncriptada ||
    `https://vault.echelecamello.co/media/v1/biometrics/enc_aes256_gcm_${Math.floor(10000000 + Math.random() * 90000000)}.bin`
  );

  // OTP Verification modal state
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Find department data for municipalities
  const currentDeptData = COLOMBIA_DEPARTMENTS.find(
    d => d.nombre.toLowerCase() === departamento.toLowerCase()
  ) || COLOMBIA_DEPARTMENTS[0];

  const handleDepartmentChange = (newDeptName: string) => {
    setDepartamento(newDeptName);
    const deptObj = COLOMBIA_DEPARTMENTS.find(d => d.nombre === newDeptName);
    if (deptObj && deptObj.municipios.length > 0) {
      setMunicipio(deptObj.municipios[0]);
    }
  };

  // Wallet and cards state
  const [tarjetas, setTarjetas] = useState<PaymentCard[]>(currentUser.tarjetasGuardadas || []);
  const [googlePayVinculado, setGooglePayVinculado] = useState(currentUser.googlePayVinculado ?? true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  // Worker Statistics and Services state
  const [servicios, setServicios] = useState<UserServiceItem[]>(
    currentUser.serviciosOfrecidos || [
      { id: 'srv-1', nombre: 'Detección y reparación de fugas hidráulicas', precioCOP: 50000, modalidad: 'hora' },
      { id: 'srv-2', nombre: 'Destape de sifones con sonda eléctrica', precioCOP: 120000, modalidad: 'servicio' },
      { id: 'srv-3', nombre: 'Instalación de griferías y llaves de paso', precioCOP: 85000, modalidad: 'servicio' }
    ]
  );
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(60000);
  const [newServiceModalidad, setNewServiceModalidad] = useState<'hora' | 'visita' | 'servicio'>('servicio');

  // Handle Save Profile with 2FA / OTP Verification for email/phone changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const emailHasChanged = correo.trim().toLowerCase() !== (currentUser.correo || '').trim().toLowerCase();
    const phoneHasChanged = telefono.trim() !== (currentUser.telefono || '').trim();

    // If email or phone has changed, trigger 2-Step OTP Verification
    if (emailHasChanged || phoneHasChanged) {
      setShowOtpModal(true);
      return;
    }

    commitProfileUpdate(false);
  };

  const commitProfileUpdate = (isVerifiedViaOtp = false) => {
    const updated: User = {
      ...currentUser,
      nombre,
      apellido,
      apodo,
      correo,
      telefono,
      correoVerificado: isVerifiedViaOtp ? true : currentUser.correoVerificado,
      telefonoVerificado: isVerifiedViaOtp ? true : currentUser.telefonoVerificado,
      fechaNacimiento,
      departamento,
      municipio,
      direccion,
      avatarUrl,
      avatarUrlEncriptada: avatarUrlEncrypted,
      lat,
      lng,
      tarjetasGuardadas: tarjetas,
      googlePayVinculado,
      serviciosOfrecidos: servicios
    };
    onUpdateUser(updated);
    setSaveFeedback(true);
    if (isVerifiedViaOtp) {
      setVerificationFeedback('¡Datos sensibles (correo / teléfono) verificados exitosamente con código OTP!');
    }
    setTimeout(() => {
      setSaveFeedback(false);
      setVerificationFeedback('');
    }, 3500);
  };

  // Add Card to Wallet
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || !newCardHolder.trim()) return;

    const last4 = newCardNumber.replace(/\s+/g, '').slice(-4) || '7721';
    const marca: 'visa' | 'mastercard' = newCardNumber.startsWith('5') ? 'mastercard' : 'visa';

    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      marca,
      ultimos4: last4,
      titular: newCardHolder.toUpperCase(),
      vencimiento: newCardExpiry || '12/28',
      predeterminada: tarjetas.length === 0
    };

    const updatedCards = [...tarjetas, newCard];
    setTarjetas(updatedCards);
    setShowAddCard(false);
    setNewCardNumber('');
    setNewCardHolder('');
    setNewCardExpiry('');
    setNewCardCvv('');

    onUpdateUser({
      ...currentUser,
      tarjetasGuardadas: updatedCards
    });
  };

  const handleDeleteCard = (cardId: string) => {
    const updated = tarjetas.filter(c => c.id !== cardId);
    setTarjetas(updated);
    onUpdateUser({
      ...currentUser,
      tarjetasGuardadas: updated
    });
  };

  const handleSetDefaultCard = (cardId: string) => {
    const updated = tarjetas.map(c => ({
      ...c,
      predeterminada: c.id === cardId
    }));
    setTarjetas(updated);
    onUpdateUser({
      ...currentUser,
      tarjetasGuardadas: updated
    });
  };

  // Add Service (Worker)
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSrv: UserServiceItem = {
      id: `srv-${Date.now()}`,
      nombre: newServiceName.trim(),
      precioCOP: newServicePrice,
      modalidad: newServiceModalidad
    };

    const updatedSrv = [...servicios, newSrv];
    setServicios(updatedSrv);
    setShowAddService(false);
    setNewServiceName('');

    onUpdateUser({
      ...currentUser,
      serviciosOfrecidos: updatedSrv
    });
  };

  const handleDeleteService = (srvId: string) => {
    const updated = servicios.filter(s => s.id !== srvId);
    setServicios(updated);
    onUpdateUser({
      ...currentUser,
      serviciosOfrecidos: updated
    });
  };

  // History contracts for this user
  const userContracts = contracts.filter(c => 
    isWorker ? (c.trabajadorId === currentUser.id || c.trabajadorNombre.includes(currentUser.nombre)) : true
  );

  return (
    <div className="w-full bg-[#f3f3f7] min-h-[85vh] py-10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-8">
        
        {/* Top Profile Header Card */}
        <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={nombre}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-[14px] object-cover border border-[#b9bbc6]/50 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#ff5900] text-white p-1 rounded-full text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            {(() => {
              const cleanNombre = (nombre || '').replace(/\s*\([^)]*\)/g, '').trim();
              const cleanApellido = (apellido || '').replace(/\s*\([^)]*\)/g, '').trim();
              const pNombre = cleanNombre.split(/\s+/)[0] || 'Usuario';
              const pApellido = cleanApellido.split(/\s+/)[0] || (cleanNombre.split(/\s+/)[1] || 'Gómez');
              const primerNombreYApellido = `${pNombre} ${pApellido}`;

              return (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-black tracking-tight">
                      {primerNombreYApellido}
                    </h1>
                    {apodo && (
                      <span className="text-xs text-[#60646c] font-medium bg-[#f3f3f7] px-2 py-0.5 rounded-[6px] border border-[#b9bbc6]/40">
                        "{apodo}"
                      </span>
                    )}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-[6px] ${
                      isWorker 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      ROL: {currentUser.currentRole.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-[#60646c] mt-1 flex items-center gap-3 flex-wrap">
                    <span>{correo}</span>
                    <span>·</span>
                    <span>{telefono}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-black font-semibold">
                      <MapPin className="w-3 h-3 text-[#ff5900]" />
                      <span>{municipio}, {departamento}</span>
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick status pill / action */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <button
              onClick={() => {
                const nextRole: UserRole = isWorker ? 'cliente' : 'trabajador';
                onUpdateUser({
                  ...currentUser,
                  currentRole: nextRole,
                  roles: Array.from(new Set([...currentUser.roles, nextRole]))
                });
              }}
              className="text-[11px] font-semibold text-[#ff5900] bg-orange-50 hover:bg-orange-100 border border-[#ff5900]/40 px-2.5 py-1 rounded-[8px] cursor-pointer transition-colors"
              title="Alternar entre perfil de Cliente y perfil de Trabajador"
            >
              Probar como {isWorker ? 'Cliente' : 'Trabajador'}
            </button>

            {isWorker ? (
              <div className="text-right">
                <span className="text-[10px] text-[#8b8d98] block">Saldo disponible para retiro</span>
                <span className="text-lg font-black text-emerald-700 tabular-nums">
                  ${(currentUser.saldoRetirableCOP || 645000).toLocaleString('es-CO')} COP
                </span>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-[10px] text-[#8b8d98] block">Google Pay Vinculado</span>
                <span className="text-xs font-semibold text-black flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{googlePayVinculado ? 'Activo' : 'No vinculado'}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {saveFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[10px] text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{verificationFeedback || 'Perfil actualizado exitosamente. Ubicación en Google Maps guardada.'}</span>
            </div>
            {verificationFeedback && (
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded shrink-0">
                OTP VALIDADO
              </span>
            )}
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#b9bbc6]/40 pb-2">
          <button
            onClick={() => setActiveTab('datos')}
            className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'datos'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-black border border-[#b9bbc6]/40 hover:bg-[#f3f3f7]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Editar Perfil & Ubicación Maps</span>
          </button>

          <button
            onClick={() => setActiveTab('billetera')}
            className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'billetera'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-black border border-[#b9bbc6]/40 hover:bg-[#f3f3f7]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Billetera & Google Pay ({tarjetas.length + (googlePayVinculado ? 1 : 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('historial')}
            className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'historial'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-black border border-[#b9bbc6]/40 hover:bg-[#f3f3f7]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Historial de Contratos & Escrow ({userContracts.length})</span>
          </button>

          {isWorker && (
            <>
              <button
                onClick={() => setActiveTab('estadisticas')}
                className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'estadisticas'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-black border border-[#b9bbc6]/40 hover:bg-[#f3f3f7]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Ganancias & Estadísticas de Oficio</span>
              </button>

              <button
                onClick={() => setActiveTab('servicios')}
                className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'servicios'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-black border border-[#b9bbc6]/40 hover:bg-[#f3f3f7]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Editar Trabajo & Tarifas ({servicios.length})</span>
              </button>
            </>
          )}
        </div>

        {/* Tab 1: EDIT PROFILE & GOOGLE MAPS WITH PIN */}
        {activeTab === 'datos' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Personal Data Form */}
            <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-black border-b border-[#f3f3f7] pb-3 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#ff5900]" />
                <span>Información Personal del Usuario</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Nombre:</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Apellido:</label>
                  <input
                    type="text"
                    required
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Apodo o sobrenombre:</label>
                  <input
                    type="text"
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value)}
                    placeholder="Ej: Alejo, Don Carlos..."
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-black flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#ff5900]" />
                      <span>Correo electrónico:</span>
                    </label>
                    {correo.trim().toLowerCase() !== (currentUser.correo || '').trim().toLowerCase() ? (
                      <span className="text-[9px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                        Requiere OTP
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verificado</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                  />
                  <p className="text-[10px] text-[#8b8d98] mt-1">
                    Se enviará un código de 6 dígitos a este correo al guardar.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-black flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-[#ff5900]" />
                      <span>Número de teléfono (+57):</span>
                    </label>
                    {telefono.trim() !== (currentUser.telefono || '').trim() ? (
                      <span className="text-[9px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                        Requiere SMS
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verificado</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none font-mono text-black"
                  />
                  <p className="text-[10px] text-[#8b8d98] mt-1">
                    Recibirás un SMS con código OTP de seguridad.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Fecha de nacimiento:</label>
                  <input
                    type="date"
                    required
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black font-mono"
                  />
                  <p className="text-[10px] text-[#8b8d98] mt-1">
                    Mayor de edad para contratación formal (Cédula).
                  </p>
                </div>
              </div>

              {/* Foto de Perfil con Galería y Cámara En Vivo */}
              <div className="p-4 bg-[#f3f3f7] rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-black">Foto de Perfil del Usuario:</label>
                    <p className="text-[11px] text-[#60646c]">
                      Elige una foto de tu galería o tómate una fotografía en vivo. Se guarda con URL encriptada para proteger tus datos biométricos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPhotoModal(true)}
                      className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-[8px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#ff5900]" />
                      <span>Tomar foto o elegir de galería</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-3 rounded-[10px] border border-[#b9bbc6]/40">
                  <div className="relative shrink-0">
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-[12px] object-cover border-2 border-[#b9bbc6] shadow-xs" 
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full text-[9px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-black font-semibold">
                      <Lock className="w-3.5 h-3.5 text-[#ff5900]" />
                      <span>URL Encriptada para Base de Datos:</span>
                    </div>
                    <div className="font-mono text-[10px] bg-[#f3f3f7] px-2 py-1 rounded text-emerald-800 border border-[#b9bbc6]/40 truncate max-w-full sm:max-w-md">
                      {avatarUrlEncrypted}
                    </div>
                    <p className="text-[10px] text-[#8b8d98]">
                      Cifrado tokenizado AES-256 para evitar visualización directa en tablas SQL/NoSQL (Cumplimiento Ley 1581 de 2012).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical Address & GOOGLE MAPS PIN (Requested by user) */}
            <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-black border-b border-[#f3f3f7] pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff5900]" />
                <span>Ubicación Domiciliaria y Google Maps con Pin Exacto</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Departamento: Todos los 32 departamentos de Colombia + Bogotá D.C. */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-black">Departamento en que vive:</label>
                    <span className="text-[10px] text-[#ff5900] font-semibold">{COLOMBIA_DEPARTMENTS.length} disponibles</span>
                  </div>
                  <select
                    value={departamento}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] bg-white text-black font-medium outline-none focus:border-[#ff5900]"
                  >
                    {COLOMBIA_DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.nombre}>
                        {dept.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Municipio: Con sugerencias del departamento seleccionado */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-black">Municipio o Ciudad:</label>
                    <span className="text-[10px] text-[#60646c]">Sugeridos: {currentDeptData.municipios.length}</span>
                  </div>
                  <input
                    type="text"
                    required
                    list="municipios-colombia-list"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    placeholder="Selecciona o escribe el municipio"
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                  />
                  <datalist id="municipios-colombia-list">
                    {currentDeptData.municipios.map((mun) => (
                      <option key={mun} value={mun} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Dirección de residencia:</label>
                  <input
                    type="text"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej: Carrera 17 # 45-28, Apto 402"
                    className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                  />
                </div>
              </div>

              {/* Exact Google Maps Visualizer with Pin Indicator */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-black flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#ff5900]" />
                    <span>Google Maps: Marcador Geográfico Exacto del Domicilio</span>
                  </span>
                  <span className="text-[11px] text-[#60646c] font-mono tabular-nums">
                    Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)} · {municipio}
                  </span>
                </div>

                {/* Google Maps Container with Interactive Marker */}
                <div className="relative w-full h-72 rounded-[14px] overflow-hidden border border-[#b9bbc6] shadow-xs bg-[#e5e3df]">
                  {/* Google Maps Embed iframe with live pin location for Colombia */}
                  <iframe
                    title="Google Maps Ubicación Exacta"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(direccion + ', ' + municipio + ', ' + departamento + ', Colombia')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full filter saturate-105"
                  />

                  {/* Visual Pin overlay card with details */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-3 rounded-[10px] border border-[#b9bbc6]/60 shadow-md max-w-xs text-xs space-y-1 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-[#ff5900] font-bold">
                      <MapPin className="w-4 h-4 fill-[#ff5900] text-white" />
                      <span>Pin de Residencia Verificado</span>
                    </div>
                    <div className="font-semibold text-black">{direccion}</div>
                    <div className="text-[10px] text-[#60646c]">{municipio}, {departamento} · Colombia</div>
                  </div>
                </div>

                <p className="text-[11px] text-[#60646c]">
                  Este pin indica con exactitud el punto geográfico de tu vivienda para la asignación de técnicos cercanos y cálculo de desplazamiento seguro.
                </p>
              </div>

              {/* Save changes button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs md:text-sm font-semibold rounded-[10px] flex items-center gap-2 cursor-pointer shadow-xs transition-smooth"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Datos de Perfil y Ubicación</span>
                </button>
              </div>
            </div>

          </form>
        )}

        {/* Tab 2: WALLET, CARDS & GOOGLE PAY */}
        {activeTab === 'billetera' && (
          <div className="space-y-6">
            
            {/* Google Pay Integration Card (Explicitly requested by user) */}
            <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Official Google Pay stylized icon */}
                  <div className="w-12 h-12 rounded-[12px] bg-black flex items-center justify-center p-2">
                    <span className="text-white font-bold text-xs tracking-wider flex items-center gap-1">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">P</span>
                      <span className="text-[#FBBC05]">a</span>
                      <span className="text-[#34A853]">y</span>
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-black tracking-tight">Google Pay</h3>
                      {googlePayVinculado && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-[4px] border border-emerald-300">
                          VINCULADO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#60646c]">
                      Paga en Escrow al instante con un solo toque utilizando tus tarjetas y métodos guardados en tu cuenta de Google.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !googlePayVinculado;
                    setGooglePayVinculado(next);
                    onUpdateUser({ ...currentUser, googlePayVinculado: next });
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-[8px] cursor-pointer transition-colors ${
                    googlePayVinculado
                      ? 'border border-[#b9bbc6] text-black hover:bg-[#f3f3f7]'
                      : 'bg-[#ff5900] text-white hover:bg-[#e04f00]'
                  }`}
                >
                  {googlePayVinculado ? 'Desvincular' : 'Vincular Google Pay'}
                </button>
              </div>

              {googlePayVinculado && (
                <div className="p-3 bg-[#f3f3f7] rounded-[10px] border border-[#b9bbc6]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cuenta asociada: <strong>{currentUser.googlePayEmail || correo}</strong></span>
                  </div>
                  <span className="text-[10px] text-[#60646c]">Habilitado para cobros en COP</span>
                </div>
              )}
            </div>

            {/* Credit & Debit Cards Management */}
            <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#f3f3f7] pb-3">
                <div>
                  <h3 className="text-base font-bold text-black flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#ff5900]" />
                    <span>Tarjetas de Crédito y Débito Guardadas</span>
                  </h3>
                  <p className="text-xs text-[#60646c] mt-0.5">
                    Utilizadas para depósitos automáticos en custodia Escrow (Wompi Colombia).
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCard(!showAddCard)}
                  className="px-3.5 py-1.5 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-semibold rounded-[8px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar tarjeta</span>
                </button>
              </div>

              {/* Add card subform */}
              {showAddCard && (
                <form onSubmit={handleAddCardSubmit} className="p-4 bg-[#f3f3f7] rounded-[12px] border border-[#b9bbc6]/50 space-y-3 animate-scale-in">
                  <div className="text-xs font-bold text-black">Añadir nueva tarjeta de pago</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">Número de tarjeta (16 dígitos):</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4500 0000 0000 0000"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white font-mono text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">Nombre tal como figura en el plástico:</label>
                      <input
                        type="text"
                        required
                        placeholder="ALEJANDRO GOMEZ"
                        value={newCardHolder}
                        onChange={(e) => setNewCardHolder(e.target.value)}
                        className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white text-black uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">Vencimiento (MM/AA):</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white font-mono text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">CVV / CVC:</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={newCardCvv}
                        onChange={(e) => setNewCardCvv(e.target.value)}
                        className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white font-mono text-black"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="px-3 py-1.5 text-xs text-[#60646c] hover:underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-black rounded-[6px] cursor-pointer"
                    >
                      Guardar Tarjeta
                    </button>
                  </div>
                </form>
              )}

              {/* Cards Grid */}
              {tarjetas.length === 0 ? (
                <div className="p-8 text-center bg-[#f3f3f7] rounded-[12px] text-xs text-[#60646c]">
                  No tienes tarjetas registradas aún. Puedes agregar una tarjeta de crédito o débito o utilizar Google Pay.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tarjetas.map((card) => (
                    <div 
                      key={card.id}
                      className="p-5 rounded-[12px] border border-[#b9bbc6]/60 bg-white relative space-y-3 shadow-xs hover:border-[#ff5900] transition-smooth"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#ff5900]" />
                          <span className="text-xs font-bold text-black uppercase">{card.marca}</span>
                        </div>
                        {card.predeterminada ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            PREDETERMINADA
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultCard(card.id)}
                            className="text-[10px] text-[#ff5900] hover:underline font-semibold"
                          >
                            Hacer predeterminada
                          </button>
                        )}
                      </div>

                      <div className="font-mono text-base font-bold text-black tracking-widest pt-1">
                        •••• •••• •••• {card.ultimos4}
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#60646c] pt-2 border-t border-[#f3f3f7]">
                        <div>
                          <span className="text-[9px] text-[#8b8d98] block uppercase">Titular</span>
                          <span className="font-medium text-black">{card.titular}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#8b8d98] block uppercase">Vence</span>
                          <span className="font-mono font-medium text-black">{card.vencimiento}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1 text-[#8b8d98] hover:text-rose-600 transition-colors"
                          title="Eliminar tarjeta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 3: HISTORIAL DE CONTRATOS & TRANSACCIONES */}
        {activeTab === 'historial' && (
          <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#f3f3f7] pb-3">
              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <History className="w-4 h-4 text-[#ff5900]" />
                  <span>Historial de Contrataciones y Movimientos Financieros</span>
                </h3>
                <p className="text-xs text-[#60646c] mt-0.5">
                  Trazabilidad inmutable de órdenes, estados de escrow y pagos verificados.
                </p>
              </div>

              <span className="text-xs font-semibold text-black bg-[#f3f3f7] px-3 py-1 rounded-[8px] border border-[#b9bbc6]/40">
                {userContracts.length} contratos registrados
              </span>
            </div>

            {userContracts.length === 0 ? (
              <div className="p-12 text-center bg-[#f3f3f7] rounded-[12px] text-xs text-[#60646c]">
                No tienes servicios o contratos en el historial aún.
              </div>
            ) : (
              <div className="space-y-3">
                {userContracts.map((c) => (
                  <div 
                    key={c.id}
                    className="p-4 rounded-[12px] border border-[#b9bbc6]/40 bg-white hover:border-[#ff5900]/60 transition-smooth flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-black">{c.codigoRadicado}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.estado === 'completado' ? 'bg-emerald-100 text-emerald-800' :
                          c.estado === 'pagado_escrow' ? 'bg-orange-100 text-[#ff5900]' :
                          c.estado === 'en_disputa' ? 'bg-rose-100 text-rose-800' :
                          'bg-[#f3f3f7] text-black'
                        }`}>
                          {c.estado.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#8b8d98]">· {c.fechaCreacion}</span>
                      </div>

                      <div className="text-xs font-bold text-black">{c.descripcionServicio}</div>
                      <div className="text-[11px] text-[#60646c]">
                        {isWorker ? `Cliente: ${c.clienteNombre}` : `Profesional: ${c.trabajadorNombre}`} · Categoría: {c.categoriaNombre}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[#8b8d98] block">Monto total</span>
                        <span className="text-sm font-black text-black tabular-nums">
                          ${c.montoBrutoCOP.toLocaleString('es-CO')} COP
                        </span>
                      </div>

                      {onOpenContractDetails && (
                        <button
                          onClick={() => onOpenContractDetails(c)}
                          className="px-3 py-1.5 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[8px] hover:bg-[#f3f3f7] cursor-pointer"
                        >
                          Ver radicado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: WORKER EARNINGS & ALL STATISTICS (Only if trabajador) */}
        {isWorker && activeTab === 'estadisticas' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-[14px] border border-[#b9bbc6]/50 shadow-xs">
                <span className="text-[11px] font-semibold text-[#8b8d98] block">Ganancias Brutas Generadas</span>
                <div className="text-xl font-bold text-black tabular-nums mt-1">
                  ${(currentUser.gananciasBrutasCOP || 4820000).toLocaleString('es-CO')} <span className="text-xs font-normal text-[#60646c]">COP</span>
                </div>
                <span className="text-[10px] text-emerald-600 mt-1 block">Facturación acumulada total</span>
              </div>

              <div className="bg-white p-5 rounded-[14px] border border-emerald-500/40 shadow-xs">
                <span className="text-[11px] font-semibold text-emerald-700 block">Ganancias Netas (90% Liquidado)</span>
                <div className="text-xl font-bold text-black tabular-nums mt-1">
                  ${(currentUser.gananciasNetasCOP || 4338000).toLocaleString('es-CO')} <span className="text-xs font-normal text-[#60646c]">COP</span>
                </div>
                <span className="text-[10px] text-[#60646c] mt-1 block">Tras 10% de comisión de plataforma</span>
              </div>

              <div className="bg-white p-5 rounded-[14px] border border-[#ff5900]/40 shadow-xs">
                <span className="text-[11px] font-semibold text-[#ff5900] block">Saldo Disponible para Retiro</span>
                <div className="text-xl font-bold text-black tabular-nums mt-1">
                  ${(currentUser.saldoRetirableCOP || 645000).toLocaleString('es-CO')} <span className="text-xs font-normal text-[#60646c]">COP</span>
                </div>
                <button
                  onClick={() => alert('Retiro solicitado hacia Nequi (+57 320 491 8832). Fondos dispersados en ≤ 3 días hábiles conforme al SRS RF-29.')}
                  className="mt-2 text-[10px] font-bold text-white bg-[#ff5900] hover:bg-[#e04f00] px-2.5 py-1 rounded-[6px] cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Retirar a Nequi</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-[14px] border border-[#b9bbc6]/50 shadow-xs">
                <span className="text-[11px] font-semibold text-[#8b8d98] block">Horas & Reputación</span>
                <div className="text-xl font-bold text-black tabular-nums mt-1 flex items-center gap-2">
                  <span>{currentUser.horasTrabajadas || 146} hrs</span>
                  <span className="text-xs text-[#ff5900] font-bold flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-[#ff5900]" /> 4.9
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 mt-1 block">87 servicios terminados</span>
              </div>
            </div>

            {/* Performance breakdown chart/bars */}
            <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-black">Desglose de Rendimiento Semanal (Mes Actual)</h4>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#60646c] mb-1">
                    <span>Semana 1 · 18 horas trabajadas</span>
                    <span className="font-bold text-black tabular-nums">$980.000 COP</span>
                  </div>
                  <div className="w-full bg-[#f3f3f7] h-2.5 rounded-full overflow-hidden border border-[#b9bbc6]/30">
                    <div className="bg-[#ff5900] h-full w-[80%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#60646c] mb-1">
                    <span>Semana 2 · 22 horas trabajadas</span>
                    <span className="font-bold text-black tabular-nums">$1.240.000 COP</span>
                  </div>
                  <div className="w-full bg-[#f3f3f7] h-2.5 rounded-full overflow-hidden border border-[#b9bbc6]/30">
                    <div className="bg-[#ff5900] h-full w-[95%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#60646c] mb-1">
                    <span>Semana 3 · 15 horas trabajadas</span>
                    <span className="font-bold text-black tabular-nums">$820.000 COP</span>
                  </div>
                  <div className="w-full bg-[#f3f3f7] h-2.5 rounded-full overflow-hidden border border-[#b9bbc6]/30">
                    <div className="bg-[#ff5900] h-full w-[65%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#60646c] mb-1">
                    <span>Semana 4 (En curso) · 12 horas</span>
                    <span className="font-bold text-black tabular-nums">$645.000 COP</span>
                  </div>
                  <div className="w-full bg-[#f3f3f7] h-2.5 rounded-full overflow-hidden border border-[#b9bbc6]/30">
                    <div className="bg-[#ff5900] h-full w-[50%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: WORKER SERVICES & RATES EDITOR (Only if trabajador) */}
        {isWorker && activeTab === 'servicios' && (
          <div className="bg-white p-6 md:p-8 rounded-[16px] border border-[#b9bbc6]/50 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f3f3f7] pb-3">
              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#ff5900]" />
                  <span>Configuración de Trabajo y Catálogo de Servicios</span>
                </h3>
                <p className="text-xs text-[#60646c] mt-0.5">
                  Define las tarifas y modalidades con las que emites tus ofertas formales a clientes.
                </p>
              </div>

              <button
                onClick={() => setShowAddService(!showAddService)}
                className="px-3.5 py-1.5 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-semibold rounded-[8px] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo servicio</span>
              </button>
            </div>

            {/* Add service subform */}
            {showAddService && (
              <form onSubmit={handleAddServiceSubmit} className="p-4 bg-[#f3f3f7] rounded-[12px] border border-[#b9bbc6]/50 space-y-3 animate-scale-in">
                <div className="text-xs font-bold text-black">Añadir servicio a tu catálogo</div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-black mb-1">Nombre del servicio:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Mantenimiento correctivo calentador Haceb"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Precio sugerido COP:</label>
                    <input
                      type="number"
                      min="20000"
                      step="5000"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white font-bold text-black tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-black mb-1">Modalidad de cobro:</label>
                  <select
                    value={newServiceModalidad}
                    onChange={(e) => setNewServiceModalidad(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-[6px] border border-[#b9bbc6] bg-white text-black"
                  >
                    <option value="servicio">Por servicio cerrado</option>
                    <option value="hora">Por hora de labor</option>
                    <option value="visita">Por visita / diagnóstico inicial</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="px-3 py-1.5 text-xs text-[#60646c] hover:underline cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-black rounded-[6px] cursor-pointer"
                  >
                    Guardar Servicio
                  </button>
                </div>
              </form>
            )}

            {/* Services List */}
            <div className="space-y-3">
              {servicios.map((srv) => (
                <div 
                  key={srv.id}
                  className="p-4 rounded-[12px] border border-[#b9bbc6]/40 bg-white flex items-center justify-between gap-4 hover:border-[#ff5900]/50 transition-smooth shadow-xs"
                >
                  <div>
                    <div className="text-xs font-bold text-black">{srv.nombre}</div>
                    <div className="text-[11px] text-[#60646c] capitalize">Modalidad: {srv.modalidad}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-black tabular-nums">
                      ${srv.precioCOP.toLocaleString('es-CO')} COP
                      <span className="text-[10px] text-[#8b8d98] font-normal"> /{srv.modalidad}</span>
                    </span>

                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1 text-[#8b8d98] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Photo Selection Modal (Gallery & Live Camera with Encryption) */}
      {showPhotoModal && (
        <PhotoCaptureModal
          currentAvatar={avatarUrl}
          onPhotoSelected={(photo, encUrl) => {
            setAvatarUrl(photo);
            setAvatarUrlEncrypted(encUrl);
          }}
          onClose={() => setShowPhotoModal(false)}
        />
      )}

      {/* Two-Factor Verification OTP Modal for Email and Phone */}
      {showOtpModal && (
        <VerificationOtpModal
          emailChanged={correo.trim().toLowerCase() !== (currentUser.correo || '').trim().toLowerCase()}
          phoneChanged={telefono.trim() !== (currentUser.telefono || '').trim()}
          newEmail={correo}
          newPhone={telefono}
          onSuccess={() => {
            setShowOtpModal(false);
            commitProfileUpdate(true);
          }}
          onCancel={() => setShowOtpModal(false)}
        />
      )}

    </div>
  );
};
