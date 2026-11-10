import { LiquibaseChangeset, AuditLogEntry, MicroserviceId } from '../types';

export interface DatabaseTableInfo {
  name: string;
  entityName: string;
  description: string;
  category: 'negocio' | 'seguridad' | 'sistema';
  estimatedRows: number;
  primaryKey: string;
  foreignKeys: string[];
  moduleName: MicroserviceId;
  patternsUsed: string[];
}

export const LIQUIBASE_SYSTEM_METADATA = {
  version: '5.0.4',
  license: 'Apache-2.0 / Open Source Community',
  databaseName: 'echelecamelloprueba',
  dbServer: 'localhost:3306 (XAMPP MySQL / MariaDB 10.11 - Organizado por Dominio)',
  charset: 'utf8mb4 (Collation: utf8mb4_unicode_ci)',
  driver: 'com.mysql.cj.jdbc.Driver (MySQL Connector/J 9.1.0)',
  deploymentId: '3827605492',
  lockStatus: 'Desbloqueado (databasechangeloglock: locked=0)',
  schemaStatus: 'Sincronizado / 7 Microservicios Activos (Rama Dev)',
  totalChangesets: 25,
  pendingChangesets: 0,
  failedChangesets: 0,
  lastExecuted: '2026-11-10 02:20:00',
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
    comments: '[ms-servicios] Tabla de categorías técnicas y oficios certificados (Entidad: Categoría)',
    category: 'schema',
    microservice: 'ms-servicios',
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
    comments: '[ms-usuarios] Tabla de usuarios (clientes, trabajadores y administradores con identidad verificada)',
    category: 'schema',
    microservice: 'ms-usuarios',
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
    comments: '[ms-perfiles] Tabla de perfiles profesionales de trabajadores verificados con geolocalización',
    category: 'schema',
    microservice: 'ms-perfiles',
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
    comments: '[ms-solicitudes] Tabla de solicitudes de servicio y contratos con custodia Escrow (Patrón State)',
    category: 'schema',
    microservice: 'ms-solicitudes',
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
    comments: '[ms-comunicacion] Tabla de mensajería en tiempo real y ofertas formales vinculantes',
    category: 'schema',
    microservice: 'ms-comunicacion',
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
    comments: '[ms-reputacion] Tabla de calificaciones y reseñas (1 a 5 estrellas) y reputación bilateral',
    category: 'schema',
    microservice: 'ms-reputacion',
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
    comments: '[ms-reputacion] Tabla de reportes, moderación y resolución arbitral de disputas (Patrón State)',
    category: 'schema',
    microservice: 'ms-reputacion',
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
    comments: '[ms-servicios] Tabla de publicaciones de servicios y anuncios del foro comunitario',
    category: 'schema',
    microservice: 'ms-servicios',
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
    comments: '[ms-comunicacion] Tabla de notificaciones por eventos Observer / Publish-Subscribe',
    category: 'schema',
    microservice: 'ms-comunicacion',
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
    comments: '[ms-solicitudes] Tabla de transacciones financieras y pasarelas Escrow (Nequi, Daviplata, PSE)',
    category: 'schema',
    microservice: 'ms-solicitudes',
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
    comments: '[seguridad-transversal] Tabla de auditoría forense y severidades (INFO, WARN, CRITICAL)',
    category: 'schema',
    microservice: 'seguridad-transversal',
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
    comments: '[ms-servicios] Carga inicial de categorías técnicas (Plomería, Hogar, Construcción, Acarreos)',
    category: 'seed',
    microservice: 'ms-servicios',
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
    comments: '[ms-usuarios] Carga de usuarios base (Alejandro Gómez, Don Carlos Mendoza, Admin Auditor)',
    category: 'seed',
    microservice: 'ms-usuarios',
    tablesAffected: ['users'],
    rollbackSql: "DELETE FROM `users` WHERE `id` IN ('cliente1', 'trabajador1', 'admin1');"
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
    comments: '[ms-perfiles] Carga de perfiles camelladores verificados con tarifas y portafolio de fotos',
    category: 'seed',
    microservice: 'ms-perfiles',
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
    comments: '[ms-solicitudes] Carga inicial de solicitudes y contratos con estado Escrow y referencias Wompi/Nequi',
    category: 'seed',
    microservice: 'ms-solicitudes',
    tablesAffected: ['contracts'],
    rollbackSql: "DELETE FROM `contracts` WHERE `id` IN ('cont-8491', 'cont-8490');"
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
    comments: '[ms-reputacion] Carga de reseñas de clientes con calificación 5 estrellas y respuesta',
    category: 'seed',
    microservice: 'ms-reputacion',
    tablesAffected: ['reviews'],
    rollbackSql: "DELETE FROM `reviews` WHERE `id` = 'rev-101';"
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
    comments: '[ms-servicios] Publicaciones del foro para avisos de disponibilidad y ofertas inmediatas',
    category: 'security',
    microservice: 'ms-servicios',
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
    comments: '[seguridad-transversal] Registro de trazabilidad para inicialización de BD y depósitos de garantía',
    category: 'security',
    microservice: 'seguridad-transversal',
    tablesAffected: ['audit_logs'],
    rollbackSql: "DELETE FROM `audit_logs` WHERE `id` IN ('log-1', 'log-2');"
  },
  {
    id: '004-create-roles-and-sessions-ms-usuarios',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 19,
    execType: 'EXECUTED',
    md5sum: '9:a18f92e4b019c732d8f1120984bc2201',
    description: 'sql',
    comments: '[ms-usuarios] Creación de tablas roles y sessions para RBAC (Cliente, Trabajador, Admin) y control de sesiones (RF-01 a RF-08)',
    category: 'microservices',
    microservice: 'ms-usuarios',
    tablesAffected: ['roles', 'sessions'],
    rollbackSql: 'DROP TABLE IF EXISTS `sessions`; DROP TABLE IF EXISTS `roles`;'
  },
  {
    id: '004-create-availability-and-locations-ms-perfiles',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 20,
    execType: 'EXECUTED',
    md5sum: '9:b49c01d3e721a843f9e2231095cd3312',
    description: 'sql',
    comments: '[ms-perfiles] Creación de tablas worker_availability y worker_locations para Disponibilidad y Ubicación (RF-09 a RF-017)',
    category: 'microservices',
    microservice: 'ms-perfiles',
    tablesAffected: ['worker_availability', 'worker_locations'],
    rollbackSql: 'DROP TABLE IF EXISTS `worker_locations`; DROP TABLE IF EXISTS `worker_availability`;'
  },
  {
    id: '004-create-services-catalog-ms-servicios',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 21,
    execType: 'EXECUTED',
    md5sum: '9:c72d14e5f832b954a0f3342106de4423',
    description: 'sql',
    comments: '[ms-servicios] Creación de tabla services con máquina de estados State (ACTIVO, INACTIVO, SUSPENDIDO, BORRADOR) (RF-018 a RF-023)',
    category: 'microservices',
    microservice: 'ms-servicios',
    tablesAffected: ['services'],
    rollbackSql: 'DROP TABLE IF EXISTS `services`;'
  },
  {
    id: '004-create-schedules-ms-solicitudes',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 22,
    execType: 'EXECUTED',
    md5sum: '9:d83e25f6a943ca65b1a4453217ef5534',
    description: 'sql',
    comments: '[ms-solicitudes] Creación de tabla service_schedules para Programación y Reprogramación de Solicitudes (RF-033 a RF-040)',
    category: 'microservices',
    microservice: 'ms-solicitudes',
    tablesAffected: ['service_schedules'],
    rollbackSql: 'DROP TABLE IF EXISTS `service_schedules`;'
  },
  {
    id: '004-create-conversations-ms-comunicacion',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 23,
    execType: 'EXECUTED',
    md5sum: '9:e94f36a7ba54db76c2b5564328fa6645',
    description: 'sql',
    comments: '[ms-comunicacion] Creación de tabla conversations para gestión de hilos y eventos Observer / Pub-Sub (RF-041 a RF-046)',
    category: 'microservices',
    microservice: 'ms-comunicacion',
    tablesAffected: ['conversations'],
    rollbackSql: 'DROP TABLE IF EXISTS `conversations`;'
  },
  {
    id: '004-create-domain-events-log',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 24,
    execType: 'EXECUTED',
    md5sum: '9:fa5047b8cb65ec87d3c6675439ab7756',
    description: 'sql',
    comments: '[api-gateway] Creación de tabla domain_events_log para trazabilidad de eventos Observer entre los 7 microservicios',
    category: 'microservices',
    microservice: 'api-gateway',
    tablesAffected: ['domain_events_log'],
    rollbackSql: 'DROP TABLE IF EXISTS `domain_events_log`;'
  },
  {
    id: '004-seed-microservices-domain-data',
    author: 'arquitectura',
    filename: 'changelog/changesets/004_microservices_domain_alignment.sql',
    dateExecuted: '2026-11-10 02:20:00',
    orderExecuted: 25,
    execType: 'EXECUTED',
    md5sum: '9:0b6158c9dc76fd98e4d7786540bc8867',
    description: 'sql',
    comments: '[administracion-transversal] Semillas de roles RBAC, catálogo de servicios con State y auditoría de arquitectura',
    category: 'microservices',
    microservice: 'administracion-transversal',
    tablesAffected: ['roles', 'services', 'audit_logs'],
    rollbackSql: "DELETE FROM `audit_logs` WHERE `id` = 'log-5'; DELETE FROM `services` WHERE `id` IN ('srv-101','srv-102','srv-103','srv-104'); DELETE FROM `roles` WHERE `id` IN ('rol-cliente','rol-trabajador','rol-admin');"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-6',
    accion: 'PATRONES_DISENO_INICIALIZADOS',
    usuario: 'DIContainer / ApiGateway',
    timestamp: '2026-11-10 02:20:05',
    esquema: 'api-gateway',
    detalles: 'Contenedor de Inyección de Dependencias y API Gateway activos con 7 microservicios: ms-usuarios, ms-perfiles, ms-servicios, ms-busqueda, ms-solicitudes, ms-comunicacion y ms-reputacion.',
    severidad: 'INFO',
    patronAplicado: 'Dependency Injection',
    created_at: '2026-11-10 02:20:05'
  },
  {
    id: 'log-5',
    accion: 'MICROSERVICES_ARCH_ALIGNED',
    usuario: 'arquitectura',
    timestamp: '2026-11-10 02:20:00',
    esquema: 'echelecamelloprueba',
    detalles: 'Migración 004_microservices_domain_alignment.sql ejecutada: propiedad de entidades aislada por microservicio según regla clave del modelo.',
    severidad: 'INFO',
    patronAplicado: 'Repository',
    created_at: '2026-11-10 02:20:00'
  },
  {
    id: 'log-4',
    accion: 'DISPUTE_MEDIATION_OPENED',
    usuario: 'Sistema Arbitral Escrow',
    timestamp: '2026-11-03 14:20:10',
    esquema: 'ms-reputacion',
    detalles: 'Apertura de reporte/disputa por inconformidad en tiempo de ejecución. Transición de estado controlada por ReporteStateMachine (Patrón State).',
    severidad: 'WARN',
    patronAplicado: 'State',
    created_at: '2026-11-03 14:20:10'
  },
  {
    id: 'log-3',
    accion: 'CHANGELOG_INTEGRITY_CHECK',
    usuario: 'Liquibase Verifier Daemon',
    timestamp: '2026-11-04 16:31:38',
    esquema: 'echelecamelloprueba',
    detalles: 'Verificación de checksums MD5 exitosa en los 25 changesets. Cero desviaciones de esquema detectadas en rama Dev.',
    severidad: 'INFO',
    patronAplicado: 'Layered Architecture',
    created_at: '2026-11-04 16:31:38'
  },
  {
    id: 'log-2',
    accion: 'ESCROW_DEPOSIT_VERIFIED',
    usuario: 'Pasarela Wompi / Nequi',
    timestamp: '2026-11-02 10:15:22',
    esquema: 'ms-solicitudes',
    detalles: 'Depósito de $120.000 COP retenido en cuenta escrow para solicitud cont-8491. Evento SOLICITUD_PAGADA_ESCROW publicado vía Observer.',
    severidad: 'INFO',
    patronAplicado: 'Observer',
    created_at: '2026-11-04 16:26:49'
  },
  {
    id: 'log-1',
    accion: 'DB_INIT_LIQUIBASE',
    usuario: 'juandavid',
    timestamp: '2026-11-04 16:25:00',
    esquema: 'echelecamelloprueba',
    detalles: 'Instalación y sincronización de base de datos MySQL con Liquibase para ambiente de desarrollo local en XAMPP.',
    severidad: 'INFO',
    patronAplicado: 'Repository',
    created_at: '2026-11-04 16:26:49'
  }
];

