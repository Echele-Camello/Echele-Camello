import {
  User,
  UserRole,
  WorkerProfile,
  WorkerCategory,
  Contract,
  ContractStatus,
  ChatMessage,
  Review,
  Dispute,
  WorkerAnnouncement,
  ServicioStatus,
  MicroserviceId,
  DesignPatternType
} from '../types';
import { BaseDomainRepository } from '../architecture/patterns/repository/BaseRepository';
import {
  UsuarioDTOMapper,
  UsuarioPublicDTO,
  PerfilProfesionalDTOMapper,
  PerfilProfesionalPublicDTO,
  BusquedaCriteriaDTO,
  ResultadoBusquedaWorkerDTO
} from '../architecture/patterns/dto/DTOMapper';
import { DomainEventBus } from '../architecture/patterns/observer/DomainEventBus';
import {
  ServicioStateMachine,
  SolicitudStateMachine,
  ReporteStateMachine
} from '../architecture/patterns/state/DomainStateMachines';
import { SearchStrategyContext } from '../architecture/patterns/strategy/SearchStrategy';
import {
  IEmailAdapter,
  IFileStorageAdapter,
  IGeoLocationAdapter,
  INotificationChannelAdapter
} from '../architecture/patterns/adapter/ExternalAdapters';

/**
 * ARQUITECTURA DE DOMINIOS Y 7 MICROSERVICIOS DE ÉCHELE CAMELLO
 * Cada microservicio implementa la Arquitectura por Capas (Controller -> Service -> Repository -> DB)
 * y cumple la regla clave: "Cada microservicio solo modifica las entidades de su propio dominio."
 */

export interface MicroserviceDescriptor {
  id: MicroserviceId;
  numero: number;
  nombre: string;
  responsabilidad: string;
  entidades: string[];
  rfPrincipales: string;
  patrones: DesignPatternType[];
  operacionesPrincipales: string[];
  colorHex: string;
}

