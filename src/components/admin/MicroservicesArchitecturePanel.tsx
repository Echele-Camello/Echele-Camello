import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Radio,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Play,
  Database,
  ArrowRight,
  Code2,
  Server
} from 'lucide-react';
import { platformGateway } from '../../architecture/gateway/ApiGateway';
import { MICROSERVICES_CATALOG } from '../../microservices/DomainMicroservices';
import { ServicioStateMachine } from '../../architecture/patterns/state/DomainStateMachines';
import { ServicioStatus } from '../../types';

export const MicroservicesArchitecturePanel: React.FC = () => {
  const [subTab, setSubTab] = useState<'dominios' | 'patrones' | 'eventbus' | 'gateway'>('dominios');
  const [selectedMsId, setSelectedMsId] = useState<string>('ms-usuarios');

  // Interactive Playground states for patterns testing
  const [testServiceStatus, setTestServiceStatus] = useState<ServicioStatus>('ACTIVO');
  const [patternTestOutput, setPatternTestOutput] = useState<string>(
    'Selecciona cualquier prueba de patrón de diseño para verificar su ejecución en vivo a través del API Gateway.'
  );

  const selectedMs =
    MICROSERVICES_CATALOG.find((m) => m.id === selectedMsId) || MICROSERVICES_CATALOG[0];

  const liveEvents = platformGateway.eventBus.getEventHistory();
  const liveNotifications = platformGateway.eventBus.getLiveNotifications();
  const gatewayLogs = platformGateway.getRequestLogs();
  const diDependencies = platformGateway.container.getRegisteredDependencies();

  // Interactive test 1: State Pattern in ms-servicios
  const handleTestServiceState = (target: ServicioStatus) => {
    const res = platformGateway.msServicios.changeServiceState(
      'srv-101',
      target,
      'Admin Tester',
      'admin'
    );
    if (res.valid) {
      setTestServiceStatus(res.nextStatus);
    }
    platformGateway.logRoute(
      `PATCH /api/ms-servicios/services/srv-101/state -> ${target}`,
      'ms-servicios',
      'admin',
      res.valid ? 200 : 400,
      ['API Gateway', 'State', 'Observer', 'Repository']
    );
    setPatternTestOutput(res.message);
  };

  // Interactive test 2: Domain Ownership Rule in Repository Pattern
  const handleTestDomainGuardViolation = () => {
    try {
      const userRepo = platformGateway.container.resolve<any>('UsuarioRepository');
      // ms-busqueda intenta modificar una entidad de ms-usuarios -> debe ser bloqueado por la Regla Clave
      userRepo.update('cliente1', { apodo: 'Intruso' }, 'ms-busqueda');
    } catch (err: any) {
      platformGateway.logRoute(
        'PUT /api/ms-usuarios/users/cliente1 (Cross-Domain Attempt by ms-busqueda)',
        'ms-usuarios',
        'admin',
        403,
        ['Repository', 'Seguridad Transversal']
      );
      setPatternTestOutput(`✅ REGLA CLAVE PROTEGIDA: ${err.message}`);
    }
  };

  // Interactive test 3: Adapter Pattern in ms-usuarios (Email OTP)
  const handleTestEmailAdapter = () => {
    const emailAdapter = platformGateway.container.resolve<any>('EmailAdapter');
    const res = emailAdapter.sendVerificationEmail(
      'alejandro.gomez@bogota.co',
      'Alejandro Gómez',
      '849201'
    );
    platformGateway.logRoute(
      'POST /api/ms-usuarios/auth/send-otp',
      'ms-usuarios',
      'admin',
      200,
      ['Adapter', 'DTO', 'Dependency Injection']
    );
    setPatternTestOutput(
      `✅ [Patrón Adapter - ms-usuarios] Proveedor "${emailAdapter.providerName}" envió OTP con ID: ${res.messageId} (${res.timestamp})`
    );
  };

  return (
    <div className="space-y-6">
      {/* Architecture Header Banner */}
      <div className="bg-[#15191e] text-white rounded-[12px] p-6 border border-[#b9bbc6]/30 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-[10px] bg-[#ff5900] flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold tracking-tight">
                  Arquitectura de Dominios y 7 Microservicios · Échele Camello
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  API GATEWAY + INYECCIÓN DE DEPENDENCIAS ACTIVA
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Arquitectura por capas (<code>Controller → Service → Repository → DB</code>) con aislamiento estricto de entidades por dominio y patrones <strong>Repository, DTO, State, Strategy, Observer / Pub-Sub, Adapter y API Gateway</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSubTab('dominios')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] cursor-pointer transition-colors ${
                subTab === 'dominios'
                  ? 'bg-[#ff5900] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              7 Microservicios
            </button>
            <button
              onClick={() => setSubTab('patrones')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] cursor-pointer transition-colors ${
                subTab === 'patrones'
                  ? 'bg-[#ff5900] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Laboratorio de Patrones
            </button>
            <button
              onClick={() => setSubTab('eventbus')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] cursor-pointer transition-colors ${
                subTab === 'eventbus'
                  ? 'bg-[#ff5900] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Eventos Observer ({liveEvents.length})
            </button>
            <button
              onClick={() => setSubTab('gateway')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] cursor-pointer transition-colors ${
                subTab === 'gateway'
                  ? 'bg-[#ff5900] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              API Gateway & DI ({diDependencies.length})
            </button>
          </div>
        </div>

        {/* 7 Microservices Pill Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-5">
          {MICROSERVICES_CATALOG.map((ms) => {
            const isSelected = selectedMsId === ms.id && subTab === 'dominios';
            return (
              <button
                key={ms.id}
                onClick={() => {
                  setSelectedMsId(ms.id);
                  setSubTab('dominios');
                }}
                className={`p-3 rounded-[10px] text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white text-black border-[#ff5900] shadow-md'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                  <span>DOMINIO #{ms.numero}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-xs font-mono font-bold mt-1 truncate text-[#ff5900]">
                  {ms.id}
                </div>
                <div className={`text-[11px] font-semibold mt-0.5 line-clamp-1 ${isSelected ? 'text-black' : 'text-white/90'}`}>
                  {ms.nombre}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: 7 MICROSERVICES INSPECTOR */}
      {subTab === 'dominios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Selected Microservice Full Specification */}
          <div className="lg:col-span-7 bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#f3f3f7]">
              <div>
                <span className="text-xs font-mono font-bold text-[#ff5900] uppercase">
                  MICROSERVICIO #{selectedMs.numero} · {selectedMs.id}
                </span>
                <h4 className="text-xl font-bold text-black mt-0.5">{selectedMs.nombre}</h4>
                <p className="text-xs text-[#60646c] mt-1">{selectedMs.responsabilidad}</p>
              </div>
              <span className="text-[11px] font-mono bg-[#f3f3f7] text-black px-2.5 py-1 rounded-[6px] border border-[#b9bbc6]/40 font-bold shrink-0">
                {selectedMs.rfPrincipales}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[10px] bg-[#f8f9fa] border border-[#b9bbc6]/40 space-y-2">
                <div className="text-xs font-bold text-black uppercase tracking-wider">
                  Entidades Propietarias
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMs.entidades.map((ent) => (
                    <span
                      key={ent}
                      className="text-xs font-semibold bg-white text-black px-2.5 py-1 rounded-[6px] border border-[#b9bbc6]/50 shadow-2xs"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-[10px] bg-[#fff2eb]/60 border border-[#ff5900]/30 space-y-2">
                <div className="text-xs font-bold text-black uppercase tracking-wider">
                  Patrones Implementados
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMs.patrones.map((pat) => (
                    <span
                      key={pat}
                      className="text-xs font-mono font-bold bg-[#ff5900] text-white px-2.5 py-0.5 rounded-full"
                    >
                      {pat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-black uppercase tracking-wider mb-2.5">
                Principales Operaciones Expuestas al API Gateway
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedMs.operacionesPrincipales.map((op) => (
                  <div
                    key={op}
                    className="flex items-center gap-2 text-xs text-[#60646c] bg-[#f3f3f7]/60 px-3 py-2 rounded-[8px] border border-[#b9bbc6]/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-black">{op}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Entity Ownership Matrix & Global Rules */}
          <div className="lg:col-span-5 bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-[#ff5900]" />
              <span>Propiedad de las Entidades (Regla Clave)</span>
            </h4>
            <p className="text-xs text-[#60646c]">
              Cada microservicio solo modifica las entidades de su propio dominio sobre el servidor de base de datos compartido:
            </p>

            <div className="overflow-x-auto border border-[#b9bbc6]/40 rounded-[8px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f3f3f7] text-[#8b8d98] font-mono text-[10px] border-b border-[#b9bbc6]/40">
                    <th className="py-2 px-3">ENTIDAD DE DOMINIO</th>
                    <th className="py-2 px-3">MICROSERVICIO PROPIETARIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f3f7] text-[11px]">
                  {[
                    { e: 'Usuario, Rol, Sesión', ms: 'ms-usuarios' },
                    { e: 'Perfil Profesional, Disponibilidad, Ubicación', ms: 'ms-perfiles' },
                    { e: 'Servicio, Categoría', ms: 'ms-servicios' },
                    { e: '(Consume otros servicios sin entidad propia)', ms: 'ms-busqueda' },
                    { e: 'Solicitud Servicio, Programación', ms: 'ms-solicitudes' },
                    { e: 'Conversación, Mensaje, Notificación', ms: 'ms-comunicacion' },
                    { e: 'Calificación, Reseña, Reporte', ms: 'ms-reputacion' }
                  ].map((item) => (
                    <tr key={item.ms} className="hover:bg-[#f3f3f7]/40">
                      <td className="py-2 px-3 font-semibold text-black">{item.e}</td>
                      <td className="py-2 px-3 font-mono font-bold text-[#ff5900]">{item.ms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-[10px] bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold">Tecnologías NO necesarias en esta etapa formativa:</div>
              <div className="text-[11px]">
                CQRS · Event Sourcing · Saga distribuida · Service Mesh · Kafka / RabbitMQ · Kubernetes (se reservan para escalamiento futuro).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DESIGN PATTERNS INTERACTIVE PLAYGROUND */}
      {subTab === 'patrones' && (
        <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs space-y-6">
          <div>
            <h4 className="text-base font-bold text-black">
              Laboratorio Interactivo de Patrones de Diseño (Verificación en Vivo)
            </h4>
            <p className="text-xs text-[#60646c] mt-0.5">
              Ejecuta pruebas reales sobre las clases TypeScript de los patrones implementados y observa su resultado inmediato:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: State Pattern in ms-servicios */}
            <div className="p-4 rounded-[12px] border border-[#b9bbc6]/60 bg-[#f8f9fa] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#ff5900]">PATRÓN STATE (ms-servicios)</span>
                <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-[#b9bbc6]">
                  Actual: {testServiceStatus}
                </span>
              </div>
              <p className="text-xs text-[#60646c]">
                Prueba cambiar el estado del servicio <code>srv-101</code> mediante <code>ServicioStateMachine</code>:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'BORRADOR'] as ServicioStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleTestServiceState(st)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-[#ff5900] hover:text-white text-black border border-[#b9bbc6] rounded-[6px] cursor-pointer transition-colors"
                  >
                    → {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Card 2: Repository Domain Guard */}
            <div className="p-4 rounded-[12px] border border-[#b9bbc6]/60 bg-[#f8f9fa] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#ff5900]">PATRÓN REPOSITORY (Regla Clave)</span>
              </div>
              <p className="text-xs text-[#60646c]">
                Simula un intento de <code>ms-busqueda</code> por modificar directamente la entidad <code>Usuario</code> de <code>ms-usuarios</code>:
              </p>
              <button
                onClick={handleTestDomainGuardViolation}
                className="w-full py-2 px-3 text-xs font-semibold bg-black text-white rounded-[8px] hover:bg-black/80 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff5900]" />
                <span>Probar Aislamiento de Dominio</span>
              </button>
            </div>

            {/* Card 3: Adapter Pattern */}
            <div className="p-4 rounded-[12px] border border-[#b9bbc6]/60 bg-[#f8f9fa] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#ff5900]">PATRÓN ADAPTER (ms-usuarios)</span>
              </div>
              <p className="text-xs text-[#60646c]">
                Invoca <code>SmtpEmailAdapter</code> inyectado vía <code>DIContainer</code> para despachar un código OTP de verificación:
              </p>
              <button
                onClick={handleTestEmailAdapter}
                className="w-full py-2 px-3 text-xs font-semibold bg-[#ff5900] text-white rounded-[8px] hover:bg-[#e04f00] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Ejecutar EmailAdapter</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-[10px] bg-[#15191e] text-emerald-400 font-mono text-xs border border-black">
            <div className="text-[10px] text-white/60 uppercase mb-1">Resultado de Ejecución en Vivo:</div>
            <div>{patternTestOutput}</div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: OBSERVER / PUBLISH-SUBSCRIBE EVENT BUS */}
      {subTab === 'eventbus' && (
        <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-black flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#ff5900]" />
                <span>Bus de Eventos Observer / Publish-Subscribe (ms-solicitudes · ms-comunicacion · ms-reputacion)</span>
              </h4>
              <p className="text-xs text-[#60646c]">
                Eventos emitidos en tiempo real entre microservicios y notificaciones despachadas:
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#f3f3f7] px-3 py-1 rounded-full">
              {liveEvents.length} eventos publicados
            </span>
          </div>

          {liveEvents.length === 0 ? (
            <div className="p-8 text-center bg-[#f3f3f7] rounded-[10px] text-xs text-[#60646c]">
              Cambia de rol con el botón Switch, envía un mensaje, crea una solicitud o ejecuta una prueba de patrón para ver eventos en tiempo real.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {liveEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-[10px] border border-[#b9bbc6]/50 bg-[#f8f9fa] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold bg-[#15191e] text-[#ff5900] px-2 py-0.5 rounded text-[11px]">
                        {ev.type}
                      </span>
                      <span className="font-mono font-semibold text-black">{ev.sourceMicroservice}</span>
                      <ArrowRight className="w-3 h-3 text-[#8b8d98]" />
                      <span className="font-mono text-emerald-700 font-semibold">
                        [{ev.targetMicroservices.join(', ')}]
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#60646c] break-all">
                      Payload DTO: {JSON.stringify(ev.payload)}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-[#8b8d98] shrink-0">
                    {ev.actorName} ({ev.actorRole}) · {ev.timestamp}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: API GATEWAY & DEPENDENCY INJECTION */}
      {subTab === 'gateway' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-[#ff5900]" />
              <span>Contenedor de Inyección de Dependencias (DIContainer)</span>
            </h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {diDependencies.map((dep) => (
                <div
                  key={dep.token}
                  className="p-2.5 rounded-[8px] border border-[#b9bbc6]/40 bg-[#f8f9fa] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-black">{dep.token}</span>
                    <span className="text-[10px] font-mono text-[#ff5900] ml-2">
                      ({dep.microserviceOwner})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    {dep.singleton ? 'SINGLETON' : 'TRANSIENT'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ff5900]" />
              <span>Trazas de Enrutamiento del API Gateway</span>
            </h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {gatewayLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-[8px] border border-[#b9bbc6]/40 bg-[#f8f9fa] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-black">{log.route}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        log.status === 200
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      HTTP {log.status} · {log.latencyMs}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#60646c]">
                    <span>
                      Destino: <strong className="text-[#ff5900] font-mono">{log.targetMicroservice}</strong> · Rol: {log.callerRole}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

