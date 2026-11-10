import { Contract, ContractStatus, Dispute, ServicioStatus } from '../../../types';

/**
 * PATRÓN: State (Máquinas de Estados de Dominio)
 * Implementado en los 3 microservicios indicados en la arquitectura de Échele Camello:
 * 1. ms-servicios: Estado del Servicio (ACTIVO, INACTIVO, SUSPENDIDO, BORRADOR)
 * 2. ms-solicitudes: Estado de SolicitudServicio / Contrato Escrow
 * 3. ms-reputacion: Estado de Reporte / Disputa en Moderación
 */

// ============================================================================
// 1. STATE PATTERN PARA ms-servicios (Entidad: Servicio)
// ============================================================================
export interface IServicioStateHandler {
  readonly status: ServicioStatus;
  readonly allowedTransitions: ServicioStatus[];
  canTransitionTo(nextStatus: ServicioStatus): boolean;
  getStatusDescription(): string;
}

const SERVICIO_STATE_MAP: Record<ServicioStatus, IServicioStateHandler> = {
  BORRADOR: {
    status: 'BORRADOR',
    allowedTransitions: ['ACTIVO', 'INACTIVO'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    },
    getStatusDescription: () => 'Servicio en edición preliminar, aún no visible en el catálogo público.'
  },
  ACTIVO: {
    status: 'ACTIVO',
    allowedTransitions: ['INACTIVO', 'SUSPENDIDO'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    },
    getStatusDescription: () => 'Servicio publicado y visible en búsquedas para contratación inmediata.'
  },
  INACTIVO: {
    status: 'INACTIVO',
    allowedTransitions: ['ACTIVO', 'SUSPENDIDO'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    },
    getStatusDescription: () => 'Servicio pausado temporalmente por el trabajador.'
  },
  SUSPENDIDO: {
    status: 'SUSPENDIDO',
    allowedTransitions: ['ACTIVO'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    },
    getStatusDescription: () => 'Servicio suspendido por moderación administrativa (RF-053 / RF-057).'
  }
};

export class ServicioStateMachine {
  public static getHandler(status: ServicioStatus): IServicioStateHandler {
    return SERVICIO_STATE_MAP[status] || SERVICIO_STATE_MAP.ACTIVO;
  }

  public static transition(
    currentStatus: ServicioStatus,
    targetStatus: ServicioStatus
  ): { valid: boolean; nextStatus: ServicioStatus; message: string } {
    const handler = this.getHandler(currentStatus);
    if (!handler.canTransitionTo(targetStatus)) {
      return {
        valid: false,
        nextStatus: currentStatus,
        message: `[Patrón State - ms-servicios] Transición inválida de ${currentStatus} a ${targetStatus}. Permitidas: ${handler.allowedTransitions.join(', ')}`
      };
    }
    return {
      valid: true,
      nextStatus: targetStatus,
      message: `Servicio pasó de ${currentStatus} a ${targetStatus} correctamente.`
    };
  }
}

// ============================================================================
// 2. STATE PATTERN PARA ms-solicitudes (Entidad: SolicitudServicio / Contract)
// ============================================================================
export interface ISolicitudStateHandler {
  readonly status: ContractStatus;
  readonly label: string;
  readonly progressPercent: number;
  readonly allowedTransitions: ContractStatus[];
  canTransitionTo(next: ContractStatus): boolean;
}

