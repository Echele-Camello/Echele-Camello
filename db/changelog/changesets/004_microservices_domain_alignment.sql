-- liquibase formatted sql

-- changeset arquitectura:004-create-roles-and-sessions-ms-usuarios
-- comment: [ms-usuarios] Tablas de Roles y Sesiones activas para gestion de identidad, RBAC y seguridad transversal (RF-01 a RF-08, RF-052, RF-054, RF-059, RF-061)
CREATE TABLE IF NOT EXISTS `roles` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `codigo` VARCHAR(50) NOT NULL UNIQUE,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `permisos` JSON NOT NULL,
    `microservicio_propietario` VARCHAR(50) DEFAULT 'ms-usuarios',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `usuario_id` VARCHAR(50) NOT NULL,
    `rol_activo` VARCHAR(50) NOT NULL DEFAULT 'cliente',
    `token_jwt_hash` VARCHAR(255) NOT NULL,
    `ip_origen` VARCHAR(60) NULL,
    `agente_usuario` VARCHAR(255) NULL,
    `activa` TINYINT(1) DEFAULT 1,
    `fecha_inicio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `fecha_expiracion` TIMESTAMP NULL,
    INDEX `idx_sessions_usuario` (`usuario_id`),
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `sessions`; DROP TABLE IF EXISTS `roles`;

-- changeset arquitectura:004-create-availability-and-locations-ms-perfiles
-- comment: [ms-perfiles] Tablas de Disponibilidad y Ubicacion georreferenciada del PerfilProfesional (RF-09 a RF-017)
CREATE TABLE IF NOT EXISTS `worker_availability` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `dia_semana` VARCHAR(20) NOT NULL,
    `hora_inicio` VARCHAR(10) NOT NULL,
    `hora_fin` VARCHAR(10) NOT NULL,
    `disponible_inmediato` TINYINT(1) DEFAULT 1,
    `modalidad_atencion` VARCHAR(50) DEFAULT 'presencial_domicilio',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_avail_trabajador` (`trabajador_id`),
    CONSTRAINT `fk_avail_worker` FOREIGN KEY (`trabajador_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `worker_locations` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `trabajador_id` VARCHAR(50) NOT NULL UNIQUE,
    `departamento` VARCHAR(100) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `barrio_base` VARCHAR(120) NOT NULL,
    `lat` DECIMAL(10, 7) NOT NULL,
    `lng` DECIMAL(10, 7) NOT NULL,
    `radio_cobertura_km` INT DEFAULT 15,
    `zonas_cobertura` JSON NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_loc_ciudad` (`ciudad`),
    CONSTRAINT `fk_loc_worker` FOREIGN KEY (`trabajador_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `worker_locations`; DROP TABLE IF EXISTS `worker_availability`;

-- changeset arquitectura:004-create-services-catalog-ms-servicios
-- comment: [ms-servicios] Tabla de Servicios publicados por trabajadores con patron State (ACTIVO, INACTIVO, SUSPENDIDO, BORRADOR) (RF-018 a RF-023, RF-053, RF-057)
CREATE TABLE IF NOT EXISTS `services` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `categoria_id` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `precio_cop` INT NOT NULL,
    `unidad_cobro` VARCHAR(30) DEFAULT 'servicio',
    `estado_servicio` VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    `motivo_suspension` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_services_trabajador` (`trabajador_id`),
    INDEX `idx_services_categoria` (`categoria_id`),
    INDEX `idx_services_estado` (`estado_servicio`),
    CONSTRAINT `fk_services_worker` FOREIGN KEY (`trabajador_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_services_category` FOREIGN KEY (`categoria_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `services`;

-- changeset arquitectura:004-create-schedules-ms-solicitudes
-- comment: [ms-solicitudes] Tabla de Programacion y Agendamiento vinculada a SolicitudServicio (contracts) con validacion de disponibilidad (RF-033 a RF-040)
CREATE TABLE IF NOT EXISTS `service_schedules` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `contrato_id` VARCHAR(50) NOT NULL,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `cliente_id` VARCHAR(50) NOT NULL,
    `fecha_programada` VARCHAR(30) NOT NULL,
    `franja_horaria` VARCHAR(50) NOT NULL,
    `direccion_servicio` VARCHAR(255) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `estado_agenda` VARCHAR(40) DEFAULT 'PROGRAMADA',
    `reprogramaciones_count` INT DEFAULT 0,
    `notas_agenda` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_sched_contrato` (`contrato_id`),
    INDEX `idx_sched_trabajador` (`trabajador_id`),
    CONSTRAINT `fk_sched_contract` FOREIGN KEY (`contrato_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `service_schedules`;

-- changeset arquitectura:004-create-conversations-ms-comunicacion
-- comment: [ms-comunicacion] Tabla de Conversaciones entre clientes y trabajadores para agrupar mensajes y eventos Observer (RF-041 a RF-046)
CREATE TABLE IF NOT EXISTS `conversations` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `cliente_id` VARCHAR(50) NOT NULL,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `contrato_id` VARCHAR(50) NULL,
    `estado` VARCHAR(30) DEFAULT 'ACTIVA',
    `ultimo_mensaje` TEXT NULL,
    `mensajes_no_leidos` INT DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_conv_cliente` (`cliente_id`),
    INDEX `idx_conv_trabajador` (`trabajador_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `conversations`;

-- changeset arquitectura:004-create-domain-events-log
-- comment: [Transversal / Observer] Registro de eventos de dominio Publicar-Suscribir entre los 7 microservicios y API Gateway
CREATE TABLE IF NOT EXISTS `domain_events_log` (
    `id` VARCHAR(60) NOT NULL PRIMARY KEY,
    `event_type` VARCHAR(80) NOT NULL,
    `source_microservice` VARCHAR(50) NOT NULL,
    `target_microservices` JSON NOT NULL,
    `payload_dto` JSON NOT NULL,
    `triggered_by_user` VARCHAR(80) NOT NULL,
    `triggered_by_role` VARCHAR(30) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_events_source` (`source_microservice`),
    INDEX `idx_events_type` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `domain_events_log`;

-- changeset arquitectura:004-seed-microservices-domain-data
-- comment: Semillas de roles RBAC, servicios con estado, ubicaciones georreferenciadas, agendas y auditoria de arquitectura de microservicios
INSERT INTO `roles` (`id`, `codigo`, `nombre`, `descripcion`, `permisos`, `microservicio_propietario`) VALUES
('rol-cliente', 'ROLE_CLIENTE', 'Cliente Contratante', 'Busca trabajadores, solicita servicios, deposita en Escrow y califica.', '["BUSCAR_SERVICIOS", "CREAR_SOLICITUD", "PAGAR_ESCROW", "CHAT", "CALIFICAR", "REPORTAR"]', 'ms-usuarios'),
('rol-trabajador', 'ROLE_TRABAJADOR', 'Trabajador / Camellador', 'Administra perfil profesional, publica servicios, acepta solicitudes y recibe pagos.', '["GESTIONAR_PERFIL", "PUBLICAR_SERVICIO", "GESTIONAR_SOLICITUD", "CHAT", "CALIFICAR"]', 'ms-usuarios'),
('rol-admin', 'ROLE_ADMIN', 'Administrador & Auditor', 'Acceso transversal a métricas, Liquibase, moderación de reportes y verificación.', '["ADMIN_TOTAL", "LIQUIBASE_CONTROL", "MODERAR_REPUTACION", "VERIFICAR_IDENTIDAD", "EXPORTAR_INFORMES"]', 'ms-usuarios')
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

INSERT INTO `services` (`id`, `trabajador_id`, `categoria_id`, `titulo`, `descripcion`, `precio_cop`, `unidad_cobro`, `estado_servicio`) VALUES
('srv-101', 'wk-carlos-mendoza', 'cat-serv-no-reg', 'Detección y reparación de fugas hidráulicas con geófono', 'Diagnóstico sin romper piso y reparación garantizada en PVC o cobre.', 50000, 'hora', 'ACTIVO'),
('srv-102', 'wk-carlos-mendoza', 'cat-serv-no-reg', 'Destape de cañerías y sifones con sonda eléctrica', 'Servicio de urgencia para lavaplatos, cajas de inspección y bajantes.', 120000, 'servicio', 'ACTIVO'),
('srv-103', 'wk-gloria-amparo', 'cat-domestico', 'Jornada integral de aseo profundo y desinfección residencial', 'Incluye limpieza detallada de baños, cocina, vidrios e interiores.', 95000, 'servicio', 'ACTIVO'),
('srv-104', 'wk-lucia-hernandez', 'cat-serv-no-reg', 'Mantenimiento y balanceo de tableros eléctricos RETIE', 'Prevención de cortocircuitos, cambio de breakers y cableado estructurado.', 65000, 'visita', 'ACTIVO')
ON DUPLICATE KEY UPDATE `estado_servicio` = VALUES(`estado_servicio`);

INSERT INTO `audit_logs` (`id`, `accion`, `usuario`, `timestamp`, `esquema`, `detalles`, `severidad`) VALUES
('log-5', 'MICROSERVICES_ARCH_ALIGNED', 'arquitectura', '2026-11-10 02:20:00', 'api-gateway', 'Alineación de los 7 microservicios de dominio (ms-usuarios, ms-perfiles, ms-servicios, ms-busqueda, ms-solicitudes, ms-comunicacion, ms-reputacion) con patrones Repository, DTO, State, Strategy, Observer y Adapter.', 'INFO')
ON DUPLICATE KEY UPDATE `detalles` = VALUES(`detalles`);
-- rollback DELETE FROM `audit_logs` WHERE `id` = 'log-5'; DELETE FROM `services` WHERE `id` IN ('srv-101','srv-102','srv-103','srv-104'); DELETE FROM `roles` WHERE `id` IN ('rol-cliente','rol-trabajador','rol-admin');
