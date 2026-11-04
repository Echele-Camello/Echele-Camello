-- liquibase formatted sql

-- changeset juandavid:003-seed-announcements
-- comment: Carga de publicaciones destacadas en el Foro de Trabajadores
INSERT INTO `worker_announcements` (`id`, `trabajador_id`, `trabajador_nombre`, `trabajador_avatar`, `trabajador_verificado`, `calificacion_promedio`, `titulo`, `descripcion`, `categoria_id`, `categoria_nombre`, `ciudad`, `barrio`, `precio_cop`, `tipo_precio`, `disponible_inmediato`, `horario`, `etiqueta`, `tags`, `fecha_publicacion`, `likes_count`, `comentarios`) VALUES
(
  'anuncio-1',
  'wk-carlos-mendoza',
  'Carlos Enrique Mendoza',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  1,
  4.90,
  '¡Atención de emergencias de plomería y destape hoy mismo en Bogotá!',
  'Disponibilidad inmediata para atender fugas ocultas, calentadores de paso descalibrados y destapes con sonda eléctrica de 30 metros sin romper piso ni pared.',
  'cat-serv-no-reg',
  'Servicios No Regulados (Plomería & Gas)',
  'Bogotá D.C.',
  'Teusaquillo / Chapinero / Salitre / Chicó',
  45000,
  'hora',
  1,
  'Hoy disponible hasta las 8:00 PM',
  'disponible_hoy',
  '["Destape sin romper", "Detección fugas", "Calentadores", "Urgencias"]',
  'Hace 25 minutos',
  14,
  '[{"id":"com-1","autorId":"cliente1","autorNombre":"Alejandro Gómez","texto":"Don Carlos, ¿alcanza a llegar al sector de Galerías?","fecha":"Hace 10 min"}]'
),
(
  'anuncio-2',
  'wk-mateo-cerrajero',
  'Mateo Restrepo Saldarriaga',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  1,
  4.92,
  'Servicio de Cerrajería 24 Horas y Apertura de Puertas Blindadas en Medellín',
  '¿Quedaste por fuera de tu casa o auto? Aperturas limpias sin dañar la cerradura ni desajustar el marco.',
  'cat-serv-no-reg',
  'Servicios No Regulados (Cerrajería 24/7)',
  'Medellín',
  'El Poblado / Laureles / Envigado / Sabaneta',
  65000,
  'fijo',
  1,
  'Servicio 24 Horas Activo',
  'urgencias',
  '["Cerrajería 24h", "Puertas blindadas", "Yale", "Antisecuestro"]',
  'Hace 1 hora',
  23,
  '[]'
);
-- rollback DELETE FROM `worker_announcements` WHERE `id` IN ('anuncio-1', 'anuncio-2');

-- changeset juandavid:003-seed-audit-logs
-- comment: Carga inicial de auditoria para pruebas de seguridad y compliance
INSERT INTO `audit_logs` (`id`, `accion`, `usuario`, `timestamp`, `esquema`, `detalles`, `severidad`) VALUES
(
  'log-1',
  'DB_INIT_LIQUIBASE',
  'juandavid',
  '2026-11-04 16:25:00',
  'echelecamelloprueba',
  'Instalación y sincronización de base de datos MySQL con Liquibase para ambiente de desarrollo local',
  'INFO'
),
(
  'log-2',
  'ESCROW_DEPOSIT_VERIFIED',
  'Pasarela Wompi / Nequi',
  '2026-11-02 10:15:22',
  'ms-pagos',
  'Depósito de $120.000 COP retenido en cuenta escrow para contrato cont-8491',
  'INFO'
);
-- rollback DELETE FROM `audit_logs` WHERE `id` IN ('log-1', 'log-2');

