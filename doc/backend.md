# Backend — NestJS

Codi a `backend/src/`. Patró **modular** de NestJS: cada funcionalitat té `Module` + `Controller` + `Service`.

## Punt d'entrada

| Fitxer | Funció |
|--------|--------|
| `main.ts` | Bootstrap, CORS, ValidationPipe, **Swagger** (`/api/docs`) |
| `app.module.ts` | Registre de tots els mòduls i entitats TypeORM |

## Mòduls i classes

### `auth/` — Autenticació

| Classe | Fitxer | Descripció |
|--------|--------|------------|
| `AuthModule` | `auth.module.ts` | Importa JwtModule, Passport |
| `AuthController` | `auth.controller.ts` | `POST login`, recuperació contrasenya |
| `AuthService` | `auth.service.ts` | Validació bcrypt, generació JWT, logs d'accés |
| `JwtStrategy` | `jwt.strategy.ts` | Extracció del payload del token |
| `JwtAuthGuard` | `jwt-auth.guard.ts` | Guard global per rutes protegides |
| `LoginDto` | `dto/login.dto.ts` | Validació email + contrasenya |

### `users/` — Usuaris i rendiment acadèmic

| Classe | Fitxer | Descripció |
|--------|--------|------------|
| `UsersController` | `users.controller.ts` | CRUD, stats, mòduls professor, alumnes per mòdul |
| `UsersService` | `users.service.ts` | Lògica d'usuaris, estadístiques, horaris |
| `NotesController` | `notes.controller.ts` | Notes per alumne (ruta legacy `/notes`) |
| `NotesService` | `notes.service.ts` | Mitjanes i llistat de notes |

### `attendance/` — Assistència

| Classe | Fitxer | Descripció |
|--------|--------|------------|
| `AttendanceController` | `attendance.controller.ts` | Generar/validar QR, manual, sortida/tornada |
| `AttendanceService` | `attendance.service.ts` | Tokens QR, registre assistència, passadís |
| `AttendanceGateway` | `attendance.gateway.ts` | WebSocket: sales per mòdul, `new_qr`, `attendance_updated` |
| `AttendanceModule` | `attendance.module.ts` | Registre gateway + servei |

### `justifications/`

| Classe | Descripció |
|--------|------------|
| `JustificationsController` | Pujar fitxer, llistar, validar (professor) |
| `JustificationsService` | Persistència `Justificacio`, estats |

### `booking/`

| Classe | Descripció |
|--------|------------|
| `BookingController` | Espais, reserves de l'usuari, crear/cancel·lar |
| `BookingService` | Lògica de `Espai` i `Reserva` |

### `resources/`

| Classe | Descripció |
|--------|------------|
| `ResourcesController` | Llistar recursos; descàrrega amb token JWT a query |
| `ResourcesService` | Fitxers a disc (`uploads/`) |

### `notifications/`

| Classe | Descripció |
|--------|------------|
| `NotificacionsController` | `POST subscriure` — Web Push |
| `NotificacionsService` | Guarda `SubscripcioPush`, envia notificacions |

### `chat/`

| Classe | Descripció |
|--------|------------|
| `ChatGateway` | Namespace `/chat`, sales, historial, missatges |
| `ChatModule` | Registre del gateway i entitat `Missatge` |

### `ai/`

| Classe | Descripció |
|--------|------------|
| `AiController` | `POST consultar` — resposta contextual per alumne |
| `AiService` | Integració amb servei d'IA (consultes) |

### `export/`

| Classe | Descripció |
|--------|------------|
| `ExportController` | Exportació de dades de mòdul a Google Sheets |
| `ExportService` | Generació CSV / API Sheets |

### `groups/`

| Classe | Descripció |
|--------|------------|
| `GroupsController` | `GET /api/grups` — llistat amb alumnes |

### `seed/` (només desenvolupament)

| Classe | Descripció |
|--------|------------|
| `SeedController` | `GET executar`, `GET status` |
| `SeedService` | Carrega JSON de `seed/data/` (usuaris, grups, assignatures) |

### `logs/`

| Classe | Descripció |
|--------|------------|
| `LogsService` | Registre Winston (fitxers rotatius) |
| `RolesGuard` | Control d'accés per rol (`@Roles()`) |
| `HttpErrorFilter` | Captura errors HTTP i els registra |

## Entitats TypeORM (`entities/`)

Totes les entitats estan registrades a `app.module.ts`. Resum:

| Entitat | Taula | Descripció |
|---------|-------|------------|
| `Usuari` | `usuaris` | Usuaris de tots els rols |
| `Grup` | `grups` | Grups de classe (2DAW-A, etc.) |
| `Assignatura` | `assignatures` | Assignatures del centre |
| `Modul` | `moduls` | Mòduls impartits (enllaç professor-grup) |
| `Matricula` | `matricules` | Alumne ↔ assignatura |
| `AssignacioDocent` | `assignacions_docents` | Professor ↔ assignatura |
| `Horari` | `horaris` | Franja horària per mòdul |
| `Sessio` | `sessions` | Sessió de classe concreta |
| `Assistencia` | `assistencies` | Registre de presència |
| `AttendanceToken` | `attendance_tokens` | Token QR temporal |
| `SortidaAula` | `sortides_aula` | Passadís / sortida temporal |
| `Justificacio` | `justificacions` | Justificants de falta |
| `Nota` | `notes` | Qualificacions |
| `Recurs` | `recursos` | Fitxers del repositori |
| `Missatge` | `missatges` | Xat |
| `Espai` | `espais` | Sales reservables |
| `Reserva` | `reserves` | Reserves d'espais |
| `LogAuditoria` | `logs_auditoria` | Traça d'accions |
| `SubscripcioPush` | `subscripcions_push` | Endpoints push |
| `Dispositiu` | `dispositius` | Dispositius vinculats |
| `ConfiguracioCentre` | `configuracio_centre` | Regles de retard/absència |

Detall de relacions: [base-de-dades.md](base-de-dades.md).

## Migracions

- Carpeta: `backend/src/migrations/`
- Comandaments: `npm run migration:generate`, `npm run migration:run`
- En desenvolupament, `synchronize: true` (si `NODE_ENV !== 'production'`) pot crear taules automàticament; en producció usar migracions.

## Seguretat

- Contrasenyes amb **bcrypt** (`contrasenya_hash`).
- JWT amb caducitat configurada al `AuthModule`.
- `ValidationPipe` global amb `whitelist: true`.
- Fitxers de justificació a `uploads/justificacions/` (multer).
- Docker Secrets en producció per credencials DB.

## Proves

- Tests unitaris: `*.spec.ts` (Jest)
- Executar: `npm test` des de `backend/`