export const MICROSERVICES_CATALOG: MicroserviceDescriptor[] = [
  {
    id: 'ms-usuarios',
    numero: 1,
    nombre: 'Usuarios e Identidad',
    responsabilidad: 'Gestionar la identidad de las personas, roles, acceso y sesiones.',
    entidades: ['Usuario', 'Rol', 'Sesión'],
    rfPrincipales: 'RF-01 a RF-08, RF-052, RF-054, RF-059, RF-061',
    patrones: ['Layered Architecture', 'Dependency Injection', 'Repository', 'DTO', 'Adapter'],
    operacionesPrincipales: [
      'Registro y verificación de usuario',
      'Inicio/cierre de sesión',
      'Recuperación de contraseña',
      'Gestión de roles y permisos (Switch Cliente / Trabajador / Admin)',
      'Bloqueo/suspensión de cuentas'
    ],
    colorHex: '#0284c7'
  },
  {
    id: 'ms-perfiles',
    numero: 2,
    nombre: 'Perfiles de Trabajadores',
    responsabilidad: 'Administrar la información profesional del trabajador.',
    entidades: ['PerfilProfesional', 'Disponibilidad', 'Ubicación'],
    rfPrincipales: 'RF-09 a RF-017',
    patrones: ['Layered Architecture', 'Dependency Injection', 'Repository', 'DTO', 'Adapter'],
    operacionesPrincipales: [
      'Crear/editar perfil',
      'Registrar profesión, experiencia, habilidades y certificaciones',
      'Gestionar disponibilidad y ubicación',
      'Consultar perfil público'
    ],
    colorHex: '#16a34a'
  },
  {
    id: 'ms-servicios',
    numero: 3,
    nombre: 'Servicios y Categorías',
    responsabilidad: 'Gestionar el catálogo de servicios y sus categorías.',
    entidades: ['Servicio', 'Categoría'],
    rfPrincipales: 'RF-018 a RF-023, RF-053, RF-057',
    patrones: ['Layered Architecture', 'Dependency Injection', 'Repository', 'DTO', 'State'],
    operacionesPrincipales: [
      'Publicar/editar servicio',
      'Gestionar precios y categorías',
      'Activar/desactivar o suspender (Patrón State)',
      'Consultar categorías'
    ],
    colorHex: '#ea580c'
  },
  {
    id: 'ms-busqueda',
    numero: 4,
    nombre: 'Búsqueda y Geolocalización',
    responsabilidad: 'Consultar y filtrar información para mostrar resultados relevantes.',
    entidades: ['(Sin entidad propia, consume ms-perfiles y ms-servicios)'],
    rfPrincipales: 'RF-024 a RF-032',
    patrones: ['Layered Architecture', 'Dependency Injection', 'Strategy', 'Adapter', 'DTO'],
    operacionesPrincipales: [
      'Buscar trabajadores/servicios',
      'Filtrar por categoría, ubicación, disponibilidad, calificación',
      'Ordenar por cercanía (Haversine Strategy)',
      'Integración con mapas y geolocalización'
    ],
    colorHex: '#7c3aed'
  },
  {
    id: 'ms-solicitudes',
    numero: 5,
    nombre: 'Solicitudes y Agendamiento',
    responsabilidad: 'Gestionar la solicitud de servicios y su programación.',
    entidades: ['SolicitudServicio', 'Programación'],
    rfPrincipales: 'RF-033 a RF-040',
    patrones: ['Layered Architecture', 'Dependency Injection', 'State', 'Observer', 'Repository', 'DTO'],
    operacionesPrincipales: [
      'Crear y gestionar solicitudes',
      'Aceptar/rechazar/cancelar',
      'Programar y reprogramar',
      'Validar disponibilidad',
      'Cambiar estados y finalizar (Patrón State + Observer)'
    ],
    colorHex: '#dc2626'
  },
  {
    id: 'ms-comunicacion',
    numero: 6,
    nombre: 'Comunicación y Notificaciones',
    responsabilidad: 'Permitir la comunicación entre usuarios y gestionar notificaciones.',
    entidades: ['Conversación', 'Mensaje', 'Notificación'],
    rfPrincipales: 'RF-041 a RF-046',
    patrones: ['Layered Architecture', 'Dependency Injection', 'Observer', 'Adapter', 'Repository', 'DTO'],
    operacionesPrincipales: [
      'Enviar/leer mensajes',
      'Gestionar conversaciones',
      'Crear y marcar notificaciones',
      'Notificar eventos (solicitudes, reprogramaciones, etc.)'
    ],
    colorHex: '#0d9488'
  },
  {
    id: 'ms-reputacion',
    numero: 7,
    nombre: 'Reputación y Moderación',
    responsabilidad: 'Gestionar calificaciones, reseñas y reportes. Moderar contenido.',
    entidades: ['Calificación', 'Reseña', 'Reporte'],
    rfPrincipales: 'RF-047 a RF-051, RF-055',
    patrones: ['Layered Architecture', 'Dependency Injection', 'State', 'Repository', 'DTO', 'Observer'],
    operacionesPrincipales: [
      'Calificar y reseñar',
      'Consultar calificaciones',
      'Reportar usuario/servicio',
      'Gestionar reportes (Patrón State)',
      'Aplicar acciones de moderación'
    ],
    colorHex: '#9333ea'
  }
];

// ============================================================================
// 1. MICROSERVICIO: ms-usuarios (Usuarios e Identidad)
// ============================================================================
export class UsuariosService {
  private readonly dtoMapper = new UsuarioDTOMapper();

  constructor(
    private readonly userRepository: BaseDomainRepository<User>,
    private readonly emailAdapter: IEmailAdapter,
    private readonly eventBus: DomainEventBus
  ) {}

  public switchActiveRole(currentUser: User, targetRole: UserRole, predefinedUsers: Record<string, User>): {
    user: User;
    dto: UsuarioPublicDTO;
    sessionToken: string;
  } {
    const baseAccount =
      targetRole === 'admin'
        ? predefinedUsers.admin1
        : targetRole === 'trabajador'
        ? predefinedUsers.trabajador1
        : predefinedUsers.cliente1;

    const updatedUser: User = {
      ...baseAccount,
      currentRole: targetRole,
      roles: Array.from(new Set([...(baseAccount.roles || []), targetRole]))
    };

    this.userRepository.save(updatedUser, 'ms-usuarios');

    this.eventBus.publish({
      type: 'ROL_CAMBIADO_SWITCH',
      sourceMicroservice: 'ms-usuarios',
      targetMicroservices: ['api-gateway', 'seguridad-transversal'],
      payload: {
        userId: updatedUser.id,
        nuevoRol: targetRole,
        usuarioNombre: `${updatedUser.nombre} ${updatedUser.apellido || ''}`.trim()
      },
      actorName: updatedUser.nombre,
      actorRole: targetRole,
      notification: {
        titulo: `Sesión cambiada a rol: ${targetRole.toUpperCase()}`,
        mensaje: `[ms-usuarios] Identidad activa: ${updatedUser.nombre} (${updatedUser.correo})`,
        destinatarioRol: targetRole,
        canal: 'IN_APP'
      }
    });

    return {
      user: updatedUser,
      dto: this.dtoMapper.toDTO(updatedUser),
      sessionToken: `jwt-${targetRole}-${Date.now()}`
    };
  }

