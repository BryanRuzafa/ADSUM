# Documentació tècnica ADSUM

Índex de la documentació del projecte. **Punt d'entrada per a nous col·laboradors.**

## Per on començar?

1. Llegeix el [README principal](../README.md) i executa el projecte en local.
2. Consulta la [Guia de contribució](guia-contribucio.md) per saber com orientar-te al codi.
3. Revisa l'[Arquitectura](arquitectura.md) per entendre com es connecten frontend, backend i base de dades.
4. Explora l'**API interactiva (Swagger)** amb el backend en marxa: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Documents disponibles

| Document | Contingut |
|----------|-----------|
| [manual-usuari.md](manual-usuari.md) | **Manual d'usuari** — guia per rol (alumne, professor, família, admin) |
| [guia-contribucio.md](guia-contribucio.md) | Com col·laborar, convencions, flux de treball i primeres tasques |
| [arquitectura.md](arquitectura.md) | Visió global, capes, rols i fluxos principals |
| [backend.md](backend.md) | Mòduls NestJS, serveis, entitats i guards |
| [frontend.md](frontend.md) | Estructura Vue 3, vistes per rol i configuració |
| [api.md](api.md) | Referència REST completa (complement a Swagger) |
| [websockets.md](websockets.md) | Esdeveniments Socket.io (assistència i xat) |
| [base-de-dades.md](base-de-dades.md) | Esquema MySQL, entitats TypeORM i relacions |
| [mockups-wireframes.md](mockups-wireframes.md) | **Entrega mockups/wireframes** — flux de pantalles per rol |
| [diagramas-uml-er.md](diagramas-uml-er.md) | **UML i E/R** — classes, activitats, casos d'ús, desplegament |
| [mockups/](mockups/) | Carpeta per captures PNG/PDF d'alta fidelitat |
| [comercial_2526_2DAW_Projecte_ADSUM.pdf](comercial_2526_2DAW_Projecte_ADSUM.pdf) | Presentació funcional / comercial |
| [tecnica_2526_2DAW_Projecte_ADSUM (2).pdf](tecnica_2526_2DAW_Projecte_ADSUM%20(2).pdf) | Presentació tècnica (sprints, UML, problemes) |
| [resum_2526_2DAW_Projecte_ADSUM .pdf](resum_2526_2DAW_Projecte_ADSUM%20.pdf) | Resum del projecte |

## API en viu (Swagger)

Amb el backend executant-se (`npm run start:dev` dins de `backend/`):

- **Swagger UI:** `http://localhost:3000/api/docs`
- **JSON OpenAPI:** `http://localhost:3000/api/docs-json`

Per provar endpoints protegits: fes login a `POST /api/auth/login`, copia el `access_token` i fes clic a **Authorize** a Swagger.

## Estructura del repositori

```
projecte-final-2025-26-daw-adsum_grup4/
├── README.md              ← Visió general i inici ràpid
├── doc/                   ← Documentació tècnica (aquesta carpeta)
├── schema.sql             ← Esquema SQL de referència
├── docker-compose.yml     ← Entorn de desenvolupament
├── backend/               ← API NestJS + TypeORM
│   └── src/
│       ├── entities/      ← Models de dades
│       ├── auth/          ← JWT i login
│       ├── attendance/    ← QR i assistència
│       ├── users/         ← CRUD usuaris i estadístiques
│       └── ...
└── frontend/              ← SPA Vue 3 + Vite
    └── src/
        ├── views/         ← Pantalles per rol
        ├── components/    ← Components reutilitzables
        └── config/        ← API URL, push, etc.
```
