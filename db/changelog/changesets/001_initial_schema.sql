-- liquibase formatted sql

-- changeset juandavid:001-create-categories-table
-- comment: Tabla de categorias tecnicas y de oficios
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `icono` VARCHAR(50) NOT NULL,
    `tarifa_base_min` INT DEFAULT 0,
    `tarifa_base_max` INT DEFAULT 0,
    `unidad` VARCHAR(20) DEFAULT 'servicio',
    `technician_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `categories`;

-- changeset juandavid:001-create-users-table
-- comment: Tabla de usuarios (clientes, trabajadores y administradores)
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NULL,
    `apodo` VARCHAR(100) NULL,
    `correo` VARCHAR(120) NOT NULL UNIQUE,
    `telefono` VARCHAR(50) NULL,
    `password_hash` VARCHAR(255) NULL,
    `fecha_nacimiento` VARCHAR(50) NULL,
    `departamento` VARCHAR(100) NULL,
    `municipio` VARCHAR(100) NULL,
    `direccion` VARCHAR(255) NULL,
    `ciudad` VARCHAR(100) NULL,
    `barrio` VARCHAR(100) NULL,
    `lat` DECIMAL(10, 7) NULL,
    `lng` DECIMAL(10, 7) NULL,
    `avatar_url` TEXT NULL,
    `avatar_url_encriptada` TEXT NULL,
    `correo_verificado` TINYINT(1) DEFAULT 0,
    `telefono_verificado` TINYINT(1) DEFAULT 0,
    `roles` JSON NULL,
    `current_role` VARCHAR(50) DEFAULT 'cliente',
    `privacidad_ocultar_datos` TINYINT(1) DEFAULT 1,
    `terminos_aceptados` TINYINT(1) DEFAULT 1,
    `fecha_registro` VARCHAR(50) NULL,
    `tarjetas_guardadas` JSON NULL,
    `google_pay_vinculado` TINYINT(1) DEFAULT 0,
    `google_pay_email` VARCHAR(120) NULL,
    `ganancias_brutas_cop` BIGINT DEFAULT 0,
    `ganancias_netas_cop` BIGINT DEFAULT 0,
    `saldo_retirable_cop` BIGINT DEFAULT 0,
    `horas_trabajadas` INT DEFAULT 0,
    `servicios_ofrecidos` JSON NULL,
    `status` VARCHAR(50) DEFAULT 'ACTIVO',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_correo` (`correo`),
    INDEX `idx_users_role` (`current_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `users`;

-- changeset juandavid:001-create-workers-table
-- comment: Tabla de perfiles de trabajadores verificados
CREATE TABLE IF NOT EXISTS `workers` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(50) NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `avatar_url` TEXT NULL,
    `categoria_id` VARCHAR(50) NOT NULL,
    `categoria_nombre` VARCHAR(100) NOT NULL,
    `especialidades` JSON NULL,
    `descripcion` TEXT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `barrio` VARCHAR(100) NOT NULL,
    `radio_km` INT DEFAULT 10,
    `tarifa_por_hora` INT DEFAULT 0,
    `verificado` TINYINT(1) DEFAULT 0,
    `estado_verificacion` VARCHAR(50) DEFAULT 'pendiente',
    `disponible` TINYINT(1) DEFAULT 1,
    `horario_atencion` VARCHAR(150) NULL,
    `calificacion_promedio` DECIMAL(3, 2) DEFAULT 5.00,
    `servicios_completados` INT DEFAULT 0,
    `resenas_count` INT DEFAULT 0,
    `portafolio` JSON NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_workers_categoria` (`categoria_id`),
    INDEX `idx_workers_ciudad` (`ciudad`),
    INDEX `idx_workers_calificacion` (`calificacion_promedio`),
    CONSTRAINT `fk_workers_category` FOREIGN KEY (`categoria_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `workers`;

-- changeset juandavid:001-create-contracts-table
-- comment: Tabla de contratos y solicitudes de camello
CREATE TABLE IF NOT EXISTS `contracts` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `codigo_radicado` VARCHAR(50) NOT NULL UNIQUE,
    `cliente_id` VARCHAR(50) NOT NULL,
    `cliente_nombre` VARCHAR(100) NOT NULL,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `trabajador_nombre` VARCHAR(100) NOT NULL,
    `categoria_nombre` VARCHAR(100) NOT NULL,
    `descripcion_servicio` TEXT NOT NULL,
    `monto_bruto_cop` INT NOT NULL,
    `comision_porcentaje` INT DEFAULT 10,
    `comision_cop` INT DEFAULT 0,
    `monto_neto_trabajador_cop` INT NOT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'oferta_enviada',
    `metodo_pago` VARCHAR(50) NULL,
    `referencia_pasarela` VARCHAR(100) NULL,
    `fecha_creacion` VARCHAR(50) NOT NULL,
    `fecha_pago_escrow` VARCHAR(50) NULL,
    `fecha_inicio_servicio` VARCHAR(50) NULL,
    `fecha_terminado` VARCHAR(50) NULL,
    `fecha_completado` VARCHAR(50) NULL,
    `auto_confirmacion_limite` VARCHAR(50) NULL,
    `disputa_id` VARCHAR(50) NULL,
    `historial_estados` JSON NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_contracts_cliente` (`cliente_id`),
    INDEX `idx_contracts_trabajador` (`trabajador_id`),
    INDEX `idx_contracts_estado` (`estado`),
    CONSTRAINT `fk_contracts_worker` FOREIGN KEY (`trabajador_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `contracts`;

-- changeset juandavid:001-create-chat-messages-table
-- comment: Tabla de mensajeria y ofertas formales entre clientes y trabajadores
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `conversacion_id` VARCHAR(50) NOT NULL,
    `remitente_id` VARCHAR(50) NOT NULL,
    `remitente_nombre` VARCHAR(100) NOT NULL,
    `texto` TEXT NOT NULL,
    `tipo` VARCHAR(50) DEFAULT 'texto',
    `oferta` JSON NULL,
    `timestamp` VARCHAR(50) NOT NULL,
    `entregado` TINYINT(1) DEFAULT 1,
    `leido` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_chat_conversacion` (`conversacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `chat_messages`;

-- changeset juandavid:001-create-reviews-table
-- comment: Tabla de opiniones y calificaciones de contratos
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `contrato_id` VARCHAR(50) NULL,
    `autor_id` VARCHAR(50) NOT NULL,
    `autor_nombre` VARCHAR(100) NOT NULL,
    `autor_rol` VARCHAR(50) NOT NULL,
    `destinatario_id` VARCHAR(50) NOT NULL,
    `puntuacion` INT NOT NULL CHECK (`puntuacion` BETWEEN 1 AND 5),
    `comentario` TEXT NULL,
    `respuesta` TEXT NULL,
    `fecha` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_reviews_destinatario` (`destinatario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `reviews`;

-- changeset juandavid:001-create-disputes-table
-- comment: Tabla de disputas y mediacion de contratos escrow
CREATE TABLE IF NOT EXISTS `disputes` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `contrato_id` VARCHAR(50) NOT NULL,
    `iniciada_por_id` VARCHAR(50) NOT NULL,
    `iniciada_por_nombre` VARCHAR(100) NOT NULL,
    `iniciada_por_rol` VARCHAR(50) NOT NULL,
    `motivo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `evidencias` JSON NULL,
    `estado` VARCHAR(50) DEFAULT 'abierta',
    `dictamen_admin` TEXT NULL,
    `fecha_apertura` VARCHAR(50) NOT NULL,
    `fecha_resolucion` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_disputes_contrato` (`contrato_id`),
    CONSTRAINT `fk_disputes_contract` FOREIGN KEY (`contrato_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `disputes`;

-- changeset juandavid:001-create-worker-announcements-table
-- comment: Tabla de anuncios y publicaciones del foro de trabajadores
CREATE TABLE IF NOT EXISTS `worker_announcements` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `trabajador_nombre` VARCHAR(100) NOT NULL,
    `trabajador_avatar` TEXT NULL,
    `trabajador_verificado` TINYINT(1) DEFAULT 1,
    `calificacion_promedio` DECIMAL(3, 2) DEFAULT 5.00,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `categoria_id` VARCHAR(50) NOT NULL,
    `categoria_nombre` VARCHAR(100) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `barrio` VARCHAR(100) NULL,
    `precio_cop` INT DEFAULT NULL,
    `tipo_precio` VARCHAR(50) DEFAULT 'hora',
    `disponible_inmediato` TINYINT(1) DEFAULT 1,
    `horario` VARCHAR(100) NOT NULL,
    `etiqueta` VARCHAR(50) NULL,
    `tags` JSON NULL,
    `fecha_publicacion` VARCHAR(50) NOT NULL,
    `likes_count` INT DEFAULT 0,
    `comentarios` JSON NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_ann_trabajador` (`trabajador_id`),
    CONSTRAINT `fk_ann_worker` FOREIGN KEY (`trabajador_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `worker_announcements`;

-- changeset juandavid:001-create-notifications-table
-- comment: Tabla de notificaciones para usuarios
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `usuario_id` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `leida` TINYINT(1) DEFAULT 0,
    `fecha` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_notif_usuario` (`usuario_id`),
    INDEX `idx_notif_leida` (`leida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `notifications`;

-- changeset juandavid:001-create-payments-table
-- comment: Tabla de transacciones y pagos
CREATE TABLE IF NOT EXISTS `payments` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `contrato_id` VARCHAR(50) NOT NULL,
    `cliente_id` VARCHAR(50) NOT NULL,
    `trabajador_id` VARCHAR(50) NOT NULL,
    `monto_cop` INT NOT NULL,
    `metodo_pago` VARCHAR(50) NOT NULL,
    `estado` VARCHAR(50) DEFAULT 'PENDIENTE',
    `transaccion_ref` VARCHAR(100) NOT NULL UNIQUE,
    `detalles_pasarela` JSON NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_payments_contrato` (`contrato_id`),
    INDEX `idx_payments_ref` (`transaccion_ref`),
    CONSTRAINT `fk_payments_contract` FOREIGN KEY (`contrato_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `payments`;

-- changeset juandavid:001-create-audit-logs-table
-- comment: Tabla de auditoria y trazabilidad del sistema
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `accion` VARCHAR(100) NOT NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `timestamp` VARCHAR(50) NOT NULL,
    `esquema` VARCHAR(100) NOT NULL,
    `detalles` TEXT NOT NULL,
    `severidad` VARCHAR(20) DEFAULT 'INFO',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_severidad` (`severidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- rollback DROP TABLE IF EXISTS `audit_logs`;