  public requestEmailVerification(user: User): { sent: boolean; messageId: string } {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const result = this.emailAdapter.sendVerificationEmail(user.correo, user.nombre, otp);
    return { sent: result.sent, messageId: result.messageId };
  }
}

// ============================================================================
// 2. MICROSERVICIO: ms-perfiles (Perfiles de Trabajadores)
// ============================================================================
export class PerfilesService {
  private readonly dtoMapper = new PerfilProfesionalDTOMapper();

  constructor(
    private readonly workerRepository: BaseDomainRepository<WorkerProfile>,
    private readonly fileAdapter: IFileStorageAdapter,
    private readonly eventBus: DomainEventBus
  ) {}

  public getAllWorkers(): WorkerProfile[] {
    return this.workerRepository.findAll();
  }

  public getPublicProfileDTO(workerId: string): PerfilProfesionalPublicDTO | undefined {
    const worker = this.workerRepository.findById(workerId);
    return worker ? this.dtoMapper.toDTO(worker) : undefined;
  }

  public registerOrUpdateWorker(worker: WorkerProfile): WorkerProfile {
    if (worker.documentoIdentidadUrl) {
      const uploaded = this.fileAdapter.uploadProfileDocument(worker.id, 'cedula_frente', worker.documentoIdentidadUrl);
      worker.documentoIdentidadUrl = uploaded.secureUrl;
    }
    return this.workerRepository.save(worker, 'ms-perfiles');
  }

  public verifyWorkerIdentity(workerId: string, approved: boolean, motivo?: string): WorkerProfile | undefined {
    const updated = this.workerRepository.update(
      workerId,
      {
        verificado: approved,
        estadoVerificacion: approved ? 'aprobado' : 'rechazado'
      },
      'ms-perfiles'
    );

    if (updated) {
      this.eventBus.publish({
        type: 'IDENTIDAD_VERIFICADA',
        sourceMicroservice: 'ms-perfiles',
        targetMicroservices: ['ms-comunicacion', 'ms-busqueda'],
        payload: {
          workerId: updated.id,
          nombre: updated.nombre,
          estado: updated.estadoVerificacion,
          motivo: motivo || 'Cédula y biometría aprobadas por Admin'
        },
        actorName: 'Admin Auditor',
        actorRole: 'admin',
        notification: {
          titulo: approved ? 'Perfil Profesional Verificado' : 'Verificación Rechazada',
          mensaje: `El perfil de ${updated.nombre} fue marcado como ${updated.estadoVerificacion.toUpperCase()}.`,
          destinatarioRol: 'trabajador',
          canal: 'EMAIL'
        }
      });
    }

    return updated;
  }
}

// ============================================================================
// 3. MICROSERVICIO: ms-servicios (Servicios y Categorías)
// ============================================================================
export class ServiciosService {
  private serviceStates: Map<string, ServicioStatus> = new Map();

  constructor(
    private readonly categoryRepository: BaseDomainRepository<WorkerCategory>,
    private readonly announcementRepository: BaseDomainRepository<WorkerAnnouncement>,
    private readonly eventBus: DomainEventBus
  ) {}

  public getCategories(): WorkerCategory[] {
    return this.categoryRepository.findAll();
  }

  public publishAnnouncement(announcement: WorkerAnnouncement, actorRole: UserRole): WorkerAnnouncement {
    const saved = this.announcementRepository.save(announcement, 'ms-servicios');
    this.serviceStates.set(saved.id, 'ACTIVO');

    this.eventBus.publish({
      type: 'SERVICIO_CAMBIO_ESTADO',
      sourceMicroservice: 'ms-servicios',
      targetMicroservices: ['ms-busqueda', 'ms-comunicacion'],
      payload: {
        servicioId: saved.id,
        titulo: saved.titulo,
        estadoNuevo: 'ACTIVO'
      },
      actorName: announcement.trabajadorNombre,
      actorRole
    });

    return saved;
  }

