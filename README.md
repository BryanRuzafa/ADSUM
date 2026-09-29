# ADSUM — Sistema de Gestió d'Assistència Intel·ligent

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vue.js-42B883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js"/>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
</p>

<p align="center">
  <strong>« Adsum »</strong> — del llatí <em>“Sóc aquí”</em>.<br/>
  Plataforma web per digitalitzar el control d'assistència amb <strong>codis QR dinàmics</strong>, <strong>temps real</strong> i gestió integral de la comunitat educativa.
</p>

<p align="center">
  🌐 <a href="https://adsum.cat">adsum.cat</a> · Projecte Final CFGS DAW · Grup 5 · Curs 2025-2026
</p>

---

## Taula de continguts

- [Descripció del projecte](#descripció-del-projecte)
- [Característiques principals](#característiques-principals)
- [Documentació](#documentació)
- [Inici ràpid — com arrencar el projecte](#inici-ràpid--com-arrencar-el-projecte)
- [Credencials de prova](#credencials-de-prova)
- [API REST](#api-rest)
- [Arquitectura](#arquitectura)
- [Desplegament en producció](#desplegament-en-producció)
- [Manual d'usuari](#manual-dusuari)
- [Estructura del repositori](#estructura-del-repositori)
- [Equip de desenvolupament](#equip-de-desenvolupament)

---

## Descripció del projecte

**ADSUM** és una solució tecnològica dissenyada per als centres educatius que volen substituir el paper i les llistes manuals per un sistema digital, segur i basat en dades.

| Aspecte | Detall |
|---------|--------|
| **Problema** | Passar llista és lent, poc traçable i els QR estàtics es poden compartir |
| **Solució** | QR dinàmic amb caducitat, WebSockets i panells per a cada rol |
| **Públic** | Instituts, CFGS, formació professional |
| **Rols** | Administrador · Professor · Alumne · Família |

Connecta la tradició acadèmica (*“Sóc aquí”*) amb una arquitectura moderna **Vue 3 + NestJS + MySQL**, desplegable amb **Docker**.

---

## Característiques principals

| Àrea | Funcionalitat |
|------|----------------|
| **Assistència** | QR dinàmic anti-frau, fitxatge des del mòbil, marcatge manual del professor |
| **Temps real** | Socket.io — actualització instantània de llistes i codis QR |
| **Seguretat** | JWT, RBAC per rols, bcrypt, logs d'auditoria (Winston) |
| **Alumne** | Dashboard, notes, simulador, historial assistència, Hall Pass |
| **Professor** | Generació QR per mòdul, validació justificacions, toolkit d'aula |
| **Família** | Seguiment del fill/a, justificacions, notificacions push |
| **Admin** | Gestió usuaris i configuració del centre |
| **Altres** | Reserves d'espais, repositori, xat, assistent IA, exportació |
| **PWA** | Instal·lable al mòbil, mode offline parcial, push notifications |

---

## Documentació

### Índex general

Tota la documentació tècnica i d'entrega es troba a la carpeta **[`doc/`](doc/README.md)**.

| Document | Descripció |
|----------|------------|
| [**doc/README.md**](doc/README.md) | Índex de la documentació — **comença aquí si col·labores en el codi** |
| [**doc/manual-usuari.md**](doc/manual-usuari.md) | Manual d'usuari complet (per rol) |
| [**doc/guia-contribucio.md**](doc/guia-contribucio.md) | Configuració, convencions i flux per afegir funcionalitats |
| [**doc/arquitectura.md**](doc/arquitectura.md) | Capes del sistema, rols i fluxos principals |
| [**doc/backend.md**](doc/backend.md) | Mòduls NestJS, serveis, entitats i guards |
| [**doc/frontend.md**](doc/frontend.md) | Vistes Vue 3, components i navegació per rol |
| [**doc/api.md**](doc/api.md) | Referència REST completa |
| [**doc/websockets.md**](doc/websockets.md) | Esdeveniments Socket.io (assistència i xat) |
| [**doc/base-de-dades.md**](doc/base-de-dades.md) | Esquema MySQL, entitats TypeORM i relacions |
| [**doc/mockups-wireframes.md**](doc/mockups-wireframes.md) | Flux de pantalles i wireframes |
| [**doc/diagramas-uml-er.md**](doc/diagramas-uml-er.md) | Diagrames UML, activitats i E/R |
| [**doc/mockups/**](doc/mockups/README.md) | Carpeta per captures de pantalla |

### Documentació d'entrega (PDF)

| Document | Fitxer |
|----------|--------|
| Presentació comercial | [`doc/comercial_2526_2DAW_Projecte_ADSUM.pdf`](doc/comercial_2526_2DAW_Projecte_ADSUM.pdf) |
| Presentació tècnica | [`doc/tecnica_2526_2DAW_Projecte_ADSUM (2).pdf`](doc/tecnica_2526_2DAW_Projecte_ADSUM%20(2).pdf) |
| Resum del projecte | [`doc/resum_2526_2DAW_Projecte_ADSUM .pdf`](doc/resum_2526_2DAW_Projecte_ADSUM%20.pdf) |

### API interactiva (Swagger)

Amb el backend en marxa:

| Recurs | URL |
|--------|-----|
| **Swagger UI** | http://localhost:3000/api/docs |
| **OpenAPI JSON** | http://localhost:3000/api/docs-json |

> Login → copia `access_token` → **Authorize** a Swagger per provar endpoints protegits.

### Altres fitxers útils

| Fitxer | Contingut |
|--------|-----------|
| [`schema.sql`](schema.sql) | Esquema MySQL de referència |
| [`backend/README.md`](backend/README.md) | Comandes i variables del backend |
| [`frontend/README.md`](frontend/README.md) | Comandes del frontend |

---

## Inici ràpid — com arrencar el projecte

### Requisits previs

- [Node.js](https://nodejs.org/) **18+**
- [Docker](https://www.docker.com/) i **Docker Compose**
- [Git](https://git-scm.com/)

### Opció A — Només base de dades (desenvolupament habitual)

Ideal per programar frontend i backend amb hot-reload.

**1. Clonar el repositori**

```bash
git clone <url-del-repositori>
cd projecte-final-2025-26-daw-adsum_grup4
```

**2. Arrencar MySQL**

```bash
docker-compose up -d db
```

La base de dades queda disponible al port **3308** (host) → 3306 (contenidor).

**3. Configurar variables d'entorn**

```bash
cp .env.example .env
# Edita .env si cal (JWT_SECRET, contrasenyes DB...)
```

Al directori `backend/`, assegura't que les variables `DB_*` coincideixen amb `docker-compose.yml`.

**4. Backend**

```bash
cd backend
npm install
npm run start:dev
```

| Servei | URL |
|--------|-----|
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |

**5. Frontend**

```bash
cd frontend
npm install
npm run dev
```

| Servei | URL |
|--------|-----|
| Aplicació web | http://localhost:5173 |

**6. Poblar dades de prova (opcional)**

```bash
curl http://localhost:3000/api/seed/executar
```

O obre al navegador: `http://localhost:3000/api/seed/executar`

---

### Opció B — Tot el stack amb Docker

Arrenca base de dades, backend i frontend en contenidors:

```bash
docker-compose up -d
```

| Servei | URL |
|--------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| MySQL | localhost:3308 |

---

### Comandes útils

```bash
# Aturar contenidors
docker-compose down

# Veure logs del backend
docker logs -f adsum_backend

# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test

# Build de producció
cd backend && npm run build
cd frontend && npm run build
```

---

## Credencials de prova

> ⚠️ Només per a entorn de **desenvolupament i demostració**. No utilitzar en producció.

| Rol | Email | Contrasenya |
|-----|-------|-------------|
| Admin | `admin@adsum.cat` | `admin123` |
| Professor | `joan.font@adsum.cat` | `profe123` |
| Professor | `marta.vila@adsum.cat` | `profe123` |
| Alumne | `arnau.soler@adsum.cat` | `alumne123` |
| Família | `jordi.soler@gmail.com` | `pare123` |

Llistat complet: [`credenciales-prova.md`](credenciales-prova.md) · [`ACCESSOS.md`](ACCESSOS.md)

---

## API REST

Resum dels endpoints principals. Documentació completa: [**doc/api.md**](doc/api.md) i **Swagger**.

| Endpoint | Mètode | Descripció | Auth |
|----------|--------|------------|------|
| `/api/auth/login` | POST | Login — retorna JWT | No |
| `/api/assistencia/generar` | POST | Genera QR de sessió (professor) | — |
| `/api/assistencia/validar` | POST | Registra assistència (alumne) | — |
| `/api/usuaris/:id/stats` | GET | Estadístiques de l'alumne | JWT |
| `/api/usuaris/modul/:id/students` | GET | Alumnes d'un mòdul | JWT |
| `/api/justificacions/pujar` | POST | Pujar justificant | JWT |
| `/api/justificacions/:id/validar` | PATCH | Validar justificant (professor) | JWT |
| `/api/reserves/espais` | GET | Espais reservables | JWT |
| `/api/ai/consultar` | POST | Assistent IA | JWT |
| `/api/seed/executar` | GET | Omplir BD de prova (dev) | No |

---

## Arquitectura

```
┌─────────────────┐     REST + WebSocket     ┌─────────────────┐
│  Frontend       │ ◄──────────────────────► │  Backend        │
│  Vue 3 + Vite   │                          │  NestJS         │
│  :5173          │                          │  :3000          │
└─────────────────┘                          └────────┬────────┘
                                                      │ TypeORM
                                                      ▼
                                             ┌─────────────────┐
                                             │  MySQL 8        │
                                             │  (Docker)       │
                                             └─────────────────┘
```

| Capa | Tecnologia |
|------|------------|
| Presentació | Vue 3, Vite, Tailwind CSS 4 |
| API | NestJS 11, TypeScript, Passport JWT |
| Persistència | TypeORM, MySQL 8 |
| Temps real | Socket.io |
| Desplegament | Docker Compose, Nginx, GitHub Actions |

Detall: [**doc/arquitectura.md**](doc/arquitectura.md) · Diagrames: [**doc/diagramas-uml-er.md**](doc/diagramas-uml-er.md)

---

## Desplegament en producció

```bash
# Crear secrets (no pujar al repositori)
mkdir -p secrets
echo "tu_contrasenya_root" > secrets/db_root_password.txt
echo "tu_contrasenya"      > secrets/db_password.txt

# Arrencar
docker-compose -f docker-compose.prod.yml up -d --build
```

| Variable | Descripció |
|----------|------------|
| `JWT_SECRET` | Clau secreta per signar tokens |
| `FRONTEND_URL` | URL del frontend (CORS i WebSocket) |
| `DB_*` | Connexió MySQL |

El desplegament automàtic es fa via **GitHub Actions** en fer push a la branca `main`. Veure [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Més informació: [**doc/guia-contribucio.md**](doc/guia-contribucio.md)

---

## Manual d'usuari

Guia perquè qualsevol usuari pugui entendre i utilitzar l'aplicació. **Versió completa:** [**doc/manual-usuari.md**](doc/manual-usuari.md)

### Accés ràpid

1. Obre https://adsum.cat (o `http://localhost:5173` en local).
2. Clica **Accedir** i introdueix correu i contrasenya del centre.
3. El sistema et mostra el panell segons el teu rol.

### Resum per rol

#### Alumne

| Acció | Com fer-ho |
|-------|------------|
| **Fitxar assistència** | Botó **QR** (barra inferior) → escaneja el codi del professor |
| **Veure notes i assistència** | Menú **Inici**, **Notes**, **Històric** |
| **Justificar falta** | Menú **Tràmits** → omple dates, motiu i puja document |
| **Reservar espai** | Menú **Reserves** |
| **Consultar horari** | Menús **Calendari** i **Horari** |

#### Professor

| Acció | Com fer-ho |
|-------|------------|
| **Passar llista** | **Inici** → tria mòdul → **Generar QR** → mostra pantalla als alumnes |
| **Marcatge manual** | Llista d'alumnes → marca Present / Retard / Absent |
| **Validar justificacions** | Menú **Tràmits** → aprovar o rebutjar |
| **Grups de treball** | Menú **Eines** (Toolkit) |

#### Família

| Acció | Com fer-ho |
|-------|------------|
| **Seguir el fill/a** | Panell **Inici** — assistència i alertes |
| **Justificar falta** | Menú **Tràmits** |
| **Notificacions** | Instal·la la PWA i accepta les alertes push |

#### Administrador

| Acció | Com fer-ho |
|-------|------------|
| **Gestionar usuaris** | Menú **Usuaris** |
| **Configurar el centre** | Menú **Centre** — minuts de retard i absència |

### PWA — instal·lar al mòbil

1. Obre ADSUM al navegador del mòbil.
2. **Android (Chrome):** Menú ⋮ → *Afegir a la pantalla d'inici*.
3. **iOS (Safari):** Compartir → *Afegeix a la pantalla d'inici*.

### Preguntes freqüents

| Pregunta | Resposta |
|----------|----------|
| El QR no funciona? | El codi caduca en segons; demana un de nou al professor. Comprova la connexió. |
| Sense mòbil? | El professor pot marcar l'assistència manualment. |
| Contrasenya oblidada? | Contacta amb l'administració del centre. |
| Les dades són segures? | Sí — HTTPS, JWT i compliment de protecció de dades (RGPD). |

---

## Estructura del repositori

```
projecte-final-2025-26-daw-adsum_grup4/
├── README.md                 ← Aquest fitxer
├── doc/                      ← Documentació tècnica i d'entrega
│   ├── README.md
│   ├── manual-usuari.md
│   ├── arquitectura.md
│   ├── api.md
│   ├── comercial_2526_2DAW_Projecte_ADSUM.pdf
│   ├── tecnica_2526_2DAW_Projecte_ADSUM (2).pdf
│   └── resum_2526_2DAW_Projecte_ADSUM .pdf
├── schema.sql
├── docker-compose.yml        ← Desenvolupament
├── docker-compose.prod.yml   ← Producció
├── credenciales-prova.md
├── ACCESSOS.md
├── backend/                  ← API NestJS
│   └── src/
│       ├── entities/
│       ├── auth/
│       ├── attendance/
│       └── ...
└── frontend/                 ← SPA Vue 3
    └── src/
        ├── views/
        ├── components/
        └── config/
```

---

## Equip de desenvolupament

Projecte final del cicle **CFGS Desenvolupament d'Aplicacions Web (DAW)** — curs **2025-2026** — **Grup 4**.

| Participant |
|-------------|
| **Aarón Soriano** |
| **Marcos Suarez** |
| **Adrian Maciel** |
| **Bryan Ruzafa** |

---

<p align="center">
  <sub>ADSUM · Sóc aquí · Projecte Final DAW 2025-2026</sub>
</p>
