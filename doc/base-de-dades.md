# Base de dades

- **Motor:** MySQL 8 (Docker, port local `3308`)
- **ORM:** TypeORM
- **Esquema SQL de referència:** `schema.sql` (arrel del repositori)
- **Entitats:** `backend/src/entities/*.entity.ts`

## Diagrama simplificat de relacions

```
grups ─────┬──── usuaris (alumnes, tutors)
           │
assignatures ──┬── matricules ── usuaris (alumnes)
               └── assignacions_docents ── usuaris (professors)

moduls ──┬── horaris
         ├── sessions
         ├── assistencies ── usuaris
         └── attendance_tokens

usuaris ──┬── justificacions
          ├── notes
          ├── sortides_aula
          ├── logs_auditoria
          ├── subscripcions_push
          └── dispositius

espais ── reserves ── usuaris
recursos ── usuaris (autor)
missatges ── usuaris
```

## Taules principals

### Núcleo académico

| Taula | Entitat | Descripció |
|-------|---------|------------|
| `usuaris` | `Usuari` | Tots els usuaris; camp `rol`: admin, professor, alumne, familia |
| `grups` | `Grup` | Grups formatius (codi, nom, aula, tutor) |
| `assignatures` | `Assignatura` | Matèries del centre |
| `moduls` | `Modul` | Instància docent (professor + grup + assignatura) |
| `matricules` | `Matricula` | Relació alumne–assignatura |
| `assignacions_docents` | `AssignacioDocent` | Relació professor–assignatura |
| `horaris` | `Horari` | Dies/hores de cada mòdul |
| `sessions` | `Sessio` | Sessió concreta de classe |

### Assistència

| Taula | Entitat | Descripció |
|-------|---------|------------|
| `assistencies` | `Assistencia` | Registre per sessió/alumne (present, retard, absent) |
| `attendance_tokens` | `AttendanceToken` | Tokens QR temporals |
| `sortides_aula` | `SortidaAula` | Sortides temporals (passadís) |
| `configuracio_centre` | `ConfiguracioCentre` | Minuts per retard/absència (singleton) |

### Altres dominis

| Taula | Entitat | Descripció |
|-------|---------|------------|
| `justificacions` | `Justificacio` | Justificants amb estat i arxiu |
| `notes` | `Nota` | Qualificacions per assignatura |
| `recursos` | `Recurs` | Fitxers del repositori |
| `missatges` | `Missatge` | Xat per sales |
| `espais` | `Espai` | Sales/laboratoris |
| `reserves` | `Reserva` | Reserves d'espais |
| `logs_auditoria` | `LogAuditoria` | Auditoria d'accions |
| `subscripcions_push` | `SubscripcioPush` | Claus push per usuari |
| `dispositius` | `Dispositiu` | Dispositius registrats |

## Camps JSON a `usuaris`

| Camp | Ús |
|------|-----|
| `dades_familiares` | Contactes família |
| `configuracio_usuari` | Preferències UI |
| `gamificacio_data` | Ratxa, punts, insígnies |

Definits a `users/interfaces/dades-usuari.interface.ts`.

## Configuració TypeORM

A `app.module.ts`:

- `synchronize: true` només si `NODE_ENV !== 'production'`
- `retryAttempts: 10` per esperar MySQL al arrencar Docker

## Migracions

```bash
cd backend
npm run migration:generate -- src/migrations/NomMigracio
npm run migration:run
```

La migració inicial: `migrations/1700000000000-InitialSchema.ts`.

## Seed de dades

Fitxers JSON a `backend/src/seed/data/`:

- `usuaris.json` — professors i alumnes de prova
- `grups.json` — grups 2DAW-A, 2DAM-A, etc.
- `assignatures.json` — mòduls DAW/DAM

Executar: `GET /api/seed/executar`

## Connexió manual (desenvolupament)

| Paràmetre | Valor per defecte (docker-compose) |
|-----------|-----------------------------------|
| Host | `localhost` |
| Port | `3308` |
| Database | `projecte_final` |
| User | `adsum_user` |
| Password | veure `docker-compose.yml` / `.env` |
