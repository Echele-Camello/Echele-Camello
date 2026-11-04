import { LiquibaseChangeset, AuditLogEntry } from '../types';

export interface DatabaseTableInfo {
  name: string;
  description: string;
  category: 'negocio' | 'seguridad' | 'sistema';
  estimatedRows: number;
  primaryKey: string;
  foreignKeys: string[];
  moduleName: string;
}

export const LIQUIBASE_SYSTEM_METADATA = {
  version: '5.0.4',
  license: 'Apache-2.0 / Open Source Community',
  databaseName: 'echelecamelloprueba',
  dbServer: 'localhost:3306 (XAMPP MySQL / MariaDB 10.11)',
  charset: 'utf8mb4 (Collation: utf8mb4_unicode_ci)',
  driver: 'com.mysql.cj.jdbc.Driver (MySQL Connector/J 9.1.0)',
  deploymentId: '3827605491',
  lockStatus: 'Desbloqueado (databasechangeloglock: locked=0)',
  schemaStatus: 'Sincronizado / 100% Up-to-date',
  totalChangesets: 18,
  pendingChangesets: 0,
  failedChangesets: 0,
  lastExecuted: '2026-11-04 16:26:49',
  masterFile: 'changelog/db.changelog-master.xml'
};

export const INITIAL_LIQUIBASE_CHANGESETS: LiquibaseChangeset[] = [
  {
    id: '001-create-categories-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 1,
    execType: 'EXECUTED',
    md5sum: '9:6cfe7fc6040c13e3b886c6b06fa897df',
    description: 'sql',
    comments: 'Tabla de categorías técnicas y oficios certificados',
    category: 'schema',
    tablesAffected: ['categories'],
    rollbackSql: 'DROP TABLE IF EXISTS `categories`;'
  },
  {
    id: '001-create-users-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 2,
    execType: 'EXECUTED',
    md5sum: '9:970a97c0bf4a814cef62d44f61aa7ba7',
    description: 'sql',
    comments: 'Tabla de usuarios (clientes, trabajadores y administradores con billetera)',
    category: 'schema',
    tablesAffected: ['users'],
    rollbackSql: 'DROP TABLE IF EXISTS `users`;'
  },
  {
    id: '001-create-workers-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 3,
    execType: 'EXECUTED',
    md5sum: '9:89ee748c2dc4f454143b84eaf2b6fe6d',
    description: 'sql',
    comments: 'Tabla de perfiles de trabajadores verificados con geolocalización',
    category: 'schema',
    tablesAffected: ['workers'],
    rollbackSql: 'DROP TABLE IF EXISTS `workers`;'
  },
  {
    id: '001-create-contracts-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 4,
    execType: 'EXECUTED',
    md5sum: '9:8a9e7b3fa1ff0292efe27958194c1266',
    description: 'sql',
    comments: 'Tabla de contratos y solicitudes de camello con custodia Escrow',
    category: 'schema',
    tablesAffected: ['contracts'],
    rollbackSql: 'DROP TABLE IF EXISTS `contracts`;'
  },
  {
    id: '001-create-chat-messages-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 5,
    execType: 'EXECUTED',
    md5sum: '9:8ba15980c180fcc464d4a73f2d909789',
    description: 'sql',
    comments: 'Tabla de mensajería en tiempo real y ofertas formales vinculantes',
    category: 'schema',
    tablesAffected: ['chat_messages'],
    rollbackSql: 'DROP TABLE IF EXISTS `chat_messages`;'
  },
  {
    id: '001-create-reviews-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 6,
    execType: 'EXECUTED',
    md5sum: '9:8003255200adeeb109ec9f0e83f9015c',
    description: 'sql',
    comments: 'Tabla de opiniones, puntuaciones (1 a 5) y reputación bilateral',
    category: 'schema',
    tablesAffected: ['reviews'],
    rollbackSql: 'DROP TABLE IF EXISTS `reviews`;'
  },
  {
    id: '001-create-disputes-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 7,
    execType: 'EXECUTED',
    md5sum: '9:51bbb0845d73a6d4d79a530a3a58c5cb',
    description: 'sql',
    comments: 'Tabla de mediación arbitral y resolución de disputas de pagos escrow',
    category: 'schema',
    tablesAffected: ['disputes'],
    rollbackSql: 'DROP TABLE IF EXISTS `disputes`;'
  },
  {
    id: '001-create-worker-announcements-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 8,
    execType: 'EXECUTED',
    md5sum: '9:00ddfc35e1b2ab57e2283e62ea532fd4',
    description: 'sql',
    comments: 'Tabla de publicaciones, avisos y anuncios del foro comunitario',
    category: 'schema',
    tablesAffected: ['worker_announcements'],
    rollbackSql: 'DROP TABLE IF EXISTS `worker_announcements`;'
  },
  {
    id: '001-create-notifications-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 9,
    execType: 'EXECUTED',
    md5sum: '9:714aa87ca9970990612607e4065038cd',
    description: 'sql',
    comments: 'Tabla de notificaciones transaccionales y de sistema para usuarios',
    category: 'schema',
    tablesAffected: ['notifications'],
    rollbackSql: 'DROP TABLE IF EXISTS `notifications`;'
  },
  {
    id: '001-create-payments-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 10,
    execType: 'EXECUTED',
    md5sum: '9:85696e4969b2e274f783a9366f3c735d',
    description: 'sql',
    comments: 'Tabla de transacciones financieras y pasarelas (Nequi, Daviplata, PSE)',
    category: 'schema',
    tablesAffected: ['payments'],
    rollbackSql: 'DROP TABLE IF EXISTS `payments`;'
  },
  {
    id: '001-create-audit-logs-table',
    author: 'juandavid',
    filename: 'changelog/changesets/001_initial_schema.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 11,
    execType: 'EXECUTED',
    md5sum: '9:d7564d617ad7c1562a16e28e5a9391c6',
    description: 'sql',
    comments: 'Tabla de auditoría, trazabilidad forense y severidades (INFO, WARN, CRITICAL)',
    category: 'schema',
    tablesAffected: ['audit_logs'],
    rollbackSql: 'DROP TABLE IF EXISTS `audit_logs`;'
  },
  {
    id: '002-seed-categories',
    author: 'juandavid',
    filename: 'changelog/changesets/002_seed_data.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 12,
    execType: 'EXECUTED',
    md5sum: '9:5ece3a8380f3cfcfff3123afa0cfdeff',
    description: 'sql',
    comments: 'Carga inicial de categorías técnicas (Plomería, Hogar, Construcción, Acarreos)',
    category: 'seed',
    tablesAffected: ['categories'],
    rollbackSql: 'DELETE FROM `categories` WHERE `id` IN (...);'
  },
  {
    id: '002-seed-users',
    author: 'juandavid',
    filename: 'changelog/changesets/002_seed_data.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 13,
    execType: 'EXECUTED',
    md5sum: '9:26b03092a80f619d3fe9964b13167675',
    description: 'sql',
    comments: 'Carga de usuarios base (Alejandro Gómez, Don Carlos Mendoza, Admin Auditor)',
    category: 'seed',
    tablesAffected: ['users'],
    rollbackSql: 'DELETE FROM `users` WHERE `id` IN (\'cliente1\', \'trabajador1\', \'admin1\');'
  },
  {
    id: '002-seed-workers',
    author: 'juandavid',
    filename: 'changelog/changesets/002_seed_data.sql',
    dateExecuted: '2026-11-04 16:26:48',
    orderExecuted: 14,
    execType: 'EXECUTED',
    md5sum: '9:7cd602fa0475f88f63637636628d5a62',
    description: 'sql',
    comments: 'Carga de perfiles camelladores verificados con tarifas y portafolio de fotos',
    category: 'seed',
    tablesAffected: ['workers'],
    rollbackSql: 'DELETE FROM `workers` WHERE `id` IN (...);'
  },
  {
    id: '002-seed-contracts',
    author: 'juandavid',
    filename: 'changelog/changesets/002_seed_data.sql',
    dateExecuted: '2026-11-04 16:26:49',
    orderExecuted: 15,
    execType: 'EXECUTED',
    md5sum: '9:c042edc4a24cfddc27569814db2ca28a',
    description: 'sql',
    comments: 'Carga inicial de contratos con estado Escrow y referencias Wompi/Nequi',
    category: 'seed',
    tablesAffected: ['contracts'],
    rollbackSql: 'DELETE FROM `contracts` WHERE `id` IN (\'cont-8491\', \'cont-8490\');'
  },
  {
    id: '002-seed-reviews',
    author: 'juandavid',
    filename: 'changelog/changesets/002_seed_data.sql',
    dateExecuted: '2026-11-04 16:26:49',
    orderExecuted: 16,
    execType: 'EXECUTED',
    md5sum: '9:eba3917c00d60f75752ff78d2514097b',
    description: 'sql',
    comments: 'Carga de reseñas de clientes con calificación 5 estrellas y respuesta',
    category: 'seed',
    tablesAffected: ['reviews'],
    rollbackSql: 'DELETE FROM `reviews` WHERE `id` = \'rev-101\';'
  },
  {
    id: '003-seed-announcements',
    author: 'juandavid',
    filename: 'changelog/changesets/003_escrow_and_security.sql',
    dateExecuted: '2026-11-04 16:26:49',
    orderExecuted: 17,
    execType: 'EXECUTED',
    md5sum: '9:2b0c5836adcc024676941ff947f73350',
    description: 'sql',
    comments: 'Publicaciones del foro para avisos de disponibilidad y ofertas inmediatas',
    category: 'security',
    tablesAffected: ['worker_announcements'],
    rollbackSql: 'DELETE FROM `worker_announcements` WHERE `id` IN (...);'
  },
  {
    id: '003-seed-audit-logs',
    author: 'juandavid',
    filename: 'changelog/changesets/003_escrow_and_security.sql',
    dateExecuted: '2026-11-04 16:26:49',
    orderExecuted: 18,
    execType: 'EXECUTED',
    md5sum: '9:c3af763c06aa89614f66b0188a98625a',
    description: 'sql',
    comments: 'Registro de trazabilidad para inicialización de base de datos y depósitos de garantía',
    category: 'security',
    tablesAffected: ['audit_logs'],
    rollbackSql: 'DELETE FROM `audit_logs` WHERE `id` IN (\'log-1\', \'log-2\');'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    accion: 'DB_INIT_LIQUIBASE',
    usuario: 'juandavid',
    timestamp: '2026-11-04 16:25:00',
    esquema: 'echelecamelloprueba',
    detalles: 'Instalación y sincronización de base de datos MySQL con Liquibase para ambiente de desarrollo local en XAMPP.',
    severidad: 'INFO',
    created_at: '2026-11-04 16:26:49'
  },
  {
    id: 'log-2',
    accion: 'ESCROW_DEPOSIT_VERIFIED',
    usuario: 'Pasarela Wompi / Nequi',
    timestamp: '2026-11-02 10:15:22',
    esquema: 'ms-pagos',
    detalles: 'Depósito de $120.000 COP retenido en cuenta escrow para contrato cont-8491 (Don Carlos Mendoza).',
    severidad: 'INFO',
    created_at: '2026-11-04 16:26:49'
  },
  {
    id: 'log-3',
    accion: 'CHANGELOG_INTEGRITY_CHECK',
    usuario: 'Liquibase Verifier Daemon',
    timestamp: '2026-11-04 16:31:38',
    esquema: 'echelecamelloprueba',
    detalles: 'Verificación de checksums MD5 exitosa. Cero desviaciones de esquema detectadas.',
    severidad: 'INFO',
    created_at: '2026-11-04 16:31:38'
  },
  {
    id: 'log-4',
    accion: 'DISPUTE_MEDIATION_OPENED',
    usuario: 'Sistema Arbitral Escrow',
    timestamp: '2026-11-03 14:20:10',
    esquema: 'ms-disputas',
    detalles: 'Apertura de caso de mediación por inconformidad en tiempo de ejecución. Fondos congelados de forma preventiva.',
    severidad: 'WARN',
    created_at: '2026-11-03 14:20:10'
  }
];

