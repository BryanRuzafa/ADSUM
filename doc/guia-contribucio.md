# Guia de contribució

Aquest document està pensat per a algú que vol **ajudar en el projecte** i no coneix encara el codi.

## Requisits

- Node.js 18+
- Docker i Docker Compose
- Git
- Editor amb suport TypeScript (VS Code / Cursor recomanat)

## Configuració inicial (15 minuts)

```bash
# 1. Clonar i entrar al projecte
git clone <url-del-repositori>
cd projecte-final-2025-26-daw-adsum_grup4

# 2. Base de dades
docker-compose up -d

# 3. Backend
cd backend
cp .env.example .env   # si existeix; sinó crear .env amb DB_HOST, DB_PORT, etc.
npm install
npm run start:dev

# 4. Frontend (altra terminal)
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

### Poblar dades de prova

```http
GET http://localhost:3000/api/seed/executar
```

Credencials de demo: veure `credenciales-prova.md` a l'arrel (només desenvolupament).

## On començar segons el que vulguis fer

| Vols treballar en… | Comença per… |
|--------------------|--------------|
| Login, permisos, JWT | `backend/src/auth/` |
| QR i fitxatge | `backend/src/attendance/` + `frontend/src/components/alumne/AttendanceRegister.vue` |
| Panell de l'alumne | `frontend/src/views/DashboardBento.vue` |
| Panell del professor | `frontend/src/views/DashboardProfessor.vue` |
| Base de dades / nous camps | `backend/src/entities/` + migració a `backend/src/migrations/` |
| Nova pantalla | Nova vista a `frontend/src/views/` + registre a `App.vue` / `AppShell.vue` |
| Nova API REST | Mòdul NestJS: `*.module.ts`, `*.controller.ts`, `*.service.ts` |

## Convencions del projecte

### Idioma

- Codi i comentaris: preferència per **català** en noms de domini (`assistencia`, `justificacions`, `contrasenya`).
- Variables tècniques en anglès quan és estàndard (`id`, `token`, `service`).

### Backend (NestJS)

- Un **mòdul** per funcionalitat: `auth`, `attendance`, `users`, etc.
- Lògica de negoci als **serveis** (`*.service.ts`), no als controladors.
- Entitats TypeORM a `backend/src/entities/`.
- Rutes API sota el prefix `api/` (ex: `api/usuaris`, `api/assistencia`).
- Endpoints protegits: `@UseGuards(JwtAuthGuard)` + header `Authorization: Bearer <token>`.

### Frontend (Vue 3)

- Composition API amb `<script setup>`.
- Crides HTTP via `getApiUrl()` de `frontend/src/config/api.js`.
- Token JWT a `localStorage` (`access_token`, `user`).
- Navegació per **vistes** (`activeView`) dins de `App.vue`, no Vue Router.

### Branques i commits

- Una branca per funcionalitat o correcció.
- Commits descriptius en català o castellà.
- No pujar `.env`, `secrets/` ni credencials.

## Flux típic per afegir un endpoint

1. Definir o modificar entitat a `entities/` si cal persistència.
2. Afegir mètode al `*.service.ts`.
3. Exposar ruta al `*.controller.ts` amb el prefix `api/`.
4. Documentar a Swagger (es genera automàticament; afegir `@ApiTags` si es crea un controlador nou).
5. Consumir des del frontend amb `fetch(getApiUrl('...'), { headers: { Authorization: 'Bearer ' + token } })`.
6. Actualitzar [api.md](api.md) si el canvi és rellevant.

## Proves

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Dubtes freqüents

**No veig les rutes a Swagger**  
Assegura't que el controlador està registrat al `*.module.ts` i que el backend s'ha reiniciat.

**Error de connexió a MySQL**  
Comprova que Docker està actiu (`docker-compose ps`) i que les variables `DB_*` del `.env` coincideixen amb `docker-compose.yml` (port `3308` en local).

**El frontend no arriba a l'API**  
Revisa `VITE_API_URL` o el proxy de Vite; per defecte usa `/api` (relatiu).

## Contacte i equip

Projecte final CFGS DAW — Grup 4 (curs 2025-2026).  
Per dubtes de negoci o prioritats, coordinar amb el tutor del projecte.
