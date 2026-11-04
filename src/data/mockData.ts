import { WorkerCategory, WorkerProfile, User, Contract, Review, Dispute, ChatMessage } from '../types';

export const INITIAL_CATEGORIES: WorkerCategory[] = [
  {
    id: 'cat-serv-no-reg',
    nombre: 'Servicios No Regulados',
    descripcion: 'Plomería, electricidad, cerrajería, pintura y reparaciones a domicilio.',
    icono: 'Wrench',
    tarifaBaseMin: 45000,
    tarifaBaseMax: 180000,
    unidad: 'servicio'
  },
  {
    id: 'cat-domestico',
    nombre: 'Doméstico y Cuidados',
    descripcion: 'Aseo integral de hogares, cocina tradicional, cuidado diurno de adultos y niños.',
    icono: 'Home',
    tarifaBaseMin: 55000,
    tarifaBaseMax: 110000,
    unidad: 'servicio'
  },
  {
    id: 'cat-construccion',
    nombre: 'Agro y Construcción',
    descripcion: 'Maestros de obra, albañiles, enchapes, drywall y jornales especializados.',
    icono: 'Hammer',
    tarifaBaseMin: 70000,
    tarifaBaseMax: 250000,
    unidad: 'visita'
  },
  {
    id: 'cat-transporte',
    nombre: 'Transporte y Logística',
    descripcion: 'Acarreos urbanos, mensajería expresa en moto y choferes por hora.',
    icono: 'Truck',
    tarifaBaseMin: 35000,
    tarifaBaseMax: 160000,
    unidad: 'servicio'
  },
  {
    id: 'cat-cuenta-propia',
    nombre: 'Cuenta Propia y Oficios',
    descripcion: 'Sastrería, tapicería, afilado de herramientas y confección artesanal.',
    icono: 'Scissors',
    tarifaBaseMin: 30000,
    tarifaBaseMax: 120000,
    unidad: 'hora'
  },
  {
    id: 'cat-otros',
    nombre: 'Servicios Varios',
    descripcion: 'Paseo canino, jardinería residencial, mantenimiento de computadores y electrodomésticos.',
    icono: 'Sparkles',
    tarifaBaseMin: 25000,
    tarifaBaseMax: 95000,
    unidad: 'hora'
  }
];

export const MOCK_USERS: Record<string, User> = {
  cliente1: {
    id: 'cliente1',
    nombre: 'Alejandro',
    apellido: 'Gómez Restrepo',
    apodo: 'Alejo',
    correo: 'alejandro.gomez@bogota.co',
    telefono: '+57 311 849 2011',
    fechaNacimiento: '1992-06-15',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    direccion: 'Carrera 17 # 45-28, Apto 402',
    ciudad: 'Bogotá D.C.',
    barrio: 'Teusaquillo / Palermo',
    lat: 4.6362,
    lng: -74.0722,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roles: ['cliente'],
    currentRole: 'cliente',
    privacidadOcultarDatos: true,
    terminosAceptados: true,
    fechaRegistro: '2026-02-14',
    googlePayVinculado: true,
    googlePayEmail: 'alejandro.gomez@gmail.com',
    tarjetasGuardadas: [
      {
        id: 'card-1',
        marca: 'visa',
        ultimos4: '4291',
        titular: 'ALEJANDRO GOMEZ R',
        vencimiento: '08/29',
        predeterminada: true
      },
      {
        id: 'card-2',
        marca: 'mastercard',
        ultimos4: '8812',
        titular: 'ALEJANDRO GOMEZ R',
        vencimiento: '11/27',
        predeterminada: false
      }
    ]
  },
  trabajador1: {
    id: 'trabajador1',
    nombre: 'Carlos Enrique',
    apellido: 'Mendoza Pardo',
    apodo: 'Don Carlos',
    correo: 'carlos.mendoza.oficios@gmail.com',
    telefono: '+57 320 491 8832',
    fechaNacimiento: '1984-09-22',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    direccion: 'Calle 63 # 9-42, Local 2',
    ciudad: 'Bogotá D.C.',
    barrio: 'Chapinero Alto (Radio 8 km)',
    lat: 4.6486,
    lng: -74.0583,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roles: ['cliente', 'trabajador'],
    currentRole: 'trabajador',
    privacidadOcultarDatos: true,
    terminosAceptados: true,
    fechaRegistro: '2025-11-20',
    googlePayVinculado: true,
    googlePayEmail: 'carlos.mendoza.oficios@gmail.com',
    tarjetasGuardadas: [
      {
        id: 'card-wk-1',
        marca: 'mastercard',
        ultimos4: '1094',
        titular: 'CARLOS E MENDOZA',
        vencimiento: '05/28',
        predeterminada: true
      }
    ],
    gananciasBrutasCOP: 4820000,
    gananciasNetasCOP: 4338000,
    saldoRetirableCOP: 645000,
    horasTrabajadas: 146,
    serviciosOfrecidos: [
      { id: 'srv-1', nombre: 'Detección y reparación de fugas hidráulicas', precioCOP: 50000, modalidad: 'hora' },
      { id: 'srv-2', nombre: 'Destape de sifones con sonda eléctrica profesional', precioCOP: 120000, modalidad: 'servicio' },
      { id: 'srv-3', nombre: 'Instalación de griferías y cambio de llaves de paso', precioCOP: 85000, modalidad: 'servicio' },
      { id: 'srv-4', nombre: 'Mantenimiento y calibración calentador de gas', precioCOP: 95000, modalidad: 'visita' }
    ]
  },
  admin1: {
    id: 'admin1',
    nombre: 'Supervisora Auditoría',
    apellido: 'Échele Camello',
    apodo: 'Admin Auditor',
    correo: 'auditoria@echelecamello.co',
    telefono: '+57 300 000 0000',
    fechaNacimiento: '1988-03-10',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    direccion: 'Avenida El Dorado # 68C-61',
    ciudad: 'Bogotá D.C.',
    barrio: 'Sede Central',
    lat: 4.6582,
    lng: -74.0935,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    roles: ['admin'],
    currentRole: 'admin',
    privacidadOcultarDatos: false,
    terminosAceptados: true,
    fechaRegistro: '2025-01-01',
    googlePayVinculado: false,
    tarjetasGuardadas: []
  }
};

