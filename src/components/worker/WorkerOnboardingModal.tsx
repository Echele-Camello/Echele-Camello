import React, { useState } from 'react';
import { 
  X, ShieldCheck, Briefcase, CheckCircle2, ArrowRight, 
  DollarSign, Upload, FileText, Camera, UserCheck, 
  CreditCard, MapPin, Phone, Mail, Award, Clock, AlertTriangle, Eye
} from 'lucide-react';
import { WorkerCategory, WorkerProfile, User, PortfolioItem } from '../../types';

interface WorkerOnboardingModalProps {
  currentUser: User;
  categories: WorkerCategory[];
  onCompleteWorkerRegistration: (workerData: Partial<WorkerProfile>) => void;
  onClose: () => void;
}

export const WorkerOnboardingModal: React.FC<WorkerOnboardingModalProps> = ({
  currentUser,
  categories,
  onCompleteWorkerRegistration,
  onClose
}) => {
  // Wizard steps: 1: Labor & Oficio | 2: Documentos de Seguridad | 3: Confirmación
  const [step, setStep] = useState<1 | 2>(1);
  const [isDone, setIsDone] = useState(false);

  // STEP 1: MISSING Labor / Service info (not asked before)
  const [categoriaId, setCategoriaId] = useState(categories[0]?.id || 'cat-serv-no-reg');
  const [especialidadesInput, setEspecialidadesInput] = useState('Detección de fugas, destapes con sonda, instalación de griferías');
  const [experienciaAnos, setExperienciaAnos] = useState<number>(6);
  const [tarifaPorHora, setTarifaPorHora] = useState<number>(45000);
  const [horarioAtencion, setHorarioAtencion] = useState('Lunes a Sábado: 7:30 AM - 6:00 PM');
  const [radioKm, setRadioKm] = useState<number>(15);
  const [descripcion, setDescripcion] = useState(
    'Tengo más de 6 años de experiencia en el oficio. Cuento con kit de herramientas profesionales propias, diagnóstico preciso y garantía total con respaldo escrow.'
  );

  // Portfolio samples
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 'samp-1',
      titulo: 'Mantenimiento preventivo e instalación hidráulica',
      descripcion: 'Trabajo terminado a satisfacción con materiales normativos y prueba de presión.',
      fotoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80',
      fecha: 'Muestra de trabajo 1'
    }
  ]);
  const [newSampleTitle, setNewSampleTitle] = useState('');

  // STEP 2: MISSING Security & Identification Documents (RF-15)
  const [tipoDocumento, setTipoDocumento] = useState<'CC' | 'CE' | 'PPT'>('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('1.032.485.912');
  const [fechaExpedicionDocumento, setFechaExpedicionDocumento] = useState('2016-04-18');
  
  // Document uploads states (simulated with instant verification previews)
  const [cedulaFrontalFile, setCedulaFrontalFile] = useState<string>(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'
  );
  const [cedulaReversoFile, setCedulaReversoFile] = useState<string>(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'
  );
  const [selfieSeguridadFile, setSelfieSeguridadFile] = useState<string>(
    currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );
  const [rutOpcional, setRutOpcional] = useState<boolean>(true);

  // Bank payout details for Escrow disbursements
  const [bancoEntidad, setBancoEntidad] = useState('Nequi');
  const [tipoCuenta, setTipoCuenta] = useState('Depósito Digital');
  const [numeroCuenta, setNumeroCuenta] = useState(currentUser.telefono || '3118492011');
  
  // Legal authorization check
  const [autorizaAntecedentes, setAutorizaAntecedentes] = useState(true);
  const [aceptaTerminosLaborales, setAceptaTerminosLaborales] = useState(true);

  // Client's already validated data tokens
  const clientFullName = `${currentUser.nombre} ${currentUser.apellido || ''}`.trim() || 'Alejandro Gómez Restrepo';
  const clientLocation = `${currentUser.departamento || 'Cundinamarca'}, ${currentUser.municipio || 'Bogotá D.C.'} (${currentUser.direccion || 'Calle 45 # 17-28'})`;

  // Add sample photo to portfolio
  const handleAddPortfolioSample = () => {
    if (!newSampleTitle.trim()) return;
    setPortfolioItems([
      ...portfolioItems,
      {
        id: `port-${Date.now()}`,
        titulo: newSampleTitle.trim(),
        descripcion: 'Trabajo verificado realizado con herramientas propias.',
        fotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
        fecha: 'Muestra agregada'
      }
    ]);
    setNewSampleTitle('');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) return;
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroDocumento.trim() || !autorizaAntecedentes || !aceptaTerminosLaborales) return;

    const cat = categories.find(c => c.id === categoriaId);
    const specsArray = especialidadesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onCompleteWorkerRegistration({
      nombre: clientFullName,
      categoriaId,
      categoriaNombre: cat ? cat.nombre : 'Servicios Especializados',
      especialidades: specsArray.length > 0 ? specsArray : ['Reparaciones y mantenimientos'],
      descripcion,
      ciudad: currentUser.ciudad || currentUser.municipio || 'Bogotá D.C.',
      barrio: currentUser.barrio || 'Área de Cobertura',
      radioKm,
      tarifaPorHora,
      verificado: true,
      estadoVerificacion: 'aprobado',
      tipoDocumento,
      numeroDocumento,
      fechaExpedicionDocumento,
      documentoIdentidadUrl: cedulaFrontalFile,
      documentoReversoUrl: cedulaReversoFile,
      selfieUrl: selfieSeguridadFile,
      cuentaBancariaDesembolso: {
        entidad: bancoEntidad,
        tipo: tipoCuenta,
        numero: numeroCuenta,
        titular: clientFullName
      },
      experienciaAnos,
      disponible: true,
      horarioAtencion,
      portafolio: portfolioItems
    });

    setIsDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[16px] border border-[#b9bbc6] shadow-2xl overflow-hidden my-6 animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#b9bbc6]/40 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#ff5900] flex items-center justify-center text-white text-xs font-black shadow-xs">
              EC
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-black tracking-tight">
                ¿Quieres ser contratado? Habilitar Perfil de Trabajador
              </h3>
              <p className="text-[11px] text-[#60646c]">
                Solo te solicitamos la información profesional y documentos de seguridad faltantes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ALREADY VALIDATED CLIENT DATA REUSE BANNER */}
        <div className="bg-[#f8f9fa] border-b border-[#b9bbc6]/40 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Datos ya validados en tu cuenta de cliente (NO necesitas reescribirlos)</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#60646c]">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatarUrl}
                alt={clientFullName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-[#b9bbc6]"
              />
              <span className="font-bold text-black">{clientFullName}</span>
            </div>

            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#ff5900]" />
              <span className="font-mono text-[11px]">{currentUser.correo}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded">✓ OTP</span>
            </div>

            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#ff5900]" />
              <span className="font-mono text-[11px]">{currentUser.telefono}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded">✓ SMS</span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ff5900]" />
              <span className="truncate max-w-[200px] text-[11px]">{clientLocation}</span>
            </div>
          </div>
        </div>

        {isDone ? (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Documentos Cotejados & Garantía Escrow Habilitada</span>
              </div>
              <h4 className="text-xl font-bold text-black tracking-tight">
                ¡Felicitaciones {currentUser.nombre}! Tu perfil laboral está activo
              </h4>
            </div>

            <p className="text-xs text-[#60646c] leading-relaxed max-w-md mx-auto">
              Hemos registrado tus documentos de identidad, oficio y cuenta de desembolsos. Tus servicios ya se visualizan en el <strong>Catálogo</strong> y puedes publicar anuncios en el <strong>Foro</strong>.
            </p>

            <div className="bg-[#f8f9fa] border border-[#b9bbc6]/40 rounded-[12px] p-4 max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8b8d98]">Oficio registrado:</span>
                <span className="font-bold text-black">{categories.find(c => c.id === categoriaId)?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8d98]">Tarifa base:</span>
                <span className="font-bold text-black">${tarifaPorHora.toLocaleString('es-CO')} COP / hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8d98]">Cédula:</span>
                <span className="font-mono text-black">{tipoDocumento} {numeroDocumento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8d98]">Recepción pagos:</span>
                <span className="font-bold text-emerald-700">{bancoEntidad} ({numeroCuenta})</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-bold rounded-[10px] cursor-pointer shadow-xs transition-colors"
              >
                Ir a mi Perfil y Dashboard Laboral
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Navigation Tabs */}
            <div className="flex border-b border-[#b9bbc6]/40 bg-[#fbfbfc]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  step === 1
                    ? 'border-[#ff5900] text-[#ff5900] bg-white'
                    : 'border-transparent text-[#60646c] hover:text-black'
                }`}
              >
                <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  step === 1 ? 'bg-[#ff5900] text-white' : 'bg-[#e2e4e9] text-[#60646c]'
                }`}>
                  1
                </div>
                <span>1. Oficio y Habilidades Laborales</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  step === 2
                    ? 'border-[#ff5900] text-[#ff5900] bg-white'
                    : 'border-transparent text-[#60646c] hover:text-black'
                }`}
              >
                <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  step === 2 ? 'bg-[#ff5900] text-white' : 'bg-[#e2e4e9] text-[#60646c]'
                }`}>
                  2
                </div>
                <span>2. Documentos de Seguridad (RF-15)</span>
              </button>
            </div>

            {/* STEP 1: LABOR INFO */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="p-5 sm:p-6 space-y-4 max-h-[68vh] overflow-y-auto">
                <div className="bg-[#fff4ed] border border-[#ff5900]/30 rounded-[10px] p-3 text-xs text-[#60646c] flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-[#ff5900] shrink-0 mt-0.5" />
                  <span>
                    Indica a qué te dedicas y cómo cobrarás. Podrás recibir contrataciones de clientes verificados con pago garantizado en custodia Escrow.
                  </span>
                </div>

                {/* Categoría y Años de Experiencia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Categoría u Oficio Principal *
                    </label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] bg-white text-black font-semibold focus:border-[#ff5900] outline-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Años de Experiencia en el Oficio *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="45"
                      required
                      value={experienciaAnos}
                      onChange={(e) => setExperienciaAnos(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] font-bold text-black focus:border-[#ff5900] outline-none"
                    />
                  </div>
                </div>

                {/* Especialidades Técnicas */}
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Especialidades y tipos de arreglos específicos (separadas por coma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={especialidadesInput}
                    onChange={(e) => setEspecialidadesInput(e.target.value)}
                    placeholder="Ej: Destapes con sonda, detección de fugas, calentadores Haceb, griferías"
                    className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] text-black focus:border-[#ff5900] outline-none"
                  />
                  <span className="text-[10px] text-[#8b8d98]">
                    Estas palabras clave permitirán que los clientes te encuentren en el Catálogo y Foro.
                  </span>
                </div>

                {/* Tarifa Base COP y Horario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Tarifa Base por Hora (COP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#8b8d98] font-bold">$</span>
                      <input
                        type="number"
                        min="20000"
                        step="5000"
                        required
                        value={tarifaPorHora}
                        onChange={(e) => setTarifaPorHora(Number(e.target.value))}
                        className="w-full text-xs pl-7 pr-3 py-2.5 rounded-[10px] border border-[#b9bbc6] font-extrabold text-black tabular-nums focus:border-[#ff5900] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Horario de Atención Habitual *
                    </label>
                    <input
                      type="text"
                      required
                      value={horarioAtencion}
                      onChange={(e) => setHorarioAtencion(e.target.value)}
                      placeholder="Ej: Lunes a Sábado: 8:00 AM - 6:00 PM o 24 Horas"
                      className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] text-black focus:border-[#ff5900] outline-none"
                    />
                  </div>
                </div>

                {/* Radio de Cobertura */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-black uppercase tracking-wider">
                      Radio Máximo de Cobertura desde tu Ubicación
                    </label>
                    <span className="text-xs font-extrabold text-[#ff5900]">{radioKm} km a la redonda</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="35"
                    step="1"
                    value={radioKm}
                    onChange={(e) => setRadioKm(Number(e.target.value))}
                    className="w-full accent-[#ff5900] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8b8d98]">
                    <span>3 km (Barrios aledaños)</span>
                    <span>15 km (Localidad/Ciudad)</span>
                    <span>35 km (Área Metropolitana)</span>
                  </div>
                </div>

                {/* Descripción profesional */}
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                    Descripción de tu Servicio y Experiencia *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Menciona tus herramientas de trabajo, experiencia, puntualidad y compromiso..."
                    className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] text-black focus:border-[#ff5900] outline-none"
                  />
                </div>

                {/* Muestra de Portafolio */}
                <div className="pt-2 border-t border-[#b9bbc6]/40">
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Muestras de Trabajos Previos (Portafolio)</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Genera 40% más contrataciones</span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={newSampleTitle}
                      onChange={(e) => setNewSampleTitle(e.target.value)}
                      placeholder="Ej: Instalación de tubería PVC en baño nuevo"
                      className="flex-1 text-xs p-2 rounded-[8px] border border-[#b9bbc6] text-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddPortfolioSample}
                      className="px-3 py-2 bg-[#f3f3f7] hover:bg-[#eceef2] text-xs font-semibold text-black rounded-[8px] cursor-pointer"
                    >
                      + Agregar foto
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 bg-[#f8f9fa] rounded-[8px] border border-[#b9bbc6]/40 text-xs">
                        <img src={item.fotoUrl} alt={item.titulo} className="w-10 h-10 rounded object-cover" />
                        <div className="truncate">
                          <div className="font-semibold text-black truncate">{item.titulo}</div>
                          <div className="text-[10px] text-[#8b8d98]">{item.fecha}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between border-t border-[#b9bbc6]/40">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Siguiente: Documentos de Seguridad</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: SECURITY DOCUMENTS & SAFE VERIFICATION */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="p-5 sm:p-6 space-y-4 max-h-[68vh] overflow-y-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 text-xs text-blue-950 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Verificación de Confianza y Seguridad (RF-15):</strong>
                    <p className="text-[11px] text-blue-900 mt-0.5 leading-relaxed">
                      Para proteger a los clientes de la plataforma y garantizar desembolsos de custodia Escrow sin fraudes, cotejamos tu documento de identidad y selfie de seguridad con la base de datos oficial.
                    </p>
                  </div>
                </div>

                {/* Tipo de Documento, Número y Fecha de Expedición */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Tipo de Documento *
                    </label>
                    <select
                      value={tipoDocumento}
                      onChange={(e: any) => setTipoDocumento(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] bg-white text-black font-semibold focus:border-[#ff5900] outline-none cursor-pointer"
                    >
                      <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                      <option value="CE">Cédula de Extranjería (C.E.)</option>
                      <option value="PPT">Permiso Protección Temporal (PPT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      required
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      placeholder="1.000.000.000"
                      className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] font-mono font-bold text-black focus:border-[#ff5900] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Fecha de Expedición *
                    </label>
                    <input
                      type="date"
                      required
                      value={fechaExpedicionDocumento}
                      onChange={(e) => setFechaExpedicionDocumento(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] text-black font-medium focus:border-[#ff5900] outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* DOCUMENT UPLOADS: CÉDULA FRONTAL, REVERSO, SELFIE DE SEGURIDAD */}
                <div className="space-y-3 pt-2 border-t border-[#b9bbc6]/40">
                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    Archivos Requeridos para Cotejo de Identidad
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Frontal */}
                    <div className="border border-[#b9bbc6] rounded-[10px] p-3 text-center space-y-2 bg-[#f8f9fa]">
                      <div className="text-[11px] font-bold text-black">
                        1. Cédula Frontal
                      </div>
                      <div className="w-full h-20 bg-white rounded border border-[#b9bbc6]/50 flex items-center justify-center overflow-hidden relative">
                        {cedulaFrontalFile ? (
                          <img src={cedulaFrontalFile} alt="Cédula Frontal" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-6 h-6 text-[#8b8d98]" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                          ✓ Listo
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Documento frontal verificado y listo para validación.')}
                        className="w-full py-1 text-[11px] font-semibold text-[#ff5900] hover:underline"
                      >
                        Cambiar archivo
                      </button>
                    </div>

                    {/* Reverso */}
                    <div className="border border-[#b9bbc6] rounded-[10px] p-3 text-center space-y-2 bg-[#f8f9fa]">
                      <div className="text-[11px] font-bold text-black">
                        2. Cédula Reverso (Código)
                      </div>
                      <div className="w-full h-20 bg-white rounded border border-[#b9bbc6]/50 flex items-center justify-center overflow-hidden relative">
                        {cedulaReversoFile ? (
                          <img src={cedulaReversoFile} alt="Cédula Reverso" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-6 h-6 text-[#8b8d98]" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                          ✓ Listo
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Documento reverso verificado y listo para validación.')}
                        className="w-full py-1 text-[11px] font-semibold text-[#ff5900] hover:underline"
                      >
                        Cambiar archivo
                      </button>
                    </div>

                    {/* Selfie de seguridad */}
                    <div className="border border-[#b9bbc6] rounded-[10px] p-3 text-center space-y-2 bg-[#f8f9fa]">
                      <div className="text-[11px] font-bold text-black">
                        3. Selfie con Cédula
                      </div>
                      <div className="w-full h-20 bg-white rounded border border-[#b9bbc6]/50 flex items-center justify-center overflow-hidden relative">
                        {selfieSeguridadFile ? (
                          <img src={selfieSeguridadFile} alt="Selfie de Seguridad" className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="w-6 h-6 text-[#8b8d98]" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                          ✓ Biometría
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Foto biométrica enlazada a tu perfil.')}
                        className="w-full py-1 text-[11px] font-semibold text-[#ff5900] hover:underline"
                      >
                        Tomar selfie
                      </button>
                    </div>

                  </div>
                </div>

                {/* CUENTA BANCARIA PARA DESEMBOLSOS ESCROW */}
                <div className="space-y-3 pt-2 border-t border-[#b9bbc6]/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#ff5900]" />
                      <span>Cuenta Receptora para Desembolsos Escrow</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Desembolso del 90% neto
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">Entidad:</label>
                      <select
                        value={bancoEntidad}
                        onChange={(e) => setBancoEntidad(e.target.value)}
                        className="w-full text-xs p-2 rounded-[8px] border border-[#b9bbc6] bg-white text-black font-semibold cursor-pointer"
                      >
                        <option value="Nequi">Nequi (Colombia)</option>
                        <option value="Daviplata">Daviplata</option>
                        <option value="Bancolombia">Bancolombia</option>
                        <option value="Davivienda">Davivienda</option>
                        <option value="Banco de Bogotá">Banco de Bogotá</option>
                        <option value="Dale!">Dale!</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">Tipo de Cuenta:</label>
                      <select
                        value={tipoCuenta}
                        onChange={(e) => setTipoCuenta(e.target.value)}
                        className="w-full text-xs p-2 rounded-[8px] border border-[#b9bbc6] bg-white text-black font-semibold cursor-pointer"
                      >
                        <option value="Depósito Digital">Depósito Digital</option>
                        <option value="Ahorros">Cuenta de Ahorros</option>
                        <option value="Corriente">Cuenta Corriente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-black mb-1">Número de Cuenta / Celular:</label>
                      <input
                        type="text"
                        required
                        value={numeroCuenta}
                        onChange={(e) => setNumeroCuenta(e.target.value)}
                        className="w-full text-xs p-2 rounded-[8px] border border-[#b9bbc6] font-mono font-bold text-black"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#60646c]">
                    Titular de la cuenta: <strong className="text-black">{clientFullName}</strong> (El titular debe coincidir con el documento para evitar retenciones preventivas).
                  </div>
                </div>

                {/* LEGAL AUTHORIZATION CHECKBOXES (LEY 1581) */}
                <div className="space-y-2 pt-2 border-t border-[#b9bbc6]/40 bg-[#fafafc] p-3 rounded-[10px] border">
                  <label className="flex items-start gap-2.5 text-xs text-[#60646c] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={autorizaAntecedentes}
                      onChange={(e) => setAutorizaAntecedentes(e.target.checked)}
                      className="w-4 h-4 accent-[#ff5900] mt-0.5 rounded shrink-0"
                    />
                    <span>
                      <strong>Autorización de Verificación (Ley 1581 de 2012):</strong> Autorizo expresamente a <em>Échele Camello</em> a consultar mis antecedentes disciplinarios y judiciales en bases públicas (Policía Nacional, Procuraduría y Contraloría) para otorgarme el distintivo de <strong>Trabajador Verificado Escrow</strong>.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-[#60646c] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={aceptaTerminosLaborales}
                      onChange={(e) => setAceptaTerminosLaborales(e.target.checked)}
                      className="w-4 h-4 accent-[#ff5900] mt-0.5 rounded shrink-0"
                    />
                    <span>
                      Declaro bajo gravedad de juramento que la información y documentos adjuntados son verídicos, y acepto el protocolo de cobro con retención en custodia Escrow hasta la confirmación de entrega del cliente.
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between border-t border-[#b9bbc6]/40">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer"
                  >
                    ← Volver al Paso 1
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Radicar Documentos y Activar Perfil</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
