export interface ColombiaDepartment {
  id: string;
  nombre: string;
  capital: string;
  municipios: string[];
}

export const COLOMBIA_DEPARTMENTS: ColombiaDepartment[] = [
  {
    id: 'bogota',
    nombre: 'Bogotá D.C.',
    capital: 'Bogotá',
    municipios: [
      'Bogotá D.C. (Teusaquillo)',
      'Bogotá D.C. (Chapinero)',
      'Bogotá D.C. (Usaquén)',
      'Bogotá D.C. (Suba)',
      'Bogotá D.C. (Kennedy)',
      'Bogotá D.C. (Engativá)',
      'Bogotá D.C. (Fontibón)',
      'Bogotá D.C. (Santa Fe)',
      'Bogotá D.C. (San Cristóbal)',
      'Bogotá D.C. (Bosa)'
    ]
  },
  {
    id: 'amazonas',
    nombre: 'Amazonas',
    capital: 'Leticia',
    municipios: ['Leticia', 'Puerto Nariño', 'El Encanto', 'La Chorrera', 'Tarapacá']
  },
  {
    id: 'antioquia',
    nombre: 'Antioquia',
    capital: 'Medellín',
    municipios: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó', 'Sabaneta', 'Turbo', 'Caucasia']
  },
  {
    id: 'arauca',
    nombre: 'Arauca',
    capital: 'Arauca',
    municipios: ['Arauca', 'Saravena', 'Tame', 'Arauquita', 'Fortul']
  },
  {
    id: 'atlantico',
    nombre: 'Atlántico',
    capital: 'Barranquilla',
    municipios: ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Baranoa', 'Puerto Colombia', 'Galapa']
  },
  {
    id: 'bolivar',
    nombre: 'Bolívar',
    capital: 'Cartagena',
    municipios: ['Cartagena de Indias', 'Magangué', 'Turbaco', 'El Carmen de Bolívar', 'Arjona', 'Santa Rosa de Lima']
  },
  {
    id: 'boyaca',
    nombre: 'Boyacá',
    capital: 'Tunja',
    municipios: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Puerto Boyacá', 'Paipa', 'Villa de Leyva', 'Moniquirá']
  },
  {
    id: 'caldas',
    nombre: 'Caldas',
    capital: 'Manizales',
    municipios: ['Manizales', 'La Dorada', 'Villamaría', 'Chinchiná', 'Riosucio', 'Anserma', 'Salamina']
  },
  {
    id: 'caqueta',
    nombre: 'Caquetá',
    capital: 'Florencia',
    municipios: ['Florencia', 'San Vicente del Caguán', 'Cartagena del Chairá', 'Puerto Rico', 'Belén de los Andaquíes']
  },
  {
    id: 'casanare',
    nombre: 'Casanare',
    capital: 'Yopal',
    municipios: ['Yopal', 'Aguazul', 'Villanueva', 'Paz de Ariporo', 'Tauramena', 'Monterrey']
  },
  {
    id: 'cauca',
    nombre: 'Cauca',
    capital: 'Popayán',
    municipios: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía', 'Piendamó', 'El Tambo']
  },
  {
    id: 'cesar',
    nombre: 'Cesar',
    capital: 'Valledupar',
    municipios: ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Bosconia', 'Curumaní', 'La Jagua de Ibirico']
  },
  {
    id: 'choco',
    nombre: 'Chocó',
    capital: 'Quibdó',
    municipios: ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Acandí', 'Bahía Solano', 'Nuquí']
  },
  {
    id: 'cordoba',
    nombre: 'Córdoba',
    capital: 'Montería',
    municipios: ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Montelíbano', 'Planeta Rica', 'Tierralta']
  },
  {
    id: 'cundinamarca',
    nombre: 'Cundinamarca',
    capital: 'Bogotá (Sede administrativa)',
    municipios: ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá', 'Fusagasugá', 'Mosquera', 'Madrid', 'Funza', 'Cajicá', 'Girardot', 'Cota']
  },
  {
    id: 'guainia',
    nombre: 'Guainía',
    capital: 'Inírida',
    municipios: ['Inírida', 'Barranco Minas', 'Mapiripana', 'San Felipe', 'Puerto Colombia']
  },
  {
    id: 'guaviare',
    nombre: 'Guaviare',
    capital: 'San José del Guaviare',
    municipios: ['San José del Guaviare', 'El Retorno', 'Calamar', 'Miraflores']
  },
  {
    id: 'huila',
    nombre: 'Huila',
    capital: 'Neiva',
    municipios: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'San Agustín']
  },
  {
    id: 'la_guajira',
    nombre: 'La Guajira',
    capital: 'Riohacha',
    municipios: ['Riohacha', 'Maicao', 'Uribia', 'Manaure', 'San Juan del Cesar', 'Fonseca']
  },
  {
    id: 'magdalena',
    nombre: 'Magdalena',
    capital: 'Santa Marta',
    municipios: ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato', 'Aracataca']
  },
  {
    id: 'meta',
    nombre: 'Meta',
    capital: 'Villavicencio',
    municipios: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín', 'Cumaral']
  },
  {
    id: 'narino',
    nombre: 'Nariño',
    capital: 'Pasto',
    municipios: ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres', 'La Unión', 'Samaniego']
  },
  {
    id: 'norte_de_santander',
    nombre: 'Norte de Santander',
    capital: 'Cúcuta',
    municipios: ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios', 'Pamplona', 'Tibú']
  },
  {
    id: 'putumayo',
    nombre: 'Putumayo',
    capital: 'Mocoa',
    municipios: ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez', 'Villagarzón', 'Sibundoy']
  },
  {
    id: 'quindio',
    nombre: 'Quindío',
    capital: 'Armenia',
    municipios: ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya', 'Circasia', 'Salento']
  },
  {
    id: 'risaralda',
    nombre: 'Risaralda',
    capital: 'Pereira',
    municipios: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Belén de Umbría', 'Santuario']
  },
  {
    id: 'san_andres',
    nombre: 'San Andrés y Providencia',
    capital: 'San Andrés',
    municipios: ['San Andrés', 'Providencia y Santa Catalina']
  },
  {
    id: 'santander',
    nombre: 'Santander',
    capital: 'Bucaramanga',
    municipios: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Socorro', 'Barbosa']
  },
  {
    id: 'sucre',
    nombre: 'Sucre',
    capital: 'Sincelejo',
    municipios: ['Sincelejo', 'Corozal', 'San Marcos', 'Tolú', 'Sampués', 'San Onofre']
  },
  {
    id: 'tolima',
    nombre: 'Tolima',
    capital: 'Ibagué',
    municipios: ['Ibagué', 'Espinal', 'Melgar', 'Chaparral', 'Líbano', 'Honda', 'Mariquita']
  },
  {
    id: 'valle_del_cauca',
    nombre: 'Valle del Cauca',
    capital: 'Cali',
    municipios: ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga', 'Jamundí', 'Yumbo', 'Candelaria']
  },
  {
    id: 'vaupes',
    nombre: 'Vaupés',
    capital: 'Mitú',
    municipios: ['Mitú', 'Carurú', 'Taraira', 'Pacoa', 'Yavaraté']
  },
  {
    id: 'vichada',
    nombre: 'Vichada',
    capital: 'Puerto Carreño',
    municipios: ['Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo']
  }
];
