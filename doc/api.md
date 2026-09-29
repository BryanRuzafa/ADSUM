# Referència API REST

Documentació estàtica complementària a **Swagger**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Autenticació

La majoria d'endpoints requereixen:

```http
Authorization: Bearer <access_token>
```

Obtenir token:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "arnau.soler@adsum.cat",
  "contrasenya": "alumne123"
}
```

Resposta: `{ "access_token": "...", "user": { "id", "nom", "rol", ... } }`

---

## Health

| Mètode | Ruta | Auth | Descripció |
|--------|------|------|------------|
| GET | `/` | No | Comprovar que el servidor respon |

---

## Autenticació (`/api/auth`)

| Mètode | Ruta | Auth | Descripció |
|--------|------|------|------------|
| POST | `/api/auth/login` | No | Login; retorna JWT |
| POST | `/api/auth/recuperar-contrasenya` | No | Sol·licitar enllaç de recuperació |
| POST | `/api/auth/restablir-contrasenya` | No | Restablir amb token |

---

## Assistència (`/api/assistencia`)

| Mètode | Ruta | Auth | Descripció |
|--------|------|------|------------|
| POST | `/api/assistencia/generar` | No* | Genera token QR per a un mòdul |
| POST | `/api/assistencia/validar` | No* | Alumne registra assistència amb token |
| POST | `/api/assistencia/manual` | No* | Marcatge manual per professor |
| POST | `/api/assistencia/sortida` | Sí | Sortida d'aula (passadís) |
| POST | `/api/assistencia/tornada` | Sí | Tornada a l'aula |

\*En producció cal reforçar amb JWT i rol professor/alumne.

**Body `generar`:**
```json
{
  "modulId": 1,
  "professorId": 2,
  "lateMinutes": 10,
  "absentMinutes": 30
}
```

**Body `validar`:**
```json
{
  "tokenValue": "<codi-qr>",
  "alumneId": 5
}
```

---

## Usuaris (`/api/usuaris`)

Tots requereixen JWT.

| Mètode | Ruta | Descripció |
|--------|------|------------|
| POST | `/api/usuaris` | Crear usuari |
| GET | `/api/usuaris` | Llistar tots |
| GET | `/api/usuaris/:id` | Usuari per ID |
| PUT | `/api/usuaris/:id` | Actualitzar |
| DELETE | `/api/usuaris/:id` | Eliminar |
| GET | `/api/usuaris/:id/stats` | Estadístiques alumne (assistència, ratxa…) |
| GET | `/api/usuaris/professor/:id/moduls` | Mòduls del professor |
| GET | `/api/usuaris/modul/:id/students` | Alumnes d'un mòdul |
| POST | `/api/usuaris/modul/:id/seed` | Omplir alumnes de prova |
| GET | `/api/usuaris/:id/notes` | Notes de l'alumne |
| GET | `/api/usuaris/:id/schedule` | Horari de l'alumne |

---

## Justificacions (`/api/justificacions`)

JWT obligatori.

| Mètode | Ruta | Descripció |
|--------|------|------------|
| POST | `/api/justificacions/pujar` | Pujar justificant (multipart: `file` + motiu, dates) |
| GET | `/api/justificacions/mevess` | Justificacions de l'alumne autenticat |
| GET | `/api/justificacions/totes` | Totes (professor/admin) |
| PATCH | `/api/justificacions/:id/validar` | Aprovar/rebutjar |

---

## Reserves (`/api/reserves`)

| Mètode | Ruta | Descripció |
|--------|------|------------|
| GET | `/api/reserves/espais` | Llistar espais reservables |
| GET | `/api/reserves/mevess` | Reserves de l'usuari |
| POST | `/api/reserves/crear` | Crear reserva |
| DELETE | `/api/reserves/:id` | Cancel·lar reserva |

---

## Recursos (`/api/recursos`)

| Mètode | Ruta | Auth | Descripció |
|--------|------|------|------------|
| GET | `/api/recursos` | Sí | Llistar recursos |
| GET | `/api/recursos/descarregar/:id?token=` | Token query | Descarregar fitxer |

---

## Grups (`/api/grups`)

| Mètode | Ruta | Auth | Descripció |
|--------|------|------|------------|
| GET | `/api/grups` | Sí | Llistar grups amb alumnes |

---

## Notificacions (`/api/notificacions`)

| Mètode | Ruta | Descripció |
|--------|------|------------|
| POST | `/api/notificacions/subscriure` | Registrar subscripció Web Push |

---

## Assistent IA (`/api/ai`)

| Mètode | Ruta | Body | Descripció |
|--------|------|------|------------|
| POST | `/api/ai/consultar` | `{ "consulta": "..." }` | Resposta contextual |

---

## Exportació (`/api/export`)

| Mètode | Ruta | Descripció |
|--------|------|------------|
| POST | `/api/export/google-sheets` | Exportar dades de mòdul a Google Sheets |

---

## Seed — només desenvolupament (`/api/seed`)

| Mètode | Ruta | Descripció |
|--------|------|------------|
| GET | `/api/seed/executar` | Poblar base de dades |
| GET | `/api/seed/status` | Estat del seed |

---

## Notes legacy (`/notes`)

| Mètode | Ruta | Descripció |
|--------|------|------------|
| GET | `/notes/alumne/:id` | Notes de l'alumne |
| GET | `/notes/alumne/:id/mitjana` | Mitjana numèrica |

> Preferir `/api/usuaris/:id/notes` per consistència futura.

---

## Codis d'error habituals

| Codi | Significat |
|------|------------|
| 401 | Token absent o invàlid |
| 403 | Rol sense permisos |
| 404 | Recurs no trobat |
| 400 | Validació fallida (DTO) |

Errors es registren via `HttpErrorFilter` i Winston.
