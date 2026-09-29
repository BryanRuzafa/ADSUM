# Diagrames UML i E/R

Diagramas del model de dades i del comportament del sistema ADSUM. Es poden visualitzar directament a GitHub, GitLab o qualsevol visor compatible amb **Mermaid**.

Veure també: [base-de-dades.md](base-de-dades.md) · [arquitectura.md](arquitectura.md)

---

## 1. Diagrama entitat-relació (E/R)

Model simplificat de les taules principals i les seves cardinalitats.

```mermaid
erDiagram
    GRUPS ||--o{ USUARIS : "té alumnes"
    GRUPS ||--o{ MODULS : "imparteix"
    USUARIS ||--o{ MODULS : "professor"
    USUARIS ||--o{ ASSISTENCIES : "registra"
    MODULS ||--o{ ASSISTENCIES : "pertany"
    MODULS ||--o{ NOTES : "té"
    USUARIS ||--o{ NOTES : "rep"
    USUARIS ||--o{ JUSTIFICACIONS : "presenta"
    ASSIGNATURES ||--o{ MATRICULES : ""
    USUARIS ||--o{ MATRICULES : "alumne"
    ASSIGNATURES ||--o{ ASSIGNACIONS_DOCENTS : ""
    USUARIS ||--o{ ASSIGNACIONS_DOCENTS : "professor"
    GRUPS ||--o{ ASSIGNACIONS_DOCENTS : ""
    ASSIGNACIONS_DOCENTS ||--o{ SESSIONS : "genera"
    SESSIONS ||--o{ ASSISTENCIES : "opcional"
    MODULS ||--o{ ATTENDANCE_TOKENS : "token QR"
    USUARIS ||--o{ SORTIDES_AULA : "sortida"
    ESPAIS ||--o{ RESERVES : ""
    USUARIS ||--o{ RESERVES : "reserva"
    USUARIS ||--o{ MISSATGES : "envia"
    USUARIS ||--o{ RECURSOS : "autor"
    USUARIS ||--o{ LOGS_AUDITORIA : "autor"
    USUARIS ||--o{ SUBSCRIPCIONS_PUSH : ""

    GRUPS {
        int id PK
        string codi
        string nom
        string aula_base
    }

    USUARIS {
        int id PK
        string nom
        string email UK
        enum rol
        int grup_id FK
    }

    MODULS {
        int id PK
        string codi
        int professor_id FK
        int grup_id FK
    }

    ASSISTENCIES {
        int id PK
        int alumne_id FK
        int modul_id FK
        enum estat
        enum metode_validacio
        datetime data_registre
    }

    ATTENDANCE_TOKENS {
        int id PK
        string token UK
        int modul_id FK
        datetime expira_en
    }

    JUSTIFICACIONS {
        int id PK
        int alumne_id FK
        date data_inici
        date data_fi
        enum estat
    }

    SESSIONS {
        int id PK
        int assignacio_docent_id FK
        enum estat
    }

    CONFIGURACIO_CENTRE {
        int id PK
        int minuts_tall_retard
        int minuts_tall_absencia
    }
```

### Taules auxiliars (resum)

| Taula | Relació principal |
|-------|-------------------|
| `assignatures` | Catàleg de matèries |
| `matricules` | N:M alumne ↔ assignatura |
| `horaris` | Franja horària per mòdul |
| `espais` / `reserves` | Reserva de sales |
| `recursos` | Repositori de fitxers |
| `missatges` | Xat per sales |
| `dispositius` | Dispositius de l'usuari |
| `logs_auditoria` | Traça d'accions |

Esquema SQL complet: [`../schema.sql`](../schema.sql).

---

## 2. Diagrama de classes (domini principal)

Classes del backend (`backend/src/entities/`) i serveis associats.

```mermaid
classDiagram
    class Usuari {
        +int id
        +string nom
        +string email
        +UserRole rol
        +int grupId
        +validarContrasenya()
    }

    class Grup {
        +int id
        +string codi
        +string nom
        +Usuari tutor
        +Usuari[] alumnes
    }

    class Modul {
        +int id
        +string codi
        +int professorId
        +int grupId
    }

    class Assistencia {
        +int id
        +AssistenciaEstat estat
        +MetodeValidacio metodeValidacio
        +Date dataRegistre
    }

    class AttendanceToken {
        +int id
        +string token
        +Date expiraEn
    }

    class Justificacio {
        +int id
        +JustificacioEstat estat
        +string motiu
    }

    class Sessio {
        +int id
        +SessioEstat estat
    }

    class AuthService {
        +validateUser()
        +login()
    }

    class AttendanceService {
        +generateToken()
        +registrarAssistencia()
        +registerManualAttendance()
    }

    class UsersService {
        +getAlumneStats()
        +getModulStudents()
    }

  Grup "1" --> "*" Usuari : alumnes
  Usuari "1" --> "*" Modul : imparteix
  Grup "1" --> "*" Modul : té
  Modul "1" --> "*" Assistencia
  Usuari "1" --> "*" Assistencia : alumne
  Modul "1" --> "*" AttendanceToken
  Usuari "1" --> "*" Justificacio
  Sessio "1" --> "*" Assistencia
  AttendanceService ..> Assistencia : crea
  AttendanceService ..> AttendanceToken : genera
  AuthService ..> Usuari : valida
  UsersService ..> Usuari : consulta
```

### Enumeracions rellevants

| Enum | Valors | Ús |
|------|--------|-----|
| `UserRole` | admin, professor, alumne, familia | RBAC |
| `AssistenciaEstat` | present, retard, absent, justificat | Fitxatge |
| `MetodeValidacio` | qr_mobil, professor_manual, pin_manual, targeta_nfc | Origen del registre |
| `JustificacioEstat` | pendent, validada, rebutjada | Workflow justificacions |

