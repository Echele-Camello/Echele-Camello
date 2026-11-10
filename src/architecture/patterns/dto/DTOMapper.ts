import {
  User,
  UserRole,
  WorkerProfile,
  WorkerCategory,
  Contract,
  ChatMessage,
  Review,
  Dispute,
  WorkerAnnouncement,
  ServicioStatus
} from '../../../types';

/**
 * PATRÓN GLOBAL: DTO (Data Transfer Object)
 * Evita exponer las entidades de dominio directamente, ocultando campos sensibles
 * (hashes de contraseña, tokens internos, datos privados según Ley 1581) y estructurando
 * contratos de entrada/salida entre el API Gateway y los 7 microservicios.
 */

export interface IDTOMapper<Entity, DTO> {
  toDTO(entity: Entity): DTO;
  toDTOList(entities: Entity[]): DTO[];
}

// 1. ms-usuarios DTOs
export interface UsuarioPublicDTO {
  id: string;
  nombreCompleto: string;
  apodo: string;
  correoEnmascarado: string;
  ciudad: string;
  barrio: string;
  avatarUrl: string;
  roles: UserRole[];
  rolActivo: UserRole;
  verificado: boolean;
}

export class UsuarioDTOMapper implements IDTOMapper<User, UsuarioPublicDTO> {
  public toDTO(user: User): UsuarioPublicDTO {
    const [localPart, domain] = (user.correo || 'usuario@echelecamello.co').split('@');
    const maskedEmail = user.privacidadOcultarDatos
      ? `${localPart.slice(0, 3)}***@${domain || 'co'}`
      : user.correo;

    return {
      id: user.id,
      nombreCompleto: `${user.nombre} ${user.apellido || ''}`.trim(),
      apodo: user.apodo,
      correoEnmascarado: maskedEmail,
      ciudad: user.ciudad,
      barrio: user.barrio,
      avatarUrl: user.avatarUrl,
      roles: [...user.roles],
      rolActivo: user.currentRole,
      verificado: Boolean(user.correoVerificado || user.terminosAceptados)
    };
  }

  public toDTOList(entities: User[]): UsuarioPublicDTO[] {
    return entities.map((e) => this.toDTO(e));
  }
}

// 2. ms-perfiles DTOs
export interface PerfilProfesionalPublicDTO {
  id: string;
  userId: string;
  nombre: string;
  avatarUrl: string;
  categoriaId: string;
  categoriaNombre: string;
  especialidades: string[];
  descripcion: string;
  ubicacion: {
    ciudad: string;
    barrio: string;
    radioKm: number;
    distanciaCalculadaKm?: number;
  };
  disponibilidad: {
    disponibleAhora: boolean;
    horarioAtencion: string;
  };
  tarifaPorHoraCOP: number;
  verificado: boolean;
  estadoVerificacion: 'aprobado' | 'pendiente' | 'rechazado';
  calificacionPromedio: number;
  serviciosCompletados: number;
  resenasCount: number;
}

export class PerfilProfesionalDTOMapper implements IDTOMapper<WorkerProfile, PerfilProfesionalPublicDTO> {
  public toDTO(worker: WorkerProfile, distanciaCalculadaKm?: number): PerfilProfesionalPublicDTO {
    // No expone número de documento ni cuenta bancaria de desembolso en el perfil público
    return {
      id: worker.id,
      userId: worker.userId,
      nombre: worker.nombre,
      avatarUrl: worker.avatarUrl,
      categoriaId: worker.categoriaId,
      categoriaNombre: worker.categoriaNombre,
      especialidades: [...worker.especialidades],
      descripcion: worker.descripcion,
      ubicacion: {
        ciudad: worker.ciudad,
        barrio: worker.barrio,
        radioKm: worker.radioKm,
        distanciaCalculadaKm
      },
      disponibilidad: {
        disponibleAhora: worker.disponible,
        horarioAtencion: worker.horarioAtencion
      },
      tarifaPorHoraCOP: worker.tarifaPorHora,
      verificado: worker.verificado,
      estadoVerificacion: worker.estadoVerificacion,
      calificacionPromedio: worker.calificacionPromedio,
      serviciosCompletados: worker.serviciosCompletados,
      resenasCount: worker.reseñasCount
    };
  }

  public toDTOList(entities: WorkerProfile[]): PerfilProfesionalPublicDTO[] {
    return entities.map((e) => this.toDTO(e));
  }
}

// 3. ms-servicios DTOs
export interface ServicioCatalogoDTO {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  categoriaId: string;
  categoriaNombre: string;
  titulo: string;
  descripcion: string;
  precioCOP: number;
  modalidadPrecio: string;
  estadoServicio: ServicioStatus;
  ciudad: string;
}

// 4. ms-busqueda DTOs
export interface BusquedaCriteriaDTO {
  termino?: string;
  categoriaId?: string;
  ciudad?: string;
  soloDisponibles?: boolean;
  soloVerificados?: boolean;
  horario?: string;
  precioMinCOP?: number;
  precioMaxCOP?: number;
  calificacionMinima?: number;
  estrategiaOrdenamiento: 'relevancia' | 'cercania' | 'calificacion' | 'precio_menor' | 'precio_mayor' | 'experiencia';
  coordenadasCliente?: { lat: number; lng: number; ciudad?: string };
}

export interface ResultadoBusquedaWorkerDTO {
  worker: WorkerProfile;
  distanciaKm: number;
  puntajeRelevancia: number;
  dentroDeRadioCobertura: boolean;
}

// 5. ms-solicitudes DTOs
export interface SolicitudServicioDTO {
  id: string;
  codigoRadicado: string;
  clienteNombre: string;
  trabajadorNombre: string;
  categoriaNombre: string;
  descripcionServicio: string;
  resumenFinanciero: {
    montoBrutoCOP: number;
    comisionPlataformaCOP: number;
    montoNetoTrabajadorCOP: number;
  };
  estadoActual: Contract['estado'];
  transicionesPermitidas: Contract['estado'][];
  fechaCreacion: string;
}

// 6. ms-comunicacion DTOs
export interface NotificacionEventoDTO {
  id: string;
  destinatarioRol: UserRole | 'todos';
  titulo: string;
  mensaje: string;
  microservicioOrigen: string;
  eventoTipo: string;
  canalAdaptador: 'PUSH' | 'EMAIL' | 'IN_APP';
  timestamp: string;
  leida: boolean;
}

// 7. ms-reputacion DTOs
export interface ResumenReputacionDTO {
  trabajadorId: string;
  calificacionPromedio: number;
  totalResenas: number;
  reportesActivos: number;
  insigniaConfiabilidad: 'ORO_VERIFICADO' | 'ESTANDAR' | 'EN_OBSERVACION';
}

