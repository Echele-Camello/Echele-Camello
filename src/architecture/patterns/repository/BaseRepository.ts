import { MicroserviceId } from '../../../types';

/**
 * PATRÓN GLOBAL: Repository (Abstracción del acceso a datos)
 * Regla clave de la arquitectura Échele Camello:
 * "Cada microservicio solo modifica las entidades de su propio dominio."
 */

export interface IRepository<T extends { id: string }, ID = string> {
  readonly ownerMicroservice: MicroserviceId;
  readonly entityName: string;
  findAll(): T[];
  findById(id: ID): T | undefined;
  findByPredicate(predicate: (item: T) => boolean): T[];
  save(entity: T, callerMicroservice: MicroserviceId): T;
  update(id: ID, partial: Partial<T>, callerMicroservice: MicroserviceId): T | undefined;
  delete(id: ID, callerMicroservice: MicroserviceId): boolean;
  replaceAll(items: T[], callerMicroservice?: MicroserviceId): void;
}

export class BaseDomainRepository<T extends { id: string }> implements IRepository<T, string> {
  protected items: Map<string, T> = new Map();

  constructor(
    public readonly ownerMicroservice: MicroserviceId,
    public readonly entityName: string,
    initialData: T[] = []
  ) {
    initialData.forEach((item) => this.items.set(item.id, { ...item }));
  }

  /**
   * Valida la regla clave de propiedad de entidades:
   * Solo el microservicio propietario (o la capa de administración transversal autorizada)
   * puede mutar las entidades de su dominio.
   */
  protected assertDomainOwnership(callerMicroservice: MicroserviceId): void {
    if (
      callerMicroservice !== this.ownerMicroservice &&
      callerMicroservice !== 'administracion-transversal'
    ) {
      throw new Error(
        `[Violación de Dominio] El microservicio "${callerMicroservice}" intentó modificar la entidad "${this.entityName}" que pertenece exclusivamente a "${this.ownerMicroservice}".`
      );
    }
  }

  public findAll(): T[] {
    return Array.from(this.items.values()).map((item) => ({ ...item }));
  }

  public findById(id: string): T | undefined {
    const found = this.items.get(id);
    return found ? { ...found } : undefined;
  }

  public findByPredicate(predicate: (item: T) => boolean): T[] {
    return this.findAll().filter(predicate);
  }

  public save(entity: T, callerMicroservice: MicroserviceId): T {
    this.assertDomainOwnership(callerMicroservice);
    const copy = { ...entity };
    this.items.set(copy.id, copy);
    return { ...copy };
  }

  public update(
    id: string,
    partial: Partial<T>,
    callerMicroservice: MicroserviceId
  ): T | undefined {
    this.assertDomainOwnership(callerMicroservice);
    const existing = this.items.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...partial };
    this.items.set(id, updated);
    return { ...updated };
  }

  public delete(id: string, callerMicroservice: MicroserviceId): boolean {
    this.assertDomainOwnership(callerMicroservice);
    return this.items.delete(id);
  }

  public replaceAll(items: T[], callerMicroservice?: MicroserviceId): void {
    if (callerMicroservice) {
      this.assertDomainOwnership(callerMicroservice);
    }
    this.items.clear();
    items.forEach((item) => this.items.set(item.id, { ...item }));
  }
}
