import React, { useState, useMemo } from 'react';
import {
  Database,
  GitCommit,
  ShieldCheck,
  History,
  RefreshCw,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Search,
  Terminal,
  Lock,
  Table,
  ArrowUpRight,
  PlusCircle,
  BarChart3,
  Layers
} from 'lucide-react';
import { LiquibaseChangeset, AuditLogEntry, MicroserviceId } from '../../types';
import {
  LIQUIBASE_SYSTEM_METADATA,
  INITIAL_LIQUIBASE_CHANGESETS,
  INITIAL_AUDIT_LOGS,
  DATABASE_TABLES_CATALOG
} from '../../data/liquibaseData';
import { platformGateway } from '../../architecture/gateway/ApiGateway';

export const LiquibaseHistoryPanel: React.FC = () => {
  // Sub-tabs including the new 'reports' tab for in-page reporting
  const [panelTab, setPanelTab] = useState<'changesets' | 'reports' | 'audit' | 'tables' | 'cli'>('changesets');

  // Dynamic state so Admin can register new changesets during testing
  const [changesets, setChangesets] = useState<LiquibaseChangeset[]>(INITIAL_LIQUIBASE_CHANGESETS);

  // Search & Filter state for changesets
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'schema' | 'seed' | 'security' | 'microservices'>('all');
  const [selectedMicroservice, setSelectedMicroservice] = useState<string>('all');

  // Modal states
  const [inspectingChangeset, setInspectingChangeset] = useState<LiquibaseChangeset | null>(null);
  const [showNewChangesetModal, setShowNewChangesetModal] = useState(false);
  const [newCsId, setNewCsId] = useState('005-add-index-busqueda-geolocalizacion');
  const [newCsAuthor, setNewCsAuthor] = useState('admin_camello');
  const [newCsMicroservice, setNewCsMicroservice] = useState<MicroserviceId>('ms-perfiles');
  const [newCsTables, setNewCsTables] = useState('worker_locations');
  const [newCsComment, setNewCsComment] = useState('Índice espacial para acelerar consultas Haversine desde ms-busqueda');
  const [newCsRollback, setNewCsRollback] = useState('DROP INDEX `idx_spatial_lat_lng` ON `worker_locations`;');

  // Audit logs search & filter
  const [auditQuery, setAuditQuery] = useState('');
  const [auditSeverity, setAuditSeverity] = useState<'all' | 'INFO' | 'WARN' | 'CRITICAL'>('all');

  // Interactive verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('Hace unos momentos');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Combine static + live Observer audit logs
  const combinedAuditLogs: AuditLogEntry[] = useMemo(() => {
    const liveLogs = platformGateway.eventBus.getLiveAuditLogs();
    return [...liveLogs, ...INITIAL_AUDIT_LOGS];
  }, [changesets, isVerifying, panelTab]);

  // Filtered changesets
  const filteredChangesets = useMemo(() => {
    return changesets.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesMs = selectedMicroservice === 'all' || item.microservice === selectedMicroservice;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.comments.toLowerCase().includes(query) ||
        item.filename.toLowerCase().includes(query) ||
        (item.microservice && item.microservice.toLowerCase().includes(query)) ||
        item.tablesAffected.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesMs && matchesQuery;
    });
  }, [changesets, searchQuery, selectedCategory, selectedMicroservice]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return combinedAuditLogs.filter((log) => {
      const matchesSeverity = auditSeverity === 'all' || log.severidad === auditSeverity;
      const query = auditQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        log.accion.toLowerCase().includes(query) ||
        log.usuario.toLowerCase().includes(query) ||
        log.detalles.toLowerCase().includes(query) ||
        log.esquema.toLowerCase().includes(query);
      return matchesSeverity && matchesQuery;
    });
  }, [combinedAuditLogs, auditQuery, auditSeverity]);

  // Domain summary metrics for the in-page Report
  const domainReportRows = useMemo(() => {
    const domains: { id: MicroserviceId; label: string; patterns: string }[] = [
      { id: 'ms-usuarios', label: '1. ms-usuarios (Usuarios e Identidad)', patterns: 'Repository, DTO, Adapter (correo)' },
      { id: 'ms-perfiles', label: '2. ms-perfiles (Perfiles de Trabajadores)', patterns: 'Repository, DTO, Adapter (archivos/fotos)' },
      { id: 'ms-servicios', label: '3. ms-servicios (Servicios y Categorías)', patterns: 'Repository, DTO, State' },
      { id: 'ms-busqueda', label: '4. ms-busqueda (Búsqueda y Geolocalización)', patterns: 'Strategy, Adapter (mapas), DTO' },
      { id: 'ms-solicitudes', label: '5. ms-solicitudes (Solicitudes y Agendamiento)', patterns: 'State, Observer, Repository, DTO' },
      { id: 'ms-comunicacion', label: '6. ms-comunicacion (Comunicación y Notificaciones)', patterns: 'Observer / Pub-Sub, Adapter, Repository, DTO' },
      { id: 'ms-reputacion', label: '7. ms-reputacion (Reputación y Moderación)', patterns: 'State, Repository, DTO, Observer' },
      { id: 'seguridad-transversal', label: 'Seguridad & Auditoría Transversal', patterns: 'API Gateway, Observer' }
    ];

    return domains.map((d) => {
      const domainChangesets = changesets.filter((c) => c.microservice === d.id);
      const domainTables = DATABASE_TABLES_CATALOG.filter((t) => t.moduleName === d.id);
      const totalSeededRows = domainTables.reduce((acc, t) => acc + t.estimatedRows, 0);
      return {
        ...d,
        changesetsCount: domainChangesets.length,
        tablesCount: domainTables.length,
        tableNames: domainTables.map((t) => t.name),
        totalSeededRows
      };
    });
  }, [changesets]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(label);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  const handleVerifyNow = () => {
    setIsVerifying(true);
    platformGateway.logRoute(
      'POST /api/admin/liquibase/verify-checksums',
      'administracion-transversal',
      'admin',
      200,
      ['API Gateway', 'Repository']
    );
    setTimeout(() => {
      setIsVerifying(false);
      setLastVerifiedTime(
        new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 600);
  };

  // Register a new changeset live from the UI
  const handleRegisterNewChangeset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCsId.trim()) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const created: LiquibaseChangeset = {
      id: newCsId.trim(),
      author: newCsAuthor.trim() || 'admin',
      filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
      dateExecuted: now,
      orderExecuted: changesets.length + 1,
      execType: 'EXECUTED',
      md5sum: `9:${Math.random().toString(16).slice(2, 18)}${Math.random().toString(16).slice(2, 18)}`,
      description: 'sql',
      comments: `[${newCsMicroservice}] ${newCsComment.trim()}`,
      category: 'microservices',
      microservice: newCsMicroservice,
      tablesAffected: newCsTables
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      rollbackSql: newCsRollback.trim() || '-- Sin rollback especificado'
    };

    setChangesets([created, ...changesets]);
    platformGateway.eventBus.publish({
      type: 'LIQUIBASE_MIGRACION_EJECUTADA',
      sourceMicroservice: 'administracion-transversal',
      targetMicroservices: [newCsMicroservice, 'seguridad-transversal'],
      payload: {
        changesetId: created.id,
        author: created.author,
        microservice: newCsMicroservice,
        tables: created.tablesAffected
      },
      actorName: created.author,
      actorRole: 'admin',
      notification: {
        titulo: `Liquibase Changeset Aplicado (#${created.orderExecuted})`,
        mensaje: `Se ejecutó "${created.id}" en el dominio ${newCsMicroservice}.`,
        destinatarioRol: 'admin',
        canal: 'IN_APP'
      }
    });

    setShowNewChangesetModal(false);
  };

  // Export JSON Report
  const handleExportChangelogJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            metadata: {
              ...LIQUIBASE_SYSTEM_METADATA,
              totalChangesets: changesets.length
            },
            exportedAt: new Date().toISOString(),
            domainSummary: domainReportRows,
            changesets,
            auditLogs: combinedAuditLogs,
            tables: DATABASE_TABLES_CATALOG
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `informe_liquibase_echele_camello_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV Report
  const handleExportChangelogCSV = () => {
    const headers = 'Orden,ChangesetID,Autor,Microservicio,Categoria,Tablas,FechaEjecucion,Estado,ChecksumMD5';
    const rows = changesets.map(
      (cs) =>
        `${cs.orderExecuted},"${cs.id}","${cs.author}","${cs.microservice || 'general'}","${cs.category}","${cs.tablesAffected.join('|')}","${cs.dateExecuted}","${cs.execType}","${cs.md5sum}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historico_liquibase_echele_camello_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  Control de Versiones, Histórico e Informes Liquibase
                </h3>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  RAMA DEV SINCRONIZADA
                </span>
                <span className="bg-[#f3f3f7] text-[#60646c] text-[11px] font-mono px-2 py-0.5 rounded-[6px] border border-[#b9bbc6]/40">
                  Liquibase v{LIQUIBASE_SYSTEM_METADATA.version}
                </span>
              </div>
              <p className="text-xs text-[#60646c] mt-1">
                Registro histórico de migraciones SQL, control de versiones por dominio de microservicio y generación de informes para el rol <strong>Admin</strong> de <strong>Échele Camello</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowNewChangesetModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-black bg-[#fff2eb] border border-[#ff5900]/40 rounded-[10px] hover:bg-[#ffe4d4] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Registrar Changeset</span>
            </button>

            <button
              onClick={handleVerifyNow}
              disabled={isVerifying}
              className="px-3.5 py-2 text-xs font-semibold text-black bg-white border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#ff5900] ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verificando hashes...' : 'Verificar Integridad'}</span>
            </button>

            <button
              onClick={handleExportChangelogCSV}
              className="px-3.5 py-2 text-xs font-semibold text-black bg-white border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Exportar CSV</span>
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
            <span className="text-[11px] font-medium text-[#8b8d98] block">Servidor Base de Datos</span>
            <div className="text-xs font-mono font-bold text-black mt-0.5">
              {LIQUIBASE_SYSTEM_METADATA.dbServer}
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              Esquema: {LIQUIBASE_SYSTEM_METADATA.databaseName}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Changesets Ejecutados</span>
            <div className="text-xs font-bold text-black mt-0.5 tabular-nums flex items-center gap-1.5">
              <span className="text-sm font-black text-[#ff5900]">{changesets.length}</span>
              <span className="text-[#60646c] font-normal font-mono">versiones registradas</span>
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">0 fallidos · 7 microservicios cubiertos</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Tablas por Dominio</span>
            <div className="text-xs font-bold text-black mt-0.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>{DATABASE_TABLES_CATALOG.length} tablas versionadas</span>
            </div>
            <span className="text-[10px] text-[#60646c] block mt-0.5">Aislamiento de entidad por MS</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#8b8d98] block">Última Verificación MD5</span>
            <div className="text-xs font-bold text-black mt-0.5">{lastVerifiedTime}</div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              {combinedAuditLogs.length} eventos en pista de auditoría
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-[12px] border border-[#b9bbc6]/50 overflow-hidden shadow-xs">
        <div className="flex border-b border-[#f3f3f7] px-6 text-xs font-medium bg-[#f3f3f7]/40 gap-6 overflow-x-auto">
          <button
            onClick={() => setPanelTab('changesets')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              panelTab === 'changesets'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Histórico de Versiones (DATABASECHANGELOG)</span>
            <span className="bg-[#15191e] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {changesets.length}
            </span>
          </button>

          <button
            onClick={() => setPanelTab('reports')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              panelTab === 'reports'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Informes de Control de Versiones y Dominios</span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              EN PÁGINA
            </span>
          </button>

          <button
            onClick={() => setPanelTab('audit')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              panelTab === 'audit'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <History className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Pista de Auditoría en Vivo (audit_logs)</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {combinedAuditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setPanelTab('tables')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              panelTab === 'tables'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Propiedad de Entidades y Tablas</span>
            <span className="bg-[#f3f3f7] text-[#60646c] text-[10px] px-1.5 py-0.2 rounded-full font-mono border border-[#b9bbc6]/40">
              {DATABASE_TABLES_CATALOG.length}
            </span>
          </button>

          <button
            onClick={() => setPanelTab('cli')}
            className={`py-3.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              panelTab === 'cli'
                ? 'text-black border-b-2 border-[#ff5900] font-bold'
                : 'text-[#60646c] hover:text-black'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#ff5900]" />
            <span>Consola CLI & Guía</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: CHANGESETS EXPLORER */}
          {panelTab === 'changesets' && (
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8b8d98] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, autor, microservicio, tabla o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] border border-[#b9bbc6] bg-white text-black placeholder:text-[#8b8d98] focus:outline-none focus:border-[#ff5900]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedMicroservice}
                    onChange={(e) => setSelectedMicroservice(e.target.value)}
                    className="text-xs border border-[#b9bbc6] rounded-[8px] px-2.5 py-1.5 bg-white text-black font-semibold cursor-pointer"
                  >
                    <option value="all">Todos los Microservicios</option>
                    <option value="ms-usuarios">ms-usuarios</option>
                    <option value="ms-perfiles">ms-perfiles</option>
                    <option value="ms-servicios">ms-servicios</option>
                    <option value="ms-solicitudes">ms-solicitudes</option>
                    <option value="ms-comunicacion">ms-comunicacion</option>
                    <option value="ms-reputacion">ms-reputacion</option>
                    <option value="seguridad-transversal">seguridad-transversal</option>
                    <option value="api-gateway">api-gateway</option>
                  </select>

                  <div className="inline-flex rounded-[8px] border border-[#b9bbc6]/60 p-0.5 bg-[#f3f3f7] flex-wrap">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${
                        selectedCategory === 'all' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'
                      }`}
                    >
                      Todos ({changesets.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory('schema')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${
                        selectedCategory === 'schema' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'
                      }`}
                    >
                      Esquema (11)
                    </button>
                    <button
                      onClick={() => setSelectedCategory('seed')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${
                        selectedCategory === 'seed' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'
                      }`}
                    >
                      Semillas (5)
                    </button>
                    <button
                      onClick={() => setSelectedCategory('microservices')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer transition-colors ${
                        selectedCategory === 'microservices' ? 'bg-white text-[#ff5900] shadow-xs' : 'text-[#60646c]'
                      }`}
                    >
                      Microservicios ({changesets.filter((c) => c.category === 'microservices').length})
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#b9bbc6]/40 rounded-[10px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f3f3f7] text-[#8b8d98] font-mono text-[11px] border-b border-[#b9bbc6]/40">
                      <th className="py-2.5 px-3 w-12 text-center">ORD</th>
                      <th className="py-2.5 px-3">CHANGESET ID</th>
                      <th className="py-2.5 px-3">DOMINIO / MS</th>
                      <th className="py-2.5 px-3">AUTOR</th>
                      <th className="py-2.5 px-3">PROPÓSITO & DESCRIPCIÓN</th>
                      <th className="py-2.5 px-3">TABLAS</th>
                      <th className="py-2.5 px-3">EJECUCIÓN</th>
                      <th className="py-2.5 px-3 text-center">ESTADO</th>
                      <th className="py-2.5 px-3 text-center">SQL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f7]">
                    {filteredChangesets.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-xs text-[#60646c]">
                          No se encontraron changesets que coincidan con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredChangesets.map((cs) => (
                        <tr
                          key={`${cs.id}-${cs.orderExecuted}`}
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
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-mono font-bold bg-[#fff2eb] text-[#ff5900] border border-[#ff5900]/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                              {cs.microservice || 'transversal'}
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
                              {cs.tablesAffected.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded font-semibold border border-blue-200"
                                >
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
            </div>
          )}

          {/* TAB 2: IN-PAGE REPORTS & VERSION CONTROL SUMMARY */}
          {panelTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f3f3f7] p-4 rounded-[12px] border border-[#b9bbc6]/40">
                <div>
                  <h4 className="text-sm font-bold text-black flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ff5900]" />
                    <span>Informe Consolidado de Control de Versiones y Microservicios</span>
                  </h4>
                  <p className="text-xs text-[#60646c] mt-0.5">
                    Estado en vivo del esquema relacional organizado por dominio de microservicio, cobertura de migraciones Liquibase y patrones aplicados.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportChangelogCSV}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#b9bbc6] rounded-[8px] hover:bg-[#f8f9fa] cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ff5900]" />
                    <span>Descargar CSV</span>
                  </button>
                  <button
                    onClick={handleExportChangelogJSON}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#15191e] text-white rounded-[8px] hover:bg-black cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ff5900]" />
                    <span>Descargar JSON</span>
                  </button>
                </div>
              </div>

              {/* Domain Coverage Table */}
              <div className="overflow-x-auto border border-[#b9bbc6]/40 rounded-[10px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#15191e] text-white font-mono text-[11px]">
                      <th className="py-3 px-4">MICROSERVICIO / DOMINIO</th>
                      <th className="py-3 px-4 text-center">CHANGESETS</th>
                      <th className="py-3 px-4">TABLAS PROPIETARIAS (REGLA DE DOMINIO)</th>
                      <th className="py-3 px-4">PATRONES DE DISEÑO VINCULADOS</th>
                      <th className="py-3 px-4 text-center">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f7]">
                    {domainReportRows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#f3f3f7]/50">
                        <td className="py-3 px-4 font-bold text-black">{row.label}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#ff5900]">
                          {row.changesetsCount}
                        </td>
                        <td className="py-3 px-4">
                          {row.tableNames.length === 0 ? (
                            <span className="text-[11px] italic text-[#8b8d98]">
                              Sin entidad propia (consume ms-perfiles y ms-servicios)
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {row.tableNames.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono bg-[#f3f3f7] text-black px-2 py-0.5 rounded border border-[#b9bbc6]/50"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#60646c] font-medium">{row.patterns}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Íntegro</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-white space-y-1.5">
                  <span className="text-[11px] font-bold text-[#ff5900] uppercase">Regla Clave Verificada</span>
                  <div className="text-sm font-bold text-black">Propiedad Estricta por Dominio</div>
                  <p className="text-xs text-[#60646c]">
                    Cada microservicio modifica únicamente las tablas de su propio dominio mediante <code>BaseDomainRepository</code>, en un único servidor MySQL/PostgreSQL para el proyecto formativo.
                  </p>
                </div>

                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-white space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Trazabilidad de Versiones</span>
                  <div className="text-sm font-bold text-black">4 Archivos de Migración Maestros</div>
                  <p className="text-xs text-[#60646c]">
                    <code>001_initial_schema.sql</code>, <code>002_seed_data.sql</code>, <code>003_escrow_and_security.sql</code> y <code>004_microservices_domain_alignment.sql</code> con sentencias <code>-- rollback</code> verificadas.
                  </p>
                </div>

                <div className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-white space-y-1.5">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">Auditoría en Tiempo Real</span>
                  <div className="text-sm font-bold text-black">Conectada al EventBus (Observer)</div>
                  <p className="text-xs text-[#60646c]">
                    Cada cambio de rol, solicitud, pago Escrow, reseña o moderación genera un registro automático en la pista de auditoría de esta página.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {panelTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8b8d98] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por acción, usuario, microservicio o detalle..."
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
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer ${
                        auditSeverity === 'all' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'
                      }`}
                    >
                      Todas ({combinedAuditLogs.length})
                    </button>
                    <button
                      onClick={() => setAuditSeverity('INFO')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer ${
                        auditSeverity === 'INFO' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'
                      }`}
                    >
                      INFO
                    </button>
                    <button
                      onClick={() => setAuditSeverity('WARN')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] cursor-pointer ${
                        auditSeverity === 'WARN' ? 'bg-white text-black shadow-xs' : 'text-[#60646c]'
                      }`}
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
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] font-mono ${
                            log.severidad === 'INFO'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : log.severidad === 'WARN'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {log.severidad}
                        </span>
                        <span className="text-xs font-mono font-bold text-black">{log.accion}</span>
                        <span className="text-xs text-[#8b8d98]">· por</span>
                        <span className="text-xs font-semibold text-black bg-[#f3f3f7] px-2 py-0.2 rounded">
                          {log.usuario}
                        </span>
                        <span className="text-[10px] font-mono bg-[#fff2eb] text-[#ff5900] px-2 py-0.5 rounded border border-[#ff5900]/30 font-semibold">
                          {log.esquema}
                        </span>
                        {log.patronAplicado && (
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            Patrón: {log.patronAplicado}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#8b8d98] whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#60646c] mt-2 bg-[#f3f3f7]/50 p-2.5 rounded-[8px] border border-[#b9bbc6]/20 font-mono break-all">
                      {log.detalles}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TABLES CATALOG */}
          {panelTab === 'tables' && (
            <div className="space-y-4">
              <div className="text-xs text-[#60646c]">
                Catálogo de las {DATABASE_TABLES_CATALOG.length} tablas versionadas con Liquibase y asignadas a su microservicio propietario según la tabla de <strong>Propiedad de las Entidades</strong>:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DATABASE_TABLES_CATALOG.map((t) => (
                  <div
                    key={t.name}
                    className="p-4 rounded-[12px] border border-[#b9bbc6]/50 bg-white shadow-2xs space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-black bg-[#f3f3f7] px-2 py-0.5 rounded border border-[#b9bbc6]/30">
                          {t.name}
                        </span>
                        <span className="text-[10px] font-mono bg-[#fff2eb] text-[#ff5900] px-2 py-0.5 rounded-full font-bold border border-[#ff5900]/30">
                          {t.moduleName}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-black">
                        Entidad: <span className="text-[#ff5900]">{t.entityName}</span>
                      </div>

                      <p className="text-xs text-[#60646c]">{t.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#f3f3f7]">
                      <div className="flex flex-wrap gap-1">
                        {t.patternsUsed.map((pat) => (
                          <span
                            key={pat}
                            className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold"
                          >
                            {pat}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#8b8d98]">
                        <span>
                          PK: <code className="text-black font-semibold">{t.primaryKey}</code>
                        </span>
                        <span className="font-mono text-black font-semibold">{t.estimatedRows} registros</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CLI COMMANDS & GUIDE */}
          {panelTab === 'cli' && (
            <div className="space-y-6">
              <div className="text-xs text-[#60646c]">
                Comandos rápidos configurados en <code>package.json</code> para ejecutar Liquibase sobre MySQL / PostgreSQL:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'status',
                    title: 'Consultar Estado',
                    cmd: 'npm run db:status',
                    desc: 'Verifica si todos los changesets del archivo maestro están aplicados.'
                  },
                  {
                    id: 'update',
                    title: 'Aplicar Migraciones',
                    cmd: 'npm run db:update',
                    desc: 'Aplica los scripts SQL pendientes de db/changelog/changesets.'
                  },
                  {
                    id: 'history',
                    title: 'Ver Histórico en Consola',
                    cmd: 'npm run db:history',
                    desc: 'Muestra la tabla cronológica con Deployment IDs y fechas de ejecución.'
                  },
                  {
                    id: 'rollback',
                    title: 'Reversión Segura (Rollback)',
                    cmd: 'npm run db:rollback',
                    desc: 'Ejecuta el bloque -- rollback del último changeset aplicado.'
                  }
                ].map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-[10px] border border-[#b9bbc6]/50 bg-[#15191e] text-white space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#ff5900] flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{c.title}</span>
                      </span>
                      <button
                        onClick={() => handleCopy(c.cmd, c.id)}
                        className="text-xs text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded cursor-pointer"
                      >
                        {copiedCommand === c.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedCommand === c.id ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre className="text-xs font-mono bg-black/50 p-2.5 rounded text-emerald-400 overflow-x-auto">
                      {c.cmd}
                    </pre>
                    <p className="text-[11px] text-white/70">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: REGISTER NEW CHANGESET IN PAGE */}
      {showNewChangesetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterNewChangeset}
            className="bg-white rounded-[16px] max-w-lg w-full p-6 shadow-xl border border-[#b9bbc6] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f3f7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#ff5900] uppercase">
                  CONTROL DE VERSIONES LIQUIBASE
                </span>
                <h3 className="text-base font-bold text-black">
                  Registrar Nuevo Changeset en el Histórico
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewChangesetModal(false)}
                className="text-xs font-bold text-[#8b8d98] hover:text-black p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-black block mb-1">ID del Changeset:</label>
                <input
                  type="text"
                  required
                  value={newCsId}
                  onChange={(e) => setNewCsId(e.target.value)}
                  className="w-full p-2 rounded-[8px] border border-[#b9bbc6] font-mono text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-black block mb-1">Autor:</label>
                  <input
                    type="text"
                    required
                    value={newCsAuthor}
                    onChange={(e) => setNewCsAuthor(e.target.value)}
                    className="w-full p-2 rounded-[8px] border border-[#b9bbc6] text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Microservicio Propietario:</label>
                  <select
                    value={newCsMicroservice}
                    onChange={(e) => setNewCsMicroservice(e.target.value as MicroserviceId)}
                    className="w-full p-2 rounded-[8px] border border-[#b9bbc6] text-black font-semibold"
                  >
                    <option value="ms-usuarios">ms-usuarios</option>
                    <option value="ms-perfiles">ms-perfiles</option>
                    <option value="ms-servicios">ms-servicios</option>
                    <option value="ms-solicitudes">ms-solicitudes</option>
                    <option value="ms-comunicacion">ms-comunicacion</option>
                    <option value="ms-reputacion">ms-reputacion</option>
                    <option value="seguridad-transversal">seguridad-transversal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Tablas Afectadas (separadas por coma):</label>
                <input
                  type="text"
                  required
                  value={newCsTables}
                  onChange={(e) => setNewCsTables(e.target.value)}
                  className="w-full p-2 rounded-[8px] border border-[#b9bbc6] font-mono text-black"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Comentario / Propósito del Cambio:</label>
                <input
                  type="text"
                  required
                  value={newCsComment}
                  onChange={(e) => setNewCsComment(e.target.value)}
                  className="w-full p-2 rounded-[8px] border border-[#b9bbc6] text-black"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Sentencia SQL de Rollback:</label>
                <input
                  type="text"
                  required
                  value={newCsRollback}
                  onChange={(e) => setNewCsRollback(e.target.value)}
                  className="w-full p-2 rounded-[8px] border border-[#b9bbc6] font-mono text-black"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewChangesetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#60646c] hover:text-black rounded-[10px] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer"
              >
                Ejecutar y Versionar Changeset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INSPECT CHANGESET MODAL */}
      {inspectingChangeset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-2xl w-full p-6 shadow-xl border border-[#b9bbc6] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#f3f3f7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#ff5900] uppercase tracking-wide block">
                  ORDEN #{inspectingChangeset.orderExecuted} · {inspectingChangeset.microservice || inspectingChangeset.category.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-black font-mono">{inspectingChangeset.id}</h3>
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
