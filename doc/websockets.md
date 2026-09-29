# WebSockets (Socket.io)

El backend usa **@nestjs/websockets** amb adaptador Socket.io. Hi ha dos gateways:

## 1. Assistència (gateway per defecte)

**Fitxer:** `backend/src/attendance/attendance.gateway.ts`  
**URL:** mateix origen que l'API (ex: `http://localhost:3000`)

### Connexió (client)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});
```

### Esdeveniments client → servidor

| Esdeveniment | Payload | Descripció |
|--------------|---------|------------|
| `join_module` | `modulId` (number) | Uneix el client a la sala `module_{modulId}` |
| `ping` | — | Prova de connexió; respon `pong` |

### Esdeveniments servidor → client

| Esdeveniment | Payload | Quan s'emet |
|--------------|---------|-------------|
| `joined` | `{ event, room }` | Resposta a `join_module` |
| `pong` | `{ event, data }` | Resposta a `ping` |
| `new_qr` | `{ token, expiresAt }` | Nou token QR generat per al professor |
| `attendance_updated` | dades assistència | Alumne ha fitxat o canvi manual |
| `hall_pass_updated` | dades sortida | Sortida/tornada d'aula |

### Sales (rooms)

Format: `module_{modulId}` — tots els clients del mòdul reben actualitzacions de QR i assistència.

### Mètodes interns del gateway (des del servei)

| Mètode | Funció |
|--------|--------|
| `broadcastNewToken(modulId, token)` | Emet `new_qr` |
| `notifyAttendance(modulId, data)` | Emet `attendance_updated` |
| `notifyHallPass(modulId, data)` | Emet `hall_pass_updated` |

---

## 2. Xat (namespace `/chat`)

**Fitxer:** `backend/src/chat/chat.gateway.ts`  
**URL:** `http://localhost:3000/chat`

### Connexió (client)

```javascript
const socket = io('http://localhost:3000/chat');
```

### Esdeveniments client → servidor

| Esdeveniment | Payload | Descripció |
|--------------|---------|------------|
| `join_room` | `{ room: string, user: { id, nom, email } }` | Entra a una sala; rep historial |
| `send_message` | `{ room, user, text }` | Envia missatge (es persisteix a BD) |

### Esdeveniments servidor → client

| Esdeveniment | Descripció |
|--------------|------------|
| `chat_history` | Últims 50 missatges de la sala |
| `user_joined` | Algú ha entrat a la sala |
| `new_message` | Missatge nou (la resta de la sala) |

### Persistència

Els missatges es guarden a la taula `missatges` via entitat `Missatge`.

---

## CORS

- Assistència: `FRONTEND_URL` o `http://localhost:5173`
- Xat: `origin: '*'` (revisar en producció)

---

## Depuració

1. Obrir consola del navegador a la vista de professor o xat.
2. Comprovar connexió Socket.io al Network → WS.
3. Logs del servidor: `Cliente conectado`, `unido a sala module_X`, etc.
