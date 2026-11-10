import { WorkerProfile } from '../../../types';
import { BusquedaCriteriaDTO, ResultadoBusquedaWorkerDTO } from '../dto/DTOMapper';
import { IGeoLocationAdapter } from '../adapter/ExternalAdapters';

/**
 * PATRÓN: Strategy (Criterios de Búsqueda y Ordenamiento Dinámicos en ms-busqueda)
 * RF-024 a RF-032: Permite intercambiar en tiempo de ejecución el algoritmo de ordenamiento
 * y puntuación de trabajadores (por cercanía geográfica Haversine, calificación, tarifa,
 * experiencia o relevancia multicriterio) sin acoplar la vista ni el controlador.
 */

export interface ISearchSortStrategy {
  readonly strategyName: BusquedaCriteriaDTO['estrategiaOrdenamiento'];
  readonly description: string;
  sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[];
}

export class ProximitySearchStrategy implements ISearchSortStrategy {
  public readonly strategyName = 'cercania' as const;
  public readonly description = 'Ordena por menor distancia geográfica en km (Fórmula Haversine - RF-028)';

  public sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[] {
    return [...results].sort((a, b) => a.distanciaKm - b.distanciaKm);
  }
}

export class RatingSearchStrategy implements ISearchSortStrategy {
  public readonly strategyName = 'calificacion' as const;
  public readonly description = 'Ordena por mayor calificación promedio (1 a 5 estrellas) y respaldo de reseñas';

  public sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[] {
    return [...results].sort(
      (a, b) =>
        b.worker.calificacionPromedio - a.worker.calificacionPromedio ||
        b.worker.serviciosCompletados - a.worker.serviciosCompletados
    );
  }
}

export class PriceAscSearchStrategy implements ISearchSortStrategy {
  public readonly strategyName = 'precio_menor' as const;
  public readonly description = 'Ordena desde la tarifa por hora más económica en COP';

  public sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[] {
    return [...results].sort((a, b) => a.worker.tarifaPorHora - b.worker.tarifaPorHora);
  }
}

export class PriceDescSearchStrategy implements ISearchSortStrategy {
  public readonly strategyName = 'precio_mayor' as const;
  public readonly description = 'Ordena desde la tarifa especializada más alta en COP';

  public sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[] {
    return [...results].sort((a, b) => b.worker.tarifaPorHora - a.worker.tarifaPorHora);
  }
}

export class ExperienceSearchStrategy implements ISearchSortStrategy {
  public readonly strategyName = 'experiencia' as const;
  public readonly description = 'Ordena por mayor cantidad de servicios completados exitosamente con Escrow';

  public sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[] {
    return [...results].sort(
      (a, b) => b.worker.serviciosCompletados - a.worker.serviciosCompletados
    );
  }
}

export class RelevanceSearchStrategy implements ISearchSortStrategy {
  public readonly strategyName = 'relevancia' as const;
  public readonly description = 'Pondera verificación de identidad, disponibilidad inmediata, calificación y cercanía';

  public sort(results: ResultadoBusquedaWorkerDTO[]): ResultadoBusquedaWorkerDTO[] {
    return [...results].sort((a, b) => b.puntajeRelevancia - a.puntajeRelevancia);
  }
}

export class SearchStrategyContext {
  private strategies: Map<BusquedaCriteriaDTO['estrategiaOrdenamiento'], ISearchSortStrategy> = new Map();

  constructor(private readonly geoAdapter: IGeoLocationAdapter) {
    this.registerStrategy(new RelevanceSearchStrategy());
    this.registerStrategy(new ProximitySearchStrategy());
    this.registerStrategy(new RatingSearchStrategy());
    this.registerStrategy(new PriceAscSearchStrategy());
    this.registerStrategy(new PriceDescSearchStrategy());
    this.registerStrategy(new ExperienceSearchStrategy());
  }

  public registerStrategy(strategy: ISearchSortStrategy): void {
    this.strategies.set(strategy.strategyName, strategy);
  }

