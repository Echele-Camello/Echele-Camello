import React, { useState } from 'react';
import { Contract, WorkerProfile, Dispute } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
  Database,
  Layers
} from 'lucide-react';
import { LiquibaseHistoryPanel } from './LiquibaseHistoryPanel';
import { MicroservicesArchitecturePanel } from './MicroservicesArchitecturePanel';

interface AdminDashboardProps {
  contracts: Contract[];
  workers: WorkerProfile[];
  disputes: Dispute[];
  onApproveWorkerVerification: (workerId: string) => void;
  onRejectWorkerVerification: (workerId: string, motivo: string) => void;
  onResolveDispute: (disputeId: string, decision: 'liberar' | 'reembolsar' | 'dividir', motivo: string) => void;
  initialSubTab?: 'liquibase' | 'arquitectura' | 'metricas' | 'verificaciones' | 'disputas' | 'configuracion';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  contracts,
  workers,
  disputes,
  onApproveWorkerVerification,
  onRejectWorkerVerification,
  onResolveDispute,
  initialSubTab = 'liquibase'
}) => {
  const [activeTab, setActiveTab] = useState<
    'liquibase' | 'arquitectura' | 'metricas' | 'verificaciones' | 'disputas' | 'configuracion'
  >(initialSubTab);
  const [commissionRate, setCommissionRate] = useState(10);
  const [resolutionMotive, setResolutionMotive] = useState(
    'Resolución motivada basada en evidencia de inspección.'
  );

  // Financial calculations
  const totalVolumeCOP = contracts.reduce((acc, c) => acc + c.montoBrutoCOP, 0);
  const volumeInEscrowCOP = contracts
    .filter((c) => ['pagado_escrow', 'en_curso', 'terminado'].includes(c.estado))
    .reduce((acc, c) => acc + c.montoBrutoCOP, 0);
  const platformRevenueCOP = contracts
    .filter((c) => c.estado === 'completado')
    .reduce((acc, c) => acc + c.comisionCOP, 0);
  const disputeRate =
    contracts.length > 0 ? ((disputes.length / contracts.length) * 100).toFixed(1) : '0';

  const pendingVerificationWorkers = workers.filter((w) => w.estadoVerificacion === 'pendiente');

  // CSV export function (RF-42)
  const handleExportCSV = () => {
    const headers = [
      'CodigoRadicado,Cliente,Trabajador,MontoBrutoCOP,Comision10COP,NetoTrabajadorCOP,Estado,Fecha'
    ];
    const rows = contracts.map(
      (c) =>
        `"${c.codigoRadicado}","${c.clienteNombre}","${c.trabajadorNombre}",${c.montoBrutoCOP},${c.comisionCOP},${c.montoNetoTrabajadorCOP},"${c.estado}","${c.fechaCreacion}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_transacciones_echelecamello_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full bg-[#f3f3f7] py-10 min-h-[80vh]">
      <div className="max-w-[1250px] mx-auto px-4 md:px-8">
        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#ff5900] mb-1 tracking-wide uppercase">
              ADMINISTRACIÓN TRANSVERSAL · ROL ADMIN ACTIVO (RF-40, RF-41, RF-42)
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
              Panel de Control Maestro, Liquibase y Microservicios
            </h2>
            <p className="text-xs text-[#60646c] mt-1">
              Control de versiones e informes de base de datos con Liquibase, supervisión de los 7 microservicios, custodia Escrow y moderación.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('liquibase')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-[10px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                activeTab === 'liquibase'
                  ? 'bg-[#15191e] text-white'
                  : 'bg-white text-black border border-[#b9bbc6] hover:bg-[#f3f3f7]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Histórico e Informes Liquibase</span>
            </button>

            <button
              onClick={() => setActiveTab('arquitectura')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-[10px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                activeTab === 'arquitectura'
                  ? 'bg-[#15191e] text-white'
                  : 'bg-white text-black border border-[#b9bbc6] hover:bg-[#f3f3f7]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>7 Microservicios & Patrones</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold text-black bg-white border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Exportar Contratos CSV (RF-42)</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-[12px] border border-[#b9bbc6]/50 shadow-xs">
            <span className="text-[11px] font-medium text-[#8b8d98] block">Volumen Transado Total</span>
            <div className="text-xl font-bold text-black tabular-nums mt-1">
              ${totalVolumeCOP.toLocaleString('es-CO')}{' '}
              <span className="text-xs font-normal text-[#60646c]">COP</span>
            </div>
            <span className="text-[10px] text-emerald-600 mt-1 block">Trazabilidad inmutable 100%</span>
          </div>

          <div className="bg-white p-5 rounded-[12px] border border-[#ff5900]/40 shadow-xs">
            <span className="text-[11px] font-medium text-[#ff5900] block">Fondos Activos en Escrow</span>
            <div className="text-xl font-bold text-black tabular-nums mt-1">
              ${volumeInEscrowCOP.toLocaleString('es-CO')}{' '}
              <span className="text-xs font-normal text-[#60646c]">COP</span>
            </div>
            <span className="text-[10px] text-[#60646c] mt-1 block">Retenidos en ms-solicitudes</span>
          </div>

          <div className="bg-white p-5 rounded-[12px] border border-[#b9bbc6]/50 shadow-xs">
            <span className="text-[11px] font-medium text-[#8b8d98] block">
              Ingresos Comisión Plataforma (10%)
            </span>
            <div className="text-xl font-bold text-black tabular-nums mt-1">
              ${platformRevenueCOP.toLocaleString('es-CO')}{' '}
              <span className="text-xs font-normal text-[#60646c]">COP</span>
            </div>
            <span className="text-[10px] text-[#60646c] mt-1 block">Sobre contratos completados</span>
          </div>

          <div className="bg-white p-5 rounded-[12px] border border-[#b9bbc6]/50 shadow-xs">
            <span className="text-[11px] font-medium text-[#8b8d98] block">Tasa de Disputas</span>
            <div className="text-xl font-bold text-black tabular-nums mt-1">{disputeRate}%</div>
            <span className="text-[10px] text-emerald-600 mt-1 block">Moderación vía ms-reputacion</span>
          </div>
        </div>

        {/* Main Admin Navigation Tabs */}
        <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 overflow-hidden shadow-xs mb-8">
          <div className="flex border-b border-[#f3f3f7] px-6 text-xs font-medium bg-[#f3f3f7]/40 gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('liquibase')}
              className={`py-3.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'liquibase'
                  ? 'text-black border-b-2 border-[#ff5900] font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Control de Versiones e Informes (Liquibase)</span>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
                v5.0.4
              </span>
            </button>

            <button
              onClick={() => setActiveTab('arquitectura')}
              className={`py-3.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'arquitectura'
                  ? 'text-black border-b-2 border-[#ff5900] font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Arquitectura Microservicios & Patrones</span>
              <span className="bg-[#ff5900] text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                7 MS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('metricas')}
              className={`py-3.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'metricas'
                  ? 'text-black border-b-2 border-[#ff5900] font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              Libro Contable de Contratos
            </button>

            <button
              onClick={() => setActiveTab('verificaciones')}
              className={`py-3.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'verificaciones'
                  ? 'text-black border-b-2 border-[#ff5900] font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <span>Verificación Identidad (ms-perfiles)</span>
              {pendingVerificationWorkers.length > 0 && (
                <span className="bg-[#ff5900] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingVerificationWorkers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('disputas')}
              className={`py-3.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'disputas'
                  ? 'text-black border-b-2 border-[#ff5900] font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <span>Moderación Reportes (ms-reputacion)</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                {disputes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('configuracion')}
              className={`py-3.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'configuracion'
                  ? 'text-black border-b-2 border-[#ff5900] font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              Parámetros de Comisión
            </button>
          </div>

          <div className="p-6">
            {/* Tab: Liquibase & Database Version Control / Reports */}
            {activeTab === 'liquibase' && <LiquibaseHistoryPanel />}

            {/* Tab: Microservices & Design Patterns */}
            {activeTab === 'arquitectura' && <MicroservicesArchitecturePanel />}

            {/* Tab: Financial Ledger */}
            {activeTab === 'metricas' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#60646c]">
                  <span>Registro de transacciones con retención y dispersión de fondos:</span>
                  <span>Total registros: {contracts.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#b9bbc6]/40 text-[#8b8d98] font-mono">
                        <th className="py-2.5 px-3">RADICADO</th>
                        <th className="py-2.5 px-3">CLIENTE</th>
                        <th className="py-2.5 px-3">TRABAJADOR</th>
                        <th className="py-2.5 px-3 text-right">VALOR BRUTO</th>
                        <th className="py-2.5 px-3 text-right">COMISIÓN (10%)</th>
                        <th className="py-2.5 px-3 text-right">NETO A LIQUIDAR</th>
                        <th className="py-2.5 px-3">ESTADO ESCROW (STATE)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f3f7]">
                      {contracts.map((c) => (
                        <tr key={c.id} className="hover:bg-[#f3f3f7]/50">
                          <td className="py-3 px-3 font-mono font-bold text-black">
                            {c.codigoRadicado}
                          </td>
                          <td className="py-3 px-3 font-medium text-black">{c.clienteNombre}</td>
                          <td className="py-3 px-3 text-[#60646c]">{c.trabajadorNombre}</td>
                          <td className="py-3 px-3 text-right font-bold text-black tabular-nums">
                            ${c.montoBrutoCOP.toLocaleString('es-CO')}
                          </td>
                          <td className="py-3 px-3 text-right text-[#60646c] tabular-nums">
                            ${c.comisionCOP.toLocaleString('es-CO')}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-700 tabular-nums">
                            ${c.montoNetoTrabajadorCOP.toLocaleString('es-CO')}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-[#f3f3f7] border border-[#b9bbc6]/40 text-black">
                              {c.estado.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Worker Verification Queue */}
            {activeTab === 'verificaciones' && (
              <div className="space-y-6">
                <div className="text-xs text-[#60646c]">
                  Expedientes de identidad en <code>ms-perfiles</code> para revisión manual: Cédula de Ciudadanía colombiana + fotografía selfie con prueba de vida.
                </div>

                {pendingVerificationWorkers.length === 0 ? (
                  <div className="p-8 text-center bg-[#f3f3f7] rounded-[10px]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-black">¡Cola al día!</p>
                    <p className="text-[11px] text-[#60646c]">
                      Todos los trabajadores activos han sido verificados conforme al SRS RF-09.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVerificationWorkers.map((w) => (
                      <div
                        key={w.id}
                        className="p-5 rounded-[12px] border border-[#b9bbc6]/50 bg-white space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={w.avatarUrl}
                              alt={w.nombre}
                              className="w-12 h-12 rounded-[10px] object-cover"
                            />
                            <div>
                              <h4 className="text-sm font-bold text-black">{w.nombre}</h4>
                              <div className="text-xs text-[#60646c]">
                                {w.categoriaNombre} · {w.ciudad}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-[6px] border border-amber-200 font-bold">
                            PENDIENTE VALIDACIÓN
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f3f3f7] p-3 rounded-[10px]">
                          <div>
                            <span className="text-[11px] font-bold text-black block mb-1">
                              Cédula de Ciudadanía:
                            </span>
                            <div className="h-28 bg-white border border-[#b9bbc6]/40 rounded-[8px] flex items-center justify-center text-xs text-[#8b8d98]">
                              [Cédula Digital CC 1.020.394.882 - Bogotá D.C.]
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-black block mb-1">
                              Selfie con documento:
                            </span>
                            <div className="h-28 bg-white border border-[#b9bbc6]/40 rounded-[8px] flex items-center justify-center text-xs text-[#8b8d98]">
                              [Biometría facial coincidente 98.4%]
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() =>
                              onRejectWorkerVerification(
                                w.id,
                                'Foto de documento borrosa o ilegible'
                              )
                            }
                            className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 border border-rose-300 rounded-[8px] hover:bg-rose-50 cursor-pointer"
                          >
                            Rechazar con motivo
                          </button>
                          <button
                            onClick={() => onApproveWorkerVerification(w.id)}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[8px] cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Aprobar e Imponer Insignia "Verificado"</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Dispute Mediation Room */}
            {activeTab === 'disputas' && (
              <div className="space-y-6">
                <div className="text-xs text-[#60646c]">
                  Moderación de reportes y resolución vinculante en <code>ms-reputacion</code> mediante <code>ReporteStateMachine</code> (Patrón State + Observer).
                </div>

                {disputes.length === 0 ? (
                  <div className="p-8 text-center bg-[#f3f3f7] rounded-[10px]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-black">No hay disputas abiertas.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {disputes.map((d) => (
                      <div
                        key={d.id}
                        className="p-5 rounded-[12px] border border-rose-200 bg-rose-50/20 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span className="text-xs font-bold text-rose-900">
                              REPORTE / DISPUTA #{d.id}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                            {d.estado.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <div>
                            <strong>Iniciada por:</strong> {d.iniciadaPorNombre} ({d.iniciadaPorRol})
                          </div>
                          <div>
                            <strong>Motivo:</strong> {d.motivo}
                          </div>
                          <p className="text-[#60646c] bg-white p-3 rounded-[8px] border border-[#b9bbc6]/30">
                            "{d.descripcion}"
                          </p>
                        </div>

                        {d.evidencias && d.evidencias.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-black block mb-1">
                              Evidencia fotográfica aportada:
                            </span>
                            <div className="h-32 w-48 rounded-[8px] overflow-hidden border border-[#b9bbc6]">
                              <img
                                src={d.evidencias[0]}
                                alt="Evidencia"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-[#b9bbc6]/30 space-y-3">
                          <label className="block text-xs font-bold text-black">
                            Dictamen motivado del Administrador:
                          </label>
                          <input
                            type="text"
                            value={resolutionMotive}
                            onChange={(e) => setResolutionMotive(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] bg-white text-black"
                          />

                          <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                            <button
                              onClick={() => onResolveDispute(d.id, 'liberar', resolutionMotive)}
                              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-[8px] cursor-pointer"
                            >
                              Liberar 100% al Trabajador
                            </button>
                            <button
                              onClick={() => onResolveDispute(d.id, 'dividir', resolutionMotive)}
                              className="px-3 py-1.5 text-xs font-semibold text-black bg-slate-200 hover:bg-slate-300 rounded-[8px] cursor-pointer"
                            >
                              Dividir 50% / 50%
                            </button>
                            <button
                              onClick={() => onResolveDispute(d.id, 'reembolsar', resolutionMotive)}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-[8px] cursor-pointer"
                            >
                              Reembolsar 100% al Cliente
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Configuration */}
            {activeTab === 'configuracion' && (
              <div className="max-w-md space-y-4">
                <div className="text-xs font-bold text-black">
                  Comisión de Plataforma Parametrizable (S-02 / RF-41)
                </div>
                <p className="text-xs text-[#60646c]">
                  Porcentaje deducido automáticamente al momento de la liquidación del pago retenido en escrow.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-24 text-sm font-bold p-2.5 rounded-[10px] border border-[#b9bbc6] text-black"
                  />
                  <span className="text-sm font-semibold text-black">
                    % sobre valor bruto pactado
                  </span>
                </div>

                <div className="p-3 bg-[#f3f3f7] rounded-[8px] text-xs text-[#60646c]">
                  Ejemplo: para un servicio de $100.000 COP, la plataforma retiene $
                  {((100000 * commissionRate) / 100).toLocaleString('es-CO')} COP y desembolsa $
                  {((100000 * (100 - commissionRate)) / 100).toLocaleString('es-CO')} COP al trabajador.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
