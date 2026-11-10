/**
 * PATRÓN: Adapter (Integración con servicios externos)
 * Implementado en los 4 microservicios definidos en la arquitectura de Échele Camello:
 * 1. ms-usuarios -> Adapter (correo): Envío de OTP, verificación y recuperación de contraseña
 * 2. ms-perfiles -> Adapter (archivos/fotos): Almacenamiento de fotos de portafolio, cédula y selfie
 * 3. ms-busqueda -> Adapter (mapas/geolocalización): Geocodificación y cálculo de distancia Haversine
 * 4. ms-comunicacion -> Adapter (archivos/correo/push): Despacho multicanal de notificaciones y adjuntos
 */

// ============================================================================
// 1. ADAPTER DE CORREO ELECTRÓNICO (ms-usuarios)
// ============================================================================
export interface IEmailAdapter {
  readonly providerName: string;
  sendVerificationEmail(email: string, userName: string, otpCode: string): { sent: boolean; messageId: string; timestamp: string };
  sendPasswordRecoveryEmail(email: string): { sent: boolean; recoveryToken: string; timestamp: string };
}

export class SmtpEmailAdapter implements IEmailAdapter {
  public readonly providerName = 'SendGrid / SMTP Colombia Adapter (ms-usuarios)';

  public sendVerificationEmail(email: string, userName: string, otpCode: string) {
    return {
      sent: true,
      messageId: `msg-smtp-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }

  public sendPasswordRecoveryEmail(email: string) {
    return {
      sent: true,
      recoveryToken: `rec-tok-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// 2. ADAPTER DE ARCHIVOS Y FOTOS (ms-perfiles)
// ============================================================================
export interface IFileStorageAdapter {
  readonly providerName: string;
  uploadProfileDocument(workerId: string, fileType: 'cedula_frente' | 'cedula_reverso' | 'selfie' | 'portafolio', rawUrlOrBase64: string): {
    secureUrl: string;
    checksumSha256: string;
    bucket: string;
  };
}

export class CloudFileStorageAdapter implements IFileStorageAdapter {
  public readonly providerName = 'AWS S3 / Cloud Storage Adapter (ms-perfiles)';

  public uploadProfileDocument(
    workerId: string,
    fileType: 'cedula_frente' | 'cedula_reverso' | 'selfie' | 'portafolio',
    rawUrlOrBase64: string
  ) {
    return {
      secureUrl: rawUrlOrBase64 || `https://cdn.echelecamello.co/${workerId}/${fileType}_${Date.now()}.jpg`,
      checksumSha256: `sha256:${Math.random().toString(16).slice(2, 18)}`,
      bucket: 'echele-camello-verificaciones-col'
    };
  }
}

// ============================================================================
// 3. ADAPTER DE MAPAS Y GEOLOCALIZACIÓN (ms-busqueda)
// ============================================================================
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface IGeoLocationAdapter {
  readonly providerName: string;
  getCityCoordinates(cityName: string): GeoCoordinates;
  getWorkerCoordinates(workerId: string, cityName: string): GeoCoordinates;
  calculateDistanceKm(origin: GeoCoordinates, destination: GeoCoordinates): number;
}

const COLOMBIA_CITY_COORDS: Record<string, GeoCoordinates> = {
  'Bogotá D.C.': { lat: 4.6362, lng: -74.0722 },
  'Medellín': { lat: 6.2442, lng: -75.5812 },
  'Cali': { lat: 3.4516, lng: -76.5320 },
  'Barranquilla': { lat: 10.9685, lng: -74.7813 },
  'Bucaramanga': { lat: 7.1193, lng: -73.1227 },
  'Cartagena': { lat: 10.3910, lng: -75.4794 },
  'Pereira': { lat: 4.8133, lng: -75.6961 },
  'Manizales': { lat: 5.0703, lng: -75.5138 }
};

const WORKER_SPECIFIC_COORDS: Record<string, GeoCoordinates> = {
  'wk-carlos-mendoza': { lat: 4.6486, lng: -74.0583 }, // Chapinero (~1.9 km de Teusaquillo)
  'wk-gloria-amparo': { lat: 4.7180, lng: -74.0420 },  // Cedritos (~9.6 km)
  'wk-jorge-herrera': { lat: 4.6680, lng: -74.1220 },  // Fontibón / Salitre (~6.5 km)
  'wk-marlon-ramirez': { lat: 4.6280, lng: -74.1460 }, // Kennedy (~8.2 km)
  'wk-lucia-hernandez': { lat: 4.6950, lng: -74.0320 }, // Usaquén (~7.9 km)
  'wk-mateo-cerrajero': { lat: 6.2088, lng: -75.5670 }, // El Poblado, Medellín
  'wk-valentina-carpinteria': { lat: 3.3760, lng: -76.5280 }, // Valle del Lili, Cali
  'wk-pedro-acabados': { lat: 10.9980, lng: -74.8020 }, // El Prado, Barranquilla
  'wk-esteban-jardineria': { lat: 7.1160, lng: -73.1090 } // Cabecera, Bucaramanga
};

export class ColombiaGeoMapAdapter implements IGeoLocationAdapter {
  public readonly providerName = 'OpenStreetMap / Google Maps Haversine Adapter (ms-busqueda)';

  public getCityCoordinates(cityName: string): GeoCoordinates {
    return COLOMBIA_CITY_COORDS[cityName] || COLOMBIA_CITY_COORDS['Bogotá D.C.'];
  }

  public getWorkerCoordinates(workerId: string, cityName: string): GeoCoordinates {
    if (WORKER_SPECIFIC_COORDS[workerId]) {
      return WORKER_SPECIFIC_COORDS[workerId];
    }
    return this.getCityCoordinates(cityName);
  }

  /**
   * Calcula la distancia ortodrómica en kilómetros usando la fórmula de Haversine
   */
  public calculateDistanceKm(origin: GeoCoordinates, destination: GeoCoordinates): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }
}

// ============================================================================
// 4. ADAPTER MULTICANAL DE COMUNICACIÓN Y NOTIFICACIONES (ms-comunicacion)
// ============================================================================
export interface INotificationChannelAdapter {
  readonly providerName: string;
  dispatchNotification(channel: 'PUSH' | 'EMAIL' | 'ATTACHMENT', recipient: string, title: string, body: string): {
    delivered: boolean;
    channel: string;
    externalId: string;
  };
}

export class MultiChannelNotificationAdapter implements INotificationChannelAdapter {
  public readonly providerName = 'Firebase Push + SMTP + Cloud Attachment Adapter (ms-comunicacion)';

  public dispatchNotification(
    channel: 'PUSH' | 'EMAIL' | 'ATTACHMENT',
    recipient: string,
    title: string,
    body: string
  ) {
    return {
      delivered: true,
      channel,
      externalId: `notif-${channel.toLowerCase()}-${Date.now()}`
    };
  }
}