export const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'wk-carlos-mendoza',
    userId: 'trabajador1',
    nombre: 'Carlos Enrique Mendoza',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-serv-no-reg',
    categoriaNombre: 'Servicios No Regulados (Plomería & Gas)',
    especialidades: ['Detección de fugas', 'Destape con sonda eléctrica', 'Instalación de griferías', 'Reparación calentadores de paso'],
    descripcion: 'Más de 14 años de experiencia en redes hidráulicas y sanitarias en Bogotá. Cuento con equipos propios, diagnóstico preciso y garantía total con respaldo escrow.',
    ciudad: 'Bogotá D.C.',
    barrio: 'Chapinero / Teusaquillo / Chico',
    radioKm: 12,
    tarifaPorHora: 45000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Lunes a Sábado: 7:00 AM - 6:30 PM',
    calificacionPromedio: 4.9,
    serviciosCompletados: 87,
    reseñasCount: 64,
    portafolio: [
      {
        id: 'port-1',
        titulo: 'Reemplazo de tubería matriz en baño principal',
        descripcion: 'Sustitución de tubería de hierro galvanizado por PVC de alta presión sin romper baldosas principales.',
        fotoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 2 semanas'
      },
      {
        id: 'port-2',
        titulo: 'Instalación y calibración calentador Haceb',
        descripcion: 'Montaje de ducto de evacuación de humos y chequeo de presión de gas certificado.',
        fotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 1 mes'
      },
      {
        id: 'port-3',
        titulo: 'Mantenimiento de cajas de inspección',
        descripcion: 'Limpieza preventiva y sellado hermético contra malos olores en conjunto residencial.',
        fotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 2 meses'
      }
    ]
  },
  {
    id: 'wk-gloria-amparo',
    userId: 'trabajador2',
    nombre: 'Gloria Amparo Quintero',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-domestico',
    categoriaNombre: 'Doméstico y Cuidados',
    especialidades: ['Aseo profundo y desinfección', 'Lavado y planchado fino', 'Organización de closets', 'Cocina casera colombiana'],
    descripcion: 'Puntualidad, honestidad y pulcritud. Me dedico al servicio doméstico profesional en casas y oficinas pequeñas. Traigo referencias comprobadas y verificación al día.',
    ciudad: 'Bogotá D.C.',
    barrio: 'Cedritos / Usaquén / Suba',
    radioKm: 15,
    tarifaPorHora: 50000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
    calificacionPromedio: 5.0,
    serviciosCompletados: 112,
    reseñasCount: 89,
    portafolio: [
      {
        id: 'port-4',
        titulo: 'Entrega de apartamento nuevo post-obra',
        descripcion: 'Limpieza exhaustiva de vidrios de doble altura, desmanche de porcelanato y retiro de polvo fino.',
        fotoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 5 días'
      },
      {
        id: 'port-5',
        titulo: 'Organización integral de alacena y cocina',
        descripcion: 'Categorización de alimentos por caducidad con recipientes herméticos.',
        fotoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 3 semanas'
      }
    ]
  },
  {
    id: 'wk-jorge-herrera',
    userId: 'trabajador3',
    nombre: 'Jorge Alirio Herrera',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-construccion',
    categoriaNombre: 'Agro y Construcción (Pintura & Estuco)',
    especialidades: ['Estuco veneciano', 'Pintura de fachadas e interiores', 'Reparación de humedades', 'Muros en Drywall'],
    descripcion: 'Maestro de obra con acabados finos. No mancho pisos ni marcos de puertas. Trabajo limpio con lijado al vacío y materiales de primera calidad.',
    ciudad: 'Bogotá D.C.',
    barrio: 'Fontibón / Hayuelos / Salitre',
    radioKm: 10,
    tarifaPorHora: 60000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Lunes a Sábado: 7:30 AM - 5:00 PM',
    calificacionPromedio: 4.8,
    serviciosCompletados: 54,
    reseñasCount: 42,
    portafolio: [
      {
        id: 'port-6',
        titulo: 'Pintura y resane de sala-comedor 80m2',
        descripcion: 'Corrección de grietas térmicas, dos manos de vinilo tipo 1 lavable tono blanco hueso.',
        fotoUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 1 mes'
      }
    ]
  },
  {
    id: 'wk-marlon-ramirez',
    userId: 'trabajador4',
    nombre: 'Marlon Steven Ramírez',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-transporte',
    categoriaNombre: 'Transporte y Logística (Acarreos Urbanos)',
    especialidades: ['Camioneta estacas 2.5 Toneladas', 'Embalaje con plástico burbuja', 'Personal de cargue y descargue', 'Acarreos el mismo día'],
    descripcion: 'Acarreos seguros y puntuales en todo Bogotá y municipios aledaños (Chía, Soacha, Mosquera). Mantas protectoras para electrodomésticos.',
    ciudad: 'Bogotá D.C.',
    barrio: 'Kennedy / Puente Aranda',
    radioKm: 25,
    tarifaPorHora: 75000,
    verificado: false,
    estadoVerificacion: 'pendiente',
    disponible: true,
    horarioAtencion: 'Todos los días: 6:00 AM - 8:00 PM',
    calificacionPromedio: 4.7,
    serviciosCompletados: 31,
    reseñasCount: 22,
    portafolio: [
      {
        id: 'port-7',
        titulo: 'Trasteo de apartamento en Cedritos',
        descripcion: 'Protección con esquineros de cartón y mantas acolchadas en ascensor y camión.',
        fotoUrl: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 3 semanas'
      }
    ]
  },
  {
    id: 'wk-lucia-hernandez',
    userId: 'trabajador5',
    nombre: 'Lucía Marcela Hernández',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-serv-no-reg',
    categoriaNombre: 'Servicios No Regulados (Electricidad Domiciliaria)',
    especialidades: ['Instalación de luminarias LED', 'Rebalanceo de tableros de tacos', 'Revisión de fugas de energía', 'Tomas de 110V y 220V'],
    descripcion: 'Técnica electricista con tarjeta profesional Conte. Arreglo cortocircuitos, adecuaciones para estufas de inducción y ahorro energético.',
    ciudad: 'Bogotá D.C.',
    barrio: 'Santa Bárbara / Usaquén',
    radioKm: 10,
    tarifaPorHora: 55000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
    calificacionPromedio: 4.95,
    serviciosCompletados: 48,
    reseñasCount: 39,
    portafolio: [
      {
        id: 'port-8',
        titulo: 'Adecuación de tablero eléctrico principal 12 circuitos',
        descripcion: 'Instalación de breakers termomagnéticos y rotulado normativo Retie.',
        fotoUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 10 días'
      }
    ]
  },
  {
    id: 'wk-mateo-cerrajero',
    userId: 'trabajador6',
    nombre: 'Mateo Restrepo Saldarriaga',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-serv-no-reg',
    categoriaNombre: 'Servicios No Regulados (Cerrajería 24/7)',
    especialidades: ['Apertura de cerraduras de seguridad', 'Cambio de guardas y cilindros', 'Cerrajería automotriz', 'Cerraduras digitales biométricas'],
    descripcion: 'Maestro cerrajero con más de 12 años de experiencia en Medellín y el Valle de Aburrá. Servicio de urgencias 24 horas garantizado sin averiar puertas.',
    ciudad: 'Medellín',
    barrio: 'El Poblado / Laureles / Envigado',
    radioKm: 20,
    tarifaPorHora: 65000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Servicio 24 Horas / Emergencias urgentes',
    calificacionPromedio: 4.92,
    serviciosCompletados: 94,
    reseñasCount: 76,
    portafolio: [
      {
        id: 'port-9',
        titulo: 'Instalación de cerradura digital Yale con huella y app',
        descripcion: 'Montaje sobre puerta blindada con calibración milimétrica y capacitación a residentes.',
        fotoUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 1 semana'
      }
    ]
  },
  {
    id: 'wk-valentina-carpinteria',
    userId: 'trabajador7',
    nombre: 'Valentina Ospina Gómez',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-cuenta-propia',
    categoriaNombre: 'Cuenta Propia y Oficios (Carpintería Fina)',
    especialidades: ['Mobiliario en melamina RH hidrófuga', 'Restauración de maderas macizas', 'Ajuste de bisagras de cierre suave', 'Diseño de clósets a medida'],
    descripcion: 'Diseñadora y ebanista especializada en soluciones de espacio y acabados de lujo para hogares en Cali.',
    ciudad: 'Cali',
    barrio: 'Valle del Lili / Granada / Ciudad Jardín',
    radioKm: 18,
    tarifaPorHora: 42000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Lunes a Sábado: 8:00 AM - 5:30 PM',
    calificacionPromedio: 4.88,
    serviciosCompletados: 39,
    reseñasCount: 31,
    portafolio: [
      {
        id: 'port-10',
        titulo: 'Reconfiguración de cocina integral con herrajes Blum',
        descripcion: 'Optimización de gavetas esquineras y sustitución de frentes dañados.',
        fotoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 4 días'
      }
    ]
  },
  {
    id: 'wk-pedro-acabados',
    userId: 'trabajador8',
    nombre: 'Pedro Antonio Cuadrado',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-construccion',
    categoriaNombre: 'Agro y Construcción (Pintura & Estuco)',
    especialidades: ['Pintura antihumedad y salitre', 'Estuco plástico lavable', 'Impermeabilización de cubiertas y terrazas'],
    descripcion: 'Especialista en acabados exteriores y resistencia al clima caribeño en Barranquilla y Puerto Colombia.',
    ciudad: 'Barranquilla',
    barrio: 'El Prado / Alto Prado / Riomar',
    radioKm: 15,
    tarifaPorHora: 70000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: false,
    horarioAtencion: 'Lunes a Viernes: 7:00 AM - 4:30 PM',
    calificacionPromedio: 4.75,
    serviciosCompletados: 62,
    reseñasCount: 45,
    portafolio: [
      {
        id: 'port-11',
        titulo: 'Impermeabilización de terraza 120m2 con manta asfáltica',
        descripcion: 'Sellado de juntas de dilatación y prueba de estanqueidad de 48 horas aprobada.',
        fotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 2 semanas'
      }
    ]
  },
  {
    id: 'wk-esteban-jardineria',
    userId: 'trabajador9',
    nombre: 'Esteban Darío Pinzón',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    categoriaId: 'cat-otros',
    categoriaNombre: 'Servicios Varios (Jardinería & Mantenimiento)',
    especialidades: ['Poda estética y formación de setos', 'Mantenimiento de césped y grama esmeralda', 'Fertilización orgánica y control de plagas'],
    descripcion: 'Servicios de jardinería profesional para conjuntos residenciales y casas campestres en Bucaramanga y Floridablanca.',
    ciudad: 'Bucaramanga',
    barrio: 'Cabecera del Llano / Cañaveral',
    radioKm: 14,
    tarifaPorHora: 35000,
    verificado: true,
    estadoVerificacion: 'aprobado',
    disponible: true,
    horarioAtencion: 'Lunes a Sábado: 6:30 AM - 2:00 PM',
    calificacionPromedio: 4.95,
    serviciosCompletados: 78,
    reseñasCount: 58,
    portafolio: [
      {
        id: 'port-12',
        titulo: 'Diseño y paisajismo de jardín interior zen',
        descripcion: 'Montaje de sistema de riego por goteo automatizado y plantas de semisombra.',
        fotoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=80',
        fecha: 'Hace 6 días'
      }
    ]
  }
];