  public changeServiceState(
    serviceId: string,
    targetState: ServicioStatus,
    actorName: string,
    actorRole: UserRole
  ): { valid: boolean; nextStatus: ServicioStatus; message: string } {
    const current = this.serviceStates.get(serviceId) || 'ACTIVO';
    const result = ServicioStateMachine.transition(current, targetState);

    if (result.valid) {
      this.serviceStates.set(serviceId, result.nextStatus);
      this.eventBus.publish({
        type: 'SERVICIO_CAMBIO_ESTADO',
        sourceMicroservice: 'ms-servicios',
        targetMicroservices: ['ms-busqueda', 'ms-comunicacion'],
        payload: {
          servicioId: serviceId,
          estadoAnterior: current,
          estadoNuevo: result.nextStatus
        },
        actorName,
        actorRole
      });
    }

    return result;
  }
}

// ============================================================================
// 4. MICROSERVICIO: ms-busqueda (Búsqueda y Geolocalización)
// ============================================================================
export class BusquedaService {
  private readonly strategyContext: SearchStrategyContext;

  constructor(private readonly geoAdapter: IGeoLocationAdapter) {
    this.strategyContext = new SearchStrategyContext(this.geoAdapter);
  }

  public searchWorkers(
    workers: WorkerProfile[],
    criteria: BusquedaCriteriaDTO
  ): ResultadoBusquedaWorkerDTO[] {
    return this.strategyContext.executeSearch(workers, criteria);
  }

  public getAvailableStrategies() {
    return this.strategyContext.getAvailableStrategies();
  }
}

// ============================================================================
// 5. MICROSERVICIO: ms-solicitudes (Solicitudes y Agendamiento)
// ============================================================================
export class SolicitudesService {
  constructor(
    private readonly contractRepository: BaseDomainRepository<Contract>,
    private readonly eventBus: DomainEventBus
  ) {}

  public createContractFromOffer(contract: Contract, actorRole: UserRole): Contract {
    const saved = this.contractRepository.save(contract, 'ms-solicitudes');

    this.eventBus.publish({
      type: 'SOLICITUD_CREADA',
      sourceMicroservice: 'ms-solicitudes',
      targetMicroservices: ['ms-comunicacion', 'seguridad-transversal'],
      payload: {
        contratoId: saved.id,
        codigoRadicado: saved.codigoRadicado,
        montoBrutoCOP: saved.montoBrutoCOP,
        estado: saved.estado
      },
      actorName: saved.clienteNombre,
      actorRole,
      notification: {
        titulo: `Nueva Solicitud ${saved.codigoRadicado}`,
        mensaje: `Solicitud creada con ${saved.trabajadorNombre} por $${saved.montoBrutoCOP.toLocaleString('es-CO')} COP.`,
        destinatarioRol: 'trabajador',
        canal: 'PUSH'
      }
    });

    return saved;
  }

  public transitionContractState(
    contract: Contract,
    nextStatus: ContractStatus,
    actorName: string,
    actorRole: UserRole,
    note?: string
  ): { updatedContract: Contract; valid: boolean; reason: string } {
    const result = SolicitudStateMachine.applyTransition(contract, nextStatus, actorName, note);

    if (result.valid) {
      this.contractRepository.save(result.updatedContract, 'ms-solicitudes');

      this.eventBus.publish({
        type: nextStatus === 'pagado_escrow' ? 'SOLICITUD_PAGADA_ESCROW' : 'SOLICITUD_CAMBIO_ESTADO',
        sourceMicroservice: 'ms-solicitudes',
        targetMicroservices: ['ms-comunicacion', 'ms-reputacion', 'seguridad-transversal'],
        payload: {
          contratoId: contract.id,
          codigoRadicado: contract.codigoRadicado,
          estadoAnterior: contract.estado,
          estadoNuevo: nextStatus,
          montoCOP: contract.montoBrutoCOP
        },
        actorName,
        actorRole,
        notification: {
          titulo: `Contrato ${contract.codigoRadicado}: ${nextStatus.toUpperCase()}`,
          mensaje: note || `La solicitud cambió de estado a ${nextStatus.replace('_', ' ')}.`,
          destinatarioRol: 'todos',
          canal: 'PUSH'
        }
      });
    }

    return result;
  }
}

