export type UserRole = 'visitante' | 'cliente' | 'trabajador' | 'admin';

export interface PaymentCard {
  id: string;
  marca: 'visa' | 'mastercard';
  ultimos4: string;
  titular: string;
  vencimiento: string;
  predeterminada: boolean;
}

export interface UserServiceItem {
  id: string;
  nombre: string;
  precioCOP: number;
  modalidad: 'hora' | 'visita' | 'servicio';
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  departamento: string;
  municipio: string;
  direccion: string;
  ciudad: string;
  barrio: string;
  lat: number;
  lng: number;
  avatarUrl: string;
  avatarUrlEncriptada?: string;
  correoVerificado?: boolean;
  telefonoVerificado?: boolean;
  roles: UserRole[];
  currentRole: UserRole;
  privacidadOcultarDatos: boolean;
  terminosAceptados: boolean;
  fechaRegistro: string;
  tarjetasGuardadas: PaymentCard[];
  googlePayVinculado: boolean;
  googlePayEmail?: string;
  // Worker specific metrics & services if worker role
  gananciasBrutasCOP?: number;
  gananciasNetasCOP?: number;
  saldoRetirableCOP?: number;
  horasTrabajadas?: number;
  serviciosOfrecidos?: UserServiceItem[];
}

export interface WorkerCategory {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  tarifaBaseMin: number;
  tarifaBaseMax: number;
  unidad: 'hora' | 'visita' | 'servicio';
}

export interface PortfolioItem {
  id: string;
  titulo: string;
  descripcion: string;
  fotoUrl: string;
  fecha: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  nombre: string;
  avatarUrl: string;
  categoriaId: string;
  categoriaNombre: string;
  especialidades: string[];
  descripcion: string;
  ciudad: string;
  barrio: string;
  radioKm: number;
  tarifaPorHora: number;
  verificado: boolean;
  estadoVerificacion: 'aprobado' | 'pendiente' | 'rechazado';
  tipoDocumento?: 'CC' | 'CE' | 'PPT';
  numeroDocumento?: string;
  fechaExpedicionDocumento?: string;
  documentoIdentidadUrl?: string;
  documentoReversoUrl?: string;
  selfieUrl?: string;
  certificadoAntecedentesUrl?: string;
  cuentaBancariaDesembolso?: {
    entidad: string;
    tipo: string;
    numero: string;
    titular: string;
  };
  experienciaAnos?: number;
  disponible: boolean;
  horarioAtencion: string;
  calificacionPromedio: number;
  serviciosCompletados: number;
  portafolio: PortfolioItem[];
  reseñasCount: number;
}

export type ContractStatus = 
  | 'oferta_enviada'
  | 'pendiente_pago'
  | 'pagado_escrow'
  | 'en_curso'
  | 'terminado'
  | 'completado'
  | 'en_disputa'
  | 'cancelado';

export interface FormalOffer {
  id: string;
  contratoId?: string;
  conversacionId: string;
  emisorId: string;
  receptorId: string;
  descripcionServicio: string;
  precioCOP: number;
  fechaHoraPactada: string;
  vigenciaHoras: number;
  version: number;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'contraofertada';
  fechaEnvio: string;
}

export interface Contract {
  id: string;
  codigoRadicado: string; // p. ej. EC-2026-8492
  clienteId: string;
  clienteNombre: string;
  trabajadorId: string;
  trabajadorNombre: string;
  categoriaNombre: string;
  descripcionServicio: string;
  montoBrutoCOP: number;
  comisionPorcentaje: number; // defecto 10%
  comisionCOP: number;
  montoNetoTrabajadorCOP: number;
  estado: ContractStatus;
  metodoPago?: 'nequi' | 'pse' | 'tarjeta' | 'daviplata';
  referenciaPasarela?: string;
  fechaCreacion: string;
  fechaPagoEscrow?: string;
  fechaInicioServicio?: string;
  fechaTerminado?: string;
  fechaCompletado?: string;
  autoConfirmacionLimite?: string; // 72 horas
  disputaId?: string;
  historialEstados: {
    estado: ContractStatus;
    fecha: string;
    autor: string;
    nota?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  conversacionId: string;
  remitenteId: string;
  remitenteNombre: string;
  texto: string;
  tipo: 'texto' | 'oferta' | 'sistema' | 'alerta_seguridad';
  oferta?: FormalOffer;
  timestamp: string;
  entregado: boolean;
  leido: boolean;
}

export interface Review {
  id: string;
  contratoId: string;
  autorId: string;
  autorNombre: string;
  autorRol: 'cliente' | 'trabajador';
  destinatarioId: string;
  puntuacion: number; // 1 to 5
  comentario: string;
  respuesta?: string;
  fecha: string;
}

export interface Dispute {
  id: string;
  contratoId: string;
  iniciadaPorId: string;
  iniciadaPorNombre: string;
  iniciadaPorRol: 'cliente' | 'trabajador';
  motivo: string;
  descripcion: string;
  evidencias: string[];
  estado: 'abierta' | 'en_revision' | 'resuelta_liberado' | 'resuelta_reembolsado' | 'resuelta_dividido';
  dictamenAdmin?: string;
  fechaApertura: string;
  fechaResolucion?: string;
}

export interface NotificationItem {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'pago' | 'oferta' | 'mensaje' | 'estado' | 'disputa';
  leida: boolean;
  fecha: string;
}

export interface AnnouncementComment {
  id: string;
  autorId: string;
  autorNombre: string;
  autorAvatar?: string;
  texto: string;
  fecha: string;
}

export interface WorkerAnnouncement {
  id: string;
  trabajadorId: string;
  trabajadorNombre: string;
  trabajadorAvatar: string;
  trabajadorVerificado: boolean;
  calificacionPromedio: number;
  titulo: string;
  descripcion: string;
  categoriaId: string;
  categoriaNombre: string;
  ciudad: string;
  barrio?: string;
  precioCOP?: number;
  tipoPrecio?: 'hora' | 'fijo' | 'a_convenir';
  disponibleInmediato: boolean;
  horario: string;
  etiqueta?: 'urgencias' | 'descuento' | 'disponible_hoy' | 'obra' | 'promocion';
  tags: string[];
  fechaPublicacion: string;
  likesCount: number;
  comentarios: AnnouncementComment[];
}


export interface LiquibaseChangeset {
  id: string;
  author: string;
  filename: string;
  dateExecuted: string;
  orderExecuted: number;
  execType: 'EXECUTED' | 'FAILED' | 'SKIPPED' | 'RERAN';
  md5sum: string;
  description: string;
  comments: string;
  category: 'schema' | 'seed' | 'security';
  tablesAffected: string[];
  rollbackSql: string;
}

export interface AuditLogEntry {
  id: string;
  accion: string;
  usuario: string;
  timestamp: string;
  esquema: string;
  detalles: string;
  severidad: 'INFO' | 'WARN' | 'CRITICAL';
  created_at?: string;
}
