# Arquitectura del sistema

## Visió general

ADSUM és una aplicació **client-servidor** desacoblada:

```
┌─────────────────┐     REST (JSON)      ┌─────────────────┐
│  Frontend Vue 3 │ ◄──────────────────► │  Backend NestJS │
│  (Vite, :5173)  │     WebSocket        │  (Node, :3000)   │
└─────────────────┘ ◄──────────────────► └────────┬────────┘
                                                    │
                                                    │ TypeORM
                                                    ▼
                                           ┌─────────────────┐
                                           │   MySQL 8       │
                                           │   (Docker)      │
                                           └─────────────────┘
```

## Capas

| Capa | Tecnologia | Responsabilitat |
|------|------------|-----------------|
| Presentació | Vue 3 + Tailwind | UI per rol, formularis, QR, dashboards |
| API | NestJS | Validació, autenticació, regles de negoci |
| Persistència | TypeORM + MySQL | Usuaris, assistència, notes, reserves… |
| Temps real | Socket.io | QR dinàmic, actualitzacions d'aula, xat |
| Desplegament | Docker Compose | DB, backend i frontend en contenidors |

## Rols d'usuari (RBAC)

| Rol | Descripció | Vistes principals (frontend) |
|-----|------------|------------------------------|
| `admin` | Gestió global del centre | `DashboardAdmin` |
| `professor` | Sessions, QR, alumnes, justificacions | `DashboardProfessor`, `JustificationValidatorView` |
| `alumne` | Fitxatge, notes, agenda | `DashboardBento`, `CalculatorView`, `AttendanceStats` |
| `familia` | Seguiment del fill/a | `DashboardPares` |

L'autenticació és **JWT**. El token es genera a `POST /api/auth/login` i s'envia en cada petició protegida.

El guard `JwtAuthGuard` valida el token. El decorator `@Roles()` + `RolesGuard` (quan s'aplica) restringeix per rol.

## Flux principal: fitxatge amb QR

```
Professor                    Backend                         Alumnes
    │                           │                               │
    │ POST /api/assistencia/    │                               │
    │      generar              │                               │
    ├──────────────────────────►│ Crea AttendanceToken          │
    │                           ├──── WebSocket: new_qr ───────►│
    │                           │                               │
    │                           │◄── POST /api/assistencia/     │
    │                           │        validar                │
    │                           │    Registra Assistencia       │
    │◄── WebSocket: attendance_updated ─────────────────────────┤
```

1. El professor obre el modal QR (`DashboardProfessor.vue`).
2. El backend genera un token de curta durada (`AttendanceService.generateToken`).
3. El gateway emet `new_qr` a la sala `module_{id}`.
4. L'alumne escaneja o introdueix el token → `validar`.
5. Es crea un registre a `assistencies` i es notifica la sala.

## Flux d'autenticació

```
Login.vue → POST /api/auth/login → AuthService.validateUser (bcrypt)
         ← { access_token, user } ← AuthService.login (JWT signat)
         → localStorage + App.vue carrega vista segons user.rol
```

## Mòduls backend (dominis)

| Mòdul | Carpeta | Funció |
|-------|---------|--------|
| Auth | `auth/` | Login, recuperació de contrasenya |
| Users | `users/` | CRUD usuaris, estadístiques, horari, notes |
| Attendance | `attendance/` | QR, validació, sortides d'aula |
| Justifications | `justifications/` | Pujada i validació de justificants |
| Booking | `booking/` | Reserva d'espais |
| Resources | `resources/` | Repositori de fitxers |
| Notifications | `notifications/` | Subscripcions Web Push |
| Chat | `chat/` | Missatgeria en temps real |
| AI | `ai/` | Assistent (consultes contextuals) |
| Export | `export/` | Exportació a Google Sheets |
| Seed | `seed/` | Dades de prova (dev) |
| Logs | `logs/` | Winston, auditoria, filtres d'error |

## Frontend: organització per rols

`App.vue` és el **router manual**: segons `currentUser.rol` i `activeView` renderitza una vista o una altra dins de `AppShell.vue` (layout amb sidebar).

No s'utilitza `vue-router`; la navegació és per estat (`activeView`: `home`, `calendar`, `performance`, etc.).

## Variables d'entorn rellevants

| Variable | On | Descripció |
|----------|-----|------------|
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Backend | Connexió MySQL |
| `JWT_SECRET` | Backend | Signatura del token |
| `FRONTEND_URL` | Backend | CORS i WebSocket |
| `VITE_API_URL` | Frontend | URL base de l'API |
| `NODE_ENV` | Backend | `production` desactiva `synchronize` de TypeORM |

## Desplegament

- **Desenvolupament:** `docker-compose.yml` + `npm run start:dev` / `npm run dev`
- **Producció:** `docker-compose.prod.yml`, secrets a `secrets/`, frontend buildat amb Vite

Veure [README principal](../README.md) per ordres concretes.
