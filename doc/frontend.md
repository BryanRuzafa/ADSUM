# Frontend — Vue 3

Codi a `frontend/src/`. SPA sense Vue Router; navegació per **estat** (`activeView`).

## Punt d'entrada

| Fitxer | Funció |
|--------|--------|
| `main.js` | Crea l'app Vue, push notifications |
| `App.vue` | Login/landing vs shell autenticat; switch per rol |
| `style.css` | Tailwind + variables globals |

## Configuració

| Fitxer | Funció |
|--------|--------|
| `config/api.js` | `API_BASE_URL`, helper `getApiUrl(endpoint)` |
| `config/pushNotifications.js` | Service Worker i subscripció push (famílies) |

Variable d'entorn: `VITE_API_URL` (per defecte `/api`).

## Layout

### `layouts/AppShell.vue`

- Sidebar (desktop) i bottom nav (mòbil)
- Menú dinàmic segons `user.rol` (`navItems` computed)
- Slot per al contingut: `<slot :activeView :changeView />`
- Botó assistent Gemini (modal)

## Vistes per rol (`views/`)

### Comunes (tots els rols autenticats)

| Vista | Fitxer | Funció |
|-------|--------|--------|
| Xat | `ChatView.vue` | Missatgeria (Socket.io namespace `chat`) |
| Repositori | `RepositoriView.vue` | Llistat i descàrrega de recursos |
| Assistent IA | `GeminiAssistant.vue` | Consultes IA |

### Alumne (`rol === 'alumne'`)

| Vista | `activeView` | Funció |
|-------|--------------|--------|
| `DashboardBento.vue` | `home` | Inici: assistència, mitjana, ratxa, QR identitat |
| `PerformanceView.vue` | `performance` | Detall de rendiment |
| `CalculatorView.vue` | `calculator` | Simulador de notes |
| `CalendarView.vue` | `calendar` | Calendari escolar |
| `ScheduleView.vue` | `schedule` | Horari setmanal |
| `JustificationView.vue` | `justifications` | Pujar justificants |
| `BookingView.vue` | `booking` | Reserva d'espais |
| `AttendanceStats.vue` | `attendance` | Estadístiques d'assistència (component) |

### Professor

| Vista | Funció |
|-------|--------|
| `DashboardProfessor.vue` | QR dinàmic, llista alumnes, toolkit |
| `JustificationValidatorView.vue` | Validar justificacions |
| `ClassroomToolkit.vue` | Eines d'aula (grups aleatoris) |
| `ClasseDetall.vue` | Detall de classe |
| `ProfessorHome.vue` | Vista alternativa professor |

### Família

| Vista | Funció |
|-------|--------|
| `DashboardPares.vue` | Seguiment del fill/a |

### Admin

| Vista | Funció |
|-------|--------|
| `DashboardAdmin.vue` | Gestió del centre |

### Públic (no autenticat)

| Vista | Funció |
|-------|--------|
| `LandingView.vue` | Marketing / presentació del producte |
| `Login.vue` | Formulari login i registre de centre |

### Altres / experimentals

| Vista | Notes |
|-------|-------|
| `AlumneHub.vue` | Hub orbital amb QR (prototip UI) |
| `DashboardAlumne.vue` | Dashboard alternatiu |
| `ResourcesView.vue` | Recursos (legacy) |
| `GeminiChat.vue` | Component de xat Gemini |

## Components rellevants (`components/`)

| Component | Carpeta | Funció |
|-----------|---------|--------|
| `Login.vue` | `components/` | Autenticació |
| `AppIcon.vue` | `shared/` | Icones SVG unificades |
| `AttendanceRegister.vue` | `alumne/` | Registre assistència |
| `AttendanceQR.vue` | `alumne/` | Mostrar QR alumne |
| `AttendanceStats.vue` | `alumne/` | Gràfics assistència |
| `PerformanceDashboard.vue` | `alumne/` | Panell rendiment |
| `GradeCalculator.vue` | `alumne/` | Càlcul de notes |
| `HallPass.vue` | `alumne/` | Sortida d'aula |
| `QrDisplay.vue` | `components/` | Visualització QR genèrica |
| `GeminiChat.vue` | `components/` | Widget xat |

## Flux de dades típic

```javascript
import { getApiUrl } from '../config/api.js';

const token = localStorage.getItem('access_token');
const res = await fetch(getApiUrl(`usuaris/${userId}/stats`), {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
```

Després del login, `Login.vue` emet `login-success` → `App.vue` guarda `user` i `access_token` a `localStorage`.

## WebSockets (frontend)

- **Assistència:** client Socket.io al gateway per defecte (mateix host que API); esdeveniments `join_module`, `new_qr`, `attendance_updated` — veure implementació a `DashboardProfessor.vue` i components d'assistència.
- **Xat:** connexió al namespace `/chat` des de `ChatView.vue`.

Detall: [websockets.md](websockets.md).

## Estils

- **Tailwind CSS v4** (`tailwindcss`, `@tailwindcss/postcss`)
- Disseny: targetes arrodonides, tipografia uppercase en etiquetes, paleta slate + blue
- Responsive: layout mòbil amb bottom navigation

## Build i proves

```bash
npm run dev      # Desenvolupament
npm run build    # Producció → dist/
npm run preview  # Previsualitzar build
npm test         # Vitest
```

## Afegir una nova pantalla

1. Crear `views/NovaVista.vue`.
2. Importar a `App.vue`.
3. Afegir condició `v-else-if="activeView === 'nova'"` dins del bloc del rol corresponent.
4. Afegir entrada a `navItems` a `AppShell.vue` (computed per rol).
5. Documentar l'endpoint consumit a [api.md](api.md) si és nou.
