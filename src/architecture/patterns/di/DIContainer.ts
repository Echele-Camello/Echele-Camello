/**
 * PATRÓN GLOBAL: Dependency Injection (Inyección de Dependencias)
 * Contenedor IoC ligero utilizado por todos los 7 microservicios y el API Gateway
 * para desacoplar la creación de Repositorios, Adaptadores, Servicios y Controladores.
 */

type Factory<T> = (container: DIContainer) => T;

interface Registration<T = unknown> {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
  microserviceOwner?: string;
}

export class DIContainer {
  private static globalInstance: DIContainer;
  private registry = new Map<string, Registration>();

  public static getInstance(): DIContainer {
    if (!DIContainer.globalInstance) {
      DIContainer.globalInstance = new DIContainer();
    }
    return DIContainer.globalInstance;
  }

  /**
   * Registra una dependencia como Singleton (instancia única compartida)
   */
  public registerSingleton<T>(
    token: string,
    factory: Factory<T>,
    microserviceOwner?: string
  ): void {
    this.registry.set(token, {
      factory,
      singleton: true,
      microserviceOwner
    });
  }

  /**
   * Registra una dependencia como Transient (nueva instancia en cada resolución)
   */
  public registerTransient<T>(
    token: string,
    factory: Factory<T>,
    microserviceOwner?: string
  ): void {
    this.registry.set(token, {
      factory,
      singleton: false,
      microserviceOwner
    });
  }

  /**
   * Resuelve e inyecta la dependencia solicitada por su token identificador
   */
  public resolve<T>(token: string): T {
    const registration = this.registry.get(token);
    if (!registration) {
      throw new Error(`[DIContainer] Dependencia no registrada para el token: "${token}"`);
    }

    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory(this);
      }
      return registration.instance as T;
    }

    return registration.factory(this) as T;
  }

  /**
   * Devuelve el listado de dependencias inyectadas para inspección arquitectónica
   */
  public getRegisteredDependencies(): { token: string; singleton: boolean; microserviceOwner: string; initialized: boolean }[] {
    return Array.from(this.registry.entries()).map(([token, reg]) => ({
      token,
      singleton: reg.singleton,
      microserviceOwner: reg.microserviceOwner || 'global-transversal',
      initialized: Boolean(reg.instance)
    }));
  }
}