export const DATABASE_TABLES_CATALOG: DatabaseTableInfo[] = [
  // 1. ms-usuarios (Entidades: Usuario, Rol, Sesión)
  {
    name: 'users',
    entityName: 'Usuario',
    description: 'Identidad de las personas, credenciales hash, verificación de correo/teléfono y estado de cuenta.',
    category: 'seguridad',
    estimatedRows: 3,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-usuarios',
    patternsUsed: ['Repository', 'DTO', 'Adapter (correo)']
  },
  {
    name: 'roles',
    entityName: 'Rol',
    description: 'Catálogo de roles RBAC (Cliente, Trabajador, Admin) y matriz de permisos granulares.',
    category: 'seguridad',
    estimatedRows: 3,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-usuarios',
    patternsUsed: ['Repository', 'DTO']
  },
  {
    name: 'sessions',
    entityName: 'Sesión',
    description: 'Registro de sesiones activas, cambios de rol con Switch de Pruebas y tokens JWT.',
    category: 'seguridad',
    estimatedRows: 3,
    primaryKey: 'id',
    foreignKeys: ['usuario_id -> users.id'],
    moduleName: 'ms-usuarios',
    patternsUsed: ['Repository', 'DTO']
  },

  // 2. ms-perfiles (Entidades: PerfilProfesional, Disponibilidad, Ubicación)
  {
    name: 'workers',
    entityName: 'PerfilProfesional',
    description: 'Información profesional del trabajador: oficio, experiencia, habilidades, certificaciones y portafolio.',
    category: 'negocio',
    estimatedRows: 9,
    primaryKey: 'id',
    foreignKeys: ['categoria_id -> categories.id'],
    moduleName: 'ms-perfiles',
    patternsUsed: ['Repository', 'DTO', 'Adapter (archivos/fotos)']
  },
  {
    name: 'worker_availability',
    entityName: 'Disponibilidad',
    description: 'Franjas horarias de atención, disponibilidad inmediata 24/7 y modalidad de servicio.',
    category: 'negocio',
    estimatedRows: 9,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-perfiles',
    patternsUsed: ['Repository', 'DTO']
  },
  {
    name: 'worker_locations',
    entityName: 'Ubicación',
    description: 'Coordenadas geográficas (lat, lng), ciudad, barrio base y radio de cobertura en kilómetros.',
    category: 'negocio',
    estimatedRows: 9,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-perfiles',
    patternsUsed: ['Repository', 'DTO']
  },

  // 3. ms-servicios (Entidades: Servicio, Categoría)
  {
    name: 'services',
    entityName: 'Servicio',
    description: 'Servicios publicados por los trabajadores con ciclo de vida controlado por el patrón State.',
    category: 'negocio',
    estimatedRows: 4,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id', 'categoria_id -> categories.id'],
    moduleName: 'ms-servicios',
    patternsUsed: ['Repository', 'DTO', 'State (estado del servicio)']
  },
  {
    name: 'categories',
    entityName: 'Categoría',
    description: 'Catálogo maestro de categorías de servicios, tarifas base sugeridas y unidades de cobro.',
    category: 'negocio',
    estimatedRows: 6,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-servicios',
    patternsUsed: ['Repository', 'DTO']
  },
  {
    name: 'worker_announcements',
    entityName: 'Servicio (Anuncio Foro)',
    description: 'Publicaciones inmediatas de servicios y ofertas de disponibilidad en el muro comunitario.',
    category: 'negocio',
    estimatedRows: 6,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-servicios',
    patternsUsed: ['Repository', 'DTO', 'State']
  },

  // 5. ms-solicitudes (Entidades: SolicitudServicio, Programación)
  {
    name: 'contracts',
    entityName: 'SolicitudServicio',
    description: 'Solicitudes de servicio y contratos Escrow con máquina de estados (State) y eventos Observer.',
    category: 'negocio',
    estimatedRows: 3,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-solicitudes',
    patternsUsed: ['State', 'Observer', 'Repository', 'DTO']
  },
  {
    name: 'service_schedules',
    entityName: 'Programación',
    description: 'Agendamiento, programación y reprogramación de visitas con validación de disponibilidad.',
    category: 'negocio',
    estimatedRows: 3,
    primaryKey: 'id',
    foreignKeys: ['contrato_id -> contracts.id'],
    moduleName: 'ms-solicitudes',
    patternsUsed: ['State', 'Observer', 'Repository', 'DTO']
  },
  {
    name: 'payments',
    entityName: 'CustodiaEscrow',
    description: 'Depósitos retenidos en garantía y desembolsos asociados a cada SolicitudServicio.',
    category: 'seguridad',
    estimatedRows: 2,
    primaryKey: 'id',
    foreignKeys: ['contrato_id -> contracts.id'],
    moduleName: 'ms-solicitudes',
    patternsUsed: ['Repository', 'DTO', 'Observer']
  },

  // 6. ms-comunicacion (Entidades: Conversación, Mensaje, Notificación)
  {
    name: 'conversations',
    entityName: 'Conversación',
    description: 'Hilos de conversación activa entre clientes y trabajadores.',
    category: 'negocio',
    estimatedRows: 2,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'ms-comunicacion',
    patternsUsed: ['Repository', 'DTO']
  },
  {
    name: 'chat_messages',
    entityName: 'Mensaje',
    description: 'Mensajes enviados/leídos, adjuntos y ofertas formales dentro de una conversación.',
    category: 'negocio',
    estimatedRows: 4,
    primaryKey: 'id',
    foreignKeys: ['conversacion_id -> conversations.id'],
    moduleName: 'ms-comunicacion',
    patternsUsed: ['Observer / Publish-Subscribe', 'Adapter (archivos/correo/push)', 'Repository', 'DTO']
  },
  {
    name: 'notifications',
    entityName: 'Notificación',
    description: 'Notificaciones creadas y marcadas automáticamente ante eventos de solicitudes y moderación.',
    category: 'sistema',
    estimatedRows: 5,
    primaryKey: 'id',
    foreignKeys: ['usuario_id -> users.id'],
    moduleName: 'ms-comunicacion',
    patternsUsed: ['Observer / Publish-Subscribe', 'Adapter (correo/push)', 'Repository', 'DTO']
  },

  // 7. ms-reputacion (Entidades: Calificación, Reseña, Reporte)
  {
    name: 'reviews',
    entityName: 'Calificación / Reseña',
    description: 'Calificaciones numéricas (1-5) y reseñas verificadas sobre servicios completados.',
    category: 'negocio',
    estimatedRows: 2,
    primaryKey: 'id',
    foreignKeys: ['trabajador_id -> workers.id'],
    moduleName: 'ms-reputacion',
    patternsUsed: ['Repository', 'DTO', 'Observer']
  },
  {
    name: 'disputes',
    entityName: 'Reporte (Disputa)',
    description: 'Reportes de usuarios/servicios y acciones de moderación con máquina de estados (State).',
    category: 'seguridad',
    estimatedRows: 1,
    primaryKey: 'id',
    foreignKeys: ['contrato_id -> contracts.id'],
    moduleName: 'ms-reputacion',
    patternsUsed: ['State', 'Repository', 'DTO', 'Observer']
  },

  // Transversal (Seguridad / Auditoría / API Gateway)
  {
    name: 'audit_logs',
    entityName: 'AuditoríaTransversal',
    description: 'Pista de auditoría inmutable de seguridad transversal, cambios de rol y migraciones Liquibase.',
    category: 'sistema',
    estimatedRows: 6,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'seguridad-transversal',
    patternsUsed: ['Observer', 'API Gateway']
  },
  {
    name: 'domain_events_log',
    entityName: 'EventoDominio',
    description: 'Bitácora de eventos Publish-Subscribe emitidos entre los 7 microservicios de la plataforma.',
    category: 'sistema',
    estimatedRows: 6,
    primaryKey: 'id',
    foreignKeys: [],
    moduleName: 'api-gateway',
    patternsUsed: ['Observer / Publish-Subscribe', 'API Gateway']
  }
];
