# Base de Datos y Control de Versiones con Liquibase — Échele Camello

Este módulo gestiona la base de datos relacional para el proyecto **Échele Camello** (`EcheleCamelloPrueba`), utilizando **MySQL** (instancia local de XAMPP) y **Liquibase** para el control de versiones, trazabilidad y despliegue automatizado de esquemas.

---

## 1. Configuración de Conexión (XAMPP MySQL)

| Parámetro | Valor por Defecto |
| :--- | :--- |
| **Motor** | MySQL / MariaDB (XAMPP) |
| **Host** | `localhost` / `127.0.0.1` |
| **Puerto** | `3306` |
| **Base de Datos** | `echelecamelloprueba` |
| **Usuario** | `root` |
| **Contraseña** | *(vacía por defecto en XAMPP)* |
| **Charset** | `utf8mb4` |
| **Collation** | `utf8mb4_unicode_ci` |

---

## 2. Estructura de Liquibase

```text
EcheleCamelloPrueba/
└── db/
    ├── changelog/
    │   ├── db.changelog-master.xml          # Registro maestro ordenado
    │   └── changesets/
    │       ├── 001_initial_schema.sql       # Tablas principales del sistema
    │       ├── 002_seed_data.sql            # Datos iniciales (usuarios, trabajadores, contratos)
    │       └── 003_escrow_and_security.sql  # Módulo de garantía Escrow, foro y auditoría
    ├── run-liquibase.ps1                    # Script ejecutor para PowerShell
    ├── run-liquibase.bat                    # Script ejecutor para CMD
    ├── liquibase.properties                 # Parámetros de conexión JDBC
    └── README.md                            # Esta documentación
```

---

## 3. Tablas Gestionadas

1. **`categories`**: Catálogo de oficios técnicos y servicios del hogar.
2. **`users`**: Usuarios del sistema (clientes, camelladores y administradores con perfiles, roles y billetera).
3. **`workers`**: Perfiles de trabajadores verificados con tarifas, zonas de cobertura y portafolios.
4. **`contracts`**: Contratos de prestación de servicios con soporte de custodia de pagos (**Escrow**).
5. **`chat_messages`**: Mensajería interna y ofertas formales vinculantes.
6. **`reviews`**: Reseñas, calificaciones y reputación bilateral.
7. **`disputes`**: Módulo de mediación y resolución de conflictos de pagos retenidos.
8. **`worker_announcements`**: Foro de camelladores, publicaciones y solicitudes directas.
9. **`notifications`**: Centro de notificaciones para usuarios.
10. **`payments`**: Transacciones financieras y trazabilidad de pasarelas (Nequi, PSE, etc.).
11. **`audit_logs`**: Pista de auditoría forense para eventos críticos y seguridad.
12. **`databasechangelog`** / **`databasechangeloglock`**: Metadatos automáticos de Liquibase.

---

## 4. Comandos Disponibles

Puedes ejecutar Liquibase directamente desde npm en la raíz del proyecto:

```bash
# Ver el estado de las migraciones pendientes / aplicadas
npm run db:status

# Aplicar migraciones y semillas pendientes
npm run db:update

# Ver el histórico cronológico de cambios aplicados en la base de datos
npm run db:history

# Revertir el último cambio aplicado (rollback)
npm run db:rollback
```

O mediante los scripts dedicados en la carpeta `db/`:
- **PowerShell**: `powershell -ExecutionPolicy Bypass -File db/run-liquibase.ps1 <comando>`
- **CMD**: `db\run-liquibase.bat <comando>`