---

## 3. Diagrama de casos d'ús

```mermaid
flowchart TB
    subgraph Actors[Actors]
        AL[Alumne]
        PR[Professor]
        FA[Família]
        AD[Administrador]
    end

    subgraph Sistema[ADSUM]
        UC1((Fitxar assistència QR))
        UC2((Generar QR sessió))
        UC3((Justificar falta))
        UC4((Validar justificació))
        UC5((Consultar estadístiques))
        UC6((Reservar espai))
        UC7((Xat aula))
        UC8((Gestionar usuaris))
        UC9((Exportar dades))
        UC10((Assistent IA))
    end

    AL --> UC1 & UC3 & UC5 & UC6 & UC7 & UC10
    PR --> UC2 & UC4 & UC5 & UC7 & UC9
    FA --> UC3 & UC5
    AD --> UC8 & UC9
```

---

## 4. Diagrama d'activitats — Fitxatge amb QR dinàmic

Flux principal del projecte (professor → alumne → base de dades).

```mermaid
flowchart TD
    Start([Inici sessió classe]) --> A[Professor selecciona mòdul]
    A --> B[POST /api/assistencia/generar]
    B --> C[Crear AttendanceToken amb caducitat]
    C --> D[Emitir WebSocket new_qr]
    D --> E[Mostrar QR al projector / pantalla]

    E --> F{Alumne escaneja<br/>o introdueix codi?}
    F -->|No| G{Token caducat?}
    G -->|Sí| B
    G -->|No| F
    F -->|Sí| H[POST /api/assistencia/validar]
    H --> I{Token vàlid i<br/>no utilitzat?}
    I -->|No| J[Error: token invàlid]
    I -->|Sí| K[Calcular estat: present / retard / absent]
    K --> L[Inserir registre Assistencia]
    L --> M[Emitir attendance_updated]
    M --> N[Actualitzar llista professor]
    N --> End([Fi])

    J --> F
```

---

## 5. Diagrama d'activitats — Autenticació (login)

```mermaid
flowchart TD
    A([Usuari obre Login]) --> B[Introdueix email i contrasenya]
    B --> C[POST /api/auth/login]
    C --> D{Usuari existeix<br/>i actiu?}
    D -->|No| E[401 Credencials invàlides]
    E --> B
    D -->|Sí| F[Comparar hash bcrypt]
    F --> G{Contrasenya correcta?}
    G -->|No| E
    G -->|Sí| H[Generar JWT]
    H --> I[Registrar log auditoria]
    I --> J[Retornar access_token + user]
    J --> K[Frontend guarda localStorage]
    K --> L{rol?}
    L -->|alumne| M[DashboardBento]
    L -->|professor| N[DashboardProfessor]
    L -->|pare| O[DashboardPares]
    L -->|admin| P[DashboardAdmin]
    M & N & O & P --> End([Sessió iniciada])
```

---

## 6. Diagrama d'activitats — Justificació de falta

```mermaid
flowchart TD
    A([Alumne o família]) --> B[Omple motiu i dates]
    B --> C[Opcional: puja arxiu]
    C --> D[POST /api/justificacions/pujar]
    D --> E[Estat: PENDENT]
    E --> F[Professor rep notificació]
    F --> G[JustificationValidatorView]
    G --> H{Decisió}
    H -->|Aprovar| I[PATCH validar → VALIDADA]
    H -->|Rebutjar| J[PATCH validar → REBUTJADA]
    I --> K[Actualitzar assistències del període]
    J --> L[Notificar alumne/família]
    K & L --> End([Fi])
```

---

## 7. Diagrama de desplegament

```mermaid
flowchart TB
    subgraph Client[Client]
        B[Navegador / PWA Vue 3]
    end

    subgraph Servidor[Servidor]
        F[Nginx / static frontend]
        API[NestJS :3000]
        WS[Socket.io]
    end

    subgraph Dades[Dades]
        DB[(MySQL 8)]
        VOL[Volum uploads/]
    end

    B -->|HTTPS REST| API
    B -->|WSS| WS
    API --> DB
    API --> VOL
    WS --> API
    B --> F
```

---

## 8. Diagrama de components (arquitectura lògica)

```mermaid
flowchart TB
    subgraph Frontend
        V[Vistes Vue]
        C[Components]
        CFG[config/api.js]
    end

    subgraph Backend
        CTRL[Controllers]
        SVC[Services]
        ENT[Entities TypeORM]
        GW[Gateways WS]
        AUTH[Auth JWT]
    end

    V --> C
    V --> CFG
    CFG -->|HTTP| CTRL
    V -->|Socket.io| GW
    CTRL --> AUTH
    CTRL --> SVC
    SVC --> ENT
    GW --> SVC
    ENT --> DB[(MySQL)]
```

---

## Eines recomanades per exportar

| Eina | Ús |
|------|-----|
| [Mermaid Live Editor](https://mermaid.live) | Exportar PNG/SVG dels diagrames |
| draw.io / diagrams.net | Editar E/R si cal més detall |
| Swagger UI | Documentació API (`/api/docs`) |
| MySQL Workbench | Reverse engineering des de `schema.sql` |

---

## Relació amb la implementació

| Diagrama | Codi de referència |
|----------|-------------------|
| E/R | `schema.sql`, `backend/src/entities/` |
| Classes | `*.entity.ts`, `*.service.ts` |
| Activitat QR | `attendance.service.ts`, `attendance.gateway.ts` |
| Activitat login | `auth.service.ts`, `Login.vue` |
| Casos d'ús | `App.vue`, `AppShell.vue` |
| Flux pantalles | [mockups-wireframes.md](mockups-wireframes.md) |
