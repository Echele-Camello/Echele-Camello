import {
  User,
  UserRole,
  WorkerProfile,
  WorkerCategory,
  Contract,
  Review,
  Dispute,
  WorkerAnnouncement,
  MicroserviceId
} from '../../types';
import {
  MOCK_USERS,
  MOCK_WORKERS,
  INITIAL_CATEGORIES,
  INITIAL_CONTRACTS,
  INITIAL_REVIEWS,
  INITIAL_DISPUTES
} from '../../data/mockData';
import { INITIAL_ANNOUNCEMENTS } from '../../data/mockAnnouncements';
import { DIContainer } from '../patterns/di/DIContainer';
import { BaseDomainRepository } from '../patterns/repository/BaseRepository';
import { DomainEventBus } from '../patterns/observer/DomainEventBus';
import {
  SmtpEmailAdapter,
  CloudFileStorageAdapter,
  ColombiaGeoMapAdapter,
  MultiChannelNotificationAdapter
} from '../patterns/adapter/ExternalAdapters';
import {
  UsuariosService,
  PerfilesService,
  ServiciosService,
  BusquedaService,
  SolicitudesService,
  ComunicacionService,
  ReputacionService,
  MICROSERVICES_CATALOG
} from '../../microservices/DomainMicroservices';

/**
 * PATRÓN GLOBAL: API Gateway + Seguridad Transversal + Administración Transversal
 * Punto de entrada único para clientes Web, Android y Administrador.
 * Centraliza autenticación/autorización RBAC, enrutamiento hacia los 7 microservicios
 * e inyección de dependencias mediante DIContainer.
 */

export interface GatewayRequestLog {
  id: string;
  timestamp: string;
  route: string;
  targetMicroservice: MicroserviceId;
  callerRole: UserRole;
  status: 200 | 403 | 400;
  latencyMs: number;
  patternsInvoked: string[];
}

export class ApiGateway {
  private static instance: ApiGateway;
  public readonly container: DIContainer;
  public readonly eventBus: DomainEventBus;
  private requestLogs: GatewayRequestLog[] = [];

  // Servicios de Dominio resueltos por Dependency Injection
  public readonly msUsuarios: UsuariosService;
  public readonly msPerfiles: PerfilesService;
  public readonly msServicios: ServiciosService;
  public readonly msBusqueda: BusquedaService;
  public readonly msSolicitudes: SolicitudesService;
  public readonly msComunicacion: ComunicacionService;
  public readonly msReputacion: ReputacionService;

