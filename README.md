# Échele Camello — Plataforma de Servicios Certificados con Garantía Escrow

Proyecto formativo (Tecnólogo SENA) que conecta a personas que necesitan un servicio con trabajadores que lo ofrecen, permitiendo la búsqueda, contratación, comunicación y evaluación de servicios de manera segura y confiable.

---

## 1. Arquitectura de Desarrollo Enfocado a Microservicios

El proyecto está estructurado siguiendo el modelo de **Arquitectura de Dominios y 7 Microservicios** gobernados por un **API Gateway** central y un servidor de base de datos relacional organizado por dominio:

| # | Microservicio | Dominio | Entidades Propietarias | RF Principales | Patrones de Diseño |
|---|---|---|---|---|---|
| 1 | `ms-usuarios` | Usuarios e Identidad | `Usuario`, `Rol`, `Sesión` | RF-01 a RF-08, RF-052, RF-054, RF-059, RF-061 | `Repository`, `DTO`, `Adapter (correo)` |
| 2 | `ms-perfiles` | Perfiles de Trabajadores | `PerfilProfesional`, `Disponibilidad`, `Ubicación` | RF-09 a RF-017 | `Repository`, `DTO`, `Adapter (archivos/fotos)` |
| 3 | `ms-servicios` | Servicios y Categorías | `Servicio`, `Categoría` | RF-018 a RF-023, RF-053, RF-057 | `Repository`, `DTO`, `State (estado del servicio)` |
| 4 | `ms-busqueda` | Búsqueda y Geolocalización | *(Sin entidad propia, consume otros servicios)* | RF-024 a RF-032 | `Strategy`, `Adapter (mapas/geolocalización)`, `DTO` |
| 5 | `ms-solicitudes` | Solicitudes y Agendamiento | `SolicitudServicio`, `Programación` | RF-033 a RF-040 | `State`, `Observer`, `Repository`, `DTO` |
| 6 | `ms-comunicacion` | Comunicación y Notificaciones | `Conversación`, `Mensaje`, `Notificación` | RF-041 a RF-046 | `Observer / Publish-Subscribe`, `Adapter (archivos/correo/push)`, `Repository`, `DTO` |
| 7 | `ms-reputacion` | Reputación y Moderación | `Calificación`, `Reseña`, `Reporte` | RF-047 a RF-051, RF-055 | `State`, `Repository`, `DTO`, `Observer` |

### Patrones Globales (Todos los Microservicios)
- **Dependency Injection (`src/architecture/patterns/di/DIContainer.ts`)**: Contenedor IoC para inyección de repositorios, adaptadores y servicios.
- **Arquitectura por Capas (`src/microservices/DomainMicroservices.ts`)**: `Controller -> Service -> Repository -> DB`.
- **Repository (`src/architecture/patterns/repository/BaseRepository.ts`)**: Abstracción del acceso a datos con validación de la **Regla Clave**: *"Cada microservicio solo modifica las entidades de su propio dominio"*.
- **DTO (`src/architecture/patterns/dto/DTOMapper.ts`)**: Objetos de transferencia de datos que evitan exponer entidades internas directamente.
- **API Gateway (`src/architecture/gateway/ApiGateway.ts`)**: Punto de entrada único con Seguridad Transversal (RBAC) y Administración Transversal.

---

## 2. Control de Versiones e Informes con Liquibase + Switch de Rol (`Cliente` / `Trabajador` / `Admin`)

- En la barra de navegación superior (`Navbar`) se encuentra integrado el **Switch de Rol para Pruebas (`Cliente` | `Trabajador` | `Admin (Liquibase)`)**.
- Al seleccionar **`Admin (Liquibase)`**, se habilita y abre automáticamente el **Panel de Control Maestro, Liquibase y Microservicios**, que incluye:
  1. **Histórico de Versiones (`DATABASECHANGELOG`)**: Trazabilidad de los 25 changesets aplicados en `db/changelog/changesets/001` a `004`, filtrables por microservicio propietario y categoría.
  2. **Registro Interactivo de Changesets**: Permite registrar y simular migraciones en vivo desde la interfaz.
  3. **Informes en Página y Exportables (`JSON` y `CSV`)**: Reporte ejecutivo de cobertura por microservicio, tablas propietarias, patrones vinculados y estado de firmas MD5.
  4. **Pista de Auditoría Forense en Vivo (`audit_logs`)**: Conectada en tiempo real al bus de eventos `Observer / Publish-Subscribe`.
  5. **Laboratorio de los 7 Microservicios y Patrones de Diseño**: Consola interactiva para probar en vivo los patrones `State`, `Strategy`, `Repository`, `Adapter`, `Observer` y `DIContainer`.

---

## 3. Comandos del Proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción y verificar tipos TypeScript
npm run lint
npm run build

# Comandos de Liquibase (MySQL / XAMPP)
npm run db:status
npm run db:update
npm run db:history
npm run db:rollback
```