const SOLICITUD_STATE_MAP: Record<ContractStatus, ISolicitudStateHandler> = {
  oferta_enviada: {
    status: 'oferta_enviada',
    label: 'Oferta Enviada',
    progressPercent: 20,
    allowedTransitions: ['pendiente_pago', 'cancelado'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    }
  },
  pendiente_pago: {
    status: 'pendiente_pago',
    label: 'Pendiente Depósito Escrow',
    progressPercent: 40,
    allowedTransitions: ['pagado_escrow', 'cancelado'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    }
  },
  pagado_escrow: {
    status: 'pagado_escrow',
    label: 'Fondos en Custodia Escrow',
    progressPercent: 60,
    allowedTransitions: ['en_curso', 'en_disputa', 'cancelado'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    }
  },
  en_curso: {
    status: 'en_curso',
    label: 'Servicio en Ejecución',
    progressPercent: 75,
    allowedTransitions: ['terminado', 'en_disputa'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    }
  },
  terminado: {
    status: 'terminado',
    label: 'Terminado (Esperando Visto Bueno)',
    progressPercent: 90,
    allowedTransitions: ['completado', 'en_disputa'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    }
  },
  completado: {
    status: 'completado',
    label: 'Completado y Desembolsado',
    progressPercent: 100,
    allowedTransitions: [],
    canTransitionTo() {
      return false;
    }
  },
  en_disputa: {
    status: 'en_disputa',
    label: 'En Disputa / Mediación',
    progressPercent: 50,
    allowedTransitions: ['completado', 'cancelado'],
    canTransitionTo(next) {
      return this.allowedTransitions.includes(next);
    }
  },
  cancelado: {
    status: 'cancelado',
    label: 'Cancelado / Reembolsado',
    progressPercent: 0,
    allowedTransitions: [],
    canTransitionTo() {
      return false;
    }
  }
};

export class SolicitudStateMachine {
  public static getHandler(status: ContractStatus): ISolicitudStateHandler {
    return SOLICITUD_STATE_MAP[status] || SOLICITUD_STATE_MAP.oferta_enviada;
  }

  public static applyTransition(
    contract: Contract,
    nextStatus: ContractStatus,
    actorName: string,
    note?: string
  ): { updatedContract: Contract; valid: boolean; reason: string } {
    const handler = this.getHandler(contract.estado);
    if (!handler.canTransitionTo(nextStatus)) {
      return {
        updatedContract: contract,
        valid: false,
        reason: `[Patrón State - ms-solicitudes] Transición no permitida desde "${contract.estado}" hacia "${nextStatus}". Transiciones válidas: [${handler.allowedTransitions.join(', ')}].`
      };
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updatedContract: Contract = {
      ...contract,
      estado: nextStatus,
      ...(nextStatus === 'pagado_escrow' ? { fechaPagoEscrow: now } : {}),
      ...(nextStatus === 'en_curso' ? { fechaInicioServicio: now } : {}),
      ...(nextStatus === 'terminado' ? { fechaTerminado: now } : {}),
      ...(nextStatus === 'completado' ? { fechaCompletado: now } : {}),
      historialEstados: [
        ...contract.historialEstados,
        {
          estado: nextStatus,
          fecha: now,
          autor: actorName,
          nota: note || `[State Machine] Cambio de estado verificado: ${contract.estado} -> ${nextStatus}`
        }
      ]
    };

    return {
      updatedContract,
      valid: true,
      reason: `Estado de solicitud ${contract.codigoRadicado} actualizado a "${nextStatus}".`
    };
  }
}

// ============================================================================
// 3. STATE PATTERN PARA ms-reputacion (Entidad: Reporte / Dispute)
// ============================================================================
export type ReporteStatus = Dispute['estado'];

const REPORTE_TRANSITIONS: Record<ReporteStatus, ReporteStatus[]> = {
  abierta: ['en_revision', 'resuelta_liberado', 'resuelta_reembolsado', 'resuelta_dividido'],
  en_revision: ['resuelta_liberado', 'resuelta_reembolsado', 'resuelta_dividido'],
  resuelta_liberado: [],
  resuelta_reembolsado: [],
  resuelta_dividido: []
};

export class ReporteStateMachine {
  public static canTransition(current: ReporteStatus, target: ReporteStatus): boolean {
    return (REPORTE_TRANSITIONS[current] || []).includes(target);
  }

  public static resolveReporte(
    dispute: Dispute,
    decision: 'liberar' | 'reembolsar' | 'dividir',
    dictamenAdmin: string
  ): { updatedDispute: Dispute; resultingContractStatus: ContractStatus } {
    const nextState: ReporteStatus =
      decision === 'liberar'
        ? 'resuelta_liberado'
        : decision === 'reembolsar'
        ? 'resuelta_reembolsado'
        : 'resuelta_dividido';

    const updatedDispute: Dispute = {
      ...dispute,
      estado: nextState,
      dictamenAdmin,
      fechaResolucion: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const resultingContractStatus: ContractStatus =
      decision === 'reembolsar' ? 'cancelado' : 'completado';

    return { updatedDispute, resultingContractStatus };
  }
}