// ============================================================================
// 6. MICROSERVICIO: ms-comunicacion (Comunicación y Notificaciones)
// ============================================================================
export class ComunicacionService {
  constructor(
    private readonly notificationAdapter: INotificationChannelAdapter,
    private readonly eventBus: DomainEventBus
  ) {}

  public registerSentMessage(message: ChatMessage, workerName: string, actorRole: UserRole): void {
    this.notificationAdapter.dispatchNotification(
      'PUSH',
      workerName,
      `Nuevo mensaje de ${message.remitenteNombre}`,
      message.texto
    );

    this.eventBus.publish({
      type: 'MENSAJE_ENVIADO',
      sourceMicroservice: 'ms-comunicacion',
      targetMicroservices: ['ms-solicitudes'],
      payload: {
        mensajeId: message.id,
        conversacionId: message.conversacionId,
        tipo: message.tipo,
        tieneOfertaFormal: Boolean(message.oferta)
      },
      actorName: message.remitenteNombre,
      actorRole
    });
  }
}

// ============================================================================
// 7. MICROSERVICIO: ms-reputacion (Reputación y Moderación)
// ============================================================================
export class ReputacionService {
  constructor(
    private readonly reviewRepository: BaseDomainRepository<Review>,
    private readonly disputeRepository: BaseDomainRepository<Dispute>,
    private readonly eventBus: DomainEventBus
  ) {}

  public registerReview(review: Review): Review {
    const saved = this.reviewRepository.save(review, 'ms-reputacion');

    this.eventBus.publish({
      type: 'CALIFICACION_REGISTRADA',
      sourceMicroservice: 'ms-reputacion',
      targetMicroservices: ['ms-perfiles', 'ms-comunicacion', 'ms-busqueda'],
      payload: {
        reviewId: saved.id,
        destinatarioId: saved.destinatarioId,
        puntuacion: saved.puntuacion
      },
      actorName: saved.autorNombre,
      actorRole: saved.autorRol,
      notification: {
        titulo: `Nueva Calificación ${saved.puntuacion}★ Recibida`,
        mensaje: `${saved.autorNombre} dejó una reseña verificada en ms-reputacion.`,
        destinatarioRol: 'trabajador',
        canal: 'IN_APP'
      }
    });

    return saved;
  }

  public createReporteDisputa(dispute: Dispute): Dispute {
    const saved = this.disputeRepository.save(dispute, 'ms-reputacion');

    this.eventBus.publish({
      type: 'REPORTE_CREADO',
      sourceMicroservice: 'ms-reputacion',
      targetMicroservices: ['ms-solicitudes', 'ms-comunicacion', 'administracion-transversal'],
      payload: {
        reporteId: saved.id,
        contratoId: saved.contratoId,
        motivo: saved.motivo,
        estadoInicial: saved.estado
      },
      actorName: saved.iniciadaPorNombre,
      actorRole: saved.iniciadaPorRol,
      notification: {
        titulo: `Reporte / Disputa Abierta (#${saved.id})`,
        mensaje: `Motivo: ${saved.motivo}. Fondos en custodia congelados preventivamente.`,
        destinatarioRol: 'admin',
        canal: 'EMAIL'
      }
    });

    return saved;
  }

  public moderateReporte(
    dispute: Dispute,
    decision: 'liberar' | 'reembolsar' | 'dividir',
    dictamenAdmin: string
  ): { updatedDispute: Dispute; resultingContractStatus: ContractStatus } {
    const resolved = ReporteStateMachine.resolveReporte(dispute, decision, dictamenAdmin);
    this.disputeRepository.save(resolved.updatedDispute, 'ms-reputacion');

    this.eventBus.publish({
      type: 'REPORTE_MODERADO',
      sourceMicroservice: 'ms-reputacion',
      targetMicroservices: ['ms-solicitudes', 'ms-comunicacion', 'seguridad-transversal'],
      payload: {
        reporteId: dispute.id,
        contratoId: dispute.contratoId,
        decision,
        nuevoEstadoReporte: resolved.updatedDispute.estado,
        dictamen: dictamenAdmin
      },
      actorName: 'Admin Moderador',
      actorRole: 'admin',
      notification: {
        titulo: `Resolución de Moderación (#${dispute.id})`,
        mensaje: `Dictamen Admin: ${decision.toUpperCase()} — ${dictamenAdmin}`,
        destinatarioRol: 'todos',
        canal: 'EMAIL'
      }
    });

    return resolved;
  }
}
