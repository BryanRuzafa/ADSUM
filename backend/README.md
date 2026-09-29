# Backend ADSUM (NestJS)

API REST i WebSockets del projecte ADSUM.

## Documentació

- **Índex general:** [../doc/README.md](../doc/README.md)
- **Mòduls i classes:** [../doc/backend.md](../doc/backend.md)
- **API REST:** [../doc/api.md](../doc/api.md) + **Swagger:** http://localhost:3000/api/docs

## Comandes

```bash
npm install
npm run start:dev    # Desenvolupament amb hot-reload
npm run build        # Compilar
npm run start:prod   # Producció
npm test             # Tests Jest
npm run migration:run
```

## Variables d'entorn

Crear `.env` a `backend/` amb, com a mínim:

```
DB_HOST=localhost
DB_PORT=3308
DB_USERNAME=adsum_user
DB_PASSWORD=...
DB_NAME=projecte_final
JWT_SECRET=canviar-en-produccio
FRONTEND_URL=http://localhost:5173
```