export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'cont-8491',
    codigoRadicado: 'EC-2026-8491',
    clienteId: 'cliente1',
    clienteNombre: 'Alejandro Gómez Restrepo',
    trabajadorId: 'wk-carlos-mendoza',
    trabajadorNombre: 'Carlos Enrique Mendoza',
    categoriaNombre: 'Plomería & Gas',
    descripcionServicio: 'Reparación urgente de tubería de desagüe bajo lavaplatos y cambio de empaque sifón.',
    montoBrutoCOP: 120000,
    comisionPorcentaje: 10,
    comisionCOP: 12000,
    montoNetoTrabajadorCOP: 108000,
    estado: 'pagado_escrow',
    metodoPago: 'nequi',
    referenciaPasarela: 'WMP-NQ-908234-COL',
    fechaCreacion: '2026-11-02 09:30',
    fechaPagoEscrow: '2026-11-02 10:15',
    historialEstados: [
      { estado: 'oferta_enviada', fecha: '2026-11-02 09:30', autor: 'Carlos Enrique Mendoza', nota: 'Oferta pactada en chat con garantía de repuestos.' },
      { estado: 'pendiente_pago', fecha: '2026-11-02 09:45', autor: 'Alejandro Gómez', nota: 'Oferta aceptada por el cliente.' },
      { estado: 'pagado_escrow', fecha: '2026-11-02 10:15', autor: 'Pasarela Nequi / Wompi', nota: 'Pago de $120.000 COP retenido en custodia segura (escrow).' }
    ]
  },
  {
    id: 'cont-8490',
    codigoRadicado: 'EC-2026-8490',
    clienteId: 'cliente1',
    clienteNombre: 'Alejandro Gómez Restrepo',
    trabajadorId: 'wk-gloria-amparo',
    trabajadorNombre: 'Gloria Amparo Quintero',
    categoriaNombre: 'Doméstico y Cuidados',
    descripcionServicio: 'Jornada completa de aseo profundo, desinfección de baños y lavado de ventanales.',
    montoBrutoCOP: 95000,
    comisionPorcentaje: 10,
    comisionCOP: 9500,
    montoNetoTrabajadorCOP: 85500,
    estado: 'completado',
    metodoPago: 'pse',
    referenciaPasarela: 'WMP-PSE-771239-COL',
    fechaCreacion: '2026-10-25 08:00',
    fechaPagoEscrow: '2026-10-25 08:30',
    fechaInicioServicio: '2026-10-26 08:00',
    fechaTerminado: '2026-10-26 16:30',
    fechaCompletado: '2026-10-26 17:00',
    historialEstados: [
      { estado: 'oferta_enviada', fecha: '2026-10-25 08:00', autor: 'Gloria Amparo' },
      { estado: 'pendiente_pago', fecha: '2026-10-25 08:15', autor: 'Alejandro Gómez' },
      { estado: 'pagado_escrow', fecha: '2026-10-25 08:30', autor: 'PSE Bancolombia' },
      { estado: 'en_curso', fecha: '2026-10-26 08:00', autor: 'Gloria Amparo' },
      { estado: 'terminado', fecha: '2026-10-26 16:30', autor: 'Gloria Amparo' },
      { estado: 'completado', fecha: '2026-10-26 17:00', autor: 'Alejandro Gómez', nota: 'Servicio verificado a plena satisfacción. Fondos liberados al trabajador.' }
    ]
  },
  {
    id: 'cont-8492',
    codigoRadicado: 'EC-2026-8492',
    clienteId: 'cliente1',
    clienteNombre: 'Alejandro Gómez Restrepo',
    trabajadorId: 'wk-lucia-hernandez',
    trabajadorNombre: 'Lucía Marcela Hernández',
    categoriaNombre: 'Electricidad',
    descripcionServicio: 'Instalación de 4 lámparas colgantes en isla de cocina e independización de circuitos.',
    montoBrutoCOP: 140000,
    comisionPorcentaje: 10,
    comisionCOP: 14000,
    montoNetoTrabajadorCOP: 126000,
    estado: 'oferta_enviada',
    fechaCreacion: '2026-11-03 14:10',
    historialEstados: [
      { estado: 'oferta_enviada', fecha: '2026-11-03 14:10', autor: 'Lucía Marcela Hernández', nota: 'Oferta con vigencia de 24 horas enviada por chat.' }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'wk-carlos-mendoza': [
    {
      id: 'msg-1',
      conversacionId: 'conv-carlos',
      remitenteId: 'cliente1',
      remitenteNombre: 'Alejandro Gómez',
      texto: 'Buenas tardes don Carlos, tengo un goteo constante debajo del lavaplatos que ya empezó a humedecer el mueble de madera. ¿Está disponible hoy en Teusaquillo?',
      tipo: 'texto',
      timestamp: '14:02',
      entregado: true,
      leido: true
    },
    {
      id: 'msg-2',
      conversacionId: 'conv-carlos',
      remitenteId: 'trabajador1',
      remitenteNombre: 'Carlos Enrique Mendoza',
      texto: '¡Buenas tardes Alejandro! Sí señor, estoy terminando una revisión en Palermo y paso a su dirección sobre las 3:30 PM. Llevo sonda y kit de empaques.',
      tipo: 'texto',
      timestamp: '14:05',
      entregado: true,
      leido: true
    },
    {
      id: 'msg-3',
      conversacionId: 'conv-carlos',
      remitenteId: 'trabajador1',
      remitenteNombre: 'Carlos Enrique Mendoza',
      texto: 'Le acabo de formular la oferta formal por la plataforma para que su dinero quede protegido con el Escrow de Échele Camello.',
      tipo: 'texto',
      timestamp: '14:08',
      entregado: true,
      leido: true
    },
    {
      id: 'msg-4',
      conversacionId: 'conv-carlos',
      remitenteId: 'trabajador1',
      remitenteNombre: 'Carlos Enrique Mendoza',
      texto: 'Oferta formal de servicio',
      tipo: 'oferta',
      oferta: {
        id: 'off-101',
        conversacionId: 'conv-carlos',
        emisorId: 'trabajador1',
        receptorId: 'cliente1',
        descripcionServicio: 'Reparación de filtración en desagüe lavaplatos + cambio de empaque sifón + prueba de hermeticidad con agua caliente.',
        precioCOP: 120000,
        fechaHoraPactada: 'Hoy, 3:30 PM',
        vigenciaHoras: 24,
        version: 1,
        estado: 'aceptada',
        fechaEnvio: 'Hoy, 14:08'
      },
      timestamp: '14:08',
      entregado: true,
      leido: true
    }
  ]
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    contratoId: 'cont-8490',
    autorId: 'cliente1',
    autorNombre: 'Alejandro Gómez Restrepo',
    autorRol: 'cliente',
    destinatarioId: 'wk-gloria-amparo',
    puntuacion: 5,
    comentario: 'Doña Gloria es excepcional. Llegó 10 minutos antes, sumamente respetuosa, cuidadosa con las pertenencias y dejó el apartamento impecable. Da mucha tranquilidad pagar con el escrow.',
    respuesta: '¡Muchas gracias don Alejandro por la confianza y por recomendar mi trabajo! Quedo a la orden.',
    fecha: '2026-10-27'
  },
  {
    id: 'rev-2',
    contratoId: 'cont-prev-1',
    autorId: 'cliente2',
    autorNombre: 'Mariana Duque',
    autorRol: 'cliente',
    destinatarioId: 'wk-carlos-mendoza',
    puntuacion: 5,
    comentario: 'Carlos diagnosticó el problema en 5 minutos y no me cobró de más. Excelente profesionalismo y muy transparente con los precios.',
    fecha: '2026-10-18'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp-01',
    contratoId: 'cont-sample-disp',
    iniciadaPorId: 'cliente-demo',
    iniciadaPorNombre: 'Camilo Torres',
    iniciadaPorRol: 'cliente',
    motivo: 'Inconformidad con acabado en pintura',
    descripcion: 'El trabajador dejó manchas en los zócalos de madera y una pared quedó con sombras de pintura dispareja. Solicito que se repare o se reembolse el 30%.',
    evidencias: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'],
    estado: 'en_revision',
    fechaApertura: '2026-11-01 11:20'
  }
];
