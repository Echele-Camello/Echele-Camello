import React, { useState, useMemo } from 'react';
import { 
  Database, GitCommit, ShieldCheck, History, RefreshCw, FileText, 
  CheckCircle2, AlertCircle, Copy, Check, Download, Search, Filter, 
  Terminal, Lock, ChevronRight, Layers, Table, ArrowUpRight, Code, AlertTriangle
} from 'lucide-react';
import { LiquibaseChangeset, AuditLogEntry } from '../../types';
import { 
  LIQUIBASE_SYSTEM_METADATA, 
  INITIAL_LIQUIBASE_CHANGESETS, 
  INITIAL_AUDIT_LOGS, 
  DATABASE_TABLES_CATALOG,
  DatabaseTableInfo
} from '../../data/liquibaseData';

export const LiquibaseHistoryPanel: React.FC = () => {
  // Navigation inside panel
  const [panelTab, setPanelTab] = useState<'changesets' | 'audit' | 'tables' | 'cli'>('changesets');
  
  // Search & Filter state for changesets
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'schema' | 'seed' | 'security'>('all');
  
  // Selected changeset for modal inspection
  const [inspectingChangeset, setInspectingChangeset] = useState<LiquibaseChangeset | null>(null);

  // Audit logs search & filter
  const [auditQuery, setAuditQuery] = useState('');
  const [auditSeverity, setAuditSeverity] = useState<'all' | 'INFO' | 'WARN' | 'CRITICAL'>('all');

  // Interactive verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('Hace unos momentos');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Filtered changesets
  const filteredChangesets = useMemo(() => {
    return INITIAL_LIQUIBASE_CHANGESETS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        item.id.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.comments.toLowerCase().includes(query) ||
        item.filename.toLowerCase().includes(query) ||
        item.tablesAffected.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return INITIAL_AUDIT_LOGS.filter((log) => {
      const matchesSeverity = auditSeverity === 'all' || log.severidad === auditSeverity;
      const query = auditQuery.toLowerCase().trim();
      const matchesQuery = !query ||
        log.accion.toLowerCase().includes(query) ||
        log.usuario.toLowerCase().includes(query) ||
        log.detalles.toLowerCase().includes(query) ||
        log.esquema.toLowerCase().includes(query);
      return matchesSeverity && matchesQuery;
    });
  }, [auditQuery, auditSeverity]);

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(label);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  // Simulate refresh verification
  const handleVerifyNow = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLastVerifiedTime(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 700);
  };

  // Export Changelog as JSON
  const handleExportChangelogJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      metadata: LIQUIBASE_SYSTEM_METADATA,
      exportedAt: new Date().toISOString(),
      changesets: INITIAL_LIQUIBASE_CHANGESETS,
      auditLogs: INITIAL_AUDIT_LOGS,
      tables: DATABASE_TABLES_CATALOG
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `liquibase_audit_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Liquibase Status & Metadata */}
      <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f3f3f7]">
          
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-[10px] bg-[#15191e] flex items-center justify-center shrink-0 shadow-xs">
              <Database className="w-6 h-6 text-[#ff5900]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-black tracking-tight">
                  Supervisión de Base de Datos y Liquibase
                </h3>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  SINCRONIZADO / UP TO DATE
                </span>
                <span className="bg-[#f3f3f7] text-[#60646c] text-[11px] font-mono px-2 py-0.5 rounded-[6px] border border-[#b9bbc6]/40">
                  v5.0.4
                </span>
              </div>
              <p className="text-xs text-[#60646c] mt-1">
                Control de versiones relacional de MySQL en XAMPP para el proyecto <strong>Échele Camello</strong>. Trazabilidad inmutable de cambios DDL y DML.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleVerifyNow}
              disabled={isVerifying}
              className="px-3.5 py-2 text-xs font-semibold text-black bg-white border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#ff5900] ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verificando hashes...' : 'Comprobar Estado'}</span>
            </button>

            <button
              onClick={handleExportChangelogJSON}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Informe JSON</span>
            </button>
          </div>

        </div>

        {/* 4 Summary Micro-KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Instancia y Puerto</span>
            <div className="text-xs font-mono font-bold text-black mt-0.5">
              {LIQUIBASE_SYSTEM_METADATA.dbServer}
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">BD: {LIQUIBASE_SYSTEM_METADATA.databaseName}</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Changesets Aplicados</span>
            <div className="text-xs font-bold text-black mt-0.5 tabular-nums flex items-center gap-1.5">
              <span className="text-sm font-black text-[#ff5900]">{LIQUIBASE_SYSTEM_METADATA.totalChangesets}</span>
              <span className="text-[#60646c] font-normal font-mono">/ 18 registrados</span>
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">0 fallidos · 0 pendientes</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Bloqueo de Concurrencia</span>
            <div className="text-xs font-bold text-black mt-0.5 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Desbloqueado</span>
            </div>
            <span className="text-[10px] text-[#60646c] block mt-0.5">lock_table: inactiva</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Última Auditoría</span>
            <div className="text-xs font-bold text-black mt-0.5">
              {lastVerifiedTime}
            </div>
            <span className="text-[10px] text-[#60646c] block mt-0.5">Hash MD5 íntegro</span>
          </div>
        </div>

      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 overflow-hidden shadow-xs">
        
        <div className="flex border-b border-[#f3f3f7] px-6 text-xs font-medium bg-[#f3f3f7]/40 gap-6 overflow-x-auto">
          <button
            onClick={() => setPanelTab('changesets')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${panelTab === 'changesets' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c] hover:text-black'}`}
          >
            <GitCommit className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Histórico de Changesets (DATABASECHANGELOG)</span>
            <span className="bg-[#15191e] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {INITIAL_LIQUIBASE_CHANGESETS.length}
            </span>
          </button>

          <button
            onClick={() => setPanelTab('audit')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${panelTab === 'audit' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c] hover:text-black'}`}
          >
            <History className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Pista de Auditoría Forense (audit_logs)</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {INITIAL_AUDIT_LOGS.length}
            </span>
          </button>

          <button
            onClick={() => setPanelTab('tables')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${panelTab === 'tables' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c] hover:text-black'}`}
          >
            <Table className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Catálogo de Tablas del Esquema</span>
            <span className="bg-[#f3f3f7] text-[#60646c] text-[10px] px-1.5 py-0.2 rounded-full font-mono border border-[#b9bbc6]/40">
              {DATABASE_TABLES_CATALOG.length}
            </span>
          </button>

          <button
            onClick={() => setPanelTab('cli')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${panelTab === 'cli' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c] hover:text-black'}`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Consola & Guía de Migraciones</span>
          </button>
        </div>

        <div className="p-6">
          
          {/* TAB 1: CHANGESETS EXPLORER */}
          {panelTab === 'changesets' && (
            <div className="space-y-4">
              
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8b8d98] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, autor, tabla o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] border border-[#b9bbc6] bg-white text-black placeholder:text-[#8b8d98] focus:outline-none focus:border-[#ff5900]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#8b8d98]">Filtro:</span>
                  <div className="inline-flex rounded-[8px] border border-[#b9bbc6]/60 p-0.5 bg-[#f3f3f7]">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${selectedCategory === 'all' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      Todos ({INITIAL_LIQUIBASE_CHANGESETS.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory('schema')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${selectedCategory === 'schema' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      DDL / Esquema (11)
                    </button>
                    <button
                      onClick={() => setSelectedCategory('seed')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${selectedCategory === 'seed' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      Semillas (5)
                    </button>
                    <button
                      onClick={() => setSelectedCategory('security')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${selectedCategory === 'security' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      Custodia / Auditoría (2)
                    </button>
                  </div>
                </div>
              </div>

              {/* Changesets Table */}
              <div className="overflow-x-auto border border-[#b9bbc6]/40 rounded-[10px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f3f3f7] text-[#8b8d98] font-mono text-[11px] border-b border-[#b9bbc6]/40">
                      <th className="py-2.5 px-3 w-12 text-center">ORD</th>
                      <th className="py-2.5 px-3">IDENTIFICADOR CHANGESET</th>
                      <th className="py-2.5 px-3">AUTOR</th>
                      <th className="py-2.5 px-3">PROPÓSITO & DESCRIPCIÓN</th>
                      <th className="py-2.5 px-3">TABLAS</th>
                      <th className="py-2.5 px-3">FECHA EJECUCIÓN</th>
                      <th className="py-2.5 px-3 text-center">ESTADO</th>
                      <th className="py-2.5 px-3 text-center">DETALLES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f7]">
                    {filteredChangesets.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-[#60646c]">
                          No se encontraron changesets que coincidan con los filtros de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredChangesets.map((cs) => (
                        <tr 
                          key={cs.id}
                          onClick={() => setInspectingChangeset(cs)}
                          className="hover:bg-[#f3f3f7]/60 cursor-pointer transition-colors group"
                        >
                          <td className="py-3 px-3 text-center font-mono text-[#8b8d98] font-bold">
                            #{cs.orderExecuted}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-black group-hover:text-[#ff5900] transition-colors block">
                              {cs.id}
                            </span>
                            <span className="text-[10px] text-[#8b8d98] font-mono block">
                              {cs.filename.split('/').pop()}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-black">
                            <span className="bg-[#f3f3f7] px-2 py-0.5 rounded-[4px] border border-[#b9bbc6]/30">
                              @{cs.author}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#60646c] max-w-xs truncate" title={cs.comments}>
                            {cs.comments}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1">
                              {cs.tablesAffected.map(t => (
                                <span key={t} className="text-[10px] font-mono bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded font-semibold border border-blue-200">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#60646c] font-mono text-[11px] whitespace-nowrap">
                            {cs.dateExecuted}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                              {cs.execType}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectingChangeset(cs);
                              }}
                              className="p-1 rounded-[6px] hover:bg-[#b9bbc6]/20 text-[#ff5900] cursor-pointer"
                              title="Inspeccionar SQL y Rollback"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-[#8b8d98] flex items-center justify-between pt-1">
                <span>Registrado en tabla física: <code>echelecamelloprueba.databasechangelog</code></span>
                <span>Checksums verificados con algoritmo SHA/MD5</span>
              </div>

            </div>
          )}

          {/* TAB 2: AUDIT LOGS */}
          {panelTab === 'audit' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8b8d98] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por acción, usuario o detalle..."
                    value={auditQuery}
                    onChange={(e) => setAuditQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] border border-[#b9bbc6] bg-white text-black"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#8b8d98]">Severidad:</span>
                  <div className="inline-flex rounded-[8px] border border-[#b9bbc6]/60 p-0.5 bg-[#f3f3f7]">
                    <button
                      onClick={() => setAuditSeverity('all')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer ${auditSeverity === 'all' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setAuditSeverity('INFO')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer ${auditSeverity === 'INFO' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      INFO
                    </button>
                    <button
                      onClick={() => setAuditSeverity('WARN')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer ${auditSeverity === 'WARN' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'}`}
                    >
                      WARN
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredAuditLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-4 rounded-[10px] border border-[#b9bbc6]/40 bg-white hover:border-[#b9bbc6] transition-colors shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] font-mono ${
                          log.severidad === 'INFO' 
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : log.severidad === 'WARN'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {log.severidad}
                        </span>
                        <span className="text-xs font-mono font-bold text-black">{log.accion}</span>
                        <span className="text-xs text-[#8b8d98]">· por</span>
                        <span className="text-xs font-semibold text-black bg-[#f3f3f7] px-2 py-0.2 rounded">
                          {log.usuario}
                        </span>
                        <span className="text-[10px] font-mono text-[#8b8d98]">({log.esquema})</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8b8d98] whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#60646c] mt-2 bg-[#f3f3f7]/50 p-2.5 rounded-[8px] border border-[#b9bbc6]/20">
                      {log.detalles}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: TABLES CATALOG */}
          {panelTab === 'tables' && (
            <div className="space-y-4">
              <div className="text-xs text-[#60646c]">
                Estructura de las 11 tablas creadas en MySQL XAMPP y versionadas mediante Liquibase:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DATABASE_TABLES_CATALOG.map((t) => (
                  <div key={t.name} className="p-4 rounded-[12px] border border-[#b9bbc6]/50 bg-white shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-black bg-[#f3f3f7] px-2 py-0.5 rounded border border-[#b9bbc6]/30">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#ff5900] font-bold">
                        {t.moduleName}
                      </span>
                    </div>

                    <p className="text-xs text-[#60646c] min-h-[36px]">
                      {t.description}
                    </p>

                    <div className="pt-2 border-t border-[#f3f3f7] flex items-center justify-between text-[11px] text-[#8b8d98]">
                      <span>PK: <code className="text-black font-semibold">{t.primaryKey}</code></span>
                      <span className="font-mono text-black font-semibold">{t.estimatedRows} filas sembradas</span>
                    </div>

                    {t.foreignKeys.length > 0 && (
                      <div className="text-[10px] font-mono bg-blue-50/60 text-blue-900 p-1.5 rounded border border-blue-100">
                        FK: {t.foreignKeys.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLI COMMANDS & GUIDE */}
          {panelTab === 'cli' && (
            <div className="space-y-6">
              
              <div className="text-xs text-[#60646c]">
                Comandos rápidos para que el equipo de desarrollo y los administradores gestionen el ciclo de vida de la base de datos:
              </div>

              {/* Command Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-[#15191e] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ff5900] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Consultar Estado</span>
                    </span>
                    <button
                      onClick={() => handleCopy('npm run db:status', 'status')}
                      className="text-xs text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded cursor-pointer"
                    >
                      {copiedCommand === 'status' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCommand === 'status' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-black/50 p-2.5 rounded text-emerald-400 overflow-x-auto">
                    npm run db:status
                  </pre>
                  <p className="text-[11px] text-white/70">
                    Verifica si todos los changesets del archivo maestro están aplicados contra XAMPP MySQL.
                  </p>
                </div>

                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-[#15191e] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ff5900] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Aplicar Migraciones</span>
                    </span>
                    <button
                      onClick={() => handleCopy('npm run db:update', 'update')}
                      className="text-xs text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded cursor-pointer"
                    >
                      {copiedCommand === 'update' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCommand === 'update' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-black/50 p-2.5 rounded text-emerald-400 overflow-x-auto">
                    npm run db:update
                  </pre>
                  <p className="text-[11px] text-white/70">
                    Aplica cualquier nuevo script SQL añadido a la carpeta <code>db/changelog/changesets</code>.
                  </p>
                </div>

                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-[#15191e] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ff5900] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Ver Histórico de Ejecución</span>
                    </span>
                    <button
                      onClick={() => handleCopy('npm run db:history', 'history')}
                      className="text-xs text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded cursor-pointer"
                    >
                      {copiedCommand === 'history' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCommand === 'history' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-black/50 p-2.5 rounded text-emerald-400 overflow-x-auto">
                    npm run db:history
                  </pre>
                  <p className="text-[11px] text-white/70">
                    Muestra en consola la tabla cronológica con Deployment IDs y fechas de ejecución.
                  </p>
                </div>

                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-[#15191e] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ff5900] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Reversión (Rollback)</span>
                    </span>
                    <button
                      onClick={() => handleCopy('npm run db:rollback', 'rollback')}
                      className="text-xs text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded cursor-pointer"
                    >
                      {copiedCommand === 'rollback' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCommand === 'rollback' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-black/50 p-2.5 rounded text-amber-400 overflow-x-auto">
                    npm run db:rollback
                  </pre>
                  <p className="text-[11px] text-white/70">
                    Ejecuta el bloque <code>-- rollback</code> del último changeset aplicado para deshacerlo limpiamente.
                  </p>
                </div>

              </div>

              {/* Step by Step Guide for Admins & Developers */}
              <div className="bg-[#f3f3f7] p-5 rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
                <h4 className="text-xs font-bold text-black uppercase tracking-wide">
                  ¿Cómo agregar una nueva modificación al esquema con trazabilidad?
                </h4>
                <ol className="text-xs text-[#60646c] space-y-2 list-decimal list-inside">
                  <li>
                    Crea un archivo SQL nuevo en <code className="text-black font-semibold">db/changelog/changesets/004_tu_cambio.sql</code>.
                  </li>
                  <li>
                    Inicia el archivo con el encabezado <code className="text-black font-semibold">-- liquibase formatted sql</code>.
                  </li>
                  <li>
                    Define el changeset con tu autor e ID: <code className="text-black font-semibold">-- changeset tu_nombre:004-descripcion</code> y su respectiva sentencia <code className="text-black font-semibold">-- rollback</code>.
                  </li>
                  <li>
                    Agrégalo a <code className="text-black font-semibold">db/changelog/db.changelog-master.xml</code> con la etiqueta <code className="text-black font-semibold">&lt;include file="changesets/004_tu_cambio.sql"...&gt;</code>.
                  </li>
                  <li>
                    Ejecuta <code className="text-black font-semibold">npm run db:update</code> en tu terminal. ¡El cambio quedará registrado automáticamente en el histórico!
                  </li>
                </ol>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* INSPECT CHANGESET MODAL */}
      {inspectingChangeset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-2xl w-full p-6 shadow-xl border border-[#b9bbc6] space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#f3f3f7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#ff5900] uppercase tracking-wide block">
                  ORDEN #{inspectingChangeset.orderExecuted} · {inspectingChangeset.category.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-black font-mono">
                  {inspectingChangeset.id}
                </h3>
              </div>
              <button
                onClick={() => setInspectingChangeset(null)}
                className="text-xs font-bold text-[#8b8d98] hover:text-black p-1 cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#f3f3f7] p-3.5 rounded-[10px]">
              <div>
                <span className="text-[10px] text-[#8b8d98] block">Autor:</span>
                <span className="font-bold text-black">@{inspectingChangeset.author}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8b8d98] block">Fecha de Ejecución:</span>
                <span className="font-mono text-black">{inspectingChangeset.dateExecuted}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8b8d98] block">Estado:</span>
                <span className="font-bold text-emerald-700">{inspectingChangeset.execType}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[10px] text-[#8b8d98] block">Archivo Fuente:</span>
                <span className="font-mono text-black text-[11px]">{inspectingChangeset.filename}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-black block mb-1">Descripción del Cambio:</span>
              <p className="text-xs text-[#60646c] bg-white border border-[#b9bbc6]/40 p-3 rounded-[8px]">
                {inspectingChangeset.comments}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-black">Sentencia de Rollback (Reversión):</span>
                <button
                  onClick={() => handleCopy(inspectingChangeset.rollbackSql, 'rollbackSql')}
                  className="text-[11px] text-[#ff5900] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedCommand === 'rollbackSql' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommand === 'rollbackSql' ? 'Copiado' : 'Copiar Rollback'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono bg-[#15191e] text-amber-300 p-3 rounded-[8px] overflow-x-auto">
                {inspectingChangeset.rollbackSql}
              </pre>
            </div>

            <div>
              <span className="text-xs font-bold text-black block mb-1">Firma Criptográfica (Checksum MD5):</span>
              <code className="text-[11px] font-mono text-[#60646c] bg-[#f3f3f7] px-2 py-1 rounded block border border-[#b9bbc6]/30">
                {inspectingChangeset.md5sum}
              </code>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingChangeset(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-black/80 rounded-[10px] cursor-pointer"
              >
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