export const DATABASE_TABLES_CATALOG: DatabaseTableInfo[] = [
  {
    name: 'categories',
    description: 'Catálogo de oficios técnicos, tarifas mínimas/máximas y unidades de cobro.',
    category: 'negocio',
    estimatedRows: 6,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-catalogos'
  },
  {
    name: 'users',
    description: 'Cuentas de usuario con roles múltiples, contraseñas hash, datos de contacto y billetera.',
    category: 'seguridad',
    estimatedRows: 3,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-usuarios'
  },
  {
    name: 'workers',
    description: 'Expediente del camellador, certificación SENA, radio de cobertura (km) y rating.',
    category: 'negocio',
    estimatedRows: 5,
    primaryKey: 'id',
    foreignKeys: ['categoria_id -> categories.id'],
    moduleName: 'ms-trabajadores'
  },
  {
    name: 'contracts',
    description: 'Acuerdos de servicio con retención de custodia financiera (Escrow) y liquidación.',
    category: 'negocio',
    estimatedRows: 2,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-contratos-escrow'
  },
  {
    name: 'chat_messages',
    description: 'Hilos de conversación interna y ofertas vinculantes con vigencia horaria.',
    category: 'negocio',
    estimatedRows: 0,
    primaryKey: 'id',
    foreignKeys: ['contrato_id -> contracts.id'],
    moduleName: 'ms-comunicacion'
  },
  {
    name: 'reviews',
    description: 'Evaluaciones bilaterales verificadas post-liberación de pago.',
    category: 'negocio',
    estimatedRows: 1,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-reputacion'
  },
  {
    name: 'disputes',
    description: 'Expedientes de arbitraje para resolver controversias sobre fondos en garantía.',
    category: 'seguridad',
    estimatedRows: 0,
    primaryKey: 'id',
    foreignKeys: ['contrato_id -> contracts.id'],
    moduleName: 'ms-disputas'
  },
  {
    name: 'worker_announcements',
    description: 'Muro comunitario de camelladores, clasificados urgentes y comentarios.',
    category: 'negocio',
    estimatedRows: 2,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-foro'
  },
  {
    name: 'notifications',
    description: 'Alertas en tiempo real sobre cambios de estado de custodia y mensajes.',
    category: 'sistema',
    estimatedRows: 0,
    primaryKey: 'id',
    foreignKeys: ['usuario_id -> users.id'],
    moduleName: 'ms-notificaciones'
  },
  {
    name: 'payments',
    description: 'Registros de pasarela con referencias únicas Wompi, Nequi y PSE.',
    category: 'seguridad',
    estimatedRows: 0,
    primaryKey: 'id',
    foreignKeys: ['contrato_id -> contracts.id'],
    moduleName: 'ms-pagos'
  },
  {
    name: 'audit_logs',
    description: 'Pista de auditoría inmutable de eventos sensibles del sistema y despliegues.',
    category: 'sistema',
    estimatedRows: 4,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-auditoria'
  }
];

