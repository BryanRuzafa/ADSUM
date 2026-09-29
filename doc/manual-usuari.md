# Manual d'usuari — ADSUM

Guia per utilitzar l'aplicació segons el rol. Per instal·lació i desplegament, consulta el [README principal](../README.md).

---

## 1. Què és ADSUM?

**ADSUM** (*“Sóc aquí”*, en llatí) és una plataforma web per gestionar l'assistència als centres educatius. Permet fitxar presència amb **codis QR dinàmics**, consultar estadístiques, justificar faltes, reservar espais i comunicar-se amb la comunitat educativa.

**URL de producció:** https://adsum.cat

---

## 2. Primer accés

### 2.1 Entrar a l'aplicació

1. Obre el navegador (Chrome, Firefox, Safari o Edge recomanats).
2. Accedeix a la URL del centre o a `http://localhost:5173` en desenvolupament.
3. A la pàgina d'inici, fes clic a **Accedir**.
4. Introdueix el **correu institucional** i la **contrasenya** que t'ha facilitat el centre.
5. Prem **Entrar**. Se't mostrarà el panell corresponent al teu rol.

### 2.2 Instal·lar com a app (PWA)

1. Des del mòbil, obre ADSUM al navegador.
2. A Chrome: menú ⋮ → **Afegir a la pantalla d'inici**.
3. A Safari: Compartir → **Afegeix a la pantalla d'inici**.
4. L'icona apareixerà com una aplicació nativa.

### 2.3 Tancar sessió

Fes clic al teu perfil (part inferior de la barra lateral o menú) i selecciona **Tancar sessió**.

---

## 3. Manual per a alumnes

### 3.1 Panell d'inici (Inici)

Després del login veuràs el **dashboard** amb:

- **Assistència global:** percentatge de presència al curs.
- **Mitjana d'expedient:** qualificació mitjana.
- **Ratxa de presència:** dies consecutius assistint.
- **Identitat digital:** codi QR personal identificatiu.

### 3.2 Fitxar assistència (QR)

És la funció principal per a l'alumne.

**Opció A — Botó QR (mòbil):**
1. Toca el botó central **QR** de la barra inferior.
2. Escaneja el codi que mostra el professor a la pantalla o introdueix el codi manualment.
3. Confirma. Rebràs confirmació si el fitxatge és correcte.

**Opció B — Des del dashboard:**
1. Quan el professor activi la sessió, el codi es renova cada pocs segons.
2. Assegura't d'estar físicament a l'aula abans de fitxar.

> **Important:** No compartis captures del QR amb altres companys. El codi caduca ràpidament per evitar fraus.

### 3.3 Notes i rendiment

- Menú **Notes:** detall de qualificacions per mòdul.
- Menú **Simulador:** calcula la mitjana que necessites per assolir una nota objectiu.

### 3.4 Justificar una falta

1. Ves a **Tràmits** (justificacions).
2. Omple el motiu i les dates d'inici i fi.
3. Opcionalment, puja un document (justificant mèdic, etc.).
4. Envia. El professor validarà la sol·licitud i rebràs l'estat (pendent / validada / rebutjada).

### 3.5 Altres funcions

| Menú | Funció |
|------|--------|
| **Calendari** | Esdeveniments i avisos del centre |
| **Horari** | Horari setmanal de classes |
| **Reserves** | Reservar sales o espais |
| **Recursos** | Descarregar materials del professor |
| **Xat** | Missatges amb la comunitat de l'aula |
| **Històric** | Detall de registres d'assistència |

### 3.6 Assistent IA

Fes clic a la icona de llampec (part superior). Pots fer consultes sobre horaris, funcionament de l'app o resum de la teva activitat acadèmica.

---

## 4. Manual per a professors

### 4.1 Panell d'inici — Passar llista amb QR

1. A **Inici**, selecciona el **mòdul / grup** a la barra superior.
2. Fes clic a **Generar QR** (o equivalent al panell docent).
3. Es mostrarà un codi QR a la pantalla o projector.
4. El codi **es renova automàticament** cada ~10 segons.
5. Els alumnes el escanejen des del mòbil.
6. La llista d'alumnes s'actualitza en **temps real** (present / retard / absent).

### 4.2 Marcatge manual

Si un alumne no pot fitxar (mòbil sense bateria, etc.):

1. A la llista d'alumnes del mòdul, selecciona l'alumne.
2. Marca l'estat manualment: **Present**, **Retard** o **Absent**.

### 4.3 Validar justificacions

1. Ves a **Tràmits**.
2. Revisa les sol·licituds pendents.
3. Per cada una: **Validar** o **Rebutjar**, amb observacions opcionals.

### 4.4 Eines d'aula (Toolkit)

- Generar **grups de treball aleatoris** per a activitats en classe.
- Consultar mètriques del grup des de la pestanya **Grups**.

### 4.5 Altres funcions

| Menú | Funció |
|------|--------|
| **Calendari / Horari** | Planificació de sessions |
| **Reserves** | Gestionar espais |
| **Recursos** | Pujar materials per als alumnes |
| **Xat** | Comunicació amb l'aula |

---

## 5. Manual per a famílies

### 5.1 Panell d'inici

Visualitza el resum del fill o filla vinculat: assistència recent, alertes i avisos.

### 5.2 Justificar faltes

1. Ves a **Tràmits**.
2. Puja el justificant i indica les dates i el motiu.
3. El centre i el professor rebran la notificació per validar-la.

### 5.3 Notificacions

Si has instal·lat la PWA i has acceptat les notificacions, rebràs avisos quan hi hagi faltes d'assistència o canvis rellevants.

### 5.4 Calendari i horari

Consulta l'activitat acadèmica del fill/a sense necessitat de trucar al centre.

---

## 6. Manual per a administradors

### 6.1 Gestió d'usuaris

- Crear, editar i desactivar comptes (professors, alumnes, famílies).
- Assignar rols i grups.

### 6.2 Configuració del centre

- Definir els **minuts de retard** i **d'absència** (quan es considera present, tard o absent).
- Consultar estadístiques globals i mapes de calor d'assistència.

### 6.3 Auditoria

Totes les accions crítiques queden registrades als logs del sistema per complir amb polítiques de seguretat i RGPD.

---

## 7. Preguntes freqüents (FAQ)

**El QR no funciona**  
Comprova la connexió a internet. Si el codi ha caducat, demana al professor que en generi un de nou.

**He oblidat la contrasenya**  
Utilitza l'enllaç de recuperació a la pantalla de login (si el centre ho té activat) o contacta amb l'administració.

**L'app no carrega**  
Actualitza el navegador, esborra la memòria cau o prova en mode incògnit. En producció, comprova que l'URL sigui correcta.

**Les meves dades estan segures?**  
Sí. ADSUM utilitza connexió xifrada (HTTPS), autenticació JWT i emmagatzematge conforme a la normativa de protecció de dades.

**Puc utilitzar ADSUM sense mòbil?**  
Sí, des d'un ordinador amb navegador. El professor sempre pot marcar l'assistència manualment.

---

## 8. Suport

Per incidències tècniques o dubtes sobre el compte, contacta amb l'administrador del teu centre educatiu o amb l'equip de desenvolupament del projecte.

---

[← Tornar al README principal](../README.md) · [Flux de pantalles](mockups-wireframes.md)
