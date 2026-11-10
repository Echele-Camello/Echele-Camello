import { MicroserviceId, UserRole, AuditLogEntry } from '../../../types';
import { NotificacionEventoDTO } from '../dto/DTOMapper';

/**
 * PATRÓN: Observer / Publish-Subscribe
 * Permite la comunicación desacoplada por eventos entre microservicios:
 * - ms-solicitudes (emite cambios de estado, creación de solicitudes, reprogramaciones)
 * - ms-reputacion (emite nuevas calificaciones, reseñas y resoluciones de moderación)
 * - ms-usuarios (emite cambios de rol, inicios de sesión y verificaciones)
 * - ms-servicios (emite activación/suspensión de servicios)
 * Suscriptores principales:
 * - ms-comunicacion (genera notificaciones automáticas para los usuarios)
 * - seguridad-transversal / Liquibase Audit (registra trazabilidad forense inmutable)
 */

export type DomainEventType =
  | 'SOLICITUD_CREADA'
  | 'SOLICITUD_PAGADA_ESCROW'
  | 'SOLICITUD_CAMBIO_ESTADO'
  | 'SOLICITUD_REPROGRAMADA'
  | 'SERVICIO_CAMBIO_ESTADO'
  | 'MENSAJE_ENVIADO'
  | 'CALIFICACION_REGISTRADA'
  | 'REPORTE_CREADO'
  | 'REPORTE_MODERADO'
  | 'ROL_CAMBIADO_SWITCH'
  | 'IDENTIDAD_VERIFICADA'
  | 'LIQUIBASE_MIGRACION_EJECUTADA';

export interface DomainEvent<TPayload = Record<string, unknown>> {
  id: string;
  type: DomainEventType;
  sourceMicroservice: MicroserviceId;
  targetMicroservices: MicroserviceId[];
  payload: TPayload;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
}

export type DomainEventSubscriber = (event: DomainEvent) => void;

export class DomainEventBus {
  private subscribers: Map<DomainEventType | '*', DomainEventSubscriber[]> = new Map();
  private eventHistory: DomainEvent[] = [];
  private liveNotifications: NotificacionEventoDTO[] = [];
  private liveAuditLogs: AuditLogEntry[] = [];

  constructor() {
    // Suscriptor automático de Auditoría Transversal
    this.subscribe('*', (event) => {
      const severity =
        event.type === 'REPORTE_CREADO'
          ? 'WARN'
          : event.type === 'REPORTE_MODERADO'
          ? 'INFO'
          : 'INFO';

      const newLog: AuditLogEntry = {
        id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        accion: event.type,
        usuario: `${event.actorName} (${event.actorRole.toUpperCase()})`,
        timestamp: event.timestamp,
        esquema: event.sourceMicroservice,
        detalles: JSON.stringify(event.payload),
        severidad: severity,
        patronAplicado: 'Observer',
        created_at: event.timestamp
      };
      this.liveAuditLogs.unshift(newLog);
    });
  }

  public subscribe(eventType: DomainEventType | '*', callback: DomainEventSubscriber): () => void {
    const existing = this.subscribers.get(eventType) || [];
    this.subscribers.set(eventType, [...existing, callback]);

    return () => {
      const current = this.subscribers.get(eventType) || [];
      this.subscribers.set(
        eventType,
        current.filter((cb) => cb !== callback)
      );
    };
  }

  public publish<TPayload = Record<string, unknown>>(params: {
    type: DomainEventType;
    sourceMicroservice: MicroserviceId;
    targetMicroservices: MicroserviceId[];
    payload: TPayload;
    actorName: string;
    actorRole: UserRole;
    notification?: {
      titulo: string;
      mensaje: string;
      destinatarioRol?: UserRole | 'todos';
      canal?: 'PUSH' | 'EMAIL' | 'IN_APP';
    };
  }): DomainEvent<TPayload> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const event: DomainEvent<TPayload> = {
      id: `evt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: params.type,
      sourceMicroservice: params.sourceMicroservice,
      targetMicroservices: params.targetMicroservices,
      payload: params.payload,
      actorName: params.actorName,
      actorRole: params.actorRole,
      timestamp: now
    };

    this.eventHistory.unshift(event as DomainEvent);

    if (params.notification) {
      const notif: NotificacionEventoDTO = {
        id: `notif-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        destinatarioRol: params.notification.destinatarioRol || 'todos',
        titulo: params.notification.titulo,
        mensaje: params.notification.mensaje,
        microservicioOrigen: params.sourceMicroservice,
        eventoTipo: params.type,
        canalAdaptador: params.notification.canal || 'IN_APP',
        timestamp: now,
        leida: false
      };
      this.liveNotifications.unshift(notif);
    }

    const specificListeners = this.subscribers.get(params.type) || [];
    const wildcardListeners = this.subscribers.get('*') || [];

    [...specificListeners, ...wildcardListeners].forEach((listener) => {
      listener(event as DomainEvent);
    });

    return event;
  }

  public getEventHistory(): DomainEvent[] {
    return [...this.eventHistory];
  }

  public getLiveNotifications(): NotificacionEventoDTO[] {
    return [...this.liveNotifications];
  }

  public getLiveAuditLogs(): AuditLogEntry[] {
    return [...this.liveAuditLogs];
  }

  public markNotificationAsRead(id: string): void {
    this.liveNotifications = this.liveNotifications.map((n) =>
      n.id === id ? { ...n, leida: true } : n
    );
  }
}