  public getAvailableStrategies(): { name: string; description: string }[] {
    return Array.from(this.strategies.values()).map((s) => ({
      name: s.strategyName,
      description: s.description
    }));
  }

  public executeSearch(
    workers: WorkerProfile[],
    criteria: BusquedaCriteriaDTO
  ): ResultadoBusquedaWorkerDTO[] {
    const referenceCoords =
      criteria.coordenadasCliente ||
      this.geoAdapter.getCityCoordinates(
        criteria.ciudad && criteria.ciudad !== 'all' ? criteria.ciudad : 'Bogotá D.C.'
      );

    // 1. Filtrado multicriterio (RF-024 a RF-031)
    const filtered = workers.filter((worker) => {
      if (criteria.termino && criteria.termino.trim()) {
        const q = criteria.termino.toLowerCase();
        const matches =
          worker.nombre.toLowerCase().includes(q) ||
          worker.categoriaNombre.toLowerCase().includes(q) ||
          worker.especialidades.some((s) => s.toLowerCase().includes(q)) ||
          worker.descripcion.toLowerCase().includes(q) ||
          worker.ciudad.toLowerCase().includes(q) ||
          worker.barrio.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (criteria.categoriaId && criteria.categoriaId !== 'all' && worker.categoriaId !== criteria.categoriaId) {
        return false;
      }

      if (criteria.ciudad && criteria.ciudad !== 'all') {
        const normWorkerCity = worker.ciudad.toLowerCase();
        const normSelected = criteria.ciudad.toLowerCase();
        if (!normWorkerCity.includes(normSelected) && !normSelected.includes(normWorkerCity)) {
          return false;
        }
      }

      if (criteria.soloDisponibles && !worker.disponible) return false;
      if (criteria.soloVerificados && !worker.verificado) return false;

      if (criteria.horario && criteria.horario !== 'all') {
        const sched = worker.horarioAtencion.toLowerCase();
        if (criteria.horario === '24h' && !sched.includes('24')) return false;
        if (criteria.horario === 'manana' && !sched.includes('am') && !sched.includes('7') && !sched.includes('8') && !sched.includes('6')) return false;
        if (criteria.horario === 'tarde' && !sched.includes('pm') && !sched.includes('sábado') && !sched.includes('viernes')) return false;
        if (criteria.horario === 'jornada_completa' && !sched.includes('lunes a') && !sched.includes('todos los días')) return false;
      }

      if (typeof criteria.precioMinCOP === 'number' && worker.tarifaPorHora < criteria.precioMinCOP) {
        return false;
      }
      if (typeof criteria.precioMaxCOP === 'number' && worker.tarifaPorHora > criteria.precioMaxCOP) {
        return false;
      }
      if (typeof criteria.calificacionMinima === 'number' && criteria.calificacionMinima > 0 && worker.calificacionPromedio < criteria.calificacionMinima) {
        return false;
      }

      return true;
    });

    // 2. Enriquecimiento con Geolocalización Adapter y cálculo de puntaje
    const enriched: ResultadoBusquedaWorkerDTO[] = filtered.map((worker) => {
      const workerCoords = this.geoAdapter.getWorkerCoordinates(worker.id, worker.ciudad);
      const distanciaKm = this.geoAdapter.calculateDistanceKm(referenceCoords, workerCoords);
      const dentroDeRadioCobertura = distanciaKm <= worker.radioKm;

      const puntajeRelevancia =
        (worker.verificado ? 30 : 0) +
        (worker.disponible ? 25 : 0) +
        worker.calificacionPromedio * 8 +
        Math.max(0, 15 - distanciaKm * 0.5);

      return {
        worker,
        distanciaKm,
        puntajeRelevancia: Number(puntajeRelevancia.toFixed(2)),
        dentroDeRadioCobertura
      };
    });

    // 3. Aplicación del Patrón Strategy seleccionado
    const strategy =
      this.strategies.get(criteria.estrategiaOrdenamiento) ||
      this.strategies.get('relevancia')!;

    return strategy.sort(enriched);
  }
}