  private constructor() {
    this.container = DIContainer.getInstance();

    // 1. Registrar EventBus (Observer / Publish-Subscribe)
    this.container.registerSingleton('DomainEventBus', () => new DomainEventBus(), 'api-gateway');

    // 2. Registrar Repositorios aislados por Dominio (Regla Clave: cada MS es dueño de sus entidades)
    this.container.registerSingleton(
      'UsuarioRepository',
      () => new BaseDomainRepository<User>('ms-usuarios', 'Usuario', Object.values(MOCK_USERS)),
      'ms-usuarios'
    );
    this.container.registerSingleton(
      'PerfilProfesionalRepository',
      () => new BaseDomainRepository<WorkerProfile>('ms-perfiles', 'PerfilProfesional', MOCK_WORKERS),
      'ms-perfiles'
    );
    this.container.registerSingleton(
      'CategoriaRepository',
      () => new BaseDomainRepository<WorkerCategory>('ms-servicios', 'Categoría', INITIAL_CATEGORIES),
      'ms-servicios'
    );
    this.container.registerSingleton(
      'ServicioAnuncioRepository',
      () => new BaseDomainRepository<WorkerAnnouncement>('ms-servicios', 'Servicio', INITIAL_ANNOUNCEMENTS),
      'ms-servicios'
    );
    this.container.registerSingleton(
      'SolicitudRepository',
      () => new BaseDomainRepository<Contract>('ms-solicitudes', 'SolicitudServicio', INITIAL_CONTRACTS),
      'ms-solicitudes'
    );
    this.container.registerSingleton(
      'ResenaRepository',
      () => new BaseDomainRepository<Review>('ms-reputacion', 'Reseña', INITIAL_REVIEWS),
      'ms-reputacion'
    );
    this.container.registerSingleton(
      'ReporteRepository',
      () => new BaseDomainRepository<Dispute>('ms-reputacion', 'Reporte', INITIAL_DISPUTES),
      'ms-reputacion'
    );

    // 3. Registrar Adaptadores de Servicios Externos (Patrón Adapter)
    this.container.registerSingleton('EmailAdapter', () => new SmtpEmailAdapter(), 'ms-usuarios');
    this.container.registerSingleton('FileStorageAdapter', () => new CloudFileStorageAdapter(), 'ms-perfiles');
    this.container.registerSingleton('GeoLocationAdapter', () => new ColombiaGeoMapAdapter(), 'ms-busqueda');
    this.container.registerSingleton(
      'NotificationChannelAdapter',
      () => new MultiChannelNotificationAdapter(),
      'ms-comunicacion'
    );

    // 4. Registrar los 7 Microservicios inyectando sus dependencias
    this.container.registerSingleton(
      'ms-usuarios',
      (c) =>
        new UsuariosService(
          c.resolve('UsuarioRepository'),
          c.resolve('EmailAdapter'),
          c.resolve('DomainEventBus')
        ),
      'ms-usuarios'
    );

    this.container.registerSingleton(
      'ms-perfiles',
      (c) =>
        new PerfilesService(
          c.resolve('PerfilProfesionalRepository'),
          c.resolve('FileStorageAdapter'),
          c.resolve('DomainEventBus')
        ),
      'ms-perfiles'
    );

    this.container.registerSingleton(
      'ms-servicios',
      (c) =>
        new ServiciosService(
          c.resolve('CategoriaRepository'),
          c.resolve('ServicioAnuncioRepository'),
          c.resolve('DomainEventBus')
        ),
      'ms-servicios'
    );

    this.container.registerSingleton(
      'ms-busqueda',
      (c) => new BusquedaService(c.resolve('GeoLocationAdapter')),
      'ms-busqueda'
    );

    this.container.registerSingleton(
      'ms-solicitudes',
      (c) =>
        new SolicitudesService(
          c.resolve('SolicitudRepository'),
          c.resolve('DomainEventBus')
        ),
      'ms-solicitudes'
    );

    this.container.registerSingleton(
      'ms-comunicacion',
      (c) =>
        new ComunicacionService(
          c.resolve('NotificationChannelAdapter'),
          c.resolve('DomainEventBus')
        ),
      'ms-comunicacion'
    );

    this.container.registerSingleton(
      'ms-reputacion',
      (c) =>
        new ReputacionService(
          c.resolve('ResenaRepository'),
          c.resolve('ReporteRepository'),
          c.resolve('DomainEventBus')
        ),
      'ms-reputacion'
    );

    // Resolver instancias principales
    this.eventBus = this.container.resolve('DomainEventBus');
    this.msUsuarios = this.container.resolve('ms-usuarios');
    this.msPerfiles = this.container.resolve('ms-perfiles');
    this.msServicios = this.container.resolve('ms-servicios');
    this.msBusqueda = this.container.resolve('ms-busqueda');
    this.msSolicitudes = this.container.resolve('ms-solicitudes');
    this.msComunicacion = this.container.resolve('ms-comunicacion');
    this.msReputacion = this.container.resolve('ms-reputacion');

    // Registrar trazas iniciales del API Gateway
    this.logRoute(
      'GET /api/gateway/health',
      'api-gateway',
      'admin',
      200,
      ['API Gateway', 'Dependency Injection']
    );
  }

  public static getInstance(): ApiGateway {
    if (!ApiGateway.instance) {
      ApiGateway.instance = new ApiGateway();
    }
    return ApiGateway.instance;
  }

  /**
   * Seguridad Transversal: Verifica si el rol activo tiene autorización para rutas administrativas
   */
  public verifyAdminAccess(role: UserRole): boolean {
    return role === 'admin';
  }

  public logRoute(
    route: string,
    targetMicroservice: MicroserviceId,
    callerRole: UserRole,
    status: 200 | 403 | 400,
    patternsInvoked: string[]
  ): void {
    const entry: GatewayRequestLog = {
      id: `gw-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
      timestamp: new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      route,
      targetMicroservice,
      callerRole,
      status,
      latencyMs: Math.floor(4 + Math.random() * 14),
      patternsInvoked
    };
    this.requestLogs.unshift(entry);
  }

  public getRequestLogs(): GatewayRequestLog[] {
    return [...this.requestLogs];
  }

  public getMicroservicesCatalog() {
    return MICROSERVICES_CATALOG;
  }
}

export const platformGateway = ApiGateway.getInstance();

