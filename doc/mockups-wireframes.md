# Mockups i wireframes — Flux de pantalles

Documentació de l'**entrega de mockups/wireframes** del projecte ADSUM. Mostra el flux de navegació entre pantalles segons el rol de l'usuari, alineat amb la implementació actual (`App.vue`, `AppShell.vue`).

## Índex

1. [Flux global (no autenticat)](#1-flux-global-no-autenticat)
2. [Flux alumne](#2-flux-alumne)
3. [Flux professor](#3-flux-professor)
4. [Flux família](#4-flux-família)
5. [Flux administrador](#5-flux-administrador)
6. [Wireframes per pantalla](#6-wireframes-per-pantalla)
7. [Assets visuals](#7-assets-visuals)

---

## 1. Flux global (no autenticat)

Qualsevol visitant accedeix a l'aplicació sense sessió iniciada.

```mermaid
flowchart TD
    A([Obrir ADSUM]) --> B[LandingView<br/>Pàgina pública]
    B -->|Accedir| C[Login.vue]
    B -->|Saber-ne més| B
    C -->|Credencials vàlides| D{Quin rol?}
    C -->|Tornar| B
    D -->|alumne| E[AppShell + vistes alumne]
    D -->|professor| F[AppShell + vistes professor]
    D -->|pare / familia| G[AppShell + vistes família]
    D -->|admin| H[AppShell + vistes admin]
    C -->|Registre centre| I[Formulari sol·licitud<br/>LandingView]
```

**Pantalles:**

| Pantalla | Fitxer | Descripció wireframe |
|----------|--------|----------------------|
| Landing | `LandingView.vue` | Hero, funcionalitats, rols, formulari registre centre |
| Login | `Login.vue` | Email, contrasenya, enllaç recuperació |

---

## 2. Flux alumne

Navegació principal via **sidebar / bottom nav** (`AppShell.vue`). Modal global: **QR de fitxatge** (FAB central al mòbil).

```mermaid
flowchart LR
    subgraph NAV[Navegació alumne]
        H[Inici<br/>DashboardBento]
        N[Notes<br/>PerformanceView]
        S[Simulador<br/>CalculatorView]
        J[Tràmits<br/>JustificationView]
        C[Calendari]
        R[Horari<br/>ScheduleView]
        B[Reserves<br/>BookingView]
        RE[Recursos<br/>RepositoriView]
        CH[Xat<br/>ChatView]
        A[Històric<br/>AttendanceStats]
    end

    H --- N & S & J & C & R & B & RE & CH & A
    H -->|FAB QR| QR[Modal AttendanceQR]
    H -->|Assistent| AI[GeminiChat]
```

**Flux crític: fitxatge amb QR**

```mermaid
sequenceDiagram
    participant A as Alumne
    participant UI as AttendanceQR
    participant API as Backend
    participant WS as WebSocket

    A->>UI: Obre modal QR (FAB)
    A->>UI: Escaneja / introdueix token
    UI->>API: POST /api/assistencia/validar
    API-->>UI: Assistència registrada
    WS-->>UI: attendance_updated (opcional)
    UI-->>A: Confirmació visual
```

| `activeView` | Vista | Contingut principal |
|--------------|-------|---------------------|
| `home` | `DashboardBento` | Assistència %, mitjana, ratxa, QR identitat |
| `performance` | `PerformanceView` | Detall notes per mòdul |
| `calculator` | `CalculatorView` | Simulador mitjana |
| `justifications` | `JustificationView` | Pujar justificant + motiu |
| `calendar` | `CalendarView` | Esdeveniments escolars |
| `schedule` | `ScheduleView` | Horari setmanal |
| `booking` | `BookingView` | Reserva d'espais |
| `resources` | `RepositoriView` | Descàrrega de materials |
| `chat` | `ChatView` | Missatgeria per sales |
| `attendance` | `AttendanceStats` | Historial assistència |

---

## 3. Flux professor

El panell principal (`DashboardProfessor`) integra **tabs internes**: inici (QR + alumnes), rendiment grups (`performance`), eina d'aula (`toolkit`).

```mermaid
flowchart TD
    P[Inici professor<br/>DashboardProfessor] --> P1[Seleccionar mòdul]
    P1 --> P2[Generar QR dinàmic]
    P2 --> P3[Modal QR + Socket new_qr]
    P1 --> P4[Llista alumnes + marcatge manual]

    P --> G[Grups / performance<br/>mateixa vista, tab]
    P --> T[Toolkit<br/>ClassroomToolkit]
    P --> JV[Justificacions<br/>JustificationValidatorView]
    P --> CAL[Calendari]
    P --> HOR[Horari]
    P --> RES[Reserves espais]
    P --> REC[Recursos]
    P --> XAT[Xat]
```

**Flux crític: passar llista amb QR**

```mermaid
flowchart TD
    A[Professor obre Inici] --> B[Tria mòdul / grup]
    B --> C[Clica Generar QR]
    C --> D[POST /api/assistencia/generar]
    D --> E[Modal amb QR SVG]
    E --> F[Token es renova cada ~10s]
    F --> G[Alumnes validen token]
    G --> H[Llista s'actualitza en temps real]
```

| `activeView` | Vista | Funció |
|--------------|-------|--------|
| `home` | `DashboardProfessor` | QR, alumnes, comandament |
| `performance` | `DashboardProfessor` (tab) | Mètriques per grup |
| `toolkit` | `DashboardProfessor` (tab) | Grups aleatoris, eines |
| `justifications` | `JustificationValidatorView` | Validar / rebutjar |
| `calendar` | `CalendarView` | Calendari |
| `schedule` | `ScheduleView` | Horari |
| `booking` | `BookingView` | Reserves |
| `resources` | `RepositoriView` | Recursos |
| `chat` | `ChatView` | Xat |

---

## 4. Flux família

Rol `pare` a `AppShell.vue` (família vinculada a un alumne).

```mermaid
flowchart LR
    F[Inici<br/>DashboardPares] --> T[Tràmits<br/>JustificationView]
    F --> C[Calendari]
    F --> H[Horari]
    F --> X[Xat]
```

| Pantalla | Descripció |
|----------|------------|
| `DashboardPares` | Resum assistència i alertes del fill/a |
| `JustificationView` | Justificar faltes (upload) |
| `CalendarView` / `ScheduleView` | Seguiment acadèmic |
| `ChatView` | Comunicació (si habilitat) |

---

## 5. Flux administrador

```mermaid
flowchart LR
    AD[Inici<br/>DashboardAdmin] --> US[Usuaris]
    AD --> CE[Centre<br/>configuració]
```

| `activeView` | Funció |
|--------------|--------|
| `home` | Panell resum centre |
| `users` | Gestió usuaris |
| `center` | Configuració global (retards, absències) |

---

## 6. Wireframes per pantalla

Descripció de baixa fidelitat (wireframe textual) de les pantalles clau. Les captures reals es poden afegir a `doc/mockups/`.

### 6.1 Landing (pública)

```
+--------------------------------------------------+
|  [Logo] ADSUM          Funcionalitats | Accedir  |
+--------------------------------------------------+
|  Hero: "L'assistència, simplificada"             |
|  [Comença ara]  [Saber-ne més]                   |
|                    +------------------+          |
|                    | Mockup dashboard |          |
|                    +------------------+          |
+--------------------------------------------------+
|  3 columnes: QR | Agenda | Analítica             |
+--------------------------------------------------+
```

### 6.2 Login

```
+--------------------------------+
|         ADSUM                  |
|    Campus Digital · Institut   |
|  +------------------------+    |
|  | Correu institucional   |    |
|  +------------------------+    |
|  | Contrasenya            |    |
|  +------------------------+    |
|  [ Entrar ]                    |
+--------------------------------+
```

### 6.3 Dashboard alumne (Bento)

```
+------------------------------------------+
|  Bon dia, {nom}!    Curs 2025-26  En línia|
+------------------------------------------+
| [Assistència 92%] [Mitjana 7.8] [Ratxa]  |
| [QR identitat digital]                    |
+------------------------------------------+
|  Properes sessions / activitat recent     |
+------------------------------------------+
```

### 6.4 Dashboard professor — Modal QR

```
+--------------------------------+
|  {Nom mòdul}                   |
|  Escaneja per registrar...     |
|  +------------------------+  |
|  |                        |  |
|  |      [ QR CODE ]       |  |
|  |                        |  |
|  +------------------------+  |
|  ● Sincronitzat · canvia 10s |
+--------------------------------+
```

### 6.5 Modal QR alumne (FAB)

```
+--------------------------------+
|  Fitxatge ràpid                |
|  [ Camp token / escàner ]      |
|  [ Confirmar assistència ]     |
+--------------------------------+
```

---

## 7. Assets visuals

### Carpeta d'entrega

Pots afegir captures i mockups d'alta fidelitat a:

```
doc/mockups/
├── 01-landing.png
├── 02-login.png
├── 03-dashboard-alumne.png
├── 04-dashboard-professor-qr.png
├── 05-justificacions.png
└── README.md
```

### Referències al codi

| Mockup / captura | Origen al projecte |
|------------------|-------------------|
| Landing + hero | `frontend/src/views/LandingView.vue` |
| Mockup dashboard | `frontend/public/mockup_dashboard.png` (si disponible) |
| Login | `frontend/src/components/Login.vue` |
| Dashboard alumne | `frontend/src/views/DashboardBento.vue` |
| QR professor | `frontend/src/views/DashboardProfessor.vue` |

### Com generar captures per l'entrega

1. Executar frontend + backend en local.
2. Login amb rols de prova (`credenciales-prova.md`).
3. Capturar cada pantalla del flux anterior.
4. Desar PNG a `doc/mockups/` amb nomenclatura `NN-nom-pantalla.png`.

---

## Mapa complet de navegació

```mermaid
flowchart TB
    subgraph PUBLIC[Zona pública]
        L[Landing]
        LG[Login]
    end

    subgraph ALUMNE[Alumne]
        DA[Dashboard]
        QR[QR Fitxatge]
    end

    subgraph PROF[Professor]
        DP[Dashboard + QR]
        JV[Validar justificacions]
    end

    subgraph FAM[Família]
        DF[Dashboard pares]
    end

    subgraph ADM[Admin]
        DAD[Dashboard admin]
    end

    L --> LG
    LG --> DA & DP & DF & DAD
    DA --> QR
```

Veure també: [diagramas-uml-er.md](diagramas-uml-er.md) per diagrames UML i base de dades.
